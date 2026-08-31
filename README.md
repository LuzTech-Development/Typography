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

## Sections

- **Instructions** — how to use the reference and regenerate assets locally.
- **Licenses** — MIT (source code), SIL OFL 1.1 (Space Grotesk font), and the
  LuzTech trademark/brand-use rules.
- **Icons** — download each variant in SVG or PNG, at any size, in black, white,
  color, or inverted.
- **Font & Resources** — Space Grotesk in multiple weights and sizes, with links
  to the official download page.

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
pnpm build        # type-check + static build to dist/
pnpm preview      # preview the production build
```

## Regenerating icons

The icon source SVGs live in [`icons/`](icons/). To regenerate the PNG outputs
and outlined SVGs, run:

```bash
make
```

This requires ImageMagick and Inkscape (see the Instructions section on the
site for details). The generated outputs are written to `out/` and copied into
`public/icons/` for the site.

## Repository structure

```text
.
├── src/                    # Astro source (pages, components, i18n, styles)
├── public/                 # Static assets (icons, fonts, LLM files)
├── icons/                  # Source SVG icon variants (editable)
├── assets/                 # Vendored fonts, background, iconsheet template
├── scripts/                # Asset generation + LLM file generation scripts
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
