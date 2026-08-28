import { MeshGradient as AnimatedMesh, StaticMeshGradient } from '@paper-design/shaders-react';
import { CSSProperties } from 'react';

interface MeshProps {
    width: number;
    height: number;
    colors: string[];
    distortion?: number;
    swirl?: number;
    grainMixer?: number;
    grainOverlay?: number;
    scale?: number;
    speed?: number;
    frame?: number;
    style?: CSSProperties;
}

/**
 * Animated (swirled) mesh gradient. Mirrors the Remotion project's
 * `AnimatedGradient` component, using the same `@paper-design/shaders-react`
 * shader so the rendered video is faithful to the existing brand animation.
 *
 * `width`/`height` are the *export* resolution: they set the aspect ratio and
 * the maximum canvas pixel count, while the on-screen size is controlled by
 * the parent container (the shader fills its parent and scales responsively).
 */
export function AnimatedMeshGradient({
    width,
    height,
    colors,
    distortion = 0.65,
    swirl = 0.3,
    grainMixer = 0,
    grainOverlay = 0,
    scale = 0.7,
    speed = 0,
    frame = 0,
    style
}: MeshProps) {
    return (
        <AnimatedMesh
            width="100%"
            height="100%"
            maxPixelCount={width * height}
            colors={colors}
            distortion={distortion}
            swirl={swirl}
            grainMixer={grainMixer}
            grainOverlay={grainOverlay}
            scale={scale}
            speed={speed}
            frame={frame}
            style={{ width: '100%', height: '100%', ...style }}
        />
    );
}

interface StaticMeshProps {
    width: number;
    height: number;
    colors: string[];
    positions?: number;
    waveX?: number;
    waveXShift?: number;
    waveY?: number;
    waveYShift?: number;
    mixing?: number;
    grainMixer?: number;
    grainOverlay?: number;
    scale?: number;
    style?: CSSProperties;
}

/**
 * Static (non-swirled) mesh gradient for still-image export. Uses the
 * `StaticMeshGradient` shader, which has no swirl and no time-based motion.
 * Its look is modeled after the Mesh Gradient Generator (meshgradient.com).
 */
export function StaticMesh({
    width,
    height,
    colors,
    positions = 2,
    waveX = 1,
    waveXShift = 0.6,
    waveY = 1,
    waveYShift = 0.21,
    mixing = 0.93,
    grainMixer = 0,
    grainOverlay = 0,
    scale = 0.7,
    style
}: StaticMeshProps) {
    return (
        <StaticMeshGradient
            width="100%"
            height="100%"
            maxPixelCount={width * height}
            colors={colors}
            positions={positions}
            waveX={waveX}
            waveXShift={waveXShift}
            waveY={waveY}
            waveYShift={waveYShift}
            mixing={mixing}
            grainMixer={grainMixer}
            grainOverlay={grainOverlay}
            scale={scale}
            speed={0}
            style={{ width: '100%', height: '100%', ...style }}
        />
    );
}
