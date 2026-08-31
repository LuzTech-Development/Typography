# LuzTech Typography

LuzTech Typography is the official reference website for the LuzTech visual
identity: icons, typography, licenses, and brand assets.

The site is statically generated with [Astro](https://astro.build), bi-lingual
(English and Portuguese), and deployed to Azure Static Web Apps. It exposes
LLM-ready files (`llms.txt`, `llms-full.txt`, `icons.json`) and stable,
predictable URLs for every icon.

## Live site

- English: <https://ui.luztech.dev.br/en-us/>
- Português: <https://ui.luztech.dev.br/pt-br/>

## Pages

The site is a multi-page reference, with each section on its own route:

- **Instructions** (`/`) — the home page. A sober overview of the site's purpose
  and quick links to the other pages.
- **Licenses** (`/licenses/`) — MIT (source code), SIL OFL 1.1 (Space Grotesk
  font), and the LuzTech trademark/brand-use rules, summarized as "you can /
  you cannot" with links to the full files.
- **Icons** (`/icons/`) — a download tool: pick a variant, format (SVG/PNG),
  color (SVG) or size (PNG), and download — or grab everything as a ZIP.
- **Font** (`/font/`) — Space Grotesk with a live text preview across weights
  and sizes, plus links to the official download page.

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

## Development

```bash
pnpm install
pnpm dev          # live preview at http://localhost:3000
pnpm build        # regenerate icons + ZIP + LLM files, then type-check + build
pnpm preview      # preview the production build
```

## Icon generation

The icon source SVGs live in [`icons/`](icons/). The PNG outputs, outlined SVGs,
and the "download all" ZIP are **generated at build time** (not committed to
git). `pnpm build` runs the full pipeline:

1. `scripts/build-assets.mjs` — outlines text and renders PNGs from the source
   SVGs (requires Inkscape, ImageMagick, and fontconfig), then copies them into
   `public/icons/`.
2. `scripts/generate-icon-zip.mjs` — packages `public/icons/` into
   `public/luztech-icons.zip`.
3. `scripts/generate-llm-files.mjs` — regenerates `llms.txt`, `llms-full.txt`,
   and `icons.json`.

To regenerate just the icons locally (without the site build), run:

```bash
make
```

## Repository structure

```text
.
├── src/                    # Astro source (pages, components, i18n, styles)
├── public/                 # Static assets (fonts, LLM files; icons generated at build)
├── icons/                  # Source SVG icon variants (editable)
├── assets/                 # Vendored fonts and background
├── scripts/                # Build-time asset generation + LLM file scripts
├── astro.config.mjs        # Astro configuration (i18n, sitemap, integrations)
├── staticwebapp.config.json# Azure Static Web Apps configuration
├── LICENSE                 # MIT license for source code and scripts
├── TRADEMARKS.md           # LuzTech visual identity and trademark notice
└── Makefile                # Convenience commands for icon generation
```

## Legal and trademark notice

The source code, scripts, and automation files are licensed under the
[MIT License](LICENSE), unless otherwise stated.

The LuzTech name, logo, icons, typography outputs, and brand materials are
**not** licensed under MIT. Read [`TRADEMARKS.md`](TRADEMARKS.md) for the full
brand-use rules. The Space Grotesk font is licensed under the
[SIL Open Font License 1.1](assets/fonts/OFL.txt).
