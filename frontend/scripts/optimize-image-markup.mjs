import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const sourceRoot = fileURLToPath(new URL("../src/", import.meta.url));
const shouldApply = process.argv.includes("--apply");

const priorityFilePatterns = [
  "/components/Navbar/",
  "/pages/Akun/",
  "/pages/Login/",
  "/pages/Daftar/InformasiDasar.tsx",
  "/pages/CSR/Registration/pages/CSRDetailsPage.tsx",
  "/pages/Mahreen-Studio/LatestCollection/LatestCollection.tsx",
  "/pages/Newsroom/Berita/sections/HeroSection.tsx",
  "/pages/Newsroom/Home/components/NewsroomNavbar.tsx",
  "/pages/Newsroom/RegistrationSuccess/",
  "/pages/Newsroom/WebinarDetail/sections/HeroSection.tsx",
  "/pages/PeduliMahreen/Donasi/DataDonatur.tsx",
  "/pages/TanyaMahreen/Konsultasi/",
];

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

const componentFiles = (await walk(sourceRoot)).filter((path) =>
  path.endsWith(".tsx"),
);

let changedFiles = 0;
let lazyImages = 0;
let asyncImages = 0;

for (const sourceFile of componentFiles) {
  const source = await readFile(sourceFile, "utf8");
  const isPriorityFile = priorityFilePatterns.some((pattern) =>
    sourceFile.includes(pattern),
  );

  const nextSource = source.replace(/<img\b[\s\S]*?>/g, (imageTag) => {
    let attributes = "";

    if (!/\bdecoding\s*=/.test(imageTag)) {
      attributes += ' decoding="async"';
      asyncImages += 1;
    }

    if (
      !isPriorityFile &&
      !/\bloading\s*=/.test(imageTag) &&
      !/\bfetchPriority\s*=/.test(imageTag)
    ) {
      attributes += ' loading="lazy"';
      lazyImages += 1;
    }

    return attributes ? imageTag.replace("<img", `<img${attributes}`) : imageTag;
  });

  if (nextSource === source) continue;
  changedFiles += 1;
  if (shouldApply) await writeFile(sourceFile, nextSource, "utf8");
}

console.log(
  `${shouldApply ? "Updated" : "Would update"} ${changedFiles} files: ${lazyImages} lazy images and ${asyncImages} asynchronous decodes.`,
);

if (!shouldApply) console.log("Dry run only. Add --apply to update JSX files.");
