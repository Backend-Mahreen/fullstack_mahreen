const MAX_SOURCE_SIZE = 8 * 1024 * 1024;

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Gambar tidak dapat dibaca."));
    reader.readAsDataURL(file);
  });

export const optimizeServiceImage = async (
  file: File,
  variant: "thumbnail" | "gallery",
) => {
  if (!file.type.startsWith("image/")) {
    throw new Error("File harus menggunakan format gambar.");
  }
  if (file.size > MAX_SOURCE_SIZE) {
    throw new Error("Ukuran gambar maksimal 8 MB per file.");
  }
  if (file.type === "image/svg+xml" || typeof createImageBitmap === "undefined") {
    return readFileAsDataUrl(file);
  }

  const bitmap = await createImageBitmap(file);
  try {
    const maxWidth = variant === "thumbnail" ? 1200 : 1000;
    const maxHeight = variant === "thumbnail" ? 800 : 1000;
    const ratio = Math.min(1, maxWidth / bitmap.width, maxHeight / bitmap.height);
    const width = Math.max(1, Math.round(bitmap.width * ratio));
    const height = Math.max(1, Math.round(bitmap.height * ratio));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return readFileAsDataUrl(file);
    context.drawImage(bitmap, 0, 0, width, height);
    return canvas.toDataURL("image/webp", variant === "thumbnail" ? 0.84 : 0.8);
  } finally {
    bitmap.close();
  }
};
