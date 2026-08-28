import { readFile, unlink, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const htmlPath = resolve(projectRoot, "dist/index.html");
const stylesheetPattern = /<link\s+rel="stylesheet"\s+crossorigin\s+href="(\/assets\/index-[^"]+\.css)">/g;

let html = await readFile(htmlPath, "utf8");
const stylesheetLinks = [...html.matchAll(stylesheetPattern)];

if (stylesheetLinks.length !== 1) {
  throw new Error(
    `Expected one entry stylesheet in dist/index.html, found ${stylesheetLinks.length}.`,
  );
}

for (const match of stylesheetLinks) {
  const publicPath = match[1];
  const cssPath = resolve(projectRoot, `dist${publicPath}`);
  const css = (await readFile(cssPath, "utf8")).replaceAll("</style", "<\\/style");

  html = html.replace(
    match[0],
    `<style data-entry-css>${css}</style>`,
  );

  await unlink(cssPath);
}

await writeFile(htmlPath, html, "utf8");
console.log("Inlined the entry stylesheet and removed its render-blocking request.");
