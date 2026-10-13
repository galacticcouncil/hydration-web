# Mobile loading performance — 2026-09-18

The GitHub-linked production site, `https://hdxlanding.vercel.app`, was serving commit `9761d50`. A fresh mobile Lighthouse run scored 89. The largest-content element was the hero paragraph, held at zero opacity until hydration and its delayed entrance animation. A separate throttled Chrome trace attributed 2.7 seconds to its render delay. Mobile WebGL rendering was already disabled, but the shader implementation was still in the initial JavaScript bundle.

## Changes

- Mobile hero text, call to action, and artwork are visible in the server response, including with JavaScript disabled. The desktop/tablet entrance sequence uses CSS keyframes with the existing durations, delays, and easing; reduced-motion users get static content.
- The foreground hero image gets the image preload and high fetch priority. Mobile scaling begins at 1 and follows actual page scrolling instead of enlarging when the target is first measured during hydration.
- The WebGL component loads through React lazy/Suspense only at widths of at least 768px. Its existing fallback image remains visible while loading. Phones do not request the shader chunk or create a canvas. Desktop shader settings are unchanged.
- Four compact Latin font faces retain the original outlines and metrics, while the full original faces remain available for other Unicode characters. Initial font files total 108,796 bytes instead of 170,668 bytes, a 36.3% reduction. This preserves font families and character coverage.

## Measurements

Three sequential runs per local production build, using Lighthouse 13.4.1, Chrome 153, and its default mobile simulated throttling: 412×823 viewport, DPR 1.75, 150ms RTT, 1,638.4 Kbps throughput, and 4× CPU slowdown. The local baseline already includes the separately measured LazyMotion dependency cleanup.

| Metric | Local baseline | Optimized |
| --- | ---: | ---: |
| Performance scores, all runs | 84, 87, 87 | 91, 92, 94 |
| Median performance score | 87 | 92 |
| Median Largest Contentful Paint | 3.99 s | 3.39 s |
| Median Total Blocking Time | 7.5 ms | 1.5 ms |
| Cumulative Layout Shift, all runs | 0 | 0 |
| Font transfer including response overhead | 171,796 bytes | 109,924 bytes |
| Next.js homepage First Load JS | 160 kB | 155 kB |

Run metadata, settings, individual values, and the deployed baseline are saved in [mobile-lighthouse-results.json](./mobile-lighthouse-results.json). These are local lab results, not a post-deployment score or field data. Hosting, cache state, device load, and network conditions affect results. The remaining LCP cost is associated with the hero image and the page's resource/loading work.

Reproduce with a production build and server, then run three times sequentially:

```sh
npm run build:check
NEXT_DIST_DIR=.next-build npm run start -- --port 3004
# In another terminal, once the server is ready:
npx lighthouse@13.4.1 http://127.0.0.1:3004 --only-categories=performance --chrome-flags="--headless --no-sandbox" --output=json --output=html --output-path=/tmp/hydration-mobile
```

## Verification

- The production build, TypeScript/ESLint validation, nine capital-metrics tests, and five agent-readiness checks pass, including the live HTTP check. The existing hook-dependency and fluid typography warnings remain.
- Browser checks cover the hero without JavaScript, zero initial mobile WebGL requests/contexts, scrolling and section reveals, menus, modal dismissal/focus, desktop rendering, resizing back to mobile, reduced motion, and no horizontal overflow.
- `scripts/build-latin-fonts.py` regenerates the compact fonts from the preserved WOFF2 originals using FontTools 4.60.2 with Brotli support. It verifies retained character maps, advance metrics, outlines, and the variable font at multiple weights. No Python dependency is added to the application.
- Browser checks compare text widths against the full fonts, including kerning/ligature samples, and exercise the full-font fallback with Polish characters outside the compact range.

References: [LCP optimization](https://web.dev/articles/optimize-lcp), [font loading and Unicode ranges](https://web.dev/articles/font-best-practices).
