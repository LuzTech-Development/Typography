import { useRef, useState } from "react";
import { Timegroup } from "@editframe/react";
import { renderTimegroupToVideo, type EFTimegroupElement } from "@editframe/elements";
import { AnimatedMeshGradient } from "../components/MeshGradients";
import { Button, ColorInput, Field, NumberInput, Slider } from "../components/Controls";
import { DEFAULT_MESH, DEFAULT_VIDEO, LUZTECH_COLORS } from "../constants";

export function VideoTab() {
  const [width, setWidth] = useState<number>(DEFAULT_VIDEO.width);
  const [height, setHeight] = useState<number>(DEFAULT_VIDEO.height);
  const [fps, setFps] = useState<number>(DEFAULT_VIDEO.fps);
  const [durationSeconds, setDurationSeconds] = useState<number>(DEFAULT_VIDEO.durationSeconds);
  const [speed, setSpeed] = useState<number>(DEFAULT_VIDEO.speed);
  const [alternate, setAlternate] = useState<boolean>(DEFAULT_VIDEO.alternate);
  const [colors, setColors] = useState<string[]>([...LUZTECH_COLORS]);
  const [distortion, setDistortion] = useState<number>(DEFAULT_MESH.distortion);
  const [swirl, setSwirl] = useState<number>(DEFAULT_MESH.swirl);
  const [scale, setScale] = useState<number>(DEFAULT_MESH.scale);

  const [rendering, setRendering] = useState<boolean>(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const timegroupRef = useRef<EFTimegroupElement>(null);
  const meshRef = useRef<HTMLDivElement>(null);

  const setColor = (i: number, value: string) => {
    setColors((prev) => prev.map((c, idx) => (idx === i ? value : c)));
  };

  // Drive the mesh's `frame` from the timegroup's own current time so the
  // animation is deterministic and synced to the render clock. The shader's
  // `frame` is in milliseconds; `speed` scales the progression. When
  // `alternate` is enabled, the animation reverses direction halfway through,
  // mirroring the Remotion project's `alternate` behavior.
  const handleFrame = ({ ownCurrentTime }: { ownCurrentTime: number }) => {
    const el = meshRef.current?.querySelector("div") as
      | (HTMLElement & { paperShaderMount?: { setFrame: (f: number) => void } })
      | null;
    const mount = el?.paperShaderMount;
    if (!mount) return;

    const total = durationSeconds;
    const half = total / 2;
    let frame: number;
    if (alternate && ownCurrentTime >= half) {
      // Reverse: go from speed*total back down to 0 over the second half.
      frame = (total - ownCurrentTime) * 1000 * speed;
    } else {
      frame = ownCurrentTime * 1000 * speed;
    }
    mount.setFrame(frame);
  };

  const handleRender = async () => {
    const tg = timegroupRef.current;
    if (!tg) return;
    setRendering(true);
    setProgress(0);
    setError(null);
    try {
      const result = await renderTimegroupToVideo(tg, {
        width,
        height,
        fps,
        to: durationSeconds,
        onProgress: (p) => setProgress(p.frame / p.totalFrames),
      });
      const blob = new Blob([result.buffer!], { type: result.mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `luztech-mesh-${width}x${height}-${durationSeconds}s.mp4`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Render failed.");
    } finally {
      setRendering(false);
      setProgress(null);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      {/* Preview */}
      <div className="flex flex-col gap-3">
        <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
          <div className="flex items-center justify-center p-4">
            <Timegroup
              ref={timegroupRef}
              mode="fixed"
              duration={`${durationSeconds}s`}
              fps={fps}
              onFrame={handleFrame}
              className="overflow-hidden rounded-lg"
              style={{ maxWidth: "100%", maxHeight: "60vh" }}
            >
              <div ref={meshRef}>
                <AnimatedMeshGradient
                  width={width}
                  height={height}
                  colors={colors}
                  distortion={distortion}
                  swirl={swirl}
                  scale={scale}
                  speed={0}
                />
              </div>
            </Timegroup>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500">
            {rendering
              ? progress !== null
                ? `Rendering… ${Math.round(progress * 100)}%`
                : "Rendering…"
              : `Preview is scaled to fit; export is full ${width}×${height} @ ${fps}fps.`}
          </span>
          <Button onClick={handleRender} disabled={rendering}>
            {rendering ? "Rendering…" : "Render MP4"}
          </Button>
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-5 rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
        <h3 className="text-sm font-semibold text-zinc-200">Video settings</h3>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Width (px)">
            <NumberInput value={width} onChange={setWidth} min={1} max={3840} />
          </Field>
          <Field label="Height (px)">
            <NumberInput value={height} onChange={setHeight} min={1} max={3840} />
          </Field>
          <Field label="FPS">
            <NumberInput value={fps} onChange={setFps} min={1} max={120} />
          </Field>
          <Field label="Duration (s)">
            <NumberInput value={durationSeconds} onChange={setDurationSeconds} min={1} max={300} />
          </Field>
        </div>

        <Field label="Speed" hint="Animation progression speed">
          <Slider value={speed} onChange={setSpeed} min={0.1} max={50} step={0.1} />
        </Field>

        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input
            type="checkbox"
            checked={alternate}
            onChange={(e) => setAlternate(e.target.checked)}
            className="accent-emerald-400"
          />
          Alternate direction (reverse halfway)
        </label>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Colors</span>
          {colors.map((c, i) => (
            <ColorInput key={i} value={c} onChange={(v) => setColor(i, v)} />
          ))}
        </div>

        <Field label="Distortion">
          <Slider value={distortion} onChange={setDistortion} />
        </Field>
        <Field label="Swirl">
          <Slider value={swirl} onChange={setSwirl} />
        </Field>
        <Field label="Scale">
          <Slider value={scale} onChange={setScale} min={0.01} max={4} />
        </Field>
      </div>
    </div>
  );
}
