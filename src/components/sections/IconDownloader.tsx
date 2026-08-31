import { useState } from 'react';
import {
    ICON_COLORS,
    ICON_SIZES,
    ICON_VARIANTS,
    pngUrl,
    svgUrl,
    type IconColor,
    type IconSize,
    type IconVariant
} from '@/lib/icons';

interface IconDownloaderProps {
    labels: {
        variant: string;
        format: string;
        size: string;
        color: string;
        download: string;
        downloadAll: string;
        downloadAllHint: string;
        copyUrl: string;
        copied: string;
        svg: string;
        png: string;
        colors: Record<IconColor, string> & { inverted: string };
    };
    variantLabels: Record<IconVariant, string>;
}

type Format = 'svg' | 'png';

export function IconDownloader({ labels, variantLabels }: IconDownloaderProps) {
    const [variant, setVariant] = useState<IconVariant>('clean');
    const [format, setFormat] = useState<Format>('svg');
    const [size, setSize] = useState<IconSize>(512);
    const [color, setColor] = useState<IconColor>('black');
    const [inverted, setInverted] = useState(false);
    const [copied, setCopied] = useState(false);

    const url =
        format === 'svg'
            ? svgUrl(variant)
            : pngUrl(variant, size, color, inverted);

    const copyUrl = async () => {
        try {
            await navigator.clipboard.writeText(
                new URL(url, window.location.origin).href
            );
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (_) {}
    };

    // For SVG, the color is applied via `currentColor` (the SVG uses
    // `stroke="currentColor"` / `fill="currentColor"`).
    const svgColor =
        color === 'white'
            ? '#f5f4ef'
            : color === 'color'
              ? '#00ff9d'
              : '#0a0d10';

    return (
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
            {/* Preview */}
            <div className="bg-ink-soft flex flex-col items-center justify-center rounded-xl border border-white/[0.08] p-8">
                <div
                    className="flex h-64 w-64 items-center justify-center rounded-lg"
                    style={{
                        background:
                            inverted || color === 'white'
                                ? '#0a0d10'
                                : color === 'color'
                                  ? 'transparent'
                                  : '#f5f4ef'
                    }}>
                    {format === 'svg' ? (
                        <img
                            src={url}
                            alt={variantLabels[variant]}
                            className="h-48 w-48"
                            style={{ color: svgColor }}
                        />
                    ) : (
                        <img
                            src={url}
                            alt={variantLabels[variant]}
                            className="h-48 w-48"
                        />
                    )}
                </div>
                <p className="text-ink-muted mt-4 font-mono text-sm">{url}</p>
            </div>

            {/* Controls */}
            <div className="bg-ink-soft space-y-6 rounded-xl border border-white/[0.08] p-8">
                {/* Variant */}
                <div>
                    <label className="stamp-num text-ink-muted mb-2 block">
                        {labels.variant}
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {ICON_VARIANTS.map(v => (
                            <button
                                key={v.id}
                                onClick={() => setVariant(v.id)}
                                className={`rounded-lg border px-4 py-2 text-sm transition ${
                                    variant === v.id
                                        ? 'border-luz-mint bg-luz-mint/10 text-luz-mint'
                                        : 'text-paper/75 border-white/10 hover:border-white/30'
                                }`}>
                                {variantLabels[v.id]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Format */}
                <div>
                    <label className="stamp-num text-ink-muted mb-2 block">
                        {labels.format}
                    </label>
                    <div className="flex gap-2">
                        {(['svg', 'png'] as Format[]).map(f => (
                            <button
                                key={f}
                                onClick={() => setFormat(f)}
                                className={`rounded-lg border px-4 py-2 text-sm uppercase transition ${
                                    format === f
                                        ? 'border-luz-mint bg-luz-mint/10 text-luz-mint'
                                        : 'text-paper/75 border-white/10 hover:border-white/30'
                                }`}>
                                {f === 'svg' ? labels.svg : labels.png}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Color (SVG only) */}
                {format === 'svg' && (
                    <div>
                        <label className="stamp-num text-ink-muted mb-2 block">
                            {labels.color}
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {ICON_COLORS.map(c => (
                                <button
                                    key={c}
                                    onClick={() => setColor(c)}
                                    className={`rounded-lg border px-4 py-2 text-sm transition ${
                                        color === c
                                            ? 'border-luz-mint bg-luz-mint/10 text-luz-mint'
                                            : 'text-paper/75 border-white/10 hover:border-white/30'
                                    }`}>
                                    {labels.colors[c]}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Size + Color (PNG only) */}
                {format === 'png' && (
                    <>
                        <div>
                            <label className="stamp-num text-ink-muted mb-2 block">
                                {labels.size}
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {ICON_SIZES.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setSize(s)}
                                        className={`rounded-lg border px-3 py-2 text-sm transition ${
                                            size === s
                                                ? 'border-luz-mint bg-luz-mint/10 text-luz-mint'
                                                : 'text-paper/75 border-white/10 hover:border-white/30'
                                        }`}>
                                        {s}px
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="stamp-num text-ink-muted mb-2 block">
                                {labels.color}
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {ICON_COLORS.map(c => (
                                    <button
                                        key={c}
                                        onClick={() => setColor(c)}
                                        className={`rounded-lg border px-4 py-2 text-sm transition ${
                                            color === c
                                                ? 'border-luz-mint bg-luz-mint/10 text-luz-mint'
                                                : 'text-paper/75 border-white/10 hover:border-white/30'
                                        }`}>
                                        {labels.colors[c]}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setInverted(!inverted)}
                                    className={`rounded-lg border px-4 py-2 text-sm transition ${
                                        inverted
                                            ? 'border-luz-mint bg-luz-mint/10 text-luz-mint'
                                            : 'text-paper/75 border-white/10 hover:border-white/30'
                                    }`}>
                                    {labels.colors.inverted}
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-2">
                    <a href={url} download className="btn btn--primary">
                        {labels.download}
                    </a>
                    <button onClick={copyUrl} className="btn btn--ghost">
                        {copied ? labels.copied : labels.copyUrl}
                    </button>
                </div>
            </div>
        </div>
    );
}
