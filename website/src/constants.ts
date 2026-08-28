// LuzTech brand colors used across the mesh gradient generators.
// These match the typography mesh gradient documented in the repo README.
export const LUZTECH_COLORS = ["#00ff9d", "#69dd96", "#4665c3", "#1f6fef"] as const;

// Default mesh parameters, mirroring the existing Remotion project
// (animations/src/MeshGradient.tsx) so the animated output stays faithful.
export const DEFAULT_MESH = {
  distortion: 0.65,
  swirl: 0.3,
  grainMixer: 0,
  grainOverlay: 0,
  scale: 0.7,
} as const;

// Default static (non-swirled) mesh parameters. The static image intentionally
// has no swirl; its look is modeled after the Mesh Gradient Generator
// (https://meshgradient.com/), referenced in the README.
export const DEFAULT_STATIC_MESH = {
  positions: 2,
  waveX: 1,
  waveXShift: 0.6,
  waveY: 1,
  waveYShift: 0.21,
  mixing: 0.93,
  grainMixer: 0,
  grainOverlay: 0,
  scale: 0.7,
} as const;

// Video defaults, matching the Remotion composition.
export const DEFAULT_VIDEO = {
  width: 1920,
  height: 1080,
  fps: 60,
  durationSeconds: 10,
  speed: 10,
  alternate: true,
} as const;
