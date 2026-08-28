/**
 * Renders a WebGL shader element to a PNG and triggers a download.
 *
 * The `@paper-design/shaders-react` components mount a `<canvas>` inside a
 * wrapper `<div>`. We locate that canvas, draw it onto an offscreen canvas at
 * the requested pixel size, and export it as a PNG.
 */
export async function exportElementToPng(
  element: HTMLElement,
  width: number,
  height: number,
  filename: string,
): Promise<void> {
  const canvas = element.querySelector("canvas");
  if (!canvas) {
    throw new Error("No canvas found in the mesh element.");
  }

  const out = document.createElement("canvas");
  out.width = width;
  out.height = height;
  const ctx = out.getContext("2d");
  if (!ctx) {
    throw new Error("Could not get 2D context.");
  }

  // Draw the shader canvas scaled to the requested output size.
  ctx.drawImage(canvas, 0, 0, width, height);

  const blob = await new Promise<Blob>((resolve, reject) => {
    out.toBlob((b) => (b ? resolve(b) : reject(new Error("PNG export failed."))), "image/png");
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
