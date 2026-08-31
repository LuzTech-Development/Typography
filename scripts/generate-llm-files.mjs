// Generates LLM-ready files (llms.txt, llms-full.txt, icons.json) into public/.
//
// Run with: node scripts/generate-llm-files.mjs
//
// These files are also committed so the site works without a build step, but
// this script keeps them in sync with src/lib/icons.ts.

import { writeFileSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const publicDir = join(root, 'public');
const iconsDir = join(root, 'icons');

const SITE = 'https://ui.luztech.dev.br';

// Discover variants from the source SVGs (single source of truth).
const TEXT_RE = /<text\b[^>]*>([^<]+)<\/text>/;
const variants = readdirSync(iconsDir)
    .filter(f => f.endsWith('.svg'))
    .map(f => f.replace(/\.svg$/, ''))
    .sort();

const sizes = [16, 32, 64, 128, 256, 512, 1024];
const colors = ['black', 'white', 'color'];

// --- icons.json -----------------------------------------------------------
const icons = {};
for (const variant of variants) {
    icons[variant] = {
        svg: `/icons/${variant}.svg`,
        png: {}
    };
    for (const size of sizes) {
        icons[variant].png[`${size}x`] = {};
        for (const color of colors) {
            icons[variant].png[`${size}x`][color] =
                `/icons/${variant}/${size}x/${color}.png`;
        }
        icons[variant].png[`${size}x`].inverted = {};
        for (const color of colors) {
            icons[variant].png[`${size}x`].inverted[color] =
                `/icons/${variant}/${size}x/inverted/${color}.png`;
        }
    }
}

const iconsJson = {
    $schema: 'https://ui.luztech.dev.br/icons.schema.json',
    site: SITE,
    description:
        'LuzTech icon library. Every icon is available as an outlined SVG and as PNGs in multiple sizes, colors, and inverted variants.',
    urlPattern: '/icons/<variant>/<size>/[inverted/]<color>.png',
    variants,
    sizes,
    colors,
    icons
};

mkdirSync(publicDir, { recursive: true });
writeFileSync(
    join(publicDir, 'icons.json'),
    JSON.stringify(iconsJson, null, 2) + '\n'
);
console.log('Wrote public/icons.json');

// --- llms.txt -------------------------------------------------------------
const llms = `# LuzTech Typography

> Official LuzTech visual identity reference: icons, typography, licenses, and brand assets.

## Site

- English: ${SITE}/en-us/
- Português: ${SITE}/pt-br/

## Pages

- Instructions (home): ${SITE}/en-us/
- Licenses: ${SITE}/en-us/licenses/
- Icons: ${SITE}/en-us/icons/
- Font: ${SITE}/en-us/font/

## Icon library

Every icon is available as an outlined SVG and as PNGs in multiple sizes, colors, and inverted variants.

URL pattern: /icons/<variant>/<size>/[inverted/]<color>.png

Variants: ${variants.join(', ')}
Sizes: ${sizes.join(', ')}
Colors: ${colors.join(', ')}

Full icon map: ${SITE}/icons.json

## Font

- Space Grotesk (variable font, SIL Open Font License 1.1)
- Google Fonts: https://fonts.google.com/specimen/Space+Grotesk
- GitHub: https://github.com/floriankarsten/space-grotesk

## Download all icons

- ZIP archive: ${SITE}/luztech-icons.zip

## Licenses

- Source code & scripts: MIT License
- Space Grotesk font: SIL Open Font License 1.1
- LuzTech brand assets: trademark & brand-use restrictions (see TRADEMARKS.md)

## Repository

- https://github.com/LuzTech-Development/Typography
`;

writeFileSync(join(publicDir, 'llms.txt'), llms);
console.log('Wrote public/llms.txt');

// --- llms-full.txt --------------------------------------------------------
const llmsFull = `${llms}
## Full icon URL listing

${variants
    .map(variant => {
        const lines = [`### ${variant}`];
        lines.push(`SVG: /icons/${variant}.svg`);
        for (const size of sizes) {
            for (const color of colors) {
                lines.push(`PNG: /icons/${variant}/${size}x/${color}.png`);
            }
            for (const color of colors) {
                lines.push(
                    `PNG (inverted): /icons/${variant}/${size}x/inverted/${color}.png`
                );
            }
        }
        return lines.join('\n');
    })
    .join('\n\n')}
`;

writeFileSync(join(publicDir, 'llms-full.txt'), llmsFull);
console.log('Wrote public/llms-full.txt');
