import { readdir, readFile, stat, unlink, writeFile } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const assetRoot = fileURLToPath(new URL("../src/assets/", import.meta.url));
const shouldApply = process.argv.includes("--apply");
const shouldPrune = process.argv.includes("--prune-unused");
const minimumBytes = Number(
  process.argv.find((item) => item.startsWith("--min-kb="))?.split("=")[1] ??
    150,
) * 1024;

const rasterExtensions = new Set([".png", ".jpg", ".jpeg"]);
const textExtensions = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".css",
  ".scss",
  ".html",
  ".json",
  ".xml",
  ".txt",
]);

const walk = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? walk(path) : [path];
    }),
  );
  return files.flat();
};

const escapeRegExp = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getAssetNamePattern = (fileName, flags = "") =>
  new RegExp(
    `(?<![A-Za-z0-9_-])${escapeRegExp(fileName)}(?![A-Za-z0-9_-])`,
    flags,
  );

const sourceFiles = [
  ...(await walk(fileURLToPath(new URL("../src/", import.meta.url)))),
  ...(await walk(fileURLToPath(new URL("../public/", import.meta.url)))),
  fileURLToPath(new URL("../index.html", import.meta.url)),
].filter((path) => textExtensions.has(extname(path).toLowerCase()));

const textContents = new Map(
  await Promise.all(
    sourceFiles.map(async (path) => [path, await readFile(path, "utf8")]),
  ),
);

const imageFiles = (await walk(assetRoot))
  .filter((path) => rasterExtensions.has(extname(path).toLowerCase()))
  .map((path) => ({ path, extension: extname(path).toLowerCase() }));

const candidates = [];
for (const image of imageFiles) {
  const imageStat = await stat(image.path);
  if (imageStat.size < minimumBytes) continue;
  candidates.push({ ...image, size: imageStat.size });
}

let convertedCount = 0;
let removedCount = 0;
let rewrittenCount = 0;
let originalBytes = 0;
let optimizedBytes = 0;

for (const candidate of candidates) {
  const sourceName = candidate.path.split("/").at(-1);
  const targetName = sourceName.replace(/\.(?:png|jpe?g)$/i, ".webp");
  const targetPath = candidate.path.replace(/\.(?:png|jpe?g)$/i, ".webp");
  const referencingFiles = [...textContents.entries()]
    .filter(([, content]) => getAssetNamePattern(sourceName).test(content))
    .map(([path]) => path);

  if (referencingFiles.length === 0) {
    if (shouldApply && shouldPrune) {
      await unlink(candidate.path);
      removedCount += 1;
      console.log(`Removed unused: ${relative(projectRoot, candidate.path)}`);
    } else {
      console.log(`Unused: ${relative(projectRoot, candidate.path)}`);
    }
    continue;
  }

  let targetSize = 0;
  try {
    targetSize = (await stat(targetPath)).size;
  } catch {
    // The optimized target will be created below.
  }

  if (shouldApply && targetSize === 0) {
    await sharp(candidate.path)
      .rotate()
      .webp({
        quality: 82,
        alphaQuality: 90,
        effort: 5,
        smartSubsample: true,
      })
      .toFile(targetPath);
    targetSize = (await stat(targetPath)).size;
    convertedCount += 1;
  }

  originalBytes += candidate.size;
  optimizedBytes += targetSize || candidate.size;

  if (shouldApply && targetSize > 0) {
    for (const sourcePath of referencingFiles) {
      const currentContent = textContents.get(sourcePath);
      const nextContent = currentContent.replace(
        getAssetNamePattern(sourceName, "g"),
        targetName,
      );
      if (nextContent === currentContent) continue;
      await writeFile(sourcePath, nextContent, "utf8");
      textContents.set(sourcePath, nextContent);
      rewrittenCount += 1;
    }

    if (shouldPrune) {
      await unlink(candidate.path);
      removedCount += 1;
    }
  }

  console.log(
    `${shouldApply ? "Optimized" : "Candidate"}: ${relative(projectRoot, candidate.path)} -> ${relative(projectRoot, targetPath)}`,
  );
}

const savedBytes = Math.max(0, originalBytes - optimizedBytes);
console.log(
  `Summary: ${convertedCount} converted, ${rewrittenCount} references updated, ${removedCount} originals removed, ${(savedBytes / 1024 / 1024).toFixed(2)} MiB saved.`,
);

if (!shouldApply) {
  console.log("Dry run only. Add --apply to write optimized files.");
}
