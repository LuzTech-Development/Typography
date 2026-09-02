import { useEffect, useRef, useState } from 'react';
import { Timegroup, usePlayback } from '@editframe/react';
import {
    renderTimegroupToVideo,
    type EFTimegroupElement,
    type FrameTaskInfo
} from '@editframe/elements';
import { SwirledMesh } from './SwirledMesh';

export const BACKGROUND_COLORS = {
    tl: '#00ff9d',
    tr: '#69dd96',
    bl: '#4665c3',
    br: '#1f6fef'
} as const;

const SIZE_PRESETS = [
    { label: '1920×1080', width: 1920, height: 1080 },
    { label: '1080×1920', width: 1080, height: 1920 },
    { label: '1024×1024', width: 1024, height: 1024 },
    { label: '2560×1440', width: 2560, height: 1440 },
    { label: '3840×2160', width: 3840, height: 2160 }
] as const;

type TabId = 'flat' | 'swirled' | 'animated';

const PREVIEW_MAX_PIXEL_COUNT = 1280 * 720;
const MIN_RENDER_OVERLAY_MS = 500;
const STATIC_SWIRL_DURATION = 10;
const STATIC_SWIRL_SPEED = 8;

type PaperShaderHost = HTMLElement & {
    paperShaderMount?: {
        render: (t: number) => void;
        setFrame: (f: number) => void;
    };
};

function getPaperShaderHost(root: ParentNode | null): PaperShaderHost | null {
    return (
        (root?.querySelector(
            '[data-swirled-mesh]'
        ) as PaperShaderHost | null) ?? null
    );
}

async function waitForCanvas(
    root: ParentNode,
    width: number,
    height: number
): Promise<HTMLCanvasElement> {
    const deadline = Date.now() + 3000;
    while (Date.now() < deadline) {
        const canvas = root.querySelector('canvas');
        if (canvas) {
            await waitForRender(canvas, width, height);
            return canvas;
        }
        await new Promise(r => requestAnimationFrame(r));
    }
    throw new Error('No canvas found.');
}

function previewFrameStyle(width: number, height: number) {
    return {
        aspectRatio: `${width} / ${height}`,
        width: '100%',
        maxWidth: `${60 * (width / height)}vh`,
        maxHeight: '60vh'
    };
}

function FullscreenRenderOverlay({
    label,
    progress
}: {
    label: string;
    progress?: number | null;
}) {
    return (
        <div className="bg-ink/95 fixed inset-0 z-9999 flex items-center justify-center px-6 text-center backdrop-blur-sm">
            <div>
                <p className="stamp-num text-luz-mint">
                    {progress == null
                        ? label
                        : `${label} ${Math.round(progress * 100)}%`}
                </p>
                <p className="text-paper/60 mt-3 text-sm">
                    Rendering the full-resolution canvas…
                </p>
            </div>
        </div>
    );
}

function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function keepOverlayVisibleSince(startTime: number): Promise<void> {
    const elapsed = performance.now() - startTime;
    if (elapsed < MIN_RENDER_OVERLAY_MS) {
        await delay(MIN_RENDER_OVERLAY_MS - elapsed);
    }
}

function frameForStaticPosition(position: number): number {
    return (position / 100) * STATIC_SWIRL_DURATION * 1000 * STATIC_SWIRL_SPEED;
}

function formatSeconds(time: number): string {
    const safe = Number.isFinite(time) ? Math.max(0, time) : 0;
    const minutes = Math.floor(safe / 60);
    const seconds = Math.floor(safe % 60);
    const tenths = Math.floor((safe % 1) * 10);
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${tenths}`;
}

// Polls until the shader canvas reaches the target internal resolution (the
// shader's ResizeObserver re-renders asynchronously after a resize), or times
// out. Mirrors the reference project's `waitForRender`.
async function waitForRender(
    canvas: HTMLCanvasElement,
    width: number,
    height: number
): Promise<void> {
    const deadline = Date.now() + 3000;
    while (Date.now() < deadline) {
        if (canvas.width >= width && canvas.height >= height) {
            await new Promise(r =>
                requestAnimationFrame(() => requestAnimationFrame(r))
            );
            return;
        }
        await new Promise(r => setTimeout(r, 16));
    }
}

interface BackgroundGeneratorProps {
    labels: {
        width: string;
        height: string;
        size: string;
        lockRatio: string;
        download: string;
        downloading: string;
        hint: string;
        tabs: {
            flat: string;
            swirled: string;
            animated: string;
        };
        swirled: {
            hint: string;
            distortion: string;
            swirl: string;
            scale: string;
            position: string;
        };
        animated: {
            hint: string;
            fps: string;
            duration: string;
            speed: string;
            alternate: string;
            renderMp4: string;
            rendering: string;
            seconds: string;
            play: string;
            pause: string;
            previewPosition: string;
        };
    };
}

// The meshgradient.com `grad()` fragment shader, reproduced verbatim. It uses
// four *fixed* points (P0..P3) and four colors blended with a bilinear
// interpolation. There is no warp and no swirl — only the colors change.
const FRAGMENT_SHADER = `
precision mediump float;

uniform vec4 u_color0;
uniform vec4 u_color1;
uniform vec4 u_color2;
uniform vec4 u_color3;
varying vec2 texco;

vec4 grad(vec2 uv) {
    vec4 color0 = u_color0;
    vec4 color1 = u_color1;
    vec4 color2 = u_color2;
    vec4 color3 = u_color3;

    // coordinates (fixed, matching meshgradient.com)
    vec2 P0 = vec2(0.31, 0.3);
    vec2 P1 = vec2(0.7, 0.32);
    vec2 P2 = vec2(0.28, 0.71);
    vec2 P3 = vec2(0.72, 0.75);

    vec2 Q = P0 - P2;
    vec2 R = P1 - P0;
    vec2 S = R + P2 - P3;
    vec2 T = P0 - uv;

    float u;
    float t;

    if (Q.x == 0.0 && S.x == 0.0) {
        u = -T.x / R.x;
        t = (T.y + u * R.y) / (Q.y + u * S.y);
    } else if (Q.y == 0.0 && S.y == 0.0) {
        u = -T.y / R.y;
        t = (T.x + u * R.x) / (Q.x + u * S.x);
    } else {
        float A = S.x * R.y - R.x * S.y;
        float B = S.x * T.y - T.x * S.y + Q.x * R.y - R.x * Q.y;
        float C = Q.x * T.y - T.x * Q.y;
        if (abs(A) < 0.0001)
            u = -C / B;
        else
            u = (-B + sqrt(B * B - 4.0 * A * C)) / (2.0 * A);
        t = (T.y + u * R.y) / (Q.y + u * S.y);
    }
    u = clamp(u, 0.0, 1.0);
    t = clamp(t, 0.0, 1.0);

    t = smoothstep(0.0, 1.0, t);
    u = smoothstep(0.0, 1.0, u);

    vec4 colorA = mix(color0, color1, u);
    vec4 colorB = mix(color2, color3, u);

    return mix(colorA, colorB, t);
}

void main() {
    gl_FragColor = grad(texco);
}
`;

const VERTEX_SHADER = `
attribute vec2 a_Position;
attribute vec2 a_TexCoord;
varying vec2 texco;

void main() {
    texco = a_TexCoord;
    gl_Position = vec4(a_Position, 0.0, 1.0);
}
`;

function hexToRgb(hex: string): [number, number, number] {
    const h = hex.replace('#', '');
    const full =
        h.length === 3
            ? h
                  .split('')
                  .map(c => c + c)
                  .join('')
            : h;
    const n = parseInt(full, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/**
 * A self-contained WebGL canvas that renders the meshgradient.com `grad()`
 * gradient with four fixed points and four fixed colors.
 */
function MeshCanvas({ width, height }: { width: number; height: number }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl', {
            preserveDrawingBuffer: true
        });
        if (!gl) return;

        const compile = (type: number, src: string) => {
            const shader = gl.createShader(type);
            if (!shader) throw new Error('createShader failed');
            gl.shaderSource(shader, src);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                throw new Error(gl.getShaderInfoLog(shader) ?? 'shader error');
            }
            return shader;
        };

        const program = gl.createProgram();
        if (!program) return;
        gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX_SHADER));
        gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER));
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error(gl.getProgramInfoLog(program) ?? 'link error');
        }
        gl.useProgram(program);

        // Fullscreen quad.
        const position = new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]);
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, position, gl.STATIC_DRAW);
        const aPosition = gl.getAttribLocation(program, 'a_Position');
        gl.enableVertexAttribArray(aPosition);
        gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

        const texcoord = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
        const texcoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, texcoord, gl.STATIC_DRAW);
        const aTexCoord = gl.getAttribLocation(program, 'a_TexCoord');
        gl.enableVertexAttribArray(aTexCoord);
        gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 0, 0);

        const indices = new Uint16Array([0, 1, 2, 2, 3, 0]);
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        const setColor = (name: string, hex: string) => {
            const [r, g, b] = hexToRgb(hex);
            gl.uniform4f(
                gl.getUniformLocation(program, name),
                r / 255,
                g / 255,
                b / 255,
                1
            );
        };

        // Color mapping matches meshgradient.com's `draw()`:
        //   u_color1 = bl -> P0, u_color2 = br -> P1,
        //   u_color3 = tl -> P2, u_color4 = tr -> P3.
        setColor('u_color0', BACKGROUND_COLORS.bl);
        setColor('u_color1', BACKGROUND_COLORS.br);
        setColor('u_color2', BACKGROUND_COLORS.tl);
        setColor('u_color3', BACKGROUND_COLORS.tr);

        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    }, [width, height]);

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="h-full w-full"
        />
    );
}

// Shared size/ratio-lock state hook, reused by all three tabs so the
// dimensions stay consistent across Flat, Swirled, and Animated.
function useSizeState() {
    const [widthStr, setWidthStr] = useState<string>('1920');
    const [heightStr, setHeightStr] = useState<string>('1080');
    const [lockRatio, setLockRatio] = useState<boolean>(true);
    const ratioRef = useRef<number>(1920 / 1080);

    const width = Math.max(1, Math.min(8192, Number(widthStr) || 1));
    const height = Math.max(1, Math.min(8192, Number(heightStr) || 1));

    const updateWidth = (next: string) => {
        setWidthStr(next);
        if (lockRatio) {
            const w = Math.max(1, Math.min(8192, Number(next) || 1));
            setHeightStr(String(Math.max(1, Math.round(w / ratioRef.current))));
        }
    };

    const updateHeight = (next: string) => {
        setHeightStr(next);
        if (lockRatio) {
            const h = Math.max(1, Math.min(8192, Number(next) || 1));
            setWidthStr(String(Math.max(1, Math.round(h * ratioRef.current))));
        }
    };

    const applyPreset = (w: number, h: number) => {
        ratioRef.current = w / h;
        setWidthStr(String(w));
        setHeightStr(String(h));
    };

    const toggleLock = () => {
        setLockRatio(prev => {
            const next = !prev;
            if (next) ratioRef.current = width / height;
            return next;
        });
    };

    const normalizeWidth = () => {
        if (!widthStr || Number(widthStr) < 1) {
            setWidthStr('1');
            if (lockRatio)
                setHeightStr(
                    String(Math.max(1, Math.round(1 / ratioRef.current)))
                );
        }
    };

    const normalizeHeight = () => {
        if (!heightStr || Number(heightStr) < 1) {
            setHeightStr('1');
            if (lockRatio)
                setWidthStr(
                    String(Math.max(1, Math.round(1 * ratioRef.current)))
                );
        }
    };

    return {
        widthStr,
        heightStr,
        width,
        height,
        lockRatio,
        updateWidth,
        updateHeight,
        applyPreset,
        toggleLock,
        normalizeWidth,
        normalizeHeight
    };
}

// Shared size controls (presets + width/height + ratio lock), rendered by all
// three tabs so the layout stays consistent.
function SizeControls({
    labels,
    size
}: {
    labels: BackgroundGeneratorProps['labels'];
    size: ReturnType<typeof useSizeState>;
}) {
    return (
        <>
            <div>
                <label className="stamp-num text-ink-muted mb-2 block">
                    {labels.size}
                </label>
                <div className="flex flex-wrap gap-2">
                    {SIZE_PRESETS.map(p => {
                        const active =
                            size.width === p.width && size.height === p.height;
                        return (
                            <button
                                key={p.label}
                                onClick={() =>
                                    size.applyPreset(p.width, p.height)
                                }
                                className={`rounded-lg border px-4 py-2 text-sm transition ${
                                    active
                                        ? 'border-luz-mint bg-luz-mint/10 text-luz-mint'
                                        : 'text-paper/75 border-white/10 hover:border-white/30'
                                }`}>
                                {p.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div>
                <div className="mb-2 flex items-center justify-between">
                    <label className="stamp-num text-ink-muted block">
                        {labels.width} × {labels.height}
                    </label>
                    <button
                        onClick={size.toggleLock}
                        className={`stamp-num flex items-center gap-1.5 rounded-lg border px-3 py-1.5 transition ${
                            size.lockRatio
                                ? 'border-luz-mint bg-luz-mint/10 text-luz-mint'
                                : 'text-paper/75 border-white/10 hover:border-white/30'
                        }`}
                        aria-pressed={size.lockRatio}>
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true">
                            {size.lockRatio ? (
                                <>
                                    <rect
                                        x="3"
                                        y="11"
                                        width="18"
                                        height="11"
                                        rx="2"
                                    />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </>
                            ) : (
                                <>
                                    <rect
                                        x="3"
                                        y="11"
                                        width="18"
                                        height="11"
                                        rx="2"
                                    />
                                    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                                </>
                            )}
                        </svg>
                        {labels.lockRatio}
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="number"
                        min={1}
                        max={8192}
                        value={size.widthStr}
                        onChange={e => size.updateWidth(e.target.value)}
                        onBlur={size.normalizeWidth}
                        className="text-paper focus:border-luz-mint w-full rounded-lg border border-white/10 bg-transparent px-4 py-2 text-sm transition hover:border-white/30 focus:outline-none"
                    />
                    <input
                        type="number"
                        min={1}
                        max={8192}
                        value={size.heightStr}
                        onChange={e => size.updateHeight(e.target.value)}
                        onBlur={size.normalizeHeight}
                        className="text-paper focus:border-luz-mint w-full rounded-lg border border-white/10 bg-transparent px-4 py-2 text-sm transition hover:border-white/30 focus:outline-none"
                    />
                </div>
            </div>
        </>
    );
}

// A small labeled slider, used by the Swirled and Animated tabs.
function SliderField({
    label,
    value,
    onChange,
    min = 0,
    max = 1,
    step = 0.01,
    formatValue = v => v.toFixed(2)
}: {
    label: string;
    value: number;
    onChange: (v: number) => void;
    min?: number;
    max?: number;
    step?: number;
    formatValue?: (value: number) => string;
}) {
    return (
        <label className="block">
            <span className="stamp-num text-ink-muted mb-2 flex items-center justify-between">
                {label}
                <span className="tabular text-paper/75">
                    {formatValue(value)}
                </span>
            </span>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={e => onChange(Number(e.target.value))}
                className="accent-luz-mint w-full"
            />
        </label>
    );
}

// The Flat tab: the existing meshgradient.com-compatible WebGL generator.
function FlatTab({ labels }: { labels: BackgroundGeneratorProps['labels'] }) {
    const size = useSizeState();
    const [exporting, setExporting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const previewRef = useRef<HTMLDivElement>(null);

    const handleExport = async () => {
        if (!previewRef.current) return;
        setExporting(true);
        setError(null);
        try {
            const canvas = previewRef.current.querySelector('canvas');
            if (!canvas) throw new Error('No canvas found.');
            const out = document.createElement('canvas');
            out.width = size.width;
            out.height = size.height;
            const ctx = out.getContext('2d');
            if (!ctx) throw new Error('Could not get 2D context.');
            ctx.drawImage(canvas, 0, 0, size.width, size.height);
            const blob = await new Promise<Blob>((resolve, reject) => {
                out.toBlob(
                    b =>
                        b
                            ? resolve(b)
                            : reject(new Error('PNG export failed.')),
                    'image/png'
                );
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `luztech-background-${size.width}x${size.height}.png`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Export failed.');
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:gap-8">
            <div className="bg-ink-soft flex flex-col items-center justify-center rounded-xl border border-white/8 p-6 md:p-8">
                <div className="flex h-[45vh] w-full items-center justify-center md:h-[60vh]">
                    <div
                        ref={previewRef}
                        className="overflow-hidden rounded-lg"
                        style={{
                            aspectRatio: `${size.width} / ${size.height}`,
                            maxWidth: '100%',
                            maxHeight: '100%'
                        }}>
                        <MeshCanvas width={size.width} height={size.height} />
                    </div>
                </div>
                <p className="stamp-num text-ink-muted mt-4">
                    {size.width}×{size.height} PNG
                </p>
            </div>

            <div className="bg-ink-soft space-y-6 rounded-xl border border-white/8 p-6 md:p-8">
                <SizeControls labels={labels} size={size} />

                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
                    <button
                        onClick={handleExport}
                        disabled={exporting}
                        className="btn btn--primary justify-center disabled:cursor-not-allowed disabled:opacity-50 sm:justify-start">
                        {exporting ? labels.downloading : labels.download}
                    </button>
                </div>

                {error && <p className="text-sm text-red-400">{error}</p>}

                <p className="text-ink-muted text-sm">{labels.hint}</p>
            </div>
        </div>
    );
}

// The Swirled tab: a static (single-frame) swirled mesh with simplified
// controls, exported as PNG.
function SwirledTab({
    labels
}: {
    labels: BackgroundGeneratorProps['labels'];
}) {
    const size = useSizeState();
    const [distortion, setDistortion] = useState(0.65);
    const [swirl, setSwirl] = useState(0.3);
    const [scale, setScale] = useState(0.7);
    const [position, setPosition] = useState(0);
    const [exporting, setExporting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const exportRef = useRef<HTMLDivElement>(null);
    const positionFrame = frameForStaticPosition(position);

    const handleExport = async () => {
        const startTime = performance.now();
        setExporting(true);
        setError(null);
        try {
            await new Promise(r => requestAnimationFrame(r));
            if (!exportRef.current) throw new Error('Export stage not ready.');
            const canvas = await waitForCanvas(
                exportRef.current,
                size.width,
                size.height
            );

            const mount = getPaperShaderHost(
                exportRef.current
            )?.paperShaderMount;
            mount?.setFrame(positionFrame);
            mount?.render(performance.now());

            const out = document.createElement('canvas');
            out.width = size.width;
            out.height = size.height;
            const ctx = out.getContext('2d');
            if (!ctx) throw new Error('Could not get 2D context.');
            ctx.drawImage(canvas, 0, 0, size.width, size.height);
            const blob = await new Promise<Blob>((resolve, reject) => {
                out.toBlob(
                    b =>
                        b
                            ? resolve(b)
                            : reject(new Error('PNG export failed.')),
                    'image/png'
                );
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `luztech-background-swirled-${size.width}x${size.height}.png`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Export failed.');
        } finally {
            await keepOverlayVisibleSince(startTime);
            setExporting(false);
        }
    };

    return (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:gap-8">
            {exporting && (
                <>
                    <FullscreenRenderOverlay label={labels.downloading} />
                    <div
                        ref={exportRef}
                        aria-hidden="true"
                        className="pointer-events-none fixed top-0 left-[-99999px] overflow-hidden"
                        style={{ width: size.width, height: size.height }}>
                        <SwirledMesh
                            width={size.width}
                            height={size.height}
                            distortion={distortion}
                            swirl={swirl}
                            scale={scale}
                            frame={positionFrame}
                            speed={0}
                        />
                    </div>
                </>
            )}

            <div className="bg-ink-soft flex flex-col items-center justify-center rounded-xl border border-white/8 p-6 md:p-8">
                <div className="flex h-[45vh] w-full items-center justify-center md:h-[60vh]">
                    <div
                        className="relative overflow-hidden rounded-lg"
                        style={previewFrameStyle(size.width, size.height)}>
                        <SwirledMesh
                            width={size.width}
                            height={size.height}
                            distortion={distortion}
                            swirl={swirl}
                            scale={scale}
                            frame={positionFrame}
                            speed={0}
                            maxPixelCount={PREVIEW_MAX_PIXEL_COUNT}
                        />
                    </div>
                </div>
                <p className="stamp-num text-ink-muted mt-4">
                    {size.width}×{size.height} PNG
                </p>
            </div>

            <div className="bg-ink-soft space-y-6 rounded-xl border border-white/8 p-6 md:p-8">
                <SizeControls labels={labels} size={size} />

                <SliderField
                    label={labels.swirled.distortion}
                    value={distortion}
                    onChange={setDistortion}
                />
                <SliderField
                    label={labels.swirled.swirl}
                    value={swirl}
                    onChange={setSwirl}
                />
                <SliderField
                    label={labels.swirled.scale}
                    value={scale}
                    onChange={setScale}
                    min={0.01}
                    max={4}
                />
                <SliderField
                    label={labels.swirled.position}
                    value={position}
                    onChange={setPosition}
                    min={0}
                    max={100}
                    step={1}
                    formatValue={v => `${Math.round(v)}%`}
                />

                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
                    <button
                        onClick={handleExport}
                        disabled={exporting}
                        className="btn btn--primary justify-center disabled:cursor-not-allowed disabled:opacity-50 sm:justify-start">
                        {exporting ? labels.downloading : labels.download}
                    </button>
                </div>

                {error && <p className="text-sm text-red-400">{error}</p>}

                <p className="text-ink-muted text-sm">{labels.swirled.hint}</p>
            </div>
        </div>
    );
}

// The Animated tab: a swirled mesh rendered to MP4/GIF via Editframe's local
// renderer. The mesh's `frame` is driven by the timegroup's clock so the
// animation is deterministic and synced to the render.
function AnimatedTab({
    labels
}: {
    labels: BackgroundGeneratorProps['labels'];
}) {
    const size = useSizeState();
    const [fps, setFps] = useState(60);
    const [duration, setDuration] = useState(10);
    const [speed, setSpeed] = useState(8);
    const [alternate, setAlternate] = useState(true);
    const [distortion, setDistortion] = useState(0.65);
    const [swirl, setSwirl] = useState(0.3);
    const [scale, setScale] = useState(0.7);

    const [rendering, setRendering] = useState(false);
    const [progress, setProgress] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const previewTimegroupRef = useRef<EFTimegroupElement>(null);
    const renderTimegroupRef = useRef<EFTimegroupElement>(null);
    const playback = usePlayback(previewTimegroupRef);

    const frameForTime = (ownCurrentTime: number) => {
        const total = duration;
        const half = total / 2;
        if (alternate && ownCurrentTime >= half) {
            return (total - ownCurrentTime) * 1000 * speed;
        }
        return ownCurrentTime * 1000 * speed;
    };

    const handleFrame = ({ ownCurrentTime, element }: FrameTaskInfo) => {
        const mount = getPaperShaderHost(element)?.paperShaderMount;
        if (!mount) return;
        mount.setFrame(frameForTime(ownCurrentTime));
    };

    const renderStage = (
        <Timegroup
            ref={renderTimegroupRef}
            mode="fixed"
            duration={`${duration}s`}
            fps={fps}
            onFrame={handleFrame}
            className="block overflow-hidden"
            style={{
                width: size.width,
                height: size.height
            }}>
            <SwirledMesh
                width={size.width}
                height={size.height}
                distortion={distortion}
                swirl={swirl}
                scale={scale}
                frame={0}
                speed={0}
            />
        </Timegroup>
    );

    const waitForRenderStage = async () => {
        const deadline = Date.now() + 3000;
        while (Date.now() < deadline) {
            const tg = renderTimegroupRef.current;
            if (tg) {
                await waitForCanvas(tg, size.width, size.height);
                return tg;
            }
            await new Promise(r => requestAnimationFrame(r));
        }
        throw new Error('Render stage not ready.');
    };

    const handleRender = async () => {
        const startTime = performance.now();
        setRendering(true);
        setProgress(0);
        setError(null);
        try {
            playback.pause();
            await new Promise(r => requestAnimationFrame(r));
            const tg = await waitForRenderStage();
            const result = await renderTimegroupToVideo(tg, {
                width: size.width,
                height: size.height,
                fps,
                to: duration,
                onProgress: p => setProgress(p.frame / p.totalFrames)
            });
            const blob = new Blob([result.buffer!], { type: result.mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `luztech-mesh-${size.width}x${size.height}-${duration}s.mp4`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Render failed.');
        } finally {
            await keepOverlayVisibleSince(startTime);
            setRendering(false);
            setProgress(null);
        }
    };

    const handlePreviewToggle = async () => {
        if (playback.playing) {
            playback.pause();
            return;
        }
        if (playback.currentTime >= duration) {
            await playback.seek(0);
        }
        playback.play();
    };

    const previewCurrentTime = Math.min(playback.currentTime, duration);

    return (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:gap-8">
            {rendering && (
                <>
                    <FullscreenRenderOverlay
                        label={labels.animated.rendering}
                        progress={progress}
                    />
                    <div
                        aria-hidden="true"
                        className="pointer-events-none fixed top-0 left-[-99999px] overflow-hidden"
                        style={{ width: size.width, height: size.height }}>
                        {renderStage}
                    </div>
                </>
            )}

            <div className="bg-ink-soft flex flex-col items-center justify-center rounded-xl border border-white/8 p-6 md:p-8">
                <div className="flex min-h-[260px] w-full items-center justify-center md:min-h-[60vh]">
                    <Timegroup
                        ref={previewTimegroupRef}
                        mode="fixed"
                        duration={`${duration}s`}
                        fps={fps}
                        onFrame={handleFrame}
                        className="block w-full max-w-full overflow-hidden rounded-lg"
                        style={previewFrameStyle(size.width, size.height)}>
                        <SwirledMesh
                            width={size.width}
                            height={size.height}
                            distortion={distortion}
                            swirl={swirl}
                            scale={scale}
                            frame={0}
                            speed={0}
                            maxPixelCount={PREVIEW_MAX_PIXEL_COUNT}
                        />
                    </Timegroup>
                </div>
                <div className="mt-5 w-full max-w-xl">
                    <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 sm:flex">
                        <button
                            type="button"
                            onClick={handlePreviewToggle}
                            aria-label={
                                playback.playing
                                    ? labels.animated.pause
                                    : labels.animated.play
                            }
                            title={
                                playback.playing
                                    ? labels.animated.pause
                                    : labels.animated.play
                            }
                            className="text-paper hover:border-luz-mint flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 transition sm:shrink-0">
                            {playback.playing ? (
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    aria-hidden="true">
                                    <rect
                                        x="6"
                                        y="5"
                                        width="4"
                                        height="14"
                                        rx="1"
                                    />
                                    <rect
                                        x="14"
                                        y="5"
                                        width="4"
                                        height="14"
                                        rx="1"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    aria-hidden="true">
                                    <path d="M8 5.14v13.72a1 1 0 0 0 1.55.83l10.29-6.86a1 1 0 0 0 0-1.66L9.55 4.31A1 1 0 0 0 8 5.14z" />
                                </svg>
                            )}
                        </button>
                        <input
                            type="range"
                            min={0}
                            max={duration}
                            step={1 / fps}
                            value={previewCurrentTime}
                            onChange={e =>
                                playback.seek(Number(e.target.value))
                            }
                            className="accent-luz-mint min-w-0 sm:flex-1"
                            aria-label={labels.animated.previewPosition}
                        />
                        <span className="stamp-num text-ink-muted col-span-2 min-h-4 text-right tabular-nums sm:col-span-1 sm:min-w-24">
                            {formatSeconds(previewCurrentTime)} /{' '}
                            {formatSeconds(duration)}
                        </span>
                    </div>
                </div>
                <p className="stamp-num text-ink-muted mt-4">
                    {rendering
                        ? progress !== null
                            ? `${labels.animated.rendering} ${Math.round(progress * 100)}%`
                            : labels.animated.rendering
                        : `${size.width}×${size.height} · ${fps}fps · ${duration}${labels.animated.seconds}`}
                </p>
            </div>

            <div className="bg-ink-soft space-y-6 rounded-xl border border-white/8 p-6 md:p-8">
                <SizeControls labels={labels} size={size} />

                <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                        <span className="stamp-num text-ink-muted mb-2 block">
                            {labels.animated.fps}
                        </span>
                        <input
                            type="number"
                            min={1}
                            max={120}
                            value={fps}
                            onChange={e =>
                                setFps(
                                    Math.max(
                                        1,
                                        Math.min(
                                            120,
                                            Number(e.target.value) || 1
                                        )
                                    )
                                )
                            }
                            className="text-paper focus:border-luz-mint w-full rounded-lg border border-white/10 bg-transparent px-4 py-2 text-sm transition hover:border-white/30 focus:outline-none"
                        />
                    </label>
                    <label className="block">
                        <span className="stamp-num text-ink-muted mb-2 block">
                            {labels.animated.duration} (
                            {labels.animated.seconds})
                        </span>
                        <input
                            type="number"
                            min={1}
                            max={300}
                            value={duration}
                            onChange={e =>
                                setDuration(
                                    Math.max(
                                        1,
                                        Math.min(
                                            300,
                                            Number(e.target.value) || 1
                                        )
                                    )
                                )
                            }
                            className="text-paper focus:border-luz-mint w-full rounded-lg border border-white/10 bg-transparent px-4 py-2 text-sm transition hover:border-white/30 focus:outline-none"
                        />
                    </label>
                </div>

                <SliderField
                    label={labels.animated.speed}
                    value={speed}
                    onChange={setSpeed}
                    min={0.1}
                    max={8}
                    step={0.1}
                />

                <label className="text-paper/75 flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={alternate}
                        onChange={e => setAlternate(e.target.checked)}
                        className="accent-luz-mint"
                    />
                    {labels.animated.alternate}
                </label>

                <SliderField
                    label={labels.swirled.distortion}
                    value={distortion}
                    onChange={setDistortion}
                />
                <SliderField
                    label={labels.swirled.swirl}
                    value={swirl}
                    onChange={setSwirl}
                />
                <SliderField
                    label={labels.swirled.scale}
                    value={scale}
                    onChange={setScale}
                    min={0.01}
                    max={4}
                />

                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
                    <button
                        onClick={handleRender}
                        disabled={rendering}
                        className="btn btn--primary justify-center disabled:cursor-not-allowed disabled:opacity-50 sm:justify-start">
                        {rendering
                            ? labels.animated.rendering
                            : labels.animated.renderMp4}
                    </button>
                </div>

                {error && <p className="text-sm text-red-400">{error}</p>}

                <p className="text-ink-muted text-sm">{labels.animated.hint}</p>
            </div>
        </div>
    );
}

export function BackgroundGenerator({ labels }: BackgroundGeneratorProps) {
    const [tab, setTab] = useState<TabId>('flat');

    const tabs: { id: TabId; label: string }[] = [
        { id: 'flat', label: labels.tabs.flat },
        { id: 'swirled', label: labels.tabs.swirled },
        { id: 'animated', label: labels.tabs.animated }
    ];

    return (
        <div>
            {/* Sub-tabs */}
            <div
                role="tablist"
                aria-label="Background type"
                className="mb-8 flex flex-wrap gap-2">
                {tabs.map(t => {
                    const active = tab === t.id;
                    return (
                        <button
                            key={t.id}
                            role="tab"
                            aria-selected={active}
                            onClick={() => setTab(t.id)}
                            className={`rounded-lg border px-5 py-2.5 text-sm font-medium transition ${
                                active
                                    ? 'border-luz-mint bg-luz-mint/10 text-luz-mint'
                                    : 'text-paper/75 border-white/10 hover:border-white/30'
                            }`}>
                            {t.label}
                        </button>
                    );
                })}
            </div>

            {tab === 'flat' && <FlatTab labels={labels} />}
            {tab === 'swirled' && <SwirledTab labels={labels} />}
            {tab === 'animated' && <AnimatedTab labels={labels} />}
        </div>
    );
}
