import {
  capitalMetricDefinitions,
  isMetricValue,
  MAX_METRIC_AGE_MS,
  type CapitalMetric,
  type CapitalMetricDefinition,
  type CapitalMetricId,
  type CapitalMetricsResponse,
} from "../lib/capital-metrics";

type Reading = {
  value: number;
  retrievedAt: string;
  asOf: string | null;
};

const TIMEOUT_MS = 8000;
const RETRY_DELAY_MS = 60_000;

function field(data: unknown, path: string[]): unknown {
  return path.reduce<unknown>((value, key) =>
    value && typeof value === "object" ? (value as Record<string, unknown>)[key] : undefined,
  data);
}

function amount(data: unknown, path: string[]): number {
  const value = field(data, path);
  if (!isMetricValue(value)) throw new Error(`Invalid ${path.join(".")}`);
  return value;
}

// This service is instantiated only by the server route. The factory allows
// deterministic tests of source failures, caching and request coalescing.
export function createCapitalMetricsService({
  fetcher = (url, init) => fetch(url, init),
  now = Date.now,
  warn = (message: string) => console.warn(message),
}: {
  fetcher?: typeof fetch;
  now?: () => number;
  warn?: (message: string) => void;
} = {}) {
  const cache = new Map<CapitalMetricId, Reading>();
  const pending = new Map<CapitalMetricId, Promise<CapitalMetric>>();
  const retryAfter = new Map<CapitalMetricId, number>();

  async function load(definition: CapitalMetricDefinition): Promise<Reading> {
    const responses = await Promise.all(definition.sources.map(async (url) => {
      const response = await fetcher(url, {
        cache: "no-store",
        headers: { accept: "application/json" },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json() as Promise<unknown>;
    }));

    const value = definition.id === "allocated" ? amount(responses[0], ["tvl"])
      : definition.id === "hollar" ? amount(responses[0], ["supply", "total"])
        : definition.id === "generated" ? amount(responses[0], ["totals", "allTime"])
          : responses.reduce<number>((sum, response) => sum + amount(response, ["totalAllTime"]), 0);
    if (!isMetricValue(value)) throw new Error("Invalid metric total");

    let asOf: string | null = null;
    if (definition.id === "generated") {
      const timestamp = field(responses[0], ["asOf"]);
      const sourceTime = typeof timestamp === "string" ? Date.parse(timestamp) : NaN;
      if (!Number.isFinite(sourceTime) || sourceTime > now() + 60_000 || now() - sourceTime > MAX_METRIC_AGE_MS) {
        throw new Error("Invalid or expired source timestamp");
      }
      asOf = new Date(sourceTime).toISOString();
    }
    return { value, asOf, retrievedAt: new Date(now()).toISOString() };
  }

  function result(definition: CapitalMetricDefinition, reading?: Reading, failed = false): CapitalMetric {
    const oldestTime = reading
      ? Math.min(Date.parse(reading.retrievedAt), reading.asOf ? Date.parse(reading.asOf) : Infinity)
      : -Infinity;
    if (!reading || now() - oldestTime > MAX_METRIC_AGE_MS) {
      return { ...definition, value: null, delta: null, retrievedAt: null, asOf: null, status: "unavailable" };
    }
    return {
      ...definition,
      ...reading,
      delta: null,
      status: failed || now() - oldestTime > definition.refreshSeconds * 1000 ? "stale" : "fresh",
    };
  }

  function getMetric(definition: CapitalMetricDefinition): Promise<CapitalMetric> {
    const cached = cache.get(definition.id);
    if (cached && now() - Date.parse(cached.retrievedAt) < definition.refreshSeconds * 1000) {
      return Promise.resolve(result(definition, cached));
    }
    if (now() < (retryAfter.get(definition.id) ?? 0)) {
      return Promise.resolve(result(definition, cached, true));
    }
    const existing = pending.get(definition.id);
    if (existing) return existing;

    const request = load(definition)
      .then((reading) => {
        cache.set(definition.id, reading);
        retryAfter.delete(definition.id);
        return result(definition, reading);
      })
      .catch((error: unknown) => {
        retryAfter.set(definition.id, now() + RETRY_DELAY_MS);
        warn(`[capital-metrics] ${definition.id}: ${error instanceof Error ? error.message : "Source unavailable"}`);
        return result(definition, cached, true);
      })
      .finally(() => pending.delete(definition.id));
    pending.set(definition.id, request);
    return request;
  }

  return async (): Promise<CapitalMetricsResponse> => ({
    version: 2,
    metrics: await Promise.all(capitalMetricDefinitions.map(getMetric)),
  });
}
