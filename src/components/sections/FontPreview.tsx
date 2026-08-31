import { useState } from 'react';

interface FontPreviewProps {
    labels: {
        title: string;
        placeholder: string;
        defaultText: string;
        weightsTitle: string;
        sizesTitle: string;
    };
    weights: { label: string; weight: number }[];
    sizes: { label: string; cls: string }[];
}

export function FontPreview({ labels, weights, sizes }: FontPreviewProps) {
    const [text, setText] = useState(labels.defaultText);

    return (
        <div className="space-y-8">
            {/* Input */}
            <div>
                <label className="stamp-num text-ink-muted mb-2 block">
                    {labels.title}
                </label>
                <input
                    type="text"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder={labels.placeholder}
                    className="bg-ink text-paper focus:border-luz-mint/60 w-full rounded-lg border border-white/10 px-4 py-3 text-lg transition outline-none"
                />
            </div>

            {/* Weights */}
            <div className="bg-ink-soft rounded-xl border border-white/[0.08] p-8">
                <h3 className="text-xl font-bold">{labels.weightsTitle}</h3>
                <div className="mt-6 space-y-4">
                    {weights.map(w => (
                        <div
                            key={w.weight}
                            className="flex items-baseline justify-between gap-4 border-b border-white/[0.06] pb-3">
                            <span
                                className="truncate text-2xl"
                                style={{ fontWeight: w.weight }}>
                                {text || '\u00a0'}
                            </span>
                            <span className="stamp-num text-ink-muted shrink-0">
                                {w.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sizes */}
            <div className="bg-ink-soft rounded-xl border border-white/[0.08] p-8">
                <h3 className="text-xl font-bold">{labels.sizesTitle}</h3>
                <div className="mt-6 space-y-4">
                    {sizes.map(s => (
                        <div
                            key={s.cls}
                            className="flex items-baseline justify-between gap-4 border-b border-white/[0.06] pb-3">
                            <span className={`${s.cls} truncate font-semibold`}>
                                {text || '\u00a0'}
                            </span>
                            <span className="stamp-num text-ink-muted shrink-0">
                                {s.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
