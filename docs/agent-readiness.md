# Agent-readable landing page

The landing page keeps its visual design and animations while offering a lighter representation for agents and clear search metadata. Agent-facing resources focus on the product content; they do not advertise the statistics feed as a public API product.

## Available representations and discovery

| URL | Purpose |
| --- | --- |
| `/` | Server-rendered HTML, canonical metadata, and Organization/WebSite/WebPage JSON-LD. |
| `/index.md` | Main homepage content as Markdown. |
| `/llms.txt` | Short Markdown index of the page and official resources. |
| `/robots.txt` | Public crawl rules and sitemap discovery. |
| `/sitemap.xml` | The canonical homepage; referral redirects are excluded and marked `noindex`. |

HTTP `Link` headers and HTML links advertise the Markdown representation and resource index. Markdown is served at the explicit `/index.md` URL, independently of request headers. The homepage keeps its normal HTML and React Server Component behavior.

Content negotiation at `/` is deliberately not enabled: repeated production requests showed that Next 14.2.3 can overwrite middleware's `Vary: Accept` header on cached pages. A distinct Markdown URL preserves static page caching without risking a CDN mixing the two representations. Cloudflare's article describes this URL fallback as well. Negotiation can be added at the hosting edge once its cache behavior can be verified there.

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

The first command checks content, structured data and the absence of API promotion. Setting `AGENT_READINESS_BASE_URL` also exercises repeated HTML/Markdown requests, React Server Component requests, crawl files, discovery headers and referral metadata. Run that integration check against a production build before deployment as well.

After deployment, repeat the HTTP checks on the public origin. Confirm that the CDN preserves the advertised links and content types, and that bot rules do not unexpectedly challenge these public read-only resources. Local tests cannot establish the behavior of a production proxy or whether an external agent will choose to cite the site.

## Source rationale

- [Deepak Gupta's AEO/GEO/AIO guide](https://gupta-deepak.medium.com/aeo-geo-aio-a-simple-guide-to-the-new-search-optimization-terminology-26d8271aeb83) informed clear, extractable content and consistent entity descriptions. Existing product copy remains intact; no hidden FAQ or invented ratings were added.
- [Cloudflare's agent-readiness article](https://blog.cloudflare.com/agent-readiness/) informed the Markdown URL fallback and content discovery. API promotion, transaction authentication, commerce and MCP features are outside this landing page's agent-facing scope.
- [The llms.txt proposal](https://llmstxt.org/) defines the lightweight Markdown index. It is an optional discovery aid, not a universal crawler requirement or a ranking guarantee.

No Cloudflare account configuration, bot identity policy, AI training policy or external indexing settings were changed.
