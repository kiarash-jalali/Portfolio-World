import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const dist = resolve(root, "dist");

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

const requiredEntries = [
  "index.html",
  "src",
  "public",
  "world-lab",
  "robots.txt",
  "sitemap.xml"
];

for (const entry of requiredEntries) {
  await cp(resolve(root, entry), resolve(dist, entry), { recursive: true });
}

// Production owns the custom domain. Portfolio-World intentionally has no CNAME.
await writeFile(resolve(dist, ".nojekyll"), "", "utf8");
console.log("Built Portfolio-World static site to ./dist");
