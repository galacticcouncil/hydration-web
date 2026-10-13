# Homepage capital metrics

The hero requests `GET /api/capital-metrics`. This Node route fetches the public sources below, validates each value, and returns a small response with the value, provider, source URL, definition, retrieval time, source time where available, and freshness status. No API keys are required by these endpoints at the time of integration (10 September 2026).

| Homepage metric | Source and field | Meaning | Refresh interval |
| --- | --- | --- | --- |
| Total Capital Allocated | [Neckwork homepage stats](https://hydration-api.neckwork.net/hydration-web/v1/stats), `tvl` | Current USD TVL under the original Hydration homepage's scope, not cumulative deposits | 10 minutes |
| Total Yield Earned | DefiLlama [Hydration DEX](https://api.llama.fi/summary/fees/hydration-dex?dataType=dailySupplySideRevenue&excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true) and [Hydration Lending](https://api.llama.fi/summary/fees/hydration-lending?dataType=dailySupplySideRevenue&excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true), sum of both `totalAllTime` values | All-time LP fees and lender interest in USD | 1 hour |
| Total Protocol Revenue Generated | [Neckwork platform stats](https://hydration-api.neckwork.net/v1/stats/platform), `protocolRevenue.allTimeUsd` | All-time protocol usage revenue in USD: trade fees, liquidations, borrowing interest and network fees; excludes treasury investment returns | 1 hour |
| Total HOLLAR Issued | [Neckwork platform stats](https://hydration-api.neckwork.net/v1/stats/platform), `hollar.totalSupply` ÷ 10¹⁸ | Current outstanding HOLLAR units, net of burns; not lifetime gross minting | 10 minutes |

Neckwork TVL differs in scope from the previous DefiLlama DEX-plus-lending sum. The original [landing page](https://github.com/galacticcouncil/hydration-web/blob/b88b1394f0dad8aa94892ee5e387502c44677fac/src/api/stats.ts) used `api.hydradx.io/hydration-web/v1/stats`; Neckwork's `/hydration-web/v1/stats` is its drop-in replacement. Nothing in this site calls `api.hydradx.io` or the explorer's `/api/explorer/*` endpoints.

Yield deliberately retains DefiLlama. Explorer's `/api/explorer/revenue/stakers?range=all` measures staker distributions, not the existing LP/lender yield definition. These distributions also must not be added to protocol revenue a second time. No equivalent aggregate LP/lender yield endpoint exists on the Neckwork API.

`/v1/stats/platform` publishes amounts as decimal strings (HOLLAR as a raw 18-decimal integer); anything else, including `null`, is rejected. Its `asOf` is the swap-index anchor and trails wall clock by a few minutes, so it is only used to reject a dead or clock-skewed indexer (missing, future, or older than 24 hours), not to judge freshness.

Refresh intervals are the longest lag each figure can tolerate, not the upstream's cadence. The hero shows one decimal of millions, so the question is how quickly the displayed value can move. TVL follows prices and Neckwork memoises it for 10 minutes anyway. HOLLAR supply jumps on mints and burns, so it also uses 10 minutes. All-time revenue (about $3.5k/day against 0.1M display steps) and DefiLlama yield (daily data points) move visibly about once a month, so an hour of lag is invisible. The DefiLlama requests exclude the chart series; `totalAllTime` is identical without them and the payload drops from about 60 KB to 3.5 KB.

## Failure and cache behavior

- Values must be finite and nonnegative: JSON numbers from `/hydration-web/v1/stats` and DefiLlama, decimal strings from `/v1/stats/platform`. Zero is valid; missing, malformed or failed requests never become zero. Both yield components must succeed before their sum can be used.
- Each metric has an independent cache and in-flight request. Concurrent requests on the same server process share upstream work. Requests time out after 8 seconds; failed providers retry after 60 seconds.
- Last-good values can be returned as `stale` for up to 24 hours. After that the value is `null` and the page shows an em dash. Freshness follows retrieval time for every metric.
- Server memory is per process, not durable storage: a cold server instance cannot recover another instance's last-good reading. A fully fresh response permits a 60-second CDN cache plus 60-second stale-while-revalidate; partial or stale responses use `no-store`.
- The browser saves validated last-good values using `hydration:capital-metrics:v2`. This version excludes previous DefiLlama-only caches. It checks for updates every minute while visible and on returning to the tab or coming online; all calls go to the same-origin route. Storage being unavailable does not prevent live updates.
- A full outage on a cold server returns HTTP 503; a partial result returns HTTP 200. Browser-held valid values survive either case, subject to the same 24-hour maximum age. There are no hardcoded financial fallback amounts.

Definitions and validation live in `src/lib/capital-metrics.ts`; upstream fetching lives in `src/api/capital-metrics.server.ts`; the browser hook lives in `src/components/sections/homepage-v3/capital-metrics.ts`.

## Verification

Run `npm run test:capital-metrics` for deterministic source mapping, partial failure, timeout, validation, coalescing, refresh, recovery and cache-expiry tests. The runner uses the project's TypeScript compiler and Node's built-in test runner, and removes its temporary compiled output.

Run `npx tsc --noEmit --incremental false` and `npm run build:check` for the app checks. With the preview running, inspect `/api/capital-metrics`, then scroll to the hero stats to check the rendered values. Live values will change; tests use clearly isolated fixtures rather than pinning production balances.
