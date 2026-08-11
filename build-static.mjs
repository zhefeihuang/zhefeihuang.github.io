import { cp, mkdir, rm, writeFile } from "node:fs/promises";

const root = new URL("./", import.meta.url);
const dist = new URL("./dist/", root);
const client = new URL("./client/", dist);
const entries = [
  "index.html",
  "css",
  "js",
  "images",
  "videos",
  "audio",
  "projects"
];

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await mkdir(client, { recursive: true });
await mkdir(new URL("./server/", dist), { recursive: true });
await cp(new URL(".openai", root), new URL(".openai", dist), { recursive: true });

for (const entry of entries) {
  await cp(new URL(entry, root), new URL(entry, client), { recursive: true });
}

await writeFile(
  new URL("./server/index.js", dist),
  `export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const assetResponse = await env.ASSETS.fetch(request);

    if (assetResponse.status !== 404 || url.pathname.includes(".")) {
      return assetResponse;
    }

    return env.ASSETS.fetch(new Request(new URL("/index.html", url), request));
  }
};
`,
  "utf8"
);
