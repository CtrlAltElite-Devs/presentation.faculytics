# presentation.faculytics

Web-based research congress presentation for **Faculytics 2.0** — a data-mining approach for feedback analysis, generating actionable insights and recommendations.

Replaces the static PDF deck with a GSAP-animated, keyboard-driven podium presentation. The UI tour slides embed live SingleFile snapshots of the actual product in iframes so the audience sees real rendered HTML with real text — not pixelated screenshots.

## Quick start

```bash
bun install
bun dev               # http://localhost:5173
```

Then press `F` for fullscreen and `→` to advance.

## Keyboard

| Key | Action |
|---|---|
| `→` / `Space` | Next build / next slide |
| `←` | Previous |
| `Home` / `End` | First / last slide |
| `F` | Fullscreen |
| `Z` | Zoom UI screenshot (UI tour slides) |
| `Esc` | Exit zoom |
| `.` | Blackout |
| `O` | Overview grid |
| `?` | Show shortcuts overlay |

URLs are deep-linkable: `#/pipeline`, `#/sentiment-results/1` (slide id + optional build step).

## Slides

33 slides total, in this order:

1. **02 Title** — Faculytics 2.0 hero with team
2. **03 Rationale** — six motivation cards
3. **04 Research Objectives** — checkmark list with morphing blob
4. **05 Research Design** — quantitative approach + four-phase framework
5. **06 AI Processing Pipeline** ★ — five-stage flow with traveling-dot connectors
6. **07 Sentiment Classification Model** — Gemma 4 26B-A4B + LoRA
7. **08 Topic Modeling Architecture** — BERTopic + LaBSE + UMAP + HDBSCAN
8. **09 Topic Modeling Results** — metrics table
9. **10 Sentiment Results** ★ — 96.86 % hero number + per-class / per-language tables
10. **11–29 UI Tour** — Student → Faculty → Dean → Superadmin (each role gets a section divider + 2-9 product views)
11. **30 Conclusions & Recommendations** ★ — split-panel finale

★ = cinematic standout slides.

## Adding / editing slides

Native slides live as individual TSX files under `src/slides/`. Each default-exports a `SlideDef`:

```ts
export const slide03Rationale: SlideDef = {
  id: "rationale",       // URL-safe; used for hash routing
  title: "Rationale",    // shown in the overview grid
  builds: 0,             // number of click-to-reveal build steps
  Component: RationaleSlide,
};
```

Add the export to the `slides` array in `src/slides/index.ts` to register it. Order in the array is presentation order.

### Adding a UI tour slide

```ts
makeUiSlide({
  id: "ui-faculty-overview",
  page: 13,                              // PNG fallback page number
  role: "Faculty",
  caption: "Analytics overview",
  urlBar: "app.faculytics.ctr3.org/faculty/analytics",
  htmlPath: "/slides/html/faculty-analytics.html",   // optional — iframe-embed a SingleFile save
  htmlScrollToText: "Concrete next steps",           // optional — scroll iframe to a heading
  htmlScrollOffset: -32,                             // optional — extra px of breathing room
  // pdfPath: "/slides/pdf/foo.pdf",                 // alternatively, embed a PDF
})
```

The same `makeUiSlide()` factory transparently picks the right inner component:
- `pdfPath` set → live PDF iframe (`PdfFrame`)
- `htmlPath` set → SingleFile HTML iframe (`HtmlSnapshot`) with PNG fallback
- neither set → static PNG (`ScreenshotFrame`)

## Capturing new UI screenshots

1. Install the [SingleFile](https://github.com/gildas-lormeau/SingleFile) browser extension (Chrome / Firefox / Edge / Brave).
2. Log into Faculytics and navigate to the page you want. Set up DOM state (open modals, switch tabs, etc.) **before** clicking save — SingleFile captures the current DOM.
3. Click the SingleFile extension icon. It saves a single self-contained `.html` file with everything (CSS, JS, fonts, images) inlined as base64.
4. Drop the file in `public/slides/html/<descriptive-name>.html`.
5. Wire the slide in `src/slides/ui-tour.tsx` via `makeUiSlide({ ..., htmlPath: "/slides/html/<name>.html" })`.

For scroll-variant slides on the same page (e.g., overview / themes / scores tab views all on `/faculty/analytics`), use one save and pass different `htmlScrollToText` values per slide.

## Build & deploy

```bash
bun run build         # tsc -b && vite build → ./dist
bun run preview       # local preview of dist/
```

The `dist/` output is a fully static SPA — works on any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages, plain S3+CDN). All UI tour assets (HTML, PDFs, PNGs) are bundled into `dist/slides/` and served as-is.

## Tech stack

- **Vite 8** + **React 19** + **TypeScript** (strict)
- **Tailwind CSS 4** via `@tailwindcss/vite`
- **GSAP 3.15** with Flip, MotionPath, SplitText, Observer, CustomEase
- **Zustand** for deck state
- **Bun** as package manager

## Authors

Norhanah Umpar · Ethan Patrick Bandebas · Leander Lorenz Lubguban · Harvie Purgatorio

College of Computer Studies, University of Cebu — Main.
