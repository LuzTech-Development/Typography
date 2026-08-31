// Source of truth for the LuzTech icon library.
//
// The generated PNG outputs live under `public/icons/<variant>/<size>/[inverted/]<color>.png`
// and the outlined SVGs under `public/icons/<variant>.svg`. This module mirrors that
// layout so the UI, the `icons.json` map, and `llms.txt` all stay in sync.
//
// The list of variants is derived from the `icons/*.svg` files at build time
// (see `scripts/generate-icon-manifest.mjs`), so adding a new SVG requires no
// manual edits here.

import { GENERATED_ICON_VARIANTS } from './icons.generated';

export type IconVariant = string;

export type IconColor = 'black' | 'white' | 'color';

export type IconSize = 16 | 32 | 64 | 128 | 256 | 512 | 1024;

export interface IconVariantMeta {
    id: IconVariant;
    /** Display label derived from the SVG's `<text>` (or the filename). */
    label: string;
}

export const ICON_VARIANTS: IconVariantMeta[] = GENERATED_ICON_VARIANTS;

export const ICON_SIZES: IconSize[] = [16, 32, 64, 128, 256, 512, 1024];

export const ICON_COLORS: IconColor[] = ['black', 'white', 'color'];

/**
 * Builds the relative URL for a PNG icon.
 * Matches the requested scheme: `/icons/<variant>/<size>/[inverted/]<color>.png`.
 */
export function pngUrl(
    variant: IconVariant,
    size: IconSize,
    color: IconColor,
    inverted = false
): string {
    const inv = inverted ? 'inverted/' : '';
    return `/icons/${variant}/${size}x/${inv}${color}.png`;
}

/** Builds the relative URL for the outlined SVG of a variant. */
export function svgUrl(variant: IconVariant): string {
    return `/icons/${variant}.svg`;
}
