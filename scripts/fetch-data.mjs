import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const token = process.env.GH_PAT || process.env.WEBSITE_DISPATCH_TOKEN;

const repos = {
  inflation: 'mokhtartabari/inflation-data-viz',
  gdp: 'mokhtartabari/gdp-data-viz'
};

async function syncTopic(topic, repo) {
  const manifestPath = path.join(rootDir, 'src', 'data', `charts-manifest-${topic}.json`);
  const chartsDir = path.join(rootDir, 'public', 'charts', topic);
  
  if (!fs.existsSync(chartsDir)) fs.mkdirSync(chartsDir, { recursive: true });

  const headers = {};
  if (token) headers['Authorization'] = `token ${token}`;

  let manifestData;
  try {
    console.log(`Fetching manifest for ${topic}...`);
    const manifestUrl = `https://raw.githubusercontent.com/${repo}/main/charts-manifest.json`;
    const res = await fetch(manifestUrl, { headers });
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

  // Download charts
  for (const chart of manifestData.charts || []) {
    if (!chart.url) continue;
    const dest = path.join(chartsDir, chart.filename);
    try {
      const res = await fetch(chart.url, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const arrayBuffer = await res.arrayBuffer();
      fs.writeFileSync(dest, Buffer.from(arrayBuffer));
      console.log(`  ✓ ${chart.filename}`);
    } catch (err) {
      console.error(`  ✗ Failed to download ${chart.filename}: ${err.message}`);
    }
  }
}

async function main() {
  for (const [topic, repo] of Object.entries(repos)) {
    await syncTopic(topic, repo);
  }
}

main().catch(console.error);
