import { mkdir, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));

const jobs = [
  {
    input: "src/assets/Partnership/Icon-berkarya.png",
    variants: [["src/assets/Partnership/optimized/berkarya-192.avif", 192]],
    format: "avif",
    quality: 45,
  },
  ...[
    ["ITB.png", "itb"],
    ["UI.png", "ui"],
    ["PNP.png", "pnp"],
    ["Ma Chung.png", "ma-chung"],
    ["PU.webp", "president-university"],
    ["UTB.png", "utb"],
  ].map(([source, name]) => ({
    input: `src/assets/Partnership/${source}`,
    variants: [[`src/assets/Partnership/optimized/${name}-112.avif`, 112]],
    format: "avif",
    quality: 42,
  })),
  {
    input: "src/assets/Purpose/meeting.jpg",
    variants: [
      ["src/assets/Purpose/meeting-480.webp", 480],
      ["src/assets/Purpose/meeting-768.webp", 768],
      ["src/assets/Purpose/meeting-1024.webp", 1024],
    ],
    format: "webp",
    quality: 76,
  },
  {
    input: "src/assets/Navbar/mahreen-logo.png",
    variants: [
      ["public/mahreen-logo-192.webp", 192],
      ["public/mahreen-logo-224.webp", 224],
      ["public/mahreen-logo-256.webp", 256],
      ["public/mahreen-logo-384.webp", 384],
    ],
    format: "webp",
    quality: 58,
  },
  {
    input: "src/assets/Hero-section/baground-home.webp",
    variants: [
      ["public/hero-home-mobile.webp", 768],
      ["public/hero-home.webp", 1440],
    ],
    format: "webp",
    quality: 78,
  },
  {
    input: "src/assets/Newsroom/featured-building.webp",
    variants: [
      ["src/assets/Newsroom/optimized/featured-building-480.avif", 480],
      ["src/assets/Newsroom/optimized/featured-building-768.avif", 768],
    ],
    format: "avif",
    quality: 44,
  },
];

let sourceBytes = 0;
let generatedBytes = 0;

for (const job of jobs) {
  const inputPath = resolve(projectRoot, job.input);
  sourceBytes += (await stat(inputPath)).size;

  for (const [output, width] of job.variants) {
    const outputPath = resolve(projectRoot, output);
    await mkdir(dirname(outputPath), { recursive: true });
    const image = sharp(inputPath)
      .rotate()
      .resize({ width, withoutEnlargement: true });

    if (job.format === "avif") {
      await image
        .avif({
          quality: job.quality,
          effort: 7,
          chromaSubsampling: "4:4:4",
        })
        .toFile(outputPath);
    } else {
      await image
        .webp({
          quality: job.quality,
          alphaQuality: 80,
          effort: 6,
          smartSubsample: true,
        })
        .toFile(outputPath);
    }

    const outputBytes = (await stat(outputPath)).size;
    generatedBytes += outputBytes;
    console.log(`${output}: ${(outputBytes / 1024).toFixed(1)} KiB`);
  }
}

console.log(
  `Responsive image set generated: ${(sourceBytes / 1024).toFixed(1)} KiB source -> ${(generatedBytes / 1024).toFixed(1)} KiB across all responsive variants.`,
);
