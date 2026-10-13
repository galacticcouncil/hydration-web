import "server-only";

import { unstable_cache } from "next/cache";
import { createCapitalMetricsService } from "./capital-metrics.server";

const loadCapitalMetrics = createCapitalMetricsService({
  fetcher: (url, init) =>
    fetch(url, {
      headers: init?.headers,
      signal: init?.signal,
      next: { revalidate: 60 },
    }),
});

// Keep the first-page payload warm so visitors receive real metrics in the
// server-rendered HTML without making every page request wait on providers.
export const getCachedCapitalMetrics = unstable_cache(
  loadCapitalMetrics,
  ["capital-metrics-v2-server-prefetch"],
  { revalidate: 60 },
);
