export const capitalMetricDefinitions = [
  {
    id: "allocated",
    title: "Total Capital Allocated",
    prefix: "$",
    provider: "Neckwork",
    definition: "Current Hydration TVL, using the original homepage's scope.",
    sources: ["https://hydration-api.neckwork.net/hydration-web/v1/stats"],
    refreshSeconds: 600,
  },
  {
    id: "earned",
    title: "Total Yield Earned",
    prefix: "$",
    provider: "DefiLlama",
    definition: "All-time LP fees and lender interest from Hydration DEX and Lending. Staker distributions are not a substitute for this total.",
    sources: [
      "https://api.llama.fi/summary/fees/hydration-dex?dataType=dailySupplySideRevenue",
      "https://api.llama.fi/summary/fees/hydration-lending?dataType=dailySupplySideRevenue",
    ],
    refreshSeconds: 1800,
  },
  {
    id: "generated",
    title: "Total Protocol Revenue Generated",
    prefix: "$",
    provider: "Hydration Explorer",
    definition: "All-time protocol usage revenue, including trade fees, liquidations, borrowing interest and network fees. Excludes treasury investment returns.",
    sources: ["https://hydration-explorer.neckwork.net/api/explorer/revenue?range=all"],
    refreshSeconds: 60,
  },
  {
    id: "hollar",
    title: "Total HOLLAR Issued",
    prefix: "",
    provider: "Hydration Explorer",
    definition: "Current outstanding HOLLAR supply, net of burns, not lifetime gross minting.",
    sources: ["https://hydration-explorer.neckwork.net/api/explorer/hollar"],
    refreshSeconds: 300,
  },
] as const;

export type CapitalMetricDefinition = (typeof capitalMetricDefinitions)[number];
export type CapitalMetricId = CapitalMetricDefinition["id"];

export type CapitalMetric = CapitalMetricDefinition & {
  value: number | null;
  delta: number | null;
  retrievedAt: string | null;
  asOf: string | null;
  status: "fresh" | "stale" | "unavailable";
};

export type CapitalMetricsResponse = {
  version: 2;
  metrics: CapitalMetric[];
};

export const MAX_METRIC_AGE_MS = 24 * 60 * 60 * 1000;

export function emptyCapitalMetrics(): CapitalMetric[] {
  return capitalMetricDefinitions.map((definition) => ({
    ...definition,
    value: null,
    delta: null,
    retrievedAt: null,
    asOf: null,
    status: "unavailable",
  }));
}

export function isMetricValue(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

// Validate saved/browser data as well as API data. Never revive the previous
// DefiLlama-only cache under the new source definitions.
export function parseCapitalMetrics(value: unknown, now = Date.now()): CapitalMetric[] {
  if (!value || typeof value !== "object") throw new Error("Invalid metrics response");
  const response = value as Partial<CapitalMetricsResponse>;
  if (response.version !== 2 || !Array.isArray(response.metrics)) {
    throw new Error("Invalid metrics response version");
  }

  return emptyCapitalMetrics().map((empty) => {
    const metric = response.metrics?.find((item) => item?.id === empty.id);
    if (
      !metric || !isMetricValue(metric.value) || typeof metric.retrievedAt !== "string" ||
      (metric.asOf !== null && typeof metric.asOf !== "string") ||
      (metric.status !== "fresh" && metric.status !== "stale")
    ) return empty;
    const retrievedAt = Date.parse(metric.retrievedAt);
    const asOf = metric.asOf === null ? null : Date.parse(metric.asOf);
    if (
      !Number.isFinite(retrievedAt) || retrievedAt > now + 60_000 ||
      now - retrievedAt > MAX_METRIC_AGE_MS ||
      (asOf !== null && (!Number.isFinite(asOf) || asOf > now + 60_000 || now - asOf > MAX_METRIC_AGE_MS))
    ) return empty;

    return {
      ...empty,
      value: metric.value,
      retrievedAt: metric.retrievedAt,
      asOf: metric.asOf,
      status: metric.status === "fresh" && now - Math.min(retrievedAt, asOf ?? Infinity) <= empty.refreshSeconds * 1000
        ? "fresh"
        : "stale",
    };
  });
}
