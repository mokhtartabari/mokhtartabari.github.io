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

### Chart Analytics & Tracking (Supabase)

Charts on the data pages track impressions (views) and download events using a lightweight client-side script connecting to Supabase:
- **Direct REST Calls**: Done via native browser `fetch()` using the public anonymous key (`PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`), completely avoiding heavy client SDKs.
- **RPC Incrementing**: Updates call the postgres function `increment_chart_metric(slug, metric)` which runs with `security definer` privileges (bypassing RLS write restrictions on the public client).
- **Session Locking**: Active impressions are tracked with an `IntersectionObserver` (1.5-second visible dwell time required) and locked in `sessionStorage` to prevent double-counting.
- **Threshold Limit**: View and download badges are only rendered/visible when their count exceeds `50`.

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
