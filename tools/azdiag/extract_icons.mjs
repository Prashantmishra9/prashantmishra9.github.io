// Fallback icon source: renders the official Azure icons repackaged in npm @likec4/icons to plain .svg files.
// Usage: node extract_icons.mjs <likec4-icons-package-dir> <out-dir>
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
const require = createRequire(path.join(process.cwd(), "package.json"));
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
 
const [pkgDir, outDir] = process.argv.slice(2);
const azDir = path.join(pkgDir, "azure");
fs.mkdirSync(outDir, { recursive: true });
let n = 0;
for (const f of fs.readdirSync(azDir).filter((f) => f.endsWith(".js"))) {
  try {
    const mod = await import(pathToFileURL(path.join(azDir, f)).href);
    const svg = renderToStaticMarkup(React.createElement(mod.default));
    fs.writeFileSync(path.join(outDir, f.replace(/\.js$/, ".svg")), svg);
    n++;
  } catch (e) { /* skip icons that fail */ }
}
console.log(`extracted ${n} icons to ${outDir}`);
