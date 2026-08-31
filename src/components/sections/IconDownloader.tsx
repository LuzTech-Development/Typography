import { useEffect, useState } from 'react';
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
        copyUrlWarning: string;
        svg: string;
        png: string;
        colors: Record<IconColor, string> & { inverted: string };
    };
}

type Format = 'svg' | 'png';

const VARIANT_LABELS = Object.fromEntries(
    ICON_VARIANTS.map(v => [v.id, v.label])
) as Record<IconVariant, string>;

export function IconDownloader({ labels }: IconDownloaderProps) {
    const [variant, setVariant] = useState<IconVariant>('clean');
    const [format, setFormat] = useState<Format>('svg');
    const [size, setSize] = useState<IconSize>(512);
    const [color, setColor] = useState<IconColor>('color');
    const [svgHex, setSvgHex] = useState('#ffffff');
    const [inverted, setInverted] = useState(false);
    const [copied, setCopied] = useState(false);
    const [svgMarkup, setSvgMarkup] = useState<string | null>(null);

    // Fetch the outlined SVG and inject the chosen color into `currentColor`.
    // `svgMarkup` keeps the original `width`/`height` (512) so the downloaded
    // file renders standalone; the preview derives a scaled copy separately.
    useEffect(() => {
        if (format !== 'svg') return;
        let cancelled = false;
        fetch(svgUrl(variant))
            .then(r => r.text())
            .then(text => {
                if (cancelled) return;
                setSvgMarkup(text.replaceAll('currentColor', svgHex));
            })
            .catch(() => {
                if (!cancelled) setSvgMarkup(null);
            });
        return () => {
            cancelled = true;
        };
    }, [variant, format, svgHex]);

    // Preview-only markup: strip intrinsic width/height so the SVG scales to
    // its container instead of overflowing at its native 512px size.
    const previewMarkup = svgMarkup
        ? svgMarkup
              .replace(/\swidth="[^"]*"/, '')
              .replace(/\sheight="[^"]*"/, '')
              .replace('<svg ', '<svg width="100%" height="100%" ')
        : null;

    const pngSrc = pngUrl(variant, size, color, inverted);

    // Stable URL to copy: the canonical SVG path, or the PNG path.
    const stableUrl = format === 'svg' ? svgUrl(variant) : pngSrc;

    const copyUrl = async () => {
        try {
            await navigator.clipboard.writeText(
                new URL(stableUrl, window.location.origin).href
            );
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {}
    };

    const downloadSvg = () => {
        if (!svgMarkup) return;
        const blob = new Blob([svgMarkup], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${variant}.svg`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
            {/* Preview */}
            <div className="bg-ink-soft flex flex-col items-center justify-center rounded-xl border border-white/8 p-8">
                <div
                    className="flex h-72 w-72 items-center justify-center rounded-lg"
                    style={{
                        background:
                            'conic-gradient(#1e242c 0 25%, #12161b 0 50%, #1e242c 0 75%, #12161b 0) 0 0 / 24px 24px'
                    }}>
                    {format === 'svg' ? (
                        previewMarkup ? (
                            <div
                                className="h-full w-full"
                                dangerouslySetInnerHTML={{
                                    __html: previewMarkup
                                }}
                            />
                        ) : (
                            <span className="text-ink-muted text-sm">
                                {labels.svg}
                            </span>
                        )
                    ) : (
                        <img
                            src={pngSrc}
                            alt={VARIANT_LABELS[variant]}
                            className="h-full w-full"
                        />
                    )}
                </div>
            </div>

            {/* Controls */}
            <div className="bg-ink-soft space-y-6 rounded-xl border border-white/8 p-8">
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
                                {VARIANT_LABELS[v.id]}
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

                {/* Size (always present; disabled for SVG) */}
                <div>
                    <label className="stamp-num text-ink-muted mb-2 block">
                        {labels.size}
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {ICON_SIZES.map(s => (
                            <button
                                key={s}
                                onClick={() => setSize(s)}
                                disabled={format === 'svg'}
                                className={`rounded-lg border px-3 py-2 text-sm transition ${
                                    format === 'svg'
                                        ? 'text-ink-muted/40 cursor-not-allowed border-white/5'
                                        : size === s
                                          ? 'border-luz-mint bg-luz-mint/10 text-luz-mint'
                                          : 'text-paper/75 border-white/10 hover:border-white/30'
                                }`}>
                                {s}px
                            </button>
                        ))}
                    </div>
                </div>

                {/* Color */}
                <div>
                    <label className="stamp-num text-ink-muted mb-2 block">
                        {labels.color}
                    </label>
                    <div className="min-h-11">
                        {format === 'svg' ? (
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    onClick={() => setSvgHex('#000000')}
                                    className={`rounded-lg border px-4 py-2 text-sm transition ${
                                        svgHex === '#000000'
                                            ? 'border-luz-mint bg-luz-mint/10 text-luz-mint'
                                            : 'text-paper/75 border-white/10 hover:border-white/30'
                                    }`}>
                                    {labels.colors.black}
                                </button>
                                <button
                                    onClick={() => setSvgHex('#ffffff')}
                                    className={`rounded-lg border px-4 py-2 text-sm transition ${
                                        svgHex === '#ffffff'
                                            ? 'border-luz-mint bg-luz-mint/10 text-luz-mint'
                                            : 'text-paper/75 border-white/10 hover:border-white/30'
                                    }`}>
                                    {labels.colors.white}
                                </button>
                                <span
                                    className="mx-2 h-6 w-px bg-white/10"
                                    aria-hidden="true"
                                />
                                <input
                                    type="color"
                                    value={svgHex}
                                    onChange={e => setSvgHex(e.target.value)}
                                    className="h-11 w-16 cursor-pointer rounded-lg border border-white/10 bg-transparent p-1 transition hover:border-white/30"
                                    aria-label={labels.colors.color}
                                />
                                <span className="text-paper/75 font-mono text-sm uppercase">
                                    {svgHex}
                                </span>
                            </div>
                        ) : (
                            <div className="flex flex-wrap items-center gap-2">
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
                                <span
                                    className="mx-2 h-6 w-px bg-white/10"
                                    aria-hidden="true"
                                />
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
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-2">
                    {format === 'svg' ? (
                        <button
                            onClick={downloadSvg}
                            disabled={!svgMarkup}
                            className="btn btn--primary disabled:cursor-not-allowed disabled:opacity-50">
                            {labels.download}
                        </button>
                    ) : (
                        <a href={pngSrc} download className="btn btn--primary">
                            {labels.download}
                        </a>
                    )}
                    <button onClick={copyUrl} className="btn btn--ghost">
                        {copied ? labels.copied : labels.copyUrl}
                    </button>
                </div>

                {/* Always-rendered warning (opacity toggled, no layout shift) */}
                <p
                    className={`text-ink-muted text-sm transition-opacity duration-200 ${
                        format === 'svg' ? 'opacity-100' : 'opacity-0'
                    }`}
                    aria-hidden={format !== 'svg'}>
                    {labels.copyUrlWarning}
                </p>
            </div>
        </div>
    );
}
