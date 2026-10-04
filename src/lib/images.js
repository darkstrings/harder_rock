// Resolves "asset:<name>" references to bundled image URLs.
const cabinImages = import.meta.glob("../assets/cabins/*.webp", { eager: true, query: "?url", import: "default" });
const avatarImages = import.meta.glob("../assets/avatars/*.webp", { eager: true, query: "?url", import: "default" });

const assets = {};
for (const [path, url] of Object.entries({ ...cabinImages, ...avatarImages })) {
  assets[path.split("/").pop().replace(".webp", "")] = url;
}

export const BUILT_IN_AVATARS = Object.keys(assets)
  .filter((k) => k.startsWith("user"))
  .map((k) => `asset:${k}`);

export function resolveImage(src) {
  if (!src) return null;
  if (typeof src === "string" && src.startsWith("asset:")) return assets[src.slice(6)] ?? null;
  return src;
}

/** Reads an image File, downsizes it in a canvas and returns a compact JPEG data URL. */
export function fileToDataUrl(file, maxSize = 960, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("That file doesn't look like an image."));
    };
    img.src = url;
  });
}
