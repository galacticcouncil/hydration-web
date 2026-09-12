"use client";

import { useEffect, useState } from "react";
import {
  emptyCapitalMetrics,
  parseCapitalMetrics,
  type CapitalMetric,
  type CapitalMetricsResponse,
} from "@/lib/capital-metrics";

export type { CapitalMetric } from "@/lib/capital-metrics";

const CACHE_KEY = "hydration:capital-metrics:v2";
const REFRESH_MS = 60_000;
let pending: Promise<CapitalMetric[]> | null = null;

function readCache(): CapitalMetric[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? parseCapitalMetrics(JSON.parse(raw)) : emptyCapitalMetrics();
  } catch {
    return emptyCapitalMetrics();
  }
}

function writeCache(metrics: CapitalMetric[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ version: 2, metrics } satisfies CapitalMetricsResponse));
  } catch {
    // The live figures still work when browser storage is unavailable.
  }
}

function fetchMetrics() {
  if (!pending) {
    pending = fetch("/api/capital-metrics", { signal: AbortSignal.timeout(12_000) })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Stats returned HTTP ${response.status}`);
        return parseCapitalMetrics(await response.json());
      })
      .finally(() => { pending = null; });
  }
  return pending;
}

export function useCapitalMetrics() {
  const [metrics, setMetrics] = useState<CapitalMetric[]>(emptyCapitalMetrics);

  useEffect(() => {
    let active = true;
    let refreshing = false;
    let current = readCache();
    setMetrics(current);

    const refresh = async () => {
      if (refreshing || document.visibilityState === "hidden") return;
      refreshing = true;
      try {
        const incoming = await fetchMetrics();
        if (!active) return;
        const previous = parseCapitalMetrics({ version: 2, metrics: current });
        current = incoming.map((metric, index) => metric.value !== null ? metric : {
          ...previous[index],
          status: previous[index].value === null ? "unavailable" : "stale",
        });
        writeCache(current);
        setMetrics(current);
      } catch (error) {
        if (!active) return;
        current = parseCapitalMetrics({ version: 2, metrics: current }).map((metric) => ({
          ...metric,
          status: metric.value === null ? "unavailable" : "stale",
        }));
        setMetrics(current);
        console.warn("Failed to refresh capital metrics", error);
      } finally {
        refreshing = false;
      }
    };

    void refresh();
    const interval = window.setInterval(refresh, REFRESH_MS);
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("online", refresh);
    return () => {
      active = false;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("online", refresh);
    };
  }, []);

  return metrics;
}

// Scroll-driven counters format several values every frame. Reuse the two
// formatters rather than allocating/initializing ICU formatters on every tick.
const compactMetricFormatters = [0, 1].map((minimumFractionDigits) => new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
  minimumFractionDigits,
}));

export function formatCompactMetric(value: number | null, prefix: "" | "$") {
  if (value === null || !Number.isFinite(value)) return "—";
  return `${prefix}${compactMetricFormatters[value >= 1_000_000 ? 1 : 0].format(value)}`;
}
