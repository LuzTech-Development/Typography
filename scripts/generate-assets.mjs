// Generates all assets required by the site build.
//
// Run with: node scripts/generate-assets.mjs

import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const scripts = [
    'generate-icon-manifest.mjs',
    'build-assets.mjs',
    'generate-icon-zip.mjs',
    'generate-llm-files.mjs'
];

for (const script of scripts) {
    execFileSync(process.execPath, [join(__dirname, script)], {
        cwd: root,
        stdio: 'inherit'
    });
}
