// Build-time asset generation orchestrator.
//
// Runs the icon generation pipeline (outlined SVGs + PNGs) from the source
// SVGs in `icons/`, copies the results into `public/icons/`, and produces the
// "download all" ZIP. This is the single entry point wired into `pnpm build`.
//
// Requires Inkscape, ImageMagick, and fontconfig (installed in CI and locally).
//
// Run with: node scripts/build-assets.mjs

import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const scriptsDir = join(root, 'scripts');
const iconsDir = join(root, 'icons');
const outDir = join(root, 'out');
const publicIconsDir = join(root, 'public', 'icons');

function run(cmd, args = []) {
    console.log(`\n==> ${cmd} ${args.join(' ')}`);
    execFileSync('bash', [join(scriptsDir, cmd), ...args], {
        cwd: root,
        stdio: 'inherit'
    });
}

// 1. Discover variants from the source SVGs.
const variants = readdirSync(iconsDir)
    .filter(file => file.endsWith('.svg'))
    .map(file => file.replace(/\.svg$/, ''))
    .sort();

console.log(`\n==> Generating icons for variants: ${variants.join(', ')}`);

// 2. Clean previous output.
rmSync(outDir, { recursive: true, force: true });
rmSync(publicIconsDir, { recursive: true, force: true });
mkdirSync(publicIconsDir, { recursive: true });

// 3. Generate outlined SVGs + PNGs + sizes for each variant.
for (const variant of variants) {
    run('generate_outlined_svg.sh', [variant]);
    run('generate_pngs.sh', [variant]);
    run('generate_sizes.sh', [variant]);
}

// 4. Copy the generated assets into public/icons/.
for (const variant of variants) {
    cpSync(
        join(outDir, `${variant}.svg`),
        join(publicIconsDir, `${variant}.svg`)
    );
    cpSync(join(outDir, variant), join(publicIconsDir, variant), {
        recursive: true
    });
}

console.log(`\n==> Copied generated icons to public/icons/`);
