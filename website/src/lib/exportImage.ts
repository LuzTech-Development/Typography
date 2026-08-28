/**
 * Renders a WebGL shader element to a PNG at full resolution and triggers a
 * download.
 *
 * The `@paper-design/shaders-react` components mount a `<canvas>` inside a
 * wrapper `<div>` and scale the canvas to the wrapper's CSS size (capped by
 * `maxPixelCount`). To export at the requested pixel size, we temporarily
 * resize the wrapper to the full dimensions, wait for the shader's
 * ResizeObserver to re-render, capture the canvas, then restore the wrapper.
 */
export async function exportElementToPng(
    element: HTMLElement,
    width: number,
    height: number,
    filename: string
): Promise<void> {
    const canvas = element.querySelector('canvas');
    if (!canvas) {
        throw new Error('No canvas found in the mesh element.');
    }

    // Remember the original inline size so we can restore it after capture.
    const prevWidth = element.style.width;
    const prevHeight = element.style.height;

    // Resize to full export resolution and wait for the shader to re-render.
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
    await waitForRender(canvas, width, height);

    try {
        const out = document.createElement('canvas');
        out.width = width;
        out.height = height;
        const ctx = out.getContext('2d');
        if (!ctx) {
            throw new Error('Could not get 2D context.');
        }
        ctx.drawImage(canvas, 0, 0, width, height);

        const blob = await new Promise<Blob>((resolve, reject) => {
            out.toBlob(
                b => (b ? resolve(b) : reject(new Error('PNG export failed.'))),
                'image/png'
            );
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    } finally {
        // Restore the preview size.
        element.style.width = prevWidth;
        element.style.height = prevHeight;
    }
}

/**
 * Polls until the canvas reaches the target internal resolution (the shader's
 * ResizeObserver re-renders asynchronously), or times out.
 */
async function waitForRender(
    canvas: HTMLCanvasElement,
    width: number,
    height: number
): Promise<void> {
    const deadline = Date.now() + 3000;
    while (Date.now() < deadline) {
        if (canvas.width >= width && canvas.height >= height) {
            // Give the GPU one more frame to flush before capture.
            await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
            return;
        }
        await new Promise(r => setTimeout(r, 16));
    }
    // Fall through: capture whatever resolution is available rather than fail.
}
