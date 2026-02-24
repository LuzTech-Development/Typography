# LuzTech Typography

This repository contains the source files and scripts for generating the icons used in the LuzTech Typography project. The icons are generated from SVG files located in the `assets` directory, and the generated PNG files are stored in the `out` directory.

## Requirements

- [ImageMagick](https://imagemagick.org/) for image processing.
- [Inkscape](https://inkscape.org/) for SVG to PNG conversion.
- A Unix-like environment (Linux, macOS, or Windows Subsystem for Linux) to run the shell scripts.

## Usage

To generate the icons, run the `make` script from the terminal:

```bash
make
```

This will execute the [`scripts/generate.sh`](scripts/generate.sh) script, which processes all SVG files in the `assets` directory and generates the corresponding PNG files in the `out` directory.

## Typography Details

The typography uses a mesh gradient as background, with the following colors:

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

The site used to generate the mesh gradient is [Mesh Gradient Generator](https://meshgradient.com/?w=eyJzIjpbWy0wLjg1LC0wLjldLFstMC45NDk5OTk5OTk5OTk5OTk4LDAuOTAyOTk0MDExOTc2MDQ4XSxbMC45MDM4OTIyMTU1Njg4NjIyLC0wLjkxMTk3NjA0NzkwNDE5MThdLFswLjk1LDAuOV0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF1dLCJkIjpbWy0wLjg1LC0wLjldLFstMC45NSwwLjldLFswLjg1LC0wLjldLFswLjk1LDAuOV0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF0sWzAsMF1dLCJwIjo0fQ%3D%3D&c=eyJ0bCI6IiMwMGZmOWQiLCJ0ciI6IiM2OWRkOTYiLCJibCI6IiM0NjY1YzMiLCJiciI6IiMxZjZmZWYifQ%3D%3D).

The font used in the typography is [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk), which is a variable font available on Google Fonts.

The weight used in the `name` version of the typography is `800`.
