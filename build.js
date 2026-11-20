const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const dist = path.join(root, "dist");

const files = [
  "index.html",
  "love-blueprint.html",
  "happy-together.html",
  "happy-together.css",
  "happy-together.js",
  "team-love.html",
  "team-love.css",
  "team-love.js",
  "oracle-dunerivealautre.html",
  "tirage.html",
  "oracle.css",
  "tirage.js",
  "mentions-legales.html",
  "conditions-generales-de-vente.html",
  "politique-confidentialite.html",
  "styles.css",
  "script.js",
  "analytics.js",
  "favicon.svg",
];

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const file of files) {
  if (file.endsWith(".html")) {
    const html = fs.readFileSync(path.join(root, file), "utf8");
    fs.writeFileSync(path.join(dist, file), html.replace("</head>", '<script src="/analytics.js" defer></script>\n  </head>'));
  } else {
    fs.copyFileSync(path.join(root, file), path.join(dist, file));
  }
}

fs.cpSync(path.join(root, "assets"), path.join(dist, "assets"), { recursive: true });
