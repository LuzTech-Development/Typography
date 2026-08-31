// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
    server: {
        port: 3000
    },
    site: 'https://ui.luztech.dev.br',
    output: 'static',
    trailingSlash: 'ignore',
    i18n: {
        defaultLocale: 'en-us',
        locales: ['en-us', 'pt-br'],
        routing: {
            prefixDefaultLocale: true,
            redirectToDefaultLocale: false
        }
    },
    integrations: [
        react(),
        mdx(),
        sitemap({
            i18n: {
                defaultLocale: 'en-us',
                locales: {
                    'en-us': 'en-US',
                    'pt-br': 'pt-BR'
                }
            }
        })
    ],
    vite: {
        plugins: [tailwindcss()],
        resolve: {
            dedupe: ['react', 'react-dom'],
            alias: {
                '@': new URL('./src', import.meta.url).pathname
            }
        }
    }
});
