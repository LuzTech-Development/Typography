export const en = {
    meta: {
        title: 'LuzTech Typography — Visual identity reference',
        description:
            'Official LuzTech visual identity reference for designers: icons, typography, and licenses. Download icons in SVG and PNG, preview the Space Grotesk font, and read the usage rules.'
    },
    nav: {
        instructions: 'Instructions',
        licenses: 'Licenses',
        icons: 'Icons',
        font: 'Font'
    },
    hero: {
        eyebrow: 'LuzTech Visual Identity',
        title: 'Everything you need to work with LuzTech.',
        lede: 'A practical reference for internal and external designers. Download the official icons, preview the Space Grotesk typeface, and understand exactly what you can and cannot do with the brand.',
        ctaIcons: 'Download icons',
        ctaFont: 'Preview the font',
        ctaLicenses: 'Read the licenses'
    },
    instructions: {
        eyebrow: 'Instructions',
        title: 'How to use this reference',
        lede: 'A quick guide to the resources available here and how to work with them.',
        sections: {
            icons: 'Icons',
            iconsText:
                'Download each icon variant as SVG or PNG, in any size and color. Use the Icons page to pick a variant, format, and size — or download everything at once as a ZIP.',
            font: 'Font',
            fontText:
                'Space Grotesk is the official LuzTech typeface. Preview it in every weight and size on the Font page, and download it from the official source.',
            licenses: 'Licenses',
            licensesText:
                'The source code is MIT-licensed, the font is SIL OFL 1.1, and the brand assets carry trademark restrictions. Read the Licenses page for the clear breakdown.',
            regenerate: 'Regenerate assets locally',
            regenerateText:
                'The icon source SVGs live in the icons/ directory. To regenerate the PNG outputs and outlined SVGs, run make from the repository root (requires ImageMagick and Inkscape).'
        },
        quickLinks: 'Quick links'
    },
    licenses: {
        eyebrow: 'Licenses',
        title: 'What you can and cannot do',
        lede: 'Three licenses apply to this repository. Here is the direct summary of each.',
        mit: {
            title: 'MIT License',
            subtitle: 'Source code, scripts, and automation files',
            can: 'You can',
            cannot: 'You cannot',
            canItems: [
                'Use, copy, modify, and redistribute the code',
                'Use it commercially',
                'Sublicense and sell derivative works'
            ],
            cannotItems: [
                'Remove the copyright and permission notice',
                'Hold the authors liable (provided "as is")'
            ],
            fullText: 'Read the full MIT license'
        },
        ofl: {
            title: 'SIL Open Font License 1.1',
            subtitle: 'Space Grotesk font',
            can: 'You can',
            cannot: 'You cannot',
            canItems: [
                'Use, study, and modify the font',
                'Bundle and embed it with software',
                'Redistribute it freely'
            ],
            cannotItems: [
                'Sell the font on its own',
                'Use the reserved name "Space Grotesk" for derivatives'
            ],
            fullText: 'Read the full OFL license'
        },
        trademark: {
            title: 'Trademark & brand usage',
            subtitle: 'LuzTech name, logo, icons, and visual identity',
            can: 'You can',
            cannot: 'You cannot',
            canItems: [
                'Reference and link to LuzTech',
                'Show unmodified brand assets in documentation and integrations',
                'Use the unmodified SVG source files directly'
            ],
            cannotItems: [
                'Modify brand assets to represent LuzTech',
                'Create derivative logos that imply official approval',
                'Use assets in a way that confuses users about official status'
            ],
            fullText: 'Read the full trademark notice'
        }
    },
    icons: {
        eyebrow: 'Icons',
        title: 'Icon library',
        lede: 'Download each icon variant in SVG or PNG. Pick a variant, choose a format, and download — or grab everything at once.',
        download: {
            variant: 'Variant',
            format: 'Format',
            size: 'Size',
            color: 'Color',
            download: 'Download',
            downloadAll: 'Download all (ZIP)',
            downloadAllHint:
                'Every variant in SVG and PNG, organized in folders.',
            copyUrl: 'Copy URL',
            copied: 'Copied!',
            copyUrlWarning:
                'The SVG uses currentColor — the copied URL points to the raw file, not the color shown here.',
            svg: 'SVG',
            png: 'PNG',
            colors: {
                black: 'Black',
                white: 'White',
                color: 'Color',
                inverted: 'Inverted'
            }
        }
    },
    font: {
        eyebrow: 'Font',
        title: 'Space Grotesk',
        lede: 'The official LuzTech typeface. A variable font available in multiple weights, used across the visual identity.',
        preview: {
            title: 'Preview',
            placeholder: 'Type something to preview…',
            defaultText: 'LuzTech'
        },
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
            officialHint:
                'Get Space Grotesk from Google Fonts or the official GitHub repository.',
            googleFonts: 'Google Fonts',
            github: 'GitHub repository',
            license: 'SIL Open Font License 1.1'
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
