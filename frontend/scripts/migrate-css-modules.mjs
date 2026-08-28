/**
 * CSS Modules migration script v2.
 * Handles the pattern: const xxxStyles = `...`; ... <style data-component="...">{xxxStyles}</style>
 *
 * Usage: node migrate-css-modules.mjs <file.tsx>
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { basename, dirname, join } from "path";

const filePath = process.argv[2];
if (!filePath) {
  console.error("Usage: node migrate-css-modules.mjs <file.tsx>");
  process.exit(1);
}

const content = readFileSync(filePath, "utf-8");
const dir = dirname(filePath);
const name = basename(filePath, ".tsx");
const cssPath = join(dir, `${name}.module.css`);

if (existsSync(cssPath)) {
  console.log(`SKIP: ${cssPath} already exists`);
  process.exit(0);
}

// Pattern 1: <style data-component="...">{varName}</style>
// Pattern 2: <style>{varName}</style>
const styleRefRegex = /<style(?:\s+data-component="[^"]*")?>\s*\{(\w+)\}\s*<\/style>/;
const styleRefMatch = content.match(styleRefRegex);

if (!styleRefMatch) {
  console.log(`SKIP: No style reference found in ${filePath}`);
  process.exit(0);
}

const varName = styleRefMatch[1];

// Find the CSS string constant: const varName = `...`;
// Handle multi-line template literals
const constRegex = new RegExp(`const\\s+${varName}\\s*=\\s*\`([\\s\\S]*?)\`;`);
const constMatch = content.match(constRegex);

if (!constMatch) {
  console.log(`SKIP: Could not find CSS constant '${varName}' in ${filePath}`);
  process.exit(0);
}

const cssContent = constMatch[1].trim();
if (!cssContent) {
  console.log(`SKIP: Empty CSS in ${filePath}`);
  process.exit(0);
}

// Write CSS module file
writeFileSync(cssPath, cssContent + "\n");
console.log(`CREATED: ${cssPath}`);

// Update TSX file
let updated = content;

// Remove the CSS string constant
updated = updated.replace(constRegex, "");

// Remove the <style> tag reference
updated = updated.replace(/<style(?:\s+data-component="[^"]*")?>\s*\{\w+\}\s*<\/style>\s*/, "");

// Handle style-only exports: export const XxxStyles = () => <style>{...}</style>;
const styleExportRegex = /export\s+const\s+(\w+Styles)\s*=\s*\(\)\s*=>\s*<style[^>]*>\s*\{\w+\}\s*<\/style>\s*;/;
if (styleExportRegex.test(updated)) {
  updated = updated.replace(styleExportRegex, 'export const $1 = () => null;');
}

// Add import for CSS module after the last import statement
if (!updated.includes(`import styles from "./${name}.module.css"`)) {
  const importRegex = /^(import\s+.+from\s+["'][^"']+["'];?\s*)/gm;
  let lastImportEnd = 0;
  let m;
  while ((m = importRegex.exec(updated)) !== null) {
    lastImportEnd = m.index + m[0].length;
  }
  if (lastImportEnd > 0) {
    const before = updated.substring(0, lastImportEnd);
    const after = updated.substring(lastImportEnd);
    updated = before + `\nimport styles from "./${name}.module.css";` + after;
  }
}

// Replace simple className="block" with className={styles["block"]}
updated = updated.replace(
  /className="([a-z][a-z0-9-]*(?:__[a-z0-9-]+)*(?:--[a-z0-9-]+)*)"/g,
  (match, className) => `className={styles["${className}"]}`
);

writeFileSync(filePath, updated);
console.log(`UPDATED: ${filePath}`);
