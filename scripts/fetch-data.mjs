import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const token = process.env.GH_PAT || process.env.WEBSITE_DISPATCH_TOKEN;

const repos = {
  inflation: 'mokhtartabari/inflation-data-viz',
  gdp: 'mokhtartabari/gdp-data-viz',
  trade: 'mokhtartabari/trade-data-viz',
  employment: 'mokhtartabari/employment-data-viz'
};

// The data-viz repos are private. raw.githubusercontent.com does NOT accept
// fine-grained PATs for private content, so we use the GitHub contents API
// (api.github.com/.../contents/<path>) with Accept: application/vnd.github.raw,
// which returns the raw bytes and works with fine-grained PATs.
const apiUrl = (repo, filePath) =>
  `https://api.github.com/repos/${repo}/contents/${filePath}`;

console.log(`[fetch-data] auth token present: ${!!token}`);

async function syncTopic(topic, repo) {
  const manifestPath = path.join(rootDir, 'src', 'data', `charts-manifest-${topic}.json`);
  const chartsDir = path.join(rootDir, 'public', 'charts', topic);

  if (!fs.existsSync(chartsDir)) fs.mkdirSync(chartsDir, { recursive: true });

  const headers = { Accept: 'application/vnd.github.raw' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let manifestData;
  try {
    console.log(`Fetching manifest for ${topic}...`);
    const res = await fetch(apiUrl(repo, 'charts-manifest.json'), { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    manifestData = await res.json();
    fs.writeFileSync(manifestPath, JSON.stringify(manifestData, null, 2));
    console.log(`✅ ${topic} manifest saved (${manifestData.charts?.length || 0} charts).`);
  } catch (err) {
    console.warn(`⚠️  Failed to fetch ${topic} manifest: ${err.message}`);
    if (!fs.existsSync(manifestPath)) {
      console.log(`Writing empty stub for ${topic} manifest...`);
      fs.writeFileSync(manifestPath, JSON.stringify({ topic, updated: null, charts: [] }, null, 2));
    }
    return;
  }

  // Download every available format for each chart (PNG always; SVG/PDF when
  // present). All formats live at the data-viz repo root sharing the same base
  // name, so path = `<base>.<ext>`.
  for (const chart of manifestData.charts || []) {
    if (!chart.filename) continue;
    const base = chart.filename.replace(/\.png$/i, '');
    const formats = chart.formats?.length ? chart.formats : ['png'];
    for (const ext of formats) {
      const fname = `${base}.${ext}`;
      const dest = path.join(chartsDir, fname);
      try {
        const res = await fetch(apiUrl(repo, fname), { headers });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const arrayBuffer = await res.arrayBuffer();
        fs.writeFileSync(dest, Buffer.from(arrayBuffer));
        console.log(`  ✓ ${fname}`);
      } catch (err) {
        console.error(`  ✗ Failed to download ${fname}: ${err.message}`);
      }
    }
    // Extra artifacts: interactive widget (HTML) and underlying data (CSV).
    const extras = [];
    if (chart.interactive) extras.push(`${base}_interactive.html`);
    if (chart.csv) extras.push(`${base}.csv`);
    for (const fname of extras) {
      try {
        const res = await fetch(apiUrl(repo, fname), { headers });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const dest = path.join(chartsDir, fname);
        if (fname.endsWith("_interactive.html")) {
          // Hide ggiraph's whole in-chart toolbar (zoom/lasso/save) — the site
          // provides its own fit/full-size toggle + Download menu, identical to
          // static charts. Injected here so it applies on every build without
          // regenerating the widgets.
          let html = await res.text();
          const css = "<style>.ggiraph-toolbar{display:none!important}" +
            // girafe paints an opaque white background rect; make it transparent
            // so the page's paper bg shows. Plus hide the toolbar + clear body bg.
            ".ggiraph-svg-bg{fill:transparent!important;stroke:none!important}" +
            "html,body{background:transparent!important;margin:0}</style>";
          html = html.includes("</head>") ? html.replace("</head>", `${css}</head>`) : css + html;
          fs.writeFileSync(dest, html);
        } else {
          fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
        }
        console.log(`  ✓ ${fname}`);
      } catch (err) {
        console.error(`  ✗ Failed to download ${fname}: ${err.message}`);
      }
    }
  }
}

async function main() {
  for (const [topic, repo] of Object.entries(repos)) {
    await syncTopic(topic, repo);
  }
}

main().catch(console.error);
