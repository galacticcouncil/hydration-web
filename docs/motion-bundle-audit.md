# Dependency and Motion audit

Measured on 2026-09-18 with Next.js 14.2.3 and Framer Motion 11.2.10.

## Changes

- Removed unused direct dependencies `react-scrollmagic`, `react-text-transition`, `react-error-boundary`, and `geist`, and regenerated the existing binary Bun lockfile. No remaining package versions changed. Geist remains locally hosted in `public/font/geist`.
- Replaced `motion` with `m` in all 29 files that imported the full component in this checkout. The import migration preserved hooks, animation props, variants, and timing. Subsequent mobile hero and font changes are measured separately in `mobile-performance-review.md`.
- Added a shared client `MotionProvider` with `LazyMotion`, `domAnimation`, and `strict`, used by the Next.js root layout and Storybook decorator. Features load synchronously to preserve the existing first-render animation behavior.
- Added an ESLint restriction on importing `motion` from `framer-motion`. Use `m` within the provider for new components.

The current components use animation, viewport, and exit features, without Motion drag or layout animations. These are covered by `domAnimation`; future drag/layout work will need an explicit feature-loading decision. See the [Motion LazyMotion documentation](https://motion.dev/docs/react-lazy-motion).

## Production measurement

Both builds used `npm run build:check` on the same checkout and installed dependency versions, immediately before and after the migration.

| Next.js build output | Before | After |
| --- | ---: | ---: |
| Homepage First Load JS | 185 kB | 160 kB |

The homepage entrypoint's unique JavaScript files in `.next-build/app-build-manifest.json`, gzipped individually with Node's `gzipSync`, total 185,351 bytes before and 160,110 bytes after: 25,241 bytes saved (13.6%). This is a build artifact measurement, not a network or loading-time benchmark. Removing unused packages alone does not reduce browser JavaScript when they were never imported.

## Verification

- Production build, including TypeScript and ESLint, passes. The existing `useAnimatedValue` dependency warning and Tailwind fluid-value warnings remain.
- Storybook production build passes, with warnings about optional `@emotion/is-prop-valid` resolution and asset size. The Efficient Trading story renders with all five reveal containers at opacity 1 and no browser console errors.
- All nine capital-metrics tests and five agent-readiness tests pass, including the served-site check with `AGENT_READINESS_BASE_URL=http://127.0.0.1:3004`.
- Browser checks on the production build confirm hero scroll expansion, all nine homepage reveal containers becoming visible, desktop/mobile modal open and close, Escape dismissal and focus restoration, mobile menu toggling, no horizontal overflow at 390px, and the local Geist font loading. No homepage console errors were observed; Chrome reported font preload timing warnings during viewport emulation.
- The lint restriction rejects `motion` and accepts `m`; Bun accepts the updated manifest and lockfile with `--frozen-lockfile --lockfile-only`; `git diff --check` passes.
