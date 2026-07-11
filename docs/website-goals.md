# Website improvement goals — loop-ready

Five goals for enhancing this site, written as **agent loops**: each sets an
outcome and a pass/fail check the agent can read, so it closes on its own.
Paste any one into a new Claude Code session and run it as a `/loop` (or wrap
with `/goal`).

## What makes a good loop goal

A goal loop runs an agent against an outcome **until a check validates it** — it
stops when the work is actually done, not on a timer. Each goal below is:

- **Verifiable** — a signal the agent can read: a build exit code, a test suite,
  a linter, a script that diffs output against a fixture, or a browser
  screenshot. ("All axe violations = 0" is verifiable; "make it nicer" isn't.)
- **Scoped** — explicit in-bounds / out-of-bounds so it can't wander.
- **Metric-based** — a concrete numeric target where possible.
- **Bounded** — stops when validated *or* when genuinely stuck (log the blocker;
  don't spin).

**Stack facts the checks rely on:** Astro 5 static build (`npm run build` → `dist`,
`npx astro check` for types; no test/lint scripts yet), Tailwind v4 in
`src/styles/global.css`, chart PNGs fetched at build from the private `*-data-viz`
repos, chart manifest driven by `canadianeconomy/publish.yml` + `code/qa_charts.R`,
Supabase client-side analytics, GitHub Pages deploy via `.github/workflows/deploy.yml`.
Chromium + Playwright are preinstalled (`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`).

**Suggested order:** 5 → 1 → 2 → 4 → 3 (build the regression net first; save the
chart sweep for last since it depends on the StatCan runner block clearing).

---

## Goal 1 — Performance: hit Core Web Vitals targets

- **Goal:** Every key page meets performance thresholds in a production build.
- **Success criteria (metric):** On `home`, one `/charts/[topic]` page, and one
  publication page, Lighthouse (mobile preset) scores **Performance ≥ 95,
  LCP < 2.0s, CLS < 0.1, TBT < 150ms**.
- **In scope:** image dimensions / `loading="lazy"` / responsive `srcset` on chart
  images, deferring the Supabase analytics script, font-loading strategy,
  removing unused CSS/JS.
- **Out of scope:** content, copy, visual design, chart internals.
- **Verification (pass/fail loop):** `npm run build && npx serve dist`, then
  `npx lighthouse <url> --preset=perf --output=json`; parse scores vs thresholds.
- **Stop when:** all thresholds green on all three pages, or a threshold is blocked
  by a documented platform limit.

## Goal 2 — Accessibility: zero WCAG AA violations

- **Goal:** The site is keyboard-navigable and free of automated a11y violations.
- **Success criteria (metric):** `pa11y`/`axe-core` reports **0 errors** at WCAG2AA
  on home, a charts page, a publication page, teaching, and about; every chart
  `<img>` has meaningful `alt`; **dark and light** themes pass contrast.
- **In scope:** alt text, ARIA labels, focus-visible states, heading order,
  contrast tokens in `global.css`.
- **Out of scope:** redesigns, new components.
- **Verification:** `npm run build`, then `npx pa11y-ci` (or `@axe-core/cli`) over
  the built pages in both themes; a Playwright script tabs through header/nav and
  asserts a visible focus ring via screenshot.
- **Stop when:** 0 violations in both themes across all five pages.

## Goal 3 — Chart-type + active-table sweep

- **Goal:** No published chart is a hard-to-read multi-series "spaghetti" line, and
  none sources an **inactive** StatCan table.
- **Success criteria (verifiable):** For every entry in
  `canadianeconomy/publish.yml`: (a) a script confirms the source table is
  **active** via WDS `getCubeMetadata` (no `"inactive"` in the cube title);
  (b) any chart with >6 overlapping series is re-typed to a sorted dot/lollipop,
  slope, or small-multiples; (c) `Rscript code/qa_charts.R` passes and the
  pipeline's `.failed-charts` is empty after a render.
- **In scope:** rewriting line-chart scripts to better types on active tables;
  updating `publish.yml`.
- **Out of scope:** single-metric trend lines and 2–3 series charts (a line is
  correct there — leave them).
- **Verification:** a table-activity check (getCubeMetadata) listing every
  published chart's table + status → must be all-active; then render + `qa_charts.R`
  + `.failed-charts` check.
- **Stop when:** every published chart is on an active table and passes QA; log any
  chart with no active replacement instead of silently dropping it.
- **Note:** started in July 2026 — `province_vs_2019`, `provincial_rgdp_growth`,
  `sector_rgdp_growth`, `sector_unemployment_latest` already re-typed onto active
  tables; the remaining spaghetti (e.g. the sector "comparison_highlighted"
  variants on inactive 36-10-0402) are the next targets.

## Goal 4 — SEO & structured data for an academic profile

- **Goal:** Every page is fully discoverable with valid structured data.
- **Success criteria (metric):** 100% of built pages carry complete OG + Twitter
  meta and valid **JSON-LD** (`Person` for the profile, `ScholarlyArticle` per
  publication, `Dataset` for chart pages); a valid `sitemap.xml` lists every route
  and `robots.txt` references it.
- **In scope:** `BaseLayout` head, per-page JSON-LD, `@astrojs/sitemap`.
- **Out of scope:** content rewriting, backlinks.
- **Verification:** after `npm run build`, a script validates each page's JSON-LD
  against schema.org types and asserts sitemap route coverage == built routes.
- **Stop when:** 0 invalid/missing structured-data blocks and sitemap coverage is
  100%.

## Goal 5 — Durable E2E integrity suite (the reusable check)

- **Goal:** A committed Playwright suite proves the built site has no broken links,
  images, or console errors — a safety net every future loop can reuse.
- **Success criteria (verifiable):** `npx playwright test` is green: crawl of all
  internal links returns **0 non-200s**, every chart `<img>` loads (natural width
  > 0), the analytics + feedback form mount with **0 console errors**, and the
  dark-mode toggle persists across navigation.
- **In scope:** a `tests/e2e/` suite + an `npm run test:e2e` script (Chromium is
  preinstalled at `/opt/pw-browsers`).
- **Out of scope:** changing site behavior to make tests pass without a real fix.
- **Verification:** `npm run build && npm run preview`, then `npx playwright test`;
  the exit code is the loop signal.
- **Stop when:** the suite passes twice consecutively on a clean build.

---

### Sources on the loop method

- Towards Data Science — *How to Create Powerful Loops in Claude Code*
- MindStudio — *Using /goal and /loop for autonomous workflows*
- MindStudio — *Agentic loops: verification, cost, and stopping criteria*
- Claude Code — *Best practices*
