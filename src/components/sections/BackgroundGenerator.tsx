import { useEffect, useRef, useState } from 'react';

// LuzTech brand palette, mapped to the four mesh corners (top-left, top-right,
// bottom-left, bottom-right) exactly like meshgradient.com.
const DEFAULT_COLORS = {
    tl: '#4665c3',
    tr: '#1f6fef',
    bl: '#00ff9d',
    br: '#69dd96'
} as const;

const SIZE_PRESETS = [
    { label: '1920×1080', width: 1920, height: 1080 },
    { label: '1080×1920', width: 1080, height: 1920 },
    { label: '1024×1024', width: 1024, height: 1024 },
    { label: '2560×1440', width: 2560, height: 1440 },
    { label: '3840×2160', width: 3840, height: 2160 }
] as const;

interface BackgroundGeneratorProps {
    labels: {
        width: string;
        height: string;
        size: string;
        lockRatio: string;
        download: string;
        downloading: string;
        hint: string;
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
        setColor('u_color0', DEFAULT_COLORS.bl);
        setColor('u_color1', DEFAULT_COLORS.br);
        setColor('u_color2', DEFAULT_COLORS.tl);
        setColor('u_color3', DEFAULT_COLORS.tr);

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

export function BackgroundGenerator({ labels }: BackgroundGeneratorProps) {
    const [widthStr, setWidthStr] = useState<string>('1920');
    const [heightStr, setHeightStr] = useState<string>('1080');
    const [lockRatio, setLockRatio] = useState<boolean>(true);
    const [exporting, setExporting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const previewRef = useRef<HTMLDivElement>(null);
    const ratioRef = useRef<number>(1920 / 1080);

    // Effective numeric values, clamped to [1, 8192]. The inputs themselves are
    // kept as strings so the user can clear them (empty/zero) while typing.
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
            if (next) {
                ratioRef.current = width / height;
            }
            return next;
        });
    };

    const handleExport = async () => {
        if (!previewRef.current) return;
        setExporting(true);
        setError(null);
        try {
            const canvas = previewRef.current.querySelector('canvas');
            if (!canvas) throw new Error('No canvas found.');
            const out = document.createElement('canvas');
            out.width = width;
            out.height = height;
            const ctx = out.getContext('2d');
            if (!ctx) throw new Error('Could not get 2D context.');
            ctx.drawImage(canvas, 0, 0, width, height);
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
            a.download = `luztech-background-${width}x${height}.png`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Export failed.');
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
            {/* Preview */}
            <div className="bg-ink-soft flex flex-col items-center justify-center rounded-xl border border-white/8 p-8">
                <div className="flex h-[60vh] w-full items-center justify-center">
                    <div
                        ref={previewRef}
                        className="overflow-hidden rounded-lg"
                        style={{
                            aspectRatio: `${width} / ${height}`,
                            maxWidth: '100%',
                            maxHeight: '100%'
                        }}>
                        <MeshCanvas width={width} height={height} />
                    </div>
                </div>
                <p className="stamp-num text-ink-muted mt-4">
                    {width}×{height} PNG
                </p>
            </div>

            {/* Controls */}
            <div className="bg-ink-soft space-y-6 rounded-xl border border-white/8 p-8">
                {/* Size presets */}
                <div>
                    <label className="stamp-num text-ink-muted mb-2 block">
                        {labels.size}
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {SIZE_PRESETS.map(p => {
                            const active =
                                width === p.width && height === p.height;
                            return (
                                <button
                                    key={p.label}
                                    onClick={() =>
                                        applyPreset(p.width, p.height)
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

                {/* Custom dimensions with ratio lock */}
                <div>
                    <div className="mb-2 flex items-center justify-between">
                        <label className="stamp-num text-ink-muted block">
                            {labels.width} × {labels.height}
                        </label>
                        <button
                            onClick={toggleLock}
                            className={`stamp-num flex items-center gap-1.5 rounded-lg border px-3 py-1.5 transition ${
                                lockRatio
                                    ? 'border-luz-mint bg-luz-mint/10 text-luz-mint'
                                    : 'text-paper/75 border-white/10 hover:border-white/30'
                            }`}
                            aria-pressed={lockRatio}>
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                aria-hidden="true">
                                {lockRatio ? (
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
                        <div>
                            <input
                                type="number"
                                min={1}
                                max={8192}
                                value={widthStr}
                                onChange={e => updateWidth(e.target.value)}
                                onBlur={() => {
                                    if (!widthStr || Number(widthStr) < 1) {
                                        setWidthStr('1');
                                        if (lockRatio) {
                                            setHeightStr(
                                                String(
                                                    Math.max(
                                                        1,
                                                        Math.round(
                                                            1 / ratioRef.current
                                                        )
                                                    )
                                                )
                                            );
                                        }
                                    }
                                }}
                                className="w-full rounded-lg border border-white/10 bg-transparent px-4 py-2 text-sm text-paper transition hover:border-white/30 focus:border-luz-mint focus:outline-none"
                            />
                        </div>
                        <div>
                            <input
                                type="number"
                                min={1}
                                max={8192}
                                value={heightStr}
                                onChange={e => updateHeight(e.target.value)}
                                onBlur={() => {
                                    if (!heightStr || Number(heightStr) < 1) {
                                        setHeightStr('1');
                                        if (lockRatio) {
                                            setWidthStr(
                                                String(
                                                    Math.max(
                                                        1,
                                                        Math.round(
                                                            1 * ratioRef.current
                                                        )
                                                    )
                                                )
                                            );
                                        }
                                    }
                                }}
                                className="w-full rounded-lg border border-white/10 bg-transparent px-4 py-2 text-sm text-paper transition hover:border-white/30 focus:border-luz-mint focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-2">
                    <button
                        onClick={handleExport}
                        disabled={exporting}
                        className="btn btn--primary disabled:cursor-not-allowed disabled:opacity-50">
                        {exporting ? labels.downloading : labels.download}
                    </button>
                </div>

                {error && <p className="text-sm text-red-400">{error}</p>}

                <p className="text-ink-muted text-sm">{labels.hint}</p>
            </div>
        </div>
    );
}
