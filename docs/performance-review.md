# Landing performance review — 2026-09-12

Measured the production build in Chrome DevTools against local port 3005. Baseline: `a118302`. The WebGL water effect, its 12 ripple slots, resolution limit, frame cadence, colors, interaction settings and entrance/scroll animations remain intact.

## Measured changes

| Check | Before | After |
| --- | ---: | ---: |
| Four used fonts, encoded response body total | 255,664 bytes | 170,668 bytes |
| WebGL uniform uploads per animation frame | 14 | 5 |
| Canvas layout reads for 120 offscreen pointer events | 120 | 0 |
| Layout reads/hit tests for a burst of 120 visible pointer events | Up to one per event | One for the latest position in the next frame |
| WebGL draws during a three-second visible sample | 361 | 361 |
| Frame interval, 95th percentile in that sample | 9.2 ms | 9.2 ms |

The font transfer reduction is 33.2%, relative to the compressed TTF responses. On-disk font assets shrink from 607,440 to 170,668 bytes. The uniform-call reduction is 64.3%; this is a count of API calls, not a claim of 64% lower total CPU/GPU usage. No frame-rate or image-quality reduction was introduced.

## What changed

- `water-canvas.tsx` skips empty, future and expired ripple slots before their expensive fragment-shader calculations. Active ripples use the original formula. Geometry and constant uniforms are configured once; image dimensions and canvas resolution update when those inputs change.
- Pointer events are coalesced to the latest position each frame. The existing trail interpolation still fills gaps along the movement. Offscreen/hidden/reduced-motion states skip pointer processing. Rendering is suspended when the hero is offscreen or the document is hidden.
- A media-query subscription keeps the original 768px WebGL breakpoint in sync with resizing. The canvas is hidden below that breakpoint, retaining the existing image and scroll effect. Returning to desktop rebuilds its resources and resumes rendering. The hero's separate 1024px layout breakpoint is unchanged.
- The four fonts used by this page have WOFF2 versions. The hero's three required faces are preloaded; regular Gazpacho is discovered through CSS. Font outlines, character maps, advance widths, kerning/layout and variable-font tables are preserved.
- Animated capital values reuse two `Intl.NumberFormat` instances, retaining the same one-decimal formatting and the four existing metric definitions.

## Loading traces and limits

Chrome on an Apple M1 Max, 4× CPU slowdown and Fast 4G, with a warmed cache and navigation reload:

| Trace | Before LCP | After LCP | Before CLS | After CLS |
| --- | ---: | ---: | ---: | ---: |
| Desktop 1440×900, DPR 1 | 2,760 ms | 2,833 ms | 0.01 | 0.00 |
| Mobile 390×844, DPR 3 | 2,756 ms | 2,592 ms | 0.00 | 0.00 |

These are individual lab samples, not field data or a statistically established LCP improvement. The intentional entrance sequence dominates LCP: Chrome identifies the hero paragraph as the final LCP element and attributes almost all of the time to render delay. Its animation timing was preserved. The loading traces were taken after the core shader/font changes; the final resize/visibility lifecycle adjustments were checked separately at runtime.

Unthrottled frame/call-count samples were taken separately from loading traces on the same browser. Hardware, browser and network differences will affect actual performance. No public CDN or real-user measurement is claimed.

## Regression checks

- Compiled the original and optimized fragment shaders in WebGL using the actual hero texture. Compared all 368,640 RGBA channels of each 384×240 render across six cases: empty, expired, future, mixed, all-active and fade-boundary ripples. Every channel was identical on Chrome's ANGLE Metal renderer.
- Confirmed pointer movement changes the hover/ripple uniforms and that rendering resumes when scrolling back to the hero. The offscreen sample recorded zero draws and layout reads. WebGL reported no errors.
- Checked desktop image expansion and return to the original clipped position. Checked mobile image expansion, no horizontal overflow, menu open/close, and the four displayed statistics.
- Resized 1440 → 390 → 1440 without navigation: zero WebGL draws on mobile; 60 draws in the following 500ms desktop sample, with the original desktop clip restored.
- A simulated visibility change stopped drawing (zero frames in 300ms) and resumed it (36 frames in the following 300ms). This automation session did not expose a genuinely hidden document when switching tabs, so OS-level tab backgrounding was not independently verified. A simulated reduced-motion preference drew the initial static image and then recorded zero ongoing draws, including during pointer input.
- Production build, five agent-readiness checks, nine capital-metrics tests, and `git diff --check` pass. Existing Tailwind/fluid typography and `useAnimatedValue` lint warnings remain unrelated to this change.

## Font regeneration

WOFF2 files were generated from the existing TTF files with FontTools 4.60.2 and Brotli 1.2.0, without subsetting. This is an offline conversion; the app has no new runtime dependencies.

```python
from fontTools.ttLib import TTFont

font = TTFont("input.ttf", recalcTimestamp=False)
font.flavor = "woff2"
font.save("output.woff2")
```

Keep the original TTF sources for future regeneration. Verify glyph outlines, metrics and variation tables after regenerating; do not replace these with a different font family or subset solely to improve a score.

References: [Chrome performance tracing](https://developer.chrome.com/docs/devtools/performance/overview), [MDN WebGL best practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices).
