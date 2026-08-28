import path from 'node:path';
import { vitePluginEditframe } from '@editframe/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, lazyPlugins } from 'vite-plus';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  server: {
    port: 3000
  },
  fmt: {
    arrowParens: 'avoid',

    singleQuote: true,
    bracketSameLine: true,
    trailingComma: 'none',
    tabWidth: 4,
    overrides: [
      {
        files: ['*.config.ts', '*.config.js', '*.config.mjs', '*.json', '*.yaml', '*.yml'],
        options: {
          tabWidth: 2
        }
      }
    ]
  },
  lint: {
    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
    rules: { 'vite-plus/prefer-vite-plus-imports': 'error' },
    options: { typeAware: true, typeCheck: true }
  },
  plugins: lazyPlugins(() => [
    tailwindcss(),
    vitePluginEditframe({
      root: path.join(__dirname, 'src'),
      cacheRoot: path.join(__dirname, 'src', 'assets')
    }),
    viteSingleFile(),
    react()
  ])
});
