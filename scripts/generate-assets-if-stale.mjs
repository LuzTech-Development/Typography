// Dev-time asset generation guard.
//
// Rebuilds icons (and the ZIP) only when the source SVGs in `icons/` have
// changed since the last generation. The fingerprint is a hash of every source
// SVG's contents, stored in `public/lastGenerated.txt` alongside the ISO
// timestamp. This avoids re-running the expensive Inkscape / ImageMagick
// pipeline on every `pnpm dev`, while still regenerating whenever a new SVG is
// added or an existing one is edited.
//
// Force a rebuild with: node scripts/generate-assets-if-stale.mjs --force

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const iconsDir = join(root, 'icons');
const stampFile = join(root, 'public', 'lastGenerated.txt');

const force = process.argv.includes('--force');

/** Hashes the contents of every source SVG into a single fingerprint. */
function computeFingerprint() {
    const files = readdirSync(iconsDir)
        .filter(f => f.endsWith('.svg'))
        .sort();
    const hash = createHash('sha256');
    for (const file of files) {
        hash.update(file);
        hash.update('\0');
        hash.update(readFileSync(join(iconsDir, file)));
        hash.update('\0');
    }
    return hash.digest('hex');
}

/** Reads the stored fingerprint from `lastGenerated.txt`, if present. */
function readStoredFingerprint() {
    if (!existsSync(stampFile)) return null;
    const raw = readFileSync(stampFile, 'utf8').trim();
    // Format: `<iso-date> <sha256>` (hash may be absent for legacy stamps).
    const parts = raw.split(/\s+/);
    return parts.length >= 2 ? parts[1] : null;
}

const current = computeFingerprint();
const stored = readStoredFingerprint();

if (!force && stored === current) {
    console.log(
        `\n==> Skipping asset generation (icons unchanged). Use --force to rebuild.`
    );
    process.exit(0);
}

console.log(`\n==> Generating assets (icons changed or forced)...`);
execFileSync(process.execPath, [join(__dirname, 'generate-assets.mjs')], {
    cwd: root,
    stdio: 'inherit'
});
execFileSync(process.execPath, [join(__dirname, 'cleanup-build-artifacts.mjs')], {
    cwd: root,
    stdio: 'inherit'
});

writeFileSync(stampFile, `${new Date().toISOString()} ${current}\n`);
console.log(`\n==> Wrote ${stampFile}`);
