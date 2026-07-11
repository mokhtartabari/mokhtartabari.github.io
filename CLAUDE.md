# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal academic website for Dr. Mokhtar Tabari (Economist). Built with Astro 5, TypeScript, and Tailwind CSS v4. Deployed to GitHub Pages at `https://mokhtartabari.github.io` (custom domain: `mokhtartabari.ca`).

## Commands

```bash
npm run dev       # Start dev server at http://localhost:4321
npm run build     # Production build → ./dist
npm run preview   # Serve the production build locally
npx astro check   # TypeScript/Astro type checking
```

There are no test or lint scripts. Use `npx astro check` to catch type errors before pushing.

## Architecture

### Content vs. Data

There are two distinct ways content is managed:

**Content Collections** (`src/content/publications/`) — Publications are markdown files with Zod-validated frontmatter, loaded via Astro's Content Collections API. The schema is defined in `src/content.config.ts`.

**Static Data files** (`src/data/`) — Everything else (bio, talks, teaching history, site metadata) lives in plain TypeScript files exported as `const` objects. These are imported directly into pages/components — no collection API involved.

### Page → Data Flow

Pages in `src/pages/` are mostly thin wrappers: they import from `src/data/` or query the publications collection, then render components. Core content is fully resolved at build time (no content APIs at runtime). The only runtime fetch is client-side analytics (views & downloads) querying and updating Supabase.

### Chart data pipeline (this repo hosts the shared workflow)

Charts are generated upstream and fetched at build time — see `canadianeconomy/CLAUDE.md`
for the full architecture. What lives HERE:
- **`.github/workflows/chart-pipeline.yml`** — the reusable (`workflow_call`) production
  pipeline every private `*-data-viz` repo calls. It's hosted in this repo because it's
  public (private repos can `uses:` it with no Actions access settings). Edit pipeline
  behavior here once; all eight topics pick it up.
- **`scripts/fetch-data.mjs`** (`prebuild`/`predev`) — pulls each data-viz repo's
  `charts-manifest.json` + chart assets via the GitHub Contents API (needs `GH_PAT`;
  raw.githubusercontent.com doesn't work with fine-grained PATs on private repos) into
  `src/data/charts-manifest-<topic>.json` + `public/charts/<topic>/` (both gitignored).
- **`deploy.yml`** rebuild triggers: push, `repository_dispatch[charts-updated]` (fired by
  the pipeline after committing fresh charts), manual, and a daily 15:00 UTC backstop cron.

### Chart Analytics & Tracking (Supabase)

Charts on the data pages track impressions (views) and download events using a lightweight client-side script connecting to Supabase:
- **Direct REST Calls**: Done via native browser `fetch()` using the public anonymous key (`PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`), completely avoiding heavy client SDKs.
- **RPC Incrementing**: Updates call the postgres function `increment_chart_metric(slug, metric)` which runs with `security definer` privileges (bypassing RLS write restrictions on the public client).
- **Session Locking**: Active impressions are tracked with an `IntersectionObserver` (1.5-second visible dwell time required) and locked in `sessionStorage` to prevent double-counting.
- **Threshold Limit**: View and download badges are only rendered/visible when their count exceeds `50`.

### Chart design system (single source of truth)

**The visual standard for every chart lives in `canadianeconomy/DESIGN_SYSTEM.md`** (color system,
formats/backgrounds, dimensions, typography, source line/credit, freshness labels). The website
side of it: chart cards render `data_through`/"Updated" (below), and the download menu carries the
format help text + the `Free to use with attribution — CC BY 4.0.` line. Keep website chart UI
consistent with that document.

### Chart freshness labels (`data_through` / `updated`)

Each chart in `charts-manifest-<topic>.json` carries `data_through` (latest data period, e.g.
"Apr 2026" or "2024") and `updated` (ISO date the data last advanced). `src/pages/charts/[topic].astro`
renders a quiet **"Data through …"** line under each chart and a green **"Updated"** pill for ~7 days
(`Date.now() - Date.parse(chart.updated) < 7d`). These fields are produced upstream by the data-viz
runners (`enrich_records()` in `canadianeconomy/code/manifest_helpers.R`) — the website only displays
them, and degrades gracefully if a manifest predates the fields. `ChartEntry` in
`src/data/visualizations.ts` types them as optional.

### Shared Layout

All pages use `src/layouts/BaseLayout.astro`, which handles: `<head>` meta/OG tags, dark mode toggle with `localStorage` persistence, Astro `<ClientRouter>` for view transitions, reveal-on-scroll animation setup, and `<Header>` / `<Footer>` components.

### Styling System

Tailwind v4 is configured via `src/styles/global.css` using `@import "tailwindcss"` (not a config file). Custom tokens are defined in `@theme {}`:
- `ink-*` — neutral color scale (used for text, borders, backgrounds)
- `accent-*` — indigo scale (used for links, highlights)
- `gold-*` — award/highlight color
- Dark mode is toggled via the `.dark` class on `<html>`, using `@custom-variant dark`

The path alias `~/*` maps to `src/*` (configured in `tsconfig.json`).

## Adding Content

### New Publication

Create `src/content/publications/<slug>.md`. Required frontmatter fields:

```yaml
---
title: ""
authors: ["Mokhtar Tabari"]
year: 2025
status: "working-paper"  # published | accepted | revise-and-resubmit | working-paper
abstract: ""
featured: false          # show on homepage hero
order: 0                 # sort order within status group (lower = first)
tags: []
links: []
---
```

Optional fields: `venue`, `venueShort`. Each link in `links` needs `label`, `href`, and `icon` (one of: `pdf`, `doi`, `code`, `data`, `slides`, `media`, `preprint`, `external`).

### Other Content Updates

- **Site metadata / social links**: `src/data/site.ts`
- **Biography / education / awards**: `src/data/about.ts`
- **Conference talks**: `src/data/talks.ts`
- **Teaching history / philosophy**: `src/data/teaching.ts`
- **CV**: replace `public/files/cv.pdf`

## Deployment

Pushing to `main` triggers the GitHub Actions workflow (`.github/workflows/deploy.yml`), which runs `npm ci && npm run build` and deploys `./dist` to GitHub Pages. No manual deployment step is needed.

## Site positioning — academic job search (current)

As of June 2026, Mokhtar applied for a **teaching-focused Visiting Assistant
Professor (VAP)** position. The site is deliberately presented as a
**pure-academic** profile. The following commercial elements were hidden — they
are **intentionally reversible, not dead code; do not delete them**:

- **Consulting.** Removed from the homepage hero, the header nav, and the About
  sidebar. The `/consulting` page (`src/pages/consulting.astro`) is still live
  but **unlinked**.
- **Monetization.** The Stripe "Support" link and GitHub Sponsors were removed
  from `SocialLinks.astro` and the charts-page donation card. Both links
  **remain in `src/data/site.ts`** (`socials.stripe`, `socials.sponsor`), just
  unrendered.
- **Restore plan** (after the search concludes): re-link `/consulting` in the
  header + homepage, and re-render the `site.ts` monetization links.

Academic materials added for the search:

- **CV.** `public/files/cv.pdf` is a **phone-redacted public copy** (the
  submitted/source CV keeps the phone number). Linked from the hero, the About
  page, and the header nav (the nav uses an `external: true` flag to open the
  PDF in a new tab and bypass the ClientRouter). Regenerate the public copy the
  same way if the CV changes — and re-strip the phone.
- **Teaching evidence.** Institution-neutral data lives in `src/data/teaching.ts`
  (`effectiveness`, `studentQuotes`, `peerObservations`, `professionalDevelopment`)
  and renders in the Teaching effectiveness section of `teaching.astro`.
  **USF-tailored statement PDFs were intentionally NOT published** (they name the
  target institution throughout); only neutral substance was lifted onto the page.
- **MBAF 504 lecture playlist** (YouTube, Unlisted, ~3k views): kept **unlinked**
  by choice (student-privacy + institutional-rights caution). The "3,000+ views"
  stat stays without an outbound link.

## Deferred features — revisit ~September 2026

Paused intentionally: the site has little/no traffic yet, so audience-building
plumbing isn't worth the time until there's real demand. Revisit when traffic
justifies it.

1. **Release-day email alerts (Resend).** The signup form is **live** and already
   collecting addresses into the `subscribers` table — but no email is *sent* yet.
   Resend is intentionally **not wired** for now. To finish later:
   - Re-add the `notify-subscribers` Supabase Edge Function (release-day blast +
     unsubscribe). A complete, working version was committed then removed — recover
     it from git history (PR #12 / search the log for `notify-subscribers`).
   - Needs a **verified sending domain** (you can't send from a `@gmail.com`
     address). Send from `mokhtartabari.ca` with `REPLY_TO` set to the Gmail so
     replies land there.
   - **Chosen addresses** (set up once the domain is on Namecheap):
     - `updates@mokhtartabari.ca` → the Resend **From** for release-day alerts,
       with `REPLY_TO: mokhtar@mokhtartabari.ca`.
     - `mokhtar@mokhtartabari.ca` → personal/contact address (CV, site footer).
     - *Sending* only needs Resend domain verification. *Receiving* replies needs
       email forwarding on the domain (free Cloudflare Email Routing, or
       Namecheap's forwarding) pointing both addresses at the Gmail.
   - Set secrets (`RESEND_API_KEY`, `NOTIFY_SECRET`, `FROM_EMAIL`, `REPLY_TO`) and
     wire `content-machine-orchestrator` to POST to the function on release day.
   - The Resend API key is in the macOS Keychain (`resend-api-key-website`) but was
     shared in chat — **rotate it** before going live.

2. **Domain: leave GoDaddy.** `mokhtartabari.ca` (GoDaddy) **expires October 2026**.
   Plan: transfer it to **Namecheap** (where `fyxa.ca` already lives — one
   dashboard) before expiry; a transfer adds +1 year (~CA$12–16). Then point it at
   GitHub Pages and add the Resend DNS records there. Don't let it lapse if keeping
   the name.

Engagement features that ARE live and need nothing further: chart view/download
analytics, "Popular" badges, reactions, and the feedback form (all Supabase-backed).

---

# Karpathy Guidelines

Behavioral guidelines to reduce common LLM coding mistakes, derived from [Andrej Karpathy's observations](https://x.com/karpathy/status/2015883857489522876) on LLM coding pitfalls.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.
