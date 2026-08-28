import { useRef, useState } from "react";
import { StaticMesh } from "../components/MeshGradients";
import { Button, ColorInput, Field, NumberInput, Slider } from "../components/Controls";
import { exportElementToPng } from "../lib/exportImage";
import { DEFAULT_STATIC_MESH, LUZTECH_COLORS } from "../constants";

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
    setColors((prev) => prev.map((c, idx) => (idx === i ? value : c)));
  };

  const handleExport = async () => {
    if (!meshRef.current) return;
    setExporting(true);
    setError(null);
    try {
      await exportElementToPng(meshRef.current, width, height, `luztech-mesh-${width}x${height}.png`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export failed.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      {/* Preview */}
      <div className="flex flex-col gap-3">
        <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
          <div className="flex items-center justify-center p-4">
            <div
              ref={meshRef}
              className="overflow-hidden rounded-lg"
              style={{ maxWidth: "100%", maxHeight: "60vh" }}
            >
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
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500">
            Preview is scaled to fit; export is full {width}×{height}.
          </span>
          <Button onClick={handleExport} disabled={exporting}>
            {exporting ? "Exporting…" : "Download PNG"}
          </Button>
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-5 rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
        <h3 className="text-sm font-semibold text-zinc-200">Image settings</h3>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Width (px)">
            <NumberInput value={width} onChange={setWidth} min={1} max={8192} />
          </Field>
          <Field label="Height (px)">
            <NumberInput value={height} onChange={setHeight} min={1} max={8192} />
          </Field>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Colors</span>
          {colors.map((c, i) => (
            <ColorInput key={i} value={c} onChange={(v) => setColor(i, v)} />
          ))}
        </div>

        <Field label="Positions" hint="Color spot placement seed (0–100)">
          <Slider value={positions} onChange={setPositions} min={0} max={100} step={1} />
        </Field>
        <Field label="Wave X">
          <Slider value={waveX} onChange={setWaveX} />
        </Field>
        <Field label="Wave X shift">
          <Slider value={waveXShift} onChange={setWaveXShift} />
        </Field>
        <Field label="Wave Y">
          <Slider value={waveY} onChange={setWaveY} />
        </Field>
        <Field label="Wave Y shift">
          <Slider value={waveYShift} onChange={setWaveYShift} />
        </Field>
        <Field label="Mixing" hint="0 = hard stripes, 0.5 = smooth, 1 = gradual">
          <Slider value={mixing} onChange={setMixing} />
        </Field>
        <Field label="Scale">
          <Slider value={scale} onChange={setScale} min={0.01} max={4} />
        </Field>
      </div>
    </div>
  );
}
