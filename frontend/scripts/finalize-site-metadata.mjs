import { readFile, writeFile } from "node:fs/promises";
import { fallbackSiteUrl, getSiteUrl } from "./site-origin.mjs";

const indexUrl = new URL("../dist/index.html", import.meta.url);
const siteUrl = getSiteUrl();
const html = await readFile(indexUrl, "utf8");

await writeFile(indexUrl, html.replaceAll(fallbackSiteUrl, siteUrl), "utf8");

console.log(`Finalized canonical and social metadata for ${siteUrl}.`);
