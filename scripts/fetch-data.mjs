import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Load environment variables from .env file if it exists (for local development)
try {
  const envPath = path.join(rootDir, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const index = trimmed.indexOf('=');
      if (index > 0) {
        const key = trimmed.substring(0, index).trim();
        let val = trimmed.substring(index + 1).trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        else if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    });
  }
} catch (err) {
  console.warn(`[fetch-data] Could not read .env: ${err.message}`);
}

const token = process.env.GH_PAT || process.env.WEBSITE_DISPATCH_TOKEN;

const repos = {
  inflation: 'mokhtartabari/inflation-data-viz',
  gdp: 'mokhtartabari/gdp-data-viz',
  trade: 'mokhtartabari/trade-data-viz',
  employment: 'mokhtartabari/employment-data-viz',
  productivity: 'mokhtartabari/productivity-data-viz',
  rates: 'mokhtartabari/rates-data-viz',
  housing: 'mokhtartabari/housing-data-viz'
};

// The data-viz repos are private. raw.githubusercontent.com does NOT accept
// fine-grained PATs for private content, so we use the GitHub contents API
// (api.github.com/.../contents/<path>) with Accept: application/vnd.github.raw,
// which returns the raw bytes and works with fine-grained PATs.
const apiUrl = (repo, filePath) =>
  `https://api.github.com/repos/${repo}/contents/${filePath}`;

console.log(`[fetch-data] auth token present: ${!!token}`);

async function logPipeline(pipelineName, status, message, durationSeconds) {
  const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn(`[fetch-data] Supabase URL or Anon Key is missing. Skipping pipeline log for ${pipelineName}.`);
    return;
  }

  try {
    const url = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/pipeline_logs`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        pipeline_name: pipelineName,
        status: status,
        message: message,
        duration_seconds: Math.round(durationSeconds)
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[fetch-data] Failed to write pipeline log to Supabase: ${res.status} ${errText}`);
    } else {
      console.log(`[fetch-data] Logged ${pipelineName} status (${status}) to Supabase.`);
    }
  } catch (err) {
    console.error(`[fetch-data] Error sending pipeline log: ${err.message}`);
  }
}

async function syncTopic(topic, repo) {
  const startTime = performance.now();
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
    const duration = (performance.now() - startTime) / 1000;
    await logPipeline(topic, 'failure', `Failed to fetch manifest: ${err.message}`, duration);
    return;
  }

  let downloadedCount = 0;
  let failedCount = 0;

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
        downloadedCount++;
      } catch (err) {
        console.error(`  ✗ Failed to download ${fname}: ${err.message}`);
        failedCount++;
      }
    }
    // Underlying data (CSV) download, when the chart has one.
    if (chart.csv) {
      const fname = `${base}.csv`;
      try {
        const res = await fetch(apiUrl(repo, fname), { headers });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        fs.writeFileSync(path.join(chartsDir, fname), Buffer.from(await res.arrayBuffer()));
        console.log(`  ✓ ${fname}`);
        downloadedCount++;
      } catch (err) {
        console.error(`  ✗ Failed to download ${fname}: ${err.message}`);
        failedCount++;
      }
    }
  }

  const duration = (performance.now() - startTime) / 1000;
  const status = failedCount === 0 ? 'success' : 'failure';
  const message = `Synced ${manifestData.charts?.length || 0} charts. Downloaded ${downloadedCount} assets${failedCount > 0 ? `, ${failedCount} failed` : ''}.`;
  await logPipeline(topic, status, message, duration);
}

async function main() {
  const startTime = performance.now();
  let overallSuccess = true;
  let overallMessage = '';

  for (const [topic, repo] of Object.entries(repos)) {
    try {
      await syncTopic(topic, repo);
    } catch (err) {
      overallSuccess = false;
      overallMessage += `${topic} failed: ${err.message}. `;
    }
  }

  const duration = (performance.now() - startTime) / 1000;
  if (overallSuccess) {
    await logPipeline('all', 'success', 'All pipelines completed successfully.', duration);
  } else {
    await logPipeline('all', 'failure', `Pipeline run failed: ${overallMessage}`, duration);
  }
}

main().catch(console.error);
