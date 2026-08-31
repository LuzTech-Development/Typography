export const en = {
    meta: {
        title: 'LuzTech Typography — Visual identity reference',
        description:
            'Official LuzTech visual identity reference: icons, typography, licenses, and brand assets. Download icons in SVG and PNG, explore the Space Grotesk font, and read the usage rules.'
    },
    nav: {
        instructions: 'Instructions',
        licenses: 'Licenses',
        icons: 'Icons',
        font: 'Font & Resources'
    },
    hero: {
        eyebrow: 'LuzTech Visual Identity',
        title: 'Typography & brand assets, documented.',
        lede: 'The official reference for LuzTech icons, typography, and visual identity. Download ready-to-use assets, understand what you can and cannot do, and explore the Space Grotesk font.',
        ctaIcons: 'Browse icons',
        ctaInstructions: 'Read the instructions'
    },
    instructions: {
        eyebrow: 'Instructions',
        title: 'How to use this reference',
        lede: 'Everything you need to work with LuzTech typography and brand assets — from downloading icons to regenerating them locally.',
        sections: {
            summary: 'Summary',
            gettingAssets: 'Getting the assets',
            typography: 'Typography details',
            requirements: 'Requirements for development',
            generateIcons: 'Generate icons locally',
            animations: 'Work with animations',
            structure: 'Repository structure',
            legal: 'Legal and trademark notice'
        }
    },
    licenses: {
        eyebrow: 'Licenses',
        title: 'What you can and cannot do',
        lede: 'The source code is MIT-licensed, but the LuzTech brand assets have additional trademark restrictions. Here is the clear breakdown.',
        mit: {
            title: 'MIT License',
            subtitle: 'Source code, scripts, and automation files',
            summary:
                'You may use, copy, modify, merge, publish, distribute, sublicense, and sell the source code and scripts, provided the copyright and permission notices are included.',
            points: [
                'Applies to source code, scripts, and automation files only.',
                'Free to use, modify, and redistribute — even commercially.',
                'Must retain the original copyright and permission notice.',
                'Provided "as is", without warranty of any kind.'
            ]
        },
        ofl: {
            title: 'SIL Open Font License 1.1',
            subtitle: 'Space Grotesk font',
            summary:
                'Space Grotesk is licensed under the SIL Open Font License 1.1. You may use, study, modify, and redistribute the font freely, as long as it is not sold by itself.',
            points: [
                'The font may be bundled, embedded, and redistributed with software.',
                'Derivative fonts must not use the reserved name "Space Grotesk".',
                'The font cannot be sold on its own.',
                'Documents created with the font are not subject to the license.'
            ]
        },
        trademark: {
            title: 'Trademark & brand usage',
            subtitle: 'LuzTech name, logo, icons, and visual identity',
            summary:
                'The LuzTech name, logo, icons, typography outputs, and brand materials are NOT MIT-licensed. They carry additional trademark and brand-use restrictions.',
            permitted: {
                title: 'Permitted use',
                items: [
                    'Referencing LuzTech',
                    'Linking to LuzTech',
                    'Identifying LuzTech as the source or owner',
                    'Showing unmodified brand assets in documentation, articles, presentations, integrations, or compatibility references',
                    'Using the unmodified SVG source files from icons/ directly'
                ]
            },
            restricted: {
                title: 'Restricted use (requires prior written approval)',
                items: [
                    'Modifying brand assets and using the modified version to represent LuzTech',
                    'Creating derivative logos, icons, or typography that imply official approval',
                    'Using modified assets to identify, represent, impersonate, or suggest endorsement',
                    'Using brand assets in a way that may confuse users about official status'
                ]
            }
        }
    },
    icons: {
        eyebrow: 'Icons',
        title: 'Icon library',
        lede: 'Download each icon variant in SVG or PNG, at any size, in black, white, color, or inverted. Every icon has a stable, predictable URL.',
        variants: {
            clean: 'Clean mark',
            name: 'Wordmark',
            blog: 'Blog',
            nfse: 'NFSe'
        },
        download: {
            format: 'Format',
            size: 'Size',
            color: 'Color',
            download: 'Download',
            copyUrl: 'Copy URL',
            copied: 'Copied!',
            svg: 'SVG',
            png: 'PNG',
            colors: {
                black: 'Black',
                white: 'White',
                color: 'Color',
                inverted: 'Inverted'
            }
        },
        urlPattern: 'URL pattern',
        urlPatternHint: 'Stable URLs for every icon, size, and color.'
    },
    font: {
        eyebrow: 'Font & Resources',
        title: 'Space Grotesk',
        lede: 'The official LuzTech typeface. A variable font available in multiple weights, used across the visual identity.',
        weights: {
            title: 'Weights',
            light: 'Light (300)',
            regular: 'Regular (400)',
            medium: 'Medium (500)',
            semibold: 'SemiBold (600)',
            bold: 'Bold (700)',
            extrabold: 'ExtraBold (800)'
        },
        sizes: {
            title: 'Sizes',
            caption: 'Caption',
            body: 'Body',
            subtitle: 'Subtitle',
            heading: 'Heading',
            display: 'Display'
        },
        download: {
            title: 'Download',
            official: 'Official download page',
            officialHint: 'Get Space Grotesk from Google Fonts or the official GitHub repository.',
            googleFonts: 'Google Fonts',
            github: 'GitHub repository',
            license: 'SIL Open Font License 1.1'
        },
        resources: {
            title: 'Resources',
            meshGradient: 'Mesh Gradient Generator',
            meshGradientHint: 'The third-party tool used to create the LuzTech mesh gradient.',
            releases: 'Latest release',
            releasesHint: 'Download the newest generated asset packages.',
            repository: 'GitHub repository',
            repositoryHint: 'Browse the source files and generation scripts.'
        }
    },
    footer: {
        tagline: 'LuzTech visual identity reference.',
        rights: 'All rights reserved.',
        trademark: 'See the trademark notice for usage rules.',
        builtWith: 'Built with Astro · Static Web App'
    },
    a11y: {
        skipToContent: 'Skip to content',
        languageSwitcher: 'Switch language',
        openMenu: 'Open menu'
    }
};

export type En = typeof en;
