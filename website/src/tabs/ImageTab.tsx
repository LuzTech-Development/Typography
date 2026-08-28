import { useRef, useState } from 'react';
import { StaticMesh } from '../components/MeshGradients';
import { Button, ColorInput, Field, NumberInput, Slider } from '../components/Controls';
import { exportElementToPng } from '../lib/exportImage';
import { DEFAULT_STATIC_MESH, LUZTECH_COLORS } from '../constants';

export function ImageTab() {
    const [width, setWidth] = useState<number>(1920);
    const [height, setHeight] = useState<number>(1080);
    const [colors, setColors] = useState<string[]>([...LUZTECH_COLORS]);
    const [positions, setPositions] = useState<number>(DEFAULT_STATIC_MESH.positions);
    const [waveX, setWaveX] = useState<number>(DEFAULT_STATIC_MESH.waveX);
    const [waveXShift, setWaveXShift] = useState<number>(DEFAULT_STATIC_MESH.waveXShift);
    const [waveY, setWaveY] = useState<number>(DEFAULT_STATIC_MESH.waveY);
    const [waveYShift, setWaveYShift] = useState<number>(DEFAULT_STATIC_MESH.waveYShift);
    const [mixing, setMixing] = useState<number>(DEFAULT_STATIC_MESH.mixing);
    const [scale, setScale] = useState<number>(DEFAULT_STATIC_MESH.scale);
    const [exporting, setExporting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const meshRef = useRef<HTMLDivElement>(null);

    const setColor = (i: number, value: string) => {
        setColors(prev => prev.map((c, idx) => (idx === i ? value : c)));
    };

    const handleExport = async () => {
        if (!meshRef.current) return;
        setExporting(true);
        setError(null);
        try {
            await exportElementToPng(
                meshRef.current,
                width,
                height,
                `luztech-mesh-${width}x${height}.png`
            );
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Export failed.');
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="flex flex-1 flex-col lg:flex-row">
            {/* The gradient is the hero — full-bleed, no card, no border. */}
            <section className="flex flex-1 flex-col bg-ink-2">
                <div className="flex flex-1 items-center justify-center p-4 sm:p-8">
                    <div
                        ref={meshRef}
                        className="w-full max-w-full overflow-hidden"
                        style={{
                            aspectRatio: `${width} / ${height}`,
                            maxHeight: '70vh',
                            maxWidth: `min(100%, calc(70vh * ${width} / ${height}))`
                        }}>
                        <StaticMesh
                            width={width}
                            height={height}
                            colors={colors}
                            positions={positions}
                            waveX={waveX}
                            waveXShift={waveXShift}
                            waveY={waveY}
                            waveYShift={waveYShift}
                            mixing={mixing}
                            scale={scale}
                        />
                    </div>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-line px-5 py-3 sm:px-8">
                    <span className="tabular text-[12px] text-fog">
                        {width}×{height} PNG
                    </span>
                    <Button onClick={handleExport} disabled={exporting}>
                        {exporting ? 'Exporting…' : 'Download PNG'}
                    </Button>
                </div>
                {error && <p className="px-5 pb-3 text-sm text-[#ff6b6b] sm:px-8">{error}</p>}
            </section>

            {/* The control rail — a precise spec sheet. */}
            <aside className="w-full shrink-0 border-t border-line lg:w-[360px] lg:border-l lg:border-t-0">
                <div className="flex flex-col gap-6 p-5 sm:p-6">
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Width" value={`${width}px`}>
                            <NumberInput value={width} onChange={setWidth} min={1} max={8192} />
                        </Field>
                        <Field label="Height" value={`${height}px`}>
                            <NumberInput value={height} onChange={setHeight} min={1} max={8192} />
                        </Field>
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="text-[13px] text-fog">Colors</span>
                        {colors.map((c, i) => (
                            <ColorInput key={i} value={c} onChange={v => setColor(i, v)} />
                        ))}
                    </div>

                    <Field
                        label="Positions"
                        value={positions.toFixed(0)}
                        hint="Color spot placement seed">
                        <Slider
                            value={positions}
                            onChange={setPositions}
                            min={0}
                            max={100}
                            step={1}
                        />
                    </Field>
                    <Field label="Wave X" value={waveX.toFixed(2)}>
                        <Slider value={waveX} onChange={setWaveX} />
                    </Field>
                    <Field label="Wave X shift" value={waveXShift.toFixed(2)}>
                        <Slider value={waveXShift} onChange={setWaveXShift} />
                    </Field>
                    <Field label="Wave Y" value={waveY.toFixed(2)}>
                        <Slider value={waveY} onChange={setWaveY} />
                    </Field>
                    <Field label="Wave Y shift" value={waveYShift.toFixed(2)}>
                        <Slider value={waveYShift} onChange={setWaveYShift} />
                    </Field>
                    <Field
                        label="Mixing"
                        value={mixing.toFixed(2)}
                        hint="0 = hard stripes · 0.5 = smooth · 1 = gradual">
                        <Slider value={mixing} onChange={setMixing} />
                    </Field>
                    <Field label="Scale" value={scale.toFixed(2)}>
                        <Slider value={scale} onChange={setScale} min={0.01} max={4} />
                    </Field>
                </div>
            </aside>
        </div>
    );
}
