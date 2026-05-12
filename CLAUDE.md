# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GSAP-driven web presentation deck replacing the PDF version of the Faculytics 2.0 research congress talk. Built for podium use — keyboard-driven, fullscreen-capable, deploy-safe to any static host. Designed to be visually consistent with `app.faculytics` so the UI tour slides feel continuous with the real product.

## Tech Stack

Vite 8, React 19, TypeScript (strict), Tailwind CSS 4, GSAP 3.15 (Flip, MotionPath, SplitText, Observer, CustomEase — all free as of 3.13+), Zustand, Bun (package manager).

## Commands

- `bun dev` — start dev server (port 5173)
- `bun run build` — production build (runs `tsc -b && vite build`)
- `bun run lint` — ESLint
- `bunx tsc -b --noEmit` — type-check only

## Architecture

### Slide framework

- Each slide is a React component co-located in `src/slides/`, exporting a `SlideDef` object: `{ id, title, builds, Component, dark?, preloadAssets? }`.
- Central ordered registry in `src/slides/index.ts` — explicit array, editorial order. NOT filesystem discovery.
- Deck shell in `src/components/Deck.tsx` owns: active slide, build step, transition state, keyboard handlers, URL hash sync, transition overlay.
- Only one slide is mounted at a time (dual-mounted for ~200ms during the crossfade window).
- State lives in `src/store/useDeck.ts` (Zustand). Includes `zoomed` flag for the per-slide UI-tour zoom feature; auto-resets to `false` on slide change.

### GSAP patterns

- `src/lib/gsap.ts` runs `gsap.registerPlugin(...)` once and re-exports `gsap`, `useGSAP`, plugins, and a `prefersReducedMotion()` helper.
- Three custom eases are registered: `deck-out`, `deck-in`, `deck-overshoot` — use these rather than ad-hoc strings.
- Every slide's timeline checks `prefersReducedMotion()` and calls `tl.progress(1)` to short-circuit when set.
- Build steps (PowerPoint-style click-to-reveal) use `tl.addLabel("b1")` then `tl.tweenTo("b1")`; reverse with `tl.tweenFromTo("b1", "b0")`. Currently only slide 10 (Sentiment Results) uses builds — pattern is reusable.

### Three ways to render product UI inside a slide

| Component | Use for | File path convention |
|---|---|---|
| `ScreenshotFrame` | Static PNG with browser-chrome frame | `public/slides/source/page-NN.png` |
| `HtmlSnapshot` | SingleFile-saved HTML in an iframe; supports `scrollY` / `scrollToSelector` / `scrollToText` so one save can power multiple slides | `public/slides/html/<name>.html` |
| `PdfFrame` | Live PDF in an iframe with browser PDF viewer chrome hidden via `#toolbar=0&navpanes=0` | `public/slides/pdf/<name>.pdf` |

All three share the same visual chrome (rounded card, traffic-light dots, URL bar) and the same entrance animation (scale-from-0.92 + y-up + fade + deblur).

### UI tour factory

`makeUiSlide()` in `src/slides/ui-tour.tsx` is the single factory for all 19 UI tour slides. It picks the right inner component based on which prop is provided: `pdfPath` → `PdfFrame`, `htmlPath` → `HtmlSnapshot`, otherwise → `ScreenshotFrame`. Section divider slides (Student / Faculty / Dean / Superadmin "act breaks") are made via `makeDivider()`.

### Brand parity

`src/index.css` copies oklch tokens, the radial-glow body background, and Geist + Playfair Display fonts from `app.faculytics/app/globals.css`. **Keep these in sync** with the parent app's `globals.css` if the brand evolves — there is no programmatic dependency, they were copied at scaffold time. Logo + team photos + device mockups live at `public/landing/` (also copied from `app.faculytics/public/landing/`, not symlinked — the deck must run standalone).

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `→` / `Space` / `PageDown` | Next build step then next slide |
| `←` / `PageUp` | Previous build step or previous slide |
| `Home` / `End` | First / last slide |
| `F` | Fullscreen toggle |
| `Z` | Zoom UI screenshot edge-to-edge (UI tour slides only) |
| `Esc` | Exit zoom |
| `.` | Blackout |
| `O` | Overview grid (jump to any slide) |
| `?` | Show shortcuts overlay |

## Adding a UI Tour Slide

1. Log into Faculytics and navigate to the page you want to capture. Trigger any state (open modal, switch tab, scroll) that needs to be in the DOM at capture time.
2. Click the [SingleFile browser extension](https://github.com/gildas-lormeau/SingleFile) icon — produces a self-contained `.html` with all CSS/JS/fonts/images base64-inlined.
3. Drop the file at `public/slides/html/<descriptive-name>.html`.
4. Call `makeUiSlide({ id, page, role, caption, urlBar, htmlPath: "/slides/html/<name>.html" })` in `src/slides/ui-tour.tsx`. For scroll-anchored variants of the same save, add `htmlScrollToText` + `htmlScrollOffset`.

## Key Architectural Rules

- **No DrawSVG / MorphSVG plugins** — those were Club GSAP-only historically. Use `stroke-dasharray` / `stroke-dashoffset` tweens or two-path crossfade for morph effects instead.
- **`Space` key default behavior** — the deck root must `preventDefault` on Space, otherwise the browser scrolls the page.
- **Iframe sandbox defaults to `allow-same-origin` only** (no scripts). Next.js SSR'd markup renders fully without hydration — that's intentional for stable previews. Pass `htmlAllowScripts: true` only when a slide genuinely needs runtime JS (rare).
- **Don't kill broad swathes of GSAP tweens** — `gsap.killTweensOf(".some-selector")` will nuke any unrelated tween on the same element (e.g., `HtmlSnapshot`'s entrance tween on the figure). Scope kills to specific timeline refs.
- **The deck stage is 16:9** (`.deck-stage` class), centered with letterboxing. All slide layouts must work within `min(100vw, 100vh * 16/9)` bounds. Test at both 1920×1080 and 1280×720 before podium use.

## Where Things Live

```
src/
├── components/
│   ├── Deck.tsx              # shell, keyboard, hash sync
│   ├── SlideShell.tsx        # bg gradient + padding wrapper
│   ├── SlideIndicator.tsx    # bottom-right slide counter
│   ├── ScreenshotFrame.tsx   # PNG wrapper
│   ├── HtmlSnapshot.tsx      # saved-HTML iframe wrapper
│   ├── PdfFrame.tsx          # PDF iframe wrapper
│   └── Overview.tsx          # 'O' grid view
├── slides/
│   ├── types.ts              # SlideDef + SlideProps
│   ├── index.ts              # ordered slide registry
│   ├── ui-tour.tsx           # makeUiSlide + makeDivider factories, all UI slides
│   ├── 02-title.tsx … 30-conclusions.tsx
├── store/useDeck.ts          # Zustand
└── lib/gsap.ts               # registerPlugin once + custom eases
```
