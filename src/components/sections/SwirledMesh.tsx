import { MeshGradient } from '@paper-design/shaders-react';
import type { CSSProperties } from 'react';

// LuzTech brand palette, matching the animations project.
export const LUZTECH_COLORS = ['#00ff9d', '#69dd96', '#4665c3', '#1f6fef'];

interface SwirledMeshProps {
    width: number;
    height: number;
    colors?: string[];
    distortion?: number;
    swirl?: number;
    scale?: number;
    frame?: number;
    speed?: number;
    maxPixelCount?: number;
    style?: CSSProperties;
}

/**
 * The swirled (animated) mesh gradient, mirroring the animations project's
 * `MeshGradient` component. Uses `@paper-design/shaders-react`'s `MeshGradient`
 * shader so the output is faithful to the existing brand animation.
 *
 * `width`/`height` set the aspect ratio and the maximum canvas pixel count;
 * the on-screen size is controlled by the parent container (the shader fills
 * its parent and scales responsively).
 */
export function SwirledMesh({
    width,
    height,
    colors = LUZTECH_COLORS,
    distortion = 0.65,
    swirl = 0.3,
    scale = 0.7,
    frame = 0,
    speed = 0,
    maxPixelCount = width * height,
    style
}: SwirledMeshProps) {
    return (
        <MeshGradient
            data-swirled-mesh
            width="100%"
            height="100%"
            maxPixelCount={maxPixelCount}
            colors={colors}
            distortion={distortion}
            swirl={swirl}
            grainMixer={0}
            grainOverlay={0}
            scale={scale}
            speed={speed}
            frame={frame}
            webGlContextAttributes={{ preserveDrawingBuffer: true }}
            style={{ width: '100%', height: '100%', ...style }}
        />
    );
}
