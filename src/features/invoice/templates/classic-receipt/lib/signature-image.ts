const ALLOWED_SIGNATURE_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
export const RECEIPT_SIGNATURE_MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_SCAN_WIDTH = 1200;
const MAX_SCAN_HEIGHT = 600;
const MAX_OUTPUT_WIDTH = 700;
const MAX_OUTPUT_HEIGHT = 260;
const MAX_DATA_URL_LENGTH = 700_000;

export const RECEIPT_SIGNATURE_ACCEPT = "image/png,image/jpeg,image/webp";

export function isReceiptSignatureMimeType(value: string): boolean {
  return ALLOWED_SIGNATURE_TYPES.has(value);
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("The signature image could not be read."));
    };
    image.src = url;
  });
}

function fitWithin(width: number, height: number, maxWidth: number, maxHeight: number) {
  const scale = Math.min(1, maxWidth / width, maxHeight / height);
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

function findInkBounds(canvas: HTMLCanvasElement): { x: number; y: number; width: number; height: number } | null {
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return null;

  const { width, height } = canvas;
  const pixels = context.getImageData(0, 0, width, height).data;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      const red = pixels[index];
      const green = pixels[index + 1];
      const blue = pixels[index + 2];
      const alpha = pixels[index + 3];
      const visibleInk = alpha > 12 && (red < 248 || green < 248 || blue < 248);
      if (!visibleInk) continue;

      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  if (maxX < minX || maxY < minY) return null;

  const padding = Math.max(4, Math.round(Math.min(width, height) * 0.025));
  const x = Math.max(0, minX - padding);
  const y = Math.max(0, minY - padding);
  const right = Math.min(width - 1, maxX + padding);
  const bottom = Math.min(height - 1, maxY + padding);

  return {
    x,
    y,
    width: right - x + 1,
    height: bottom - y + 1,
  };
}

function canvasToSafeDataUrl(canvas: HTMLCanvasElement): string {
  const png = canvas.toDataURL("image/png");
  if (png.length <= MAX_DATA_URL_LENGTH) return png;

  const flattened = document.createElement("canvas");
  flattened.width = canvas.width;
  flattened.height = canvas.height;
  const context = flattened.getContext("2d");
  if (!context) return png;

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, flattened.width, flattened.height);
  context.drawImage(canvas, 0, 0);
  return flattened.toDataURL("image/jpeg", 0.86);
}

export async function optimizeReceiptSignatureImage(file: File): Promise<string> {
  if (!isReceiptSignatureMimeType(file.type)) {
    throw new Error("Use a PNG, JPEG or WebP image for signatures.");
  }

  if (file.size > RECEIPT_SIGNATURE_MAX_FILE_BYTES) {
    throw new Error("Signature image is too large. Use an image smaller than 5 MB.");
  }

  const image = await loadImage(file);
  if (!image.naturalWidth || !image.naturalHeight) {
    throw new Error("The signature image has invalid dimensions.");
  }

  const scanSize = fitWithin(
    image.naturalWidth,
    image.naturalHeight,
    MAX_SCAN_WIDTH,
    MAX_SCAN_HEIGHT,
  );
  const scanCanvas = document.createElement("canvas");
  scanCanvas.width = scanSize.width;
  scanCanvas.height = scanSize.height;
  const scanContext = scanCanvas.getContext("2d");
  if (!scanContext) throw new Error("Your browser could not prepare the signature image.");

  scanContext.clearRect(0, 0, scanCanvas.width, scanCanvas.height);
  scanContext.drawImage(image, 0, 0, scanCanvas.width, scanCanvas.height);

  const bounds = findInkBounds(scanCanvas) ?? {
    x: 0,
    y: 0,
    width: scanCanvas.width,
    height: scanCanvas.height,
  };
  const outputSize = fitWithin(bounds.width, bounds.height, MAX_OUTPUT_WIDTH, MAX_OUTPUT_HEIGHT);
  const output = document.createElement("canvas");
  output.width = outputSize.width;
  output.height = outputSize.height;
  const outputContext = output.getContext("2d");
  if (!outputContext) throw new Error("Your browser could not optimize the signature image.");

  outputContext.clearRect(0, 0, output.width, output.height);
  outputContext.drawImage(
    scanCanvas,
    bounds.x,
    bounds.y,
    bounds.width,
    bounds.height,
    0,
    0,
    output.width,
    output.height,
  );

  const dataUrl = canvasToSafeDataUrl(output);
  if (dataUrl.length > 1_000_000) {
    throw new Error("The optimized signature is still too large. Please use a simpler image.");
  }

  return dataUrl;
}
