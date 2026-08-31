// Generates the "download all" ZIP archive into public/ at build time.
//
// The archive mirrors the shell script's `out/` layout:
//
//   <variant>.svg              (outlined SVG)
//   <variant>/<size>/<color>.png
//   <variant>/<size>/inverted/<color>.png
//
// Run with: node scripts/generate-icon-zip.mjs

import {
    createWriteStream,
    existsSync,
    mkdirSync,
    readdirSync,
    statSync
} from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { ZipArchive } from 'archiver';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const iconsDir = join(root, 'public', 'icons');
const outFile = join(root, 'public', 'luztech-icons.zip');

function walk(dir) {
    const entries = [];
    for (const name of readdirSync(dir)) {
        const full = join(dir, name);
        const stat = statSync(full);
        if (stat.isDirectory()) {
            entries.push(...walk(full));
        } else {
            entries.push(full);
        }
    }
    return entries;
}

if (!existsSync(iconsDir)) {
    console.error(`Icons directory not found: ${iconsDir}`);
    process.exit(1);
}

const files = walk(iconsDir).sort();

const output = createWriteStream(outFile);
const archive = new ZipArchive({ zlib: { level: 9 } });

await new Promise((resolve, reject) => {
    output.on('close', resolve);
    archive.on('error', reject);
    archive.pipe(output);

    for (const file of files) {
        // Strip the `public/icons/` prefix so the archive root is the icon tree.
        const rel = relative(iconsDir, file);
        archive.file(file, { name: rel });
    }

    archive.finalize();
});

console.log(`Wrote ${outFile} (${files.length} files)`);
