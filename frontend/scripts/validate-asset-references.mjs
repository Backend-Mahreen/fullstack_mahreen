import { access, readFile, readdir } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const sourceRoot = fileURLToPath(new URL("../src/", import.meta.url));
const textExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".css"]);

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

const sourceFiles = (await walk(sourceRoot)).filter((path) =>
  textExtensions.has(extname(path).toLowerCase()),
);
const missingReferences = [];
const assetPattern =
  /["']([^"']+\.(?:avif|gif|jpe?g|png|svg|webp))["']/gi;

for (const sourceFile of sourceFiles) {
  const content = await readFile(sourceFile, "utf8");
  for (const match of content.matchAll(assetPattern)) {
    const assetReference = match[1];
    if (
      !assetReference.startsWith("./") &&
      !assetReference.startsWith("../")
    ) {
      continue;
    }

    const assetPath = resolve(dirname(sourceFile), assetReference);
    try {
      await access(assetPath);
    } catch {
      missingReferences.push(`${sourceFile}: ${assetReference}`);
    }
  }
}

if (missingReferences.length > 0) {
  throw new Error(
    `Missing local asset references:\n${missingReferences.join("\n")}`,
  );
}

console.log(`Asset reference validation passed for ${sourceFiles.length} source files.`);
