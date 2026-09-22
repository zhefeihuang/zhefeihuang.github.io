import { readFile, writeFile } from "node:fs/promises";

const stylesheets = [
  "style.css",
  "refine.css",
  "final.css",
  "polish.css",
  "mobile-zh.css",
  "interaction-fix.css",
  "immanent-entry.css",
  "immanent-home-polish.css",
  "home-floating-scale.css",
  "site-protection.css",
  "home-current-fix.css",
  "home-readability-final.css",
  "home-bg-darken.css",
  "home-info-tune.css",
  "home-alignment-final.css"
];

const cssDirectory = new URL("../css/", import.meta.url);
const files = await Promise.all(stylesheets.map((name) => readFile(new URL(name, cssDirectory), "utf8")));
const bundle = files
  .map((css) => css.replace(/^@charset\s+["']UTF-8["'];\s*/i, "").trimEnd())
  .join("\n\n");

await writeFile(new URL("home-bundle.css", cssDirectory), `${bundle}\n`, "utf8");
