const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const dist = path.join(root, "dist");

const files = [
  "index.html",
  "love-blueprint.html",
  "mentions-legales.html",
  "politique-confidentialite.html",
  "styles.css",
  "script.js",
  "favicon.svg",
];

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const file of files) {
  fs.copyFileSync(path.join(root, file), path.join(dist, file));
}

fs.cpSync(path.join(root, "assets"), path.join(dist, "assets"), { recursive: true });
