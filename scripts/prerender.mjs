import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";

const root = process.cwd();
const outDir = resolve(root, "dist/client");
const mod = await import(pathToFileURL(resolve(root, "dist/server/server.js")).href);
const handler = mod.default ?? mod;

const routes = ["/", "/menu", "/nosotros", "/contacto", "/admin"];
const BASE = process.env.GH_PAGES_BASE || "/samguchi";

// Bypass Jekyll static file processing on GitHub Pages
await writeFile(resolve(outDir, ".nojekyll"), "");

async function render(urlPath) {
  let req = new Request(`http://localhost${BASE}${urlPath === "/" ? "/" : urlPath}`, {
    headers: { host: "localhost" },
    redirect: "manual",
  });
  let res = await handler.fetch(req, {}, {});
  // follow 3xx redirects (e.g. "/samguchi" -> "/samguchi/")
  for (let i = 0; i < 5 && res.status >= 300 && res.status < 400; i++) {
    const location = res.headers.get("location");
    req = new Request(new URL(location, req.url), { headers: { host: "localhost" }, redirect: "manual" });
    res = await handler.fetch(req, {}, {});
  }
  const html = await res.text();
  return { status: res.status, html };
}

for (const route of routes) {
  const { status, html } = await render(route);
  console.log(`${route} -> ${status} (${html.length} chars)`);
  if (status !== 200) {
    console.log("----  HEAD (first 300 chars) ----");
    console.log(html.slice(0, 300));
  }
}

await mkdir(resolve(outDir, "menu"), { recursive: true });
await mkdir(resolve(outDir, "nosotros"), { recursive: true });
await mkdir(resolve(outDir, "contacto"), { recursive: true });
await mkdir(resolve(outDir, "admin"), { recursive: true });

const index = await render("/");
await writeFile(resolve(outDir, "index.html"), index.html);
await writeFile(resolve(outDir, "404.html"), index.html);
const menu = await render("/menu");
await writeFile(resolve(outDir, "menu/index.html"), menu.html);
await writeFile(resolve(outDir, "menu.html"), menu.html);
const nosotros = await render("/nosotros");
await writeFile(resolve(outDir, "nosotros/index.html"), nosotros.html);
await writeFile(resolve(outDir, "nosotros.html"), nosotros.html);
const contacto = await render("/contacto");
await writeFile(resolve(outDir, "contacto/index.html"), contacto.html);
await writeFile(resolve(outDir, "contacto.html"), contacto.html);
const admin = await render("/admin");
await writeFile(resolve(outDir, "admin/index.html"), admin.html);
await writeFile(resolve(outDir, "admin.html"), admin.html);

console.log("\nPrerender done.");