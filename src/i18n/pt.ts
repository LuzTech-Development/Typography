import type { En } from './en';

export const pt: En = {
    meta: {
        title: 'LuzTech Typography — Referência de identidade visual',
        description:
            'Referência oficial da identidade visual LuzTech: ícones, tipografia, licenças e ativos de marca. Baixe ícones em SVG e PNG, explore a fonte Space Grotesk e leia as regras de uso.'
    },
    nav: {
        instructions: 'Instruções',
        licenses: 'Licenças',
        icons: 'Ícones',
        font: 'Fonte & Recursos'
    },
    hero: {
        eyebrow: 'Identidade Visual LuzTech',
        title: 'Tipografia e ativos de marca, documentados.',
        lede: 'A referência oficial dos ícones, tipografia e identidade visual LuzTech. Baixe ativos prontos para uso, entenda o que pode e o que não pode fazer e explore a fonte Space Grotesk.',
        ctaIcons: 'Ver ícones',
        ctaInstructions: 'Ler as instruções'
    },
    instructions: {
        eyebrow: 'Instruções',
        title: 'Como usar esta referência',
        lede: 'Tudo o que você precisa para trabalhar com a tipografia e os ativos de marca LuzTech — desde baixar ícones até regenerá-los localmente.',
        sections: {
            summary: 'Resumo',
            gettingAssets: 'Obtendo os ativos',
            typography: 'Detalhes da tipografia',
            requirements: 'Requisitos para desenvolvimento',
            generateIcons: 'Gerar ícones localmente',
            animations: 'Trabalhar com animações',
            structure: 'Estrutura do repositório',
            legal: 'Aviso legal e de marca'
        }
    },
    licenses: {
        eyebrow: 'Licenças',
        title: 'O que você pode e não pode fazer',
        lede: 'O código-fonte é licenciado sob MIT, mas os ativos de marca LuzTech têm restrições adicionais de marca registrada. Aqui está o detalhamento claro.',
        mit: {
            title: 'Licença MIT',
            subtitle: 'Código-fonte, scripts e arquivos de automação',
            summary:
                'Você pode usar, copiar, modificar, mesclar, publicar, distribuir, sublicenciar e vender o código-fonte e os scripts, desde que os avisos de copyright e permissão sejam incluídos.',
            points: [
                'Aplica-se apenas ao código-fonte, scripts e arquivos de automação.',
                'Livre para usar, modificar e redistribuir — inclusive comercialmente.',
                'Deve manter o aviso original de copyright e permissão.',
                'Fornecido "como está", sem garantia de qualquer tipo.'
            ]
        },
        ofl: {
            title: 'SIL Open Font License 1.1',
            subtitle: 'Fonte Space Grotesk',
            summary:
                'Space Grotesk é licenciada sob a SIL Open Font License 1.1. Você pode usar, estudar, modificar e redistribuir a fonte livremente, desde que não seja vendida isoladamente.',
            points: [
                'A fonte pode ser empacotada, incorporada e redistribuída com software.',
                'Fontes derivadas não devem usar o nome reservado "Space Grotesk".',
                'A fonte não pode ser vendida isoladamente.',
                'Documentos criados com a fonte não estão sujeitos à licença.'
            ]
        },
        trademark: {
            title: 'Marca registrada e uso da marca',
            subtitle: 'Nome, logo, ícones e identidade visual LuzTech',
            summary:
                'O nome, logo, ícones, saídas de tipografia e materiais de marca LuzTech NÃO são licenciados sob MIT. Eles carregam restrições adicionais de marca registrada e uso de marca.',
            permitted: {
                title: 'Uso permitido',
                items: [
                    'Referenciar a LuzTech',
                    'Vincular à LuzTech',
                    'Identificar a LuzTech como fonte ou proprietária',
                    'Exibir ativos de marca não modificados em documentação, artigos, apresentações, integrações ou referências de compatibilidade',
                    'Usar os arquivos SVG de origem não modificados de icons/ diretamente'
                ]
            },
            restricted: {
                title: 'Uso restrito (requer aprovação prévia por escrito)',
                items: [
                    'Modificar ativos de marca e usar a versão modificada para representar a LuzTech',
                    'Criar logos, ícones ou tipografia derivados que impliquem aprovação oficial',
                    'Usar ativos modificados para identificar, representar, personificar ou sugerir endosso',
                    'Usar ativos de marca de forma que possa confundir usuários sobre o status oficial'
                ]
            }
        }
    },
    icons: {
        eyebrow: 'Ícones',
        title: 'Biblioteca de ícones',
        lede: 'Baixe cada variante de ícone em SVG ou PNG, em qualquer tamanho, em preto, branco, cor ou invertido. Cada ícone tem uma URL estável e previsível.',
        variants: {
            clean: 'Marca limpa',
            name: 'Wordmark',
            blog: 'Blog',
            nfse: 'NFSe'
        },
        download: {
            format: 'Formato',
            size: 'Tamanho',
            color: 'Cor',
            download: 'Baixar',
            copyUrl: 'Copiar URL',
            copied: 'Copiado!',
            svg: 'SVG',
            png: 'PNG',
            colors: {
                black: 'Preto',
                white: 'Branco',
                color: 'Cor',
                inverted: 'Invertido'
            }
        },
        urlPattern: 'Padrão de URL',
        urlPatternHint: 'URLs estáveis para cada ícone, tamanho e cor.'
    },
    font: {
        eyebrow: 'Fonte & Recursos',
        title: 'Space Grotesk',
        lede: 'A tipografia oficial da LuzTech. Uma fonte variável disponível em múltiplos pesos, usada em toda a identidade visual.',
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
            officialHint: 'Obtenha a Space Grotesk no Google Fonts ou no repositório oficial do GitHub.',
            googleFonts: 'Google Fonts',
            github: 'Repositório GitHub',
            license: 'SIL Open Font License 1.1'
        },
        resources: {
            title: 'Recursos',
            meshGradient: 'Mesh Gradient Generator',
            meshGradientHint: 'A ferramenta de terceiros usada para criar o gradiente mesh da LuzTech.',
            releases: 'Última release',
            releasesHint: 'Baixe os pacotes de ativos gerados mais recentes.',
            repository: 'Repositório GitHub',
            repositoryHint: 'Navegue pelos arquivos de origem e scripts de geração.'
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
