// Dev-time asset generation guard.
//
// Rebuilds icons (and the ZIP) only when the last generation is older than a
// TTL (default 2 hours), so `pnpm dev` doesn't re-run the expensive Inkscape /
// ImageMagick pipeline on every start. The timestamp is stored in
// `lastGenerated.txt` (ISO date) at the repo root.
//
// Force a rebuild with: node scripts/generate-assets-if-stale.mjs --force

import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const stampFile = join(root, 'public', 'lastGenerated.txt');
const TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

const force = process.argv.includes('--force');

function isFresh() {
    if (!existsSync(stampFile)) return false;
    const raw = readFileSync(stampFile, 'utf8').trim();
    const last = Date.parse(raw);
    if (Number.isNaN(last)) return false;
    return Date.now() - last < TTL_MS;
}

if (!force && isFresh()) {
    console.log(
        `\n==> Skipping asset generation (last run < 2h ago). Use --force to rebuild.`
    );
    process.exit(0);
}

console.log(`\n==> Generating assets (stale or forced)...`);
execSync(`node "${join(__dirname, 'build-assets.mjs')}"`, {
    cwd: root,
    stdio: 'inherit'
});
execSync(`node "${join(__dirname, 'generate-icon-zip.mjs')}"`, {
    cwd: root,
    stdio: 'inherit'
});

writeFileSync(stampFile, new Date().toISOString() + '\n');
console.log(`\n==> Wrote ${stampFile}`);
