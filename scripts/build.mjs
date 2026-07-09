import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");
const files = ["index.html", "styles.css", "app.js"];

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

await Promise.all(files.map((file) => cp(resolve(root, file), resolve(dist, file))));
await writeFile(resolve(dist, ".nojekyll"), "");

console.log(`Built ${files.length} static files into dist/`);
