# Homepage capital metrics

The hero requests `GET /api/capital-metrics`. This Node route fetches the public sources below, validates each value, and returns a small response with the value, provider, source URL, definition, retrieval time, source time where available, and freshness status. No API keys are required by these endpoints at the time of integration (10 September 2026).

| Homepage metric | Source and field | Meaning | Refresh interval |
| --- | --- | --- | --- |
| Total Capital Allocated | [Neckwork homepage stats](https://hydration-api.neckwork.net/hydration-web/v1/stats), `tvl` | Current USD TVL under the original Hydration homepage's scope, not cumulative deposits | 10 minutes |
| Total Yield Earned | DefiLlama [Hydration DEX](https://api.llama.fi/summary/fees/hydration-dex?dataType=dailySupplySideRevenue) and [Hydration Lending](https://api.llama.fi/summary/fees/hydration-lending?dataType=dailySupplySideRevenue), sum of both `totalAllTime` values | All-time LP fees and lender interest in USD | 30 minutes |
| Total Protocol Revenue Generated | [Hydration Explorer revenue](https://hydration-explorer.neckwork.net/api/explorer/revenue?range=all), `totals.allTime` | All-time protocol usage revenue in USD: trade fees, liquidations, borrowing interest and network fees; excludes treasury investment returns | 1 minute |
| Total HOLLAR Issued | [Hydration Explorer HOLLAR](https://hydration-explorer.neckwork.net/api/explorer/hollar), `supply.total` | Current outstanding HOLLAR units, net of burns; not lifetime gross minting | 5 minutes |

Neckwork TVL differs in scope from the previous DefiLlama DEX-plus-lending sum. The original [landing page](https://github.com/galacticcouncil/hydration-web/blob/b88b1394f0dad8aa94892ee5e387502c44677fac/src/api/stats.ts) uses `api.hydradx.io/hydration-web/v1/stats`; its [backend](https://github.com/galacticcouncil/HydraDX-api/blob/main/app/routes/hydration-web/v1/stats.mjs) gets TVL from Neckwork. This integration uses that same TVL field directly.

Yield deliberately retains DefiLlama. Explorer's `/api/explorer/revenue/stakers?range=all` measures staker distributions, not the existing LP/lender yield definition. These distributions also must not be added to protocol revenue a second time. No equivalent aggregate LP/lender yield endpoint was identified in the explorer's published client. Explorer endpoints use `hydration-explorer.neckwork.net/api`, not the homepage stats host.

## Failure and cache behavior

- Values must be finite, nonnegative JSON numbers. Zero is valid; missing, malformed or failed requests never become zero. Both yield components must succeed before their sum can be used.
- Each metric has an independent cache and in-flight request. Concurrent requests on the same server process share upstream work. Requests time out after 8 seconds; failed providers retry after 60 seconds.
- Last-good values can be returned as `stale` for up to 24 hours. After that the value is `null` and the page shows an em dash. Explorer revenue also validates its `asOf` timestamp; retrieval time does not pretend to be source time for endpoints that do not provide one.
- Server memory is per process, not durable storage: a cold server instance cannot recover another instance's last-good reading. A fully fresh response permits a 60-second CDN cache plus 60-second stale-while-revalidate; partial or stale responses use `no-store`.
- The browser saves validated last-good values using `hydration:capital-metrics:v2`. This version excludes previous DefiLlama-only caches. It checks for updates every minute while visible and on returning to the tab or coming online; all calls go to the same-origin route. Storage being unavailable does not prevent live updates.
- A full outage on a cold server returns HTTP 503; a partial result returns HTTP 200. Browser-held valid values survive either case, subject to the same 24-hour maximum age. There are no hardcoded financial fallback amounts.

Definitions and validation live in `src/lib/capital-metrics.ts`; upstream fetching lives in `src/api/capital-metrics.server.ts`; the browser hook lives in `src/components/sections/homepage-v3/capital-metrics.ts`.

## Verification

Run `npm run test:capital-metrics` for deterministic source mapping, partial failure, timeout, validation, coalescing, refresh, recovery and cache-expiry tests. The runner uses the project's TypeScript compiler and Node's built-in test runner, and removes its temporary compiled output.

Run `npx tsc --noEmit --incremental false` and `npm run build:check` for the app checks. With the preview running, inspect `/api/capital-metrics`, then scroll to the hero stats to check the rendered values. Live values will change; tests use clearly isolated fixtures rather than pinning production balances.
