import type { En } from './en';

export const pt: En = {
    meta: {
        title: 'LuzTech Typography — Referência de identidade visual',
        description:
            'Referência oficial da identidade visual LuzTech para designers: ícones, tipografia e licenças. Baixe ícones em SVG e PNG, pré-visualize a fonte Space Grotesk e leia as regras de uso.'
    },
    nav: {
        instructions: 'Instruções',
        licenses: 'Licenças',
        icons: 'Ícones',
        font: 'Fonte'
    },
    hero: {
        eyebrow: 'Identidade Visual LuzTech',
        title: 'Tudo o que você precisa para trabalhar com a LuzTech.',
        lede: 'Uma referência prática para designers internos e externos. Baixe os ícones oficiais, pré-visualize a tipografia Space Grotesk e entenda exatamente o que pode e o que não pode fazer com a marca.',
        ctaIcons: 'Baixar ícones',
        ctaFont: 'Pré-visualizar a fonte',
        ctaLicenses: 'Ler as licenças'
    },
    instructions: {
        eyebrow: 'Instruções',
        title: 'Como usar esta referência',
        lede: 'Um guia rápido dos recursos disponíveis aqui e como trabalhar com eles.',
        sections: {
            icons: 'Ícones',
            iconsText:
                'Baixe cada variante de ícone como SVG ou PNG, em qualquer tamanho e cor. Use a página Ícones para escolher variante, formato e tamanho — ou baixe tudo de uma vez como ZIP.',
            font: 'Fonte',
            fontText:
                'Space Grotesk é a tipografia oficial da LuzTech. Pré-visualize em todos os pesos e tamanhos na página Fonte e baixe da fonte oficial.',
            licenses: 'Licenças',
            licensesText:
                'O código-fonte é licenciado sob MIT, a fonte sob SIL OFL 1.1 e os ativos de marca têm restrições de marca registrada. Leia a página Licenças para o detalhamento claro.',
            regenerate: 'Regenerar ativos localmente',
            regenerateText:
                'Os SVGs de origem dos ícones ficam no diretório icons/. Para regenerar as saídas PNG e os SVGs contornados, execute make na raiz do repositório (requer ImageMagick e Inkscape).'
        },
        quickLinks: 'Links rápidos'
    },
    licenses: {
        eyebrow: 'Licenças',
        title: 'O que você pode e não pode fazer',
        lede: 'Três licenças se aplicam a este repositório. Aqui está o resumo direto de cada uma.',
        mit: {
            title: 'Licença MIT',
            subtitle: 'Código-fonte, scripts e arquivos de automação',
            can: 'Você pode',
            cannot: 'Você não pode',
            canItems: [
                'Usar, copiar, modificar e redistribuir o código',
                'Usar comercialmente',
                'Sublicenciar e vender obras derivadas'
            ],
            cannotItems: [
                'Remover o aviso de copyright e permissão',
                'Responsabilizar os autores (fornecido "como está")'
            ],
            fullText: 'Ler a licença MIT completa'
        },
        ofl: {
            title: 'SIL Open Font License 1.1',
            subtitle: 'Fonte Space Grotesk',
            can: 'Você pode',
            cannot: 'Você não pode',
            canItems: [
                'Usar, estudar e modificar a fonte',
                'Empacotar e incorporar com software',
                'Redistribuir livremente'
            ],
            cannotItems: [
                'Vender a fonte isoladamente',
                'Usar o nome reservado "Space Grotesk" para derivadas'
            ],
            fullText: 'Ler a licença OFL completa'
        },
        trademark: {
            title: 'Marca registrada e uso da marca',
            subtitle: 'Nome, logo, ícones e identidade visual LuzTech',
            can: 'Você pode',
            cannot: 'Você não pode',
            canItems: [
                'Referenciar e vincular à LuzTech',
                'Exibir ativos de marca não modificados em documentação e integrações',
                'Usar os arquivos SVG de origem não modificados diretamente'
            ],
            cannotItems: [
                'Modificar ativos de marca para representar a LuzTech',
                'Criar logos derivados que impliquem aprovação oficial',
                'Usar ativos de forma que confunda usuários sobre o status oficial'
            ],
            fullText: 'Ler o aviso de marca completo'
        }
    },
    icons: {
        eyebrow: 'Ícones',
        title: 'Biblioteca de ícones',
        lede: 'Baixe cada variante de ícone em SVG ou PNG. Escolha uma variante, selecione um formato e baixe — ou pegue tudo de uma vez.',
        variants: {
            clean: 'Marca limpa',
            name: 'Wordmark',
            blog: 'Blog',
            nfse: 'NFSe'
        },
        download: {
            variant: 'Variante',
            format: 'Formato',
            size: 'Tamanho',
            color: 'Cor',
            download: 'Baixar',
            downloadAll: 'Baixar tudo (ZIP)',
            downloadAllHint:
                'Todas as variantes em SVG e PNG, organizadas em pastas.',
            copyUrl: 'Copiar URL',
            copied: 'Copiado!',
            copyUrlDisabled:
                'O SVG usa currentColor — a URL copiada aponta para o arquivo bruto, não para a cor exibida aqui.',
            svg: 'SVG',
            png: 'PNG',
            colors: {
                black: 'Preto',
                white: 'Branco',
                color: 'Cor',
                inverted: 'Invertido'
            }
        }
    },
    font: {
        eyebrow: 'Fonte',
        title: 'Space Grotesk',
        lede: 'A tipografia oficial da LuzTech. Uma fonte variável disponível em múltiplos pesos, usada em toda a identidade visual.',
        preview: {
            title: 'Pré-visualização',
            placeholder: 'Digite algo para pré-visualizar…',
            defaultText: 'LuzTech'
        },
        weights: {
            title: 'Pesos',
            light: 'Light (300)',
            regular: 'Regular (400)',
            medium: 'Medium (500)',
            semibold: 'SemiBold (600)',
            bold: 'Bold (700)',
            extrabold: 'ExtraBold (800)'
        },
        sizes: {
            title: 'Tamanhos',
            caption: 'Legenda',
            body: 'Corpo',
            subtitle: 'Subtítulo',
            heading: 'Título',
            display: 'Display'
        },
        download: {
            title: 'Download',
            official: 'Página oficial de download',
            officialHint:
                'Obtenha a Space Grotesk no Google Fonts ou no repositório oficial do GitHub.',
            googleFonts: 'Google Fonts',
            github: 'Repositório GitHub',
            license: 'SIL Open Font License 1.1'
        }
    },
    footer: {
        tagline: 'Referência de identidade visual LuzTech.',
        rights: 'Todos os direitos reservados.',
        trademark: 'Consulte o aviso de marca para regras de uso.',
        builtWith: 'Feito com Astro · Static Web App'
    },
    a11y: {
        skipToContent: 'Pular para o conteúdo',
        languageSwitcher: 'Alternar idioma',
        openMenu: 'Abrir menu'
    }
};
