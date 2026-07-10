#!/usr/bin/env node
/**
 * build-cv.mjs — render the built /cv page to public + dist /files/cv.pdf.
 *
 * Runs AFTER `astro build`. Serves ./dist over http (so absolute asset paths and
 * the self-hosted-via-CDN fonts resolve), loads /cv in headless Chromium, and
 * prints a Letter-size PDF. Because /cv is generated from the site's own data,
 * the PDF regenerates on every build → the CV auto-updates with the website.
 *
 * Local (this repo): Chromium is found automatically via PLAYWRIGHT_BROWSERS_PATH.
 * CI: `npx playwright install chromium` first (see deploy.yml).
 */
import http from "node:http";
import { readFile, mkdir, copyFile } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { join, extname, resolve } from "node:path";

const DIST = resolve("dist");
const OUT_DIST = join(DIST, "files", "cv.pdf");
const OUT_PUBLIC = resolve("public", "files", "cv.pdf");

const MIME = {
  ".html": "text/html", ".css": "text/css", ".js": "text/javascript",
  ".woff2": "font/woff2", ".woff": "font/woff", ".png": "image/png",
  ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".json": "application/json",
  ".ico": "image/x-icon", ".webp": "image/webp",
};

function serve(rootDir) {
  return new Promise((res) => {
    const server = http.createServer(async (req, resp) => {
      try {
        let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
        if (p.endsWith("/")) p += "index.html";
        let file = join(rootDir, p);
        // directory (e.g. /cv → dist/cv/) → serve its index.html
        if (existsSync(file) && statSync(file).isDirectory())
          file = join(file, "index.html");
        else if (!existsSync(file) && existsSync(file + ".html")) file += ".html";
        else if (!existsSync(file) && existsSync(join(rootDir, p, "index.html")))
          file = join(rootDir, p, "index.html");
        const body = await readFile(file);
        resp.writeHead(200, { "Content-Type": MIME[extname(file)] || "application/octet-stream" });
        resp.end(body);
      } catch {
        resp.writeHead(404); resp.end("not found");
      }
    });
    server.listen(0, "127.0.0.1", () => res(server));
  });
}

const { chromium } = await import("playwright");

// Prefer a pre-installed Chromium (this environment ships one and blocks re-downloads);
// fall back to Playwright's managed browser (e.g. after `npx playwright install chromium` in CI).
function findChromium() {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH;
  if (base && existsSync(base)) {
    for (const d of require("node:fs").readdirSync(base)) {
      if (!d.startsWith("chromium-")) continue;
      const p = join(base, d, "chrome-linux", "chrome");
      if (existsSync(p)) return p;
    }
  }
  return undefined;
}
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const executablePath = findChromium();

const server = await serve(DIST);
const port = server.address().port;
const url = `http://127.0.0.1:${port}/cv`;
console.log(`build-cv: serving dist on ${port}, rendering ${url}`);

const browser = await chromium.launch(executablePath ? { executablePath } : {});
if (executablePath) console.log(`build-cv: using Chromium at ${executablePath}`);
try {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  // Ensure web fonts are fully applied before printing.
  try { await page.evaluate(() => document.fonts && document.fonts.ready); } catch {}
  await mkdir(join(DIST, "files"), { recursive: true });
  await page.pdf({
    path: OUT_DIST,
    format: "Letter",
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });
  // Optional full-page PNG preview (for visual review; not part of the deploy).
  if (process.env.CV_PREVIEW) {
    await page.screenshot({ path: process.env.CV_PREVIEW, fullPage: true });
    console.log(`build-cv: preview → ${process.env.CV_PREVIEW}`);
  }
  // Keep a copy in public/ too, so `astro dev`/previews and the source tree have it.
  await mkdir(resolve("public", "files"), { recursive: true });
  await copyFile(OUT_DIST, OUT_PUBLIC);
  console.log(`build-cv: wrote ${OUT_DIST} and ${OUT_PUBLIC}`);
} finally {
  await browser.close();
  server.close();
}
