# LuzTech Typography

LuzTech Typography is the home for LuzTech visual identity source files, generated icon outputs, typography guidance, and animated brand backgrounds.

Use this repository when you need official LuzTech typography assets, generated icon packages, iconsheets, or the source files and scripts used to reproduce them.

## Summary

- [Useful links](#useful-links)
- [What you can do with this repository](#what-you-can-do-with-this-repository)
- [For users: getting the assets](#for-users-getting-the-assets)
- [Typography details](#typography-details)
- [Requirements for development](#requirements-for-development)
- [Generate icons locally](#generate-icons-locally)
- [Work with animations](#work-with-animations)
- [Repository structure](#repository-structure)
- [Legal and trademark notice](#legal-and-trademark-notice)

## Useful links

[Go to Summary](#summary)

- [Latest release](https://github.com/LuzTech-Development/Typography/releases/latest) — download the newest generated assets.
- [All releases](https://github.com/LuzTech-Development/Typography/releases) — browse previous generated asset packages.
- [Trademark notice and visual identity usage rules](TRADEMARKS.md) — read this before using LuzTech names, logos, icons, typography outputs, or other brand assets.
- [License](LICENSE) — source code, scripts, and automation files are licensed under MIT unless otherwise stated.
- [Animations project](animations/) — Remotion project for animated mesh-gradient visuals.

## What you can do with this repository

[Go to Summary](#summary)

You can use this repository to:

- Download ready-to-use LuzTech icon assets from the [latest release](https://github.com/LuzTech-Development/Typography/releases/latest).
- Regenerate PNG icons and icon sheets from the SVG sources.
- Inspect the official typography style, including the font, colors, and mesh-gradient design.
- Render animated brand backgrounds using the Remotion project in [`animations/`](animations/).
- Reference LuzTech visual identity materials in documentation, articles, integrations, or compatibility references.

Before using LuzTech brand assets, read [`TRADEMARKS.md`](TRADEMARKS.md). The source code and scripts may be MIT-licensed, but the LuzTech name, logo, icons, typography outputs, generated visual identity files, and other brand materials have additional trademark and brand-use restrictions.

## For users: getting the assets

[Go to Summary](#summary)

The easiest way to get the generated assets is to download them from the [latest release](https://github.com/LuzTech-Development/Typography/releases/latest).

Release assets may include:

- `icons.zip` — generated icon files.
- `ICONSHEET.pdf` — a printable icon sheet.

If you only need the officially generated files, prefer the release downloads instead of running the build scripts locally.

## Typography details

[Go to Summary](#summary)

The typography uses a mesh gradient background with the following colors:

<ul>
    <li>Top left: #00ff9d
        <img src="https://dummyimage.com/8x8/00ff9d/00ff9d" alt="#00ff9d" style="display: inline" />
    </li>
    <li>Top right: #69dd96
        <img src="https://dummyimage.com/8x8/69dd96/69dd96" alt="#69dd96" style="display: inline" />
    </li>
    <li>Bottom left: #4665c3
        <img src="https://dummyimage.com/8x8/4665c3/4665c3" alt="#4665c3" style="display: inline" />
    </li>
    <li>Bottom right: #1f6fef
        <img src="https://dummyimage.com/8x8/1f6fef/1f6fef" alt="#1f6fef" style="display: inline" />
    </li>
</ul>

The mesh gradient was created with [Mesh Gradient Generator](https://meshgradient.com/).

The font used in the typography is [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk), a variable font available from Google Fonts.

The weight used in the `name` version of the typography is `800`.

## Requirements for development

[Go to Summary](#summary)

To regenerate assets locally, install:

- [ImageMagick](https://imagemagick.org/) for image processing.
- [Inkscape](https://inkscape.org/) for SVG-to-PNG conversion.
- A Unix-like environment, such as Linux, macOS, or Windows Subsystem for Linux, to run the shell scripts.

To work on animations, install:

- [Node.js](https://nodejs.org/).
- [pnpm](https://pnpm.io/).

## Generate icons locally

[Go to Summary](#summary)

Run the default generation command from the repository root:

```bash
make
```

This runs [`scripts/generate.sh`](scripts/generate.sh), which processes SVG files in [`icons/`](icons/) and writes generated files to `out/`.

To generate only selected variants, pass the variant names after `generate`:

```bash
make generate clean name
```

For each requested variant, the generator runs the supporting scripts that create PNG outputs, size variants, and the icon sheet.

## Work with animations

[Go to Summary](#summary)

The [`animations/`](animations/) directory contains a [Remotion](https://www.remotion.dev/) project for rendering animated LuzTech mesh-gradient visuals.

From the `animations/` directory, install dependencies:

```bash
cd animations
pnpm i
```

Start the Remotion preview studio:

```bash
pnpm run dev
```

Run checks for the animation project:

```bash
pnpm run lint
```

Render the video with Remotion:

```bash
pnpm exec remotion render
```

The main composition is configured in [`animations/src/Root.tsx`](animations/src/Root.tsx). It currently uses a 1920×1080 canvas, 60 FPS, a 60-second duration, and the LuzTech mesh-gradient colors. The gradient implementation lives in [`animations/src/MeshGradient.tsx`](animations/src/MeshGradient.tsx).

Useful animation settings include:

- `DURATION_SECONDS` — total animation length.
- `FPS` — frames per second.
- `SPEED` — gradient animation speed.
- `ALTERNATE` — whether the animation reverses direction halfway through.
- `SHOW_LOGO` — whether the LuzTech logo is shown over the gradient.
- `WIDTH` and `HEIGHT` — render resolution.

After changing these values, preview with `pnpm run dev` before rendering the final video.

## Repository structure

[Go to Summary](#summary)

```text
.
├── animations/       # Remotion animation project
├── icons/            # Source SVG icon variants
├── out/              # Generated outputs, when created locally
├── scripts/          # Asset generation scripts
├── LICENSE           # MIT license for source code and scripts
├── Makefile          # Convenience commands for generation
├── README.md         # Project overview and usage guide
└── TRADEMARKS.md     # LuzTech visual identity and trademark notice
```

## Legal and trademark notice

[Go to Summary](#summary)

The source code, scripts, and automation files in this repository are licensed under the [MIT License](LICENSE), unless otherwise stated.

The LuzTech name, logo, icons, typography outputs, generated visual identity files, and other materials representing the LuzTech brand are **not** licensed under MIT. Read [`TRADEMARKS.md`](TRADEMARKS.md) for permitted use, restricted use, and approval requirements.
