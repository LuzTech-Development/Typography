// Source of truth for the LuzTech icon library.
//
// The generated PNG outputs live under `public/icons/<variant>/<size>/[inverted/]<color>.png`
// and the outlined SVGs under `public/icons/<variant>.svg`. This module mirrors that
// layout so the UI, the `icons.json` map, and `llms.txt` all stay in sync.

export type IconVariant = 'clean' | 'name' | 'blog' | 'nfse';

export type IconColor = 'black' | 'white' | 'color';

export type IconSize = 16 | 32 | 64 | 128 | 256 | 512 | 1024;

export interface IconVariantMeta {
    id: IconVariant;
    /** Human-readable label key (resolved via the i18n dictionary). */
    labelKey: 'clean' | 'name' | 'blog' | 'nfse';
    /** Whether the variant includes a text wordmark (vs. the clean mark). */
    hasText: boolean;
}

export const ICON_VARIANTS: IconVariantMeta[] = [
    { id: 'clean', labelKey: 'clean', hasText: false },
    { id: 'name', labelKey: 'name', hasText: true },
    { id: 'blog', labelKey: 'blog', hasText: true },
    { id: 'nfse', labelKey: 'nfse', hasText: true }
];

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
