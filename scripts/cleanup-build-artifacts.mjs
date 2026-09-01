// Removes intermediate files created while generating build assets.
//
// Run with: node scripts/cleanup-build-artifacts.mjs

import { rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outDir = join(root, 'out');

rmSync(outDir, { recursive: true, force: true });
console.log(`Removed ${outDir}`);
