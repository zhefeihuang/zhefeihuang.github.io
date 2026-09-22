import { readFile, writeFile } from "node:fs/promises";

const scripts = [
  "cursor-effects.js",
  "main.js",
  "home-float-tune.js",
  "home-mobile-spacing-final.js",
  "home-performance-fix.js",
  "interaction-fix.js",
  "site-protection.js"
];

const jsDirectory = new URL("../js/", import.meta.url);
const files = await Promise.all(scripts.map((name) => readFile(new URL(name, jsDirectory), "utf8")));
const bundle = files.map((js) => js.trimEnd()).join("\n;\n");

await writeFile(new URL("home-bundle.js", jsDirectory), `${bundle}\n`, "utf8");
