import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, normalize } from "node:path";

const root = join(process.cwd(), "dist/client");
const BASE = process.env.GH_PAGES_BASE || "/samguchi";
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".txt": "text/plain",
};

async function tryFile(filePath) {
  try {
    const s = await stat(filePath);
    if (s.isFile()) return filePath;
  } catch {}
  return null;
}

const server = createServer(async (req, res) => {
  let url = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  if (url.startsWith(BASE)) url = url.slice(BASE.length);
  if (!url.startsWith("/")) url = "/" + url;
  let filePath = join(root, url === "/" ? "index.html" : url);
  let found = await tryFile(filePath);
  if (!found && url.endsWith("/")) found = await tryFile(join(root, url, "index.html"));
  if (!found) found = await tryFile(filePath + ".html");
  if (!found) found = await tryFile(join(root, "404.html"));
  if (found) {
    const data = await readFile(found);
    res.writeHead(200, { "content-type": MIME[extname(found)] || "application/octet-stream" });
    res.end(data);
  } else {
    res.writeHead(404);
    res.end("not found");
  }
});

await new Promise((r) => server.listen(4815, r));
console.log("listening on 4815");

const paths = [
  "/samguchi/",
  "/samguchi",
  "/samguchi/menu",
  "/samguchi/menu/",
  "/samguchi/nosotros",
  "/samguchi/contacto",
  "/samguchi/admin",
  "/samguchi/favicon.ico",
];

for (const p of paths) {
  const res = await fetch("http://localhost:4815" + p);
  console.log(p, "->", res.status, res.headers.get("content-type"));
}

// extraer asset URLs del index y comprobarlos
const html = await (await fetch("http://localhost:4815/samguchi/")).text();
const assetRefs = [...html.matchAll(/(?:src|href)="(\/samguchi\/[^"]+)"/g)].map((m) => m[1]);
for (const a of assetRefs) {
  const res = await fetch("http://localhost:4815" + a);
  if (res.status !== 200) console.log("FALLA asset:", a, res.status);
}
console.log("assets probados:", assetRefs.length);

server.close();