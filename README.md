# LuzTech Typography

[![Astro](https://img.shields.io/badge/Astro-7-ff5d01?logo=astro&logoColor=white)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Font: SIL OFL 1.1](https://img.shields.io/badge/Font-SIL%20OFL%201.1-lightgrey.svg)](assets/fonts/OFL.txt)
[![Brand: Trademark](https://img.shields.io/badge/Brand-Trademark-black.svg)](TRADEMARKS.md)

Official reference website for the LuzTech visual identity — icons, typography,
licenses, and brand assets. Built with Astro and deployed to Azure Static Web
Apps.

## Live site

- English: <https://ui.luztech.dev.br/en-us/>
- Português: <https://ui.luztech.dev.br/pt-br/>

## Features

- Bi-lingual reference site (English and Portuguese) with locale-aware routing
- Downloadable icon library across four variants, seven sizes, three colors,
  and an inverted option — served from stable, predictable URLs
- Outlined SVGs and per-size PNGs generated at build time from the source SVGs
- "Download all" ZIP of the full icon set generated at build time
- Space Grotesk font preview with live weight and size controls
- In-house mesh gradient background generator (PNG, swirled, and animated
  video export) built on WebGL shaders
- LLM-ready reference files: `llms.txt`, `llms-full.txt`, and `icons.json`
- Sitemap, SEO metadata, and locale-aware 404 handling

## Tech stack

- [Astro](https://astro.build/) (static output)
- [React](https://react.dev/) islands for interactive sections
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) via
  `@fontsource-variable/space-grotesk`
- [Editframe](https://editframe.com/) for animated background video export
- [@paper-design/shaders-react](https://www.paper.design/shaders) for the
  mesh gradient renderer

## Pages

The site is a multi-page reference, with each section on its own route:

- **Instructions** (`/`) — the home page. A sober overview of the site's
  purpose and quick links to the other pages.
- **Licenses** (`/licenses/`) — MIT (source code), SIL OFL 1.1 (Space Grotesk
  font), and the LuzTech trademark/brand-use rules, summarized as "you can /
  you cannot" with links to the full files.
- **Icons** (`/icons/`) — a download tool: pick a variant, format (SVG/PNG),
  color (SVG) or size (PNG), and download — or grab everything as a ZIP.
- **Font** (`/font/`) — Space Grotesk with a live text preview across weights
  and sizes, plus links to the official download page.
- **Backgrounds** (`/backgrounds/`) — an in-house mesh gradient generator for
  LuzTech-branded backgrounds. Pick dimensions and download a PNG, generate a
  static swirled variant, or export an animated video. The renderer is built
  in-house on top of WebGL shaders; the flat mesh gradient technique is
  inspired by [meshgradient.com](https://meshgradient.com/).

## Icon URLs

Every icon is available at a stable, predictable URL:

```
/icons/<variant>/<size>/[inverted/]<color>.png
```

- **Variants**: `clean`, `name`, `blog`, `nfse`
- **Sizes**: `16`, `32`, `64`, `128`, `256`, `512`, `1024`
- **Colors**: `black`, `white`, `color`
- **Inverted**: optional `inverted/` segment

Outlined SVGs are available at `/icons/<variant>.svg`.

The full machine-readable map is at `/icons.json`.

## LLM-ready files

- `/llms.txt` — concise site overview and icon library summary.
- `/llms-full.txt` — full listing of every icon URL.
- `/icons.json` — structured JSON map of variants, sizes, colors, and URLs.

## Getting started

```bash
pnpm install
pnpm dev          # live preview at http://localhost:3000
pnpm build        # regenerate icons + ZIP + LLM files, then type-check + build
pnpm preview      # preview the production build
```

The `dev` script auto-regenerates icon assets when the source SVGs in [`icons/`](icons/) are stale. The `build` script always runs the full pipeline.

## Icon generation pipeline

The icon source SVGs live in [`icons/`](icons/). The PNG outputs, outlined SVGs, and the "download all" ZIP are **generated at build time** (not committed to git). Generation requires **Inkscape**, **ImageMagick**, and **fontconfig** on the host machine.

`pnpm build` runs the pipeline end-to-end:

1. `scripts/generate-icon-manifest.mjs` — enumerates the source SVGs and
   builds the icon manifest consumed by the site.
2. `scripts/build-assets.mjs` — outlines text and renders PNGs from the source
   SVGs, then copies them into `public/icons/`.
3. `scripts/generate-icon-zip.mjs` — packages `public/icons/` into
   `public/luztech-icons.zip`.
4. `scripts/generate-llm-files.mjs` — regenerates `llms.txt`, `llms-full.txt`,
   and `icons.json`.
5. `astro check && astro build` — type-checks and builds the site.

## Branding

This repository **is** the source of truth for LuzTech typography, colors,
and brand guidance.

## License

This repository uses a **layered license**:

- **Source code** (Astro components, scripts, styles, configuration) —
  [MIT License](LICENSE).
- **Space Grotesk font** (`assets/fonts/`, `public/fonts/`) —
  [SIL Open Font License 1.1](assets/fonts/OFL.txt).
- **LuzTech brand assets** (name, logo, icons, typography outputs, mesh
  gradient backgrounds) — **not** covered by MIT. See
  [`TRADEMARKS.md`](TRADEMARKS.md) for the full "you can / you cannot"
  brand-use rules.

If you reference LuzTech icons or typography in your own work, please credit
**LuzTech Development** and link back to <https://ui.luztech.dev.br>.
