# Agent-readable landing page

The landing page keeps its visual design and animations while offering a lighter representation for agents and clear search metadata. Agent-facing resources focus on the product content; they do not advertise the statistics feed as a public API product.

## Available representations and discovery

| URL | Purpose |
| --- | --- |
| `/` | HTML by default; Markdown when requested with `Accept: text/markdown`. HTML includes canonical metadata and Organization/WebSite/WebPage JSON-LD. |
| `/index.md` | Main homepage content as Markdown. |
| `/llms.txt` | Short Markdown index of the page and official resources. |
| `/robots.txt` | Public crawl rules and sitemap discovery. |
| `/sitemap.xml` | The canonical homepage; referral redirects are excluded and marked `noindex`. |

HTTP `Link` headers and HTML links advertise the Markdown representation and resource index. Markdown is also served at the explicit `/index.md` URL, independently of request headers. The homepage keeps its normal browser HTML and React Server Component behavior.

GET and HEAD requests at `/` negotiate Markdown only when explicitly accepted with a positive quality weight at least as high as HTML's. Missing Accept, wildcards, `text/markdown;q=0`, and a higher HTML preference keep HTML. React navigation/prefetch requests bypass negotiation. API routes, assets and referral routes are outside the middleware matcher.

Markdown responses use `Content-Type: text/markdown; charset=utf-8`, `Content-Location: /index.md`, and `x-markdown-tokens`. The token header is a rough budget estimate (UTF-8 bytes divided by four, rounded up), not an exact model tokenizer count. HEAD returns the same representation headers with an empty body. Both negotiated variants include `Vary: Accept` while preserving Next's React request dimensions; Markdown is generated as a new response, so it cannot inherit the HTML body's ETag or compression metadata.

### Next.js cache compatibility

Next 14.2.3 overwrites middleware's Vary header when serving cached App Router HTML. `scripts/patch-next-vary.mjs` reproducibly backports the two `setHeader` to `appendHeader` changes from [Next.js PR #75536](https://github.com/vercel/next.js/pull/75536), fixed upstream in 15.2. It patches both server module formats during installation and before npm dev/build/start commands. It is idempotent and fails on an unexpected Next version or implementation. Review/remove this backport during a framework upgrade; do not remove it while this version remains installed. This preserves static HTML caching and the Accept dimension on repeated responses.

Negotiation is implemented at the application origin and does not require a Cloudflare account setting. Any deployment proxy must still honor `Vary: Accept` (or explicitly include Accept in its cache key). Avoid configuring a cache rule that combines HTML and Markdown under the same key.

The visual sections and Markdown share `src/content/homepage.ts` to avoid copy drift. Animated headings expose one complete accessible label instead of individual letters. The server-rendered HTML also includes a no-JavaScript stylesheet that reveals content normally animated into view.

The existing production identity, `https://hydration.net`, remains the canonical base in `src/lib/site.ts`. Preview URLs are never emitted into the sitemap or structured data. If the production domain changes, update that source before deploying.

## Data scope

The existing stats feed continues to power the visual homepage. Its four metric meanings and upstream integrations remain unchanged; see [capital-metrics.md](capital-metrics.md).

There is no API catalog, OpenAPI document or direct stats endpoint link in the agent-facing content or discovery headers. Markdown does not publish upstream endpoint URLs, polling instructions or snapshots of changing balances. Removing discovery is not access control: the browser still calls a publicly reachable read-only endpoint, and the displayed figures remain visible on the page.

## Verification

```sh
npm run test:agent-readiness
AGENT_READINESS_BASE_URL=http://127.0.0.1:3004 npm run test:agent-readiness
npm run test:capital-metrics
npm run build:check
```

The first command checks Accept preferences, response metadata, content, structured data and the absence of API promotion. Setting `AGENT_READINESS_BASE_URL` also exercises repeated negotiated HTML/Markdown requests and Vary preservation, HEAD, React Server Component requests, crawl files, discovery headers and referral metadata. Run that integration check against a production build before deployment as well.

```sh
curl -sSI -H 'Accept: text/markdown' http://127.0.0.1:3004/
curl -sSI -H 'Accept: text/html' http://127.0.0.1:3004/
```

After deployment, repeat the HTTP checks on the public origin. Confirm that the CDN preserves the advertised links and content types, and that bot rules do not unexpectedly challenge these public read-only resources. Local tests cannot establish the behavior of a production proxy or whether an external agent will choose to cite the site.

The [Markdown negotiation skill](https://isitagentready.com/.well-known/agent-skills/markdown-negotiation/SKILL.md) also recommends POSTing `{"url":"https://YOUR-DEPLOYED-SITE"}` as JSON to `https://isitagentready.com/api/scan` and checking `checks.contentAccessibility.markdownNegotiation.status` is `pass`. That public scan requires a deployed URL; it cannot validate a localhost preview.

## Source rationale

- [Deepak Gupta's AEO/GEO/AIO guide](https://gupta-deepak.medium.com/aeo-geo-aio-a-simple-guide-to-the-new-search-optimization-terminology-26d8271aeb83) informed clear, extractable content and consistent entity descriptions. Existing product copy remains intact; no hidden FAQ or invented ratings were added.
- [Cloudflare's agent-readiness article](https://blog.cloudflare.com/agent-readiness/) informed the Markdown URL fallback and content discovery. API promotion, transaction authentication, commerce and MCP features are outside this landing page's agent-facing scope.
- [Cloudflare Markdown for Agents](https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/) documents Accept negotiation, response content types, token estimates and cache variation.
- [The llms.txt proposal](https://llmstxt.org/) defines the lightweight Markdown index. It is an optional discovery aid, not a universal crawler requirement or a ranking guarantee.

No Cloudflare account configuration, bot identity policy, AI training policy or external indexing settings were changed.
