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

Pages in `src/pages/` are mostly thin wrappers: they import from `src/data/` or query the publications collection, then render components. There is no API layer or client-side data fetching — everything is resolved at build time.

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

## Future Features

### Consulting / Services Layer Integration (Planned)
To leverage the website's data products for contract work and consulting, the following architecture is planned for a future update:

1. **Portfolio Integration (The "Show, Don't Tell" Strategy)**
   - Create a reusable `<ConsultingCTA />` component.
   - Insert this subtle CTA at the bottom of data visualization pages (`src/pages/data/[topic].astro`) and complex dashboards to convert readers into clients.

2. **Dedicated Landing Page (`/consulting` or `/services`)**
   - Create `src/pages/consulting.astro` using `<BaseLayout>`.
   - Structure: Hero emphasizing academic rigor + production data engineering; Grid of core offerings (Empirical Studies, Custom Dashboards, Data Pipelines); Clear contact CTA.
   - Store offering data in `src/data/services.ts`.

3. **Navigation & Homepage Updates**
   - Add a `Consulting` link to the main navigation in `src/components/Header.astro`.
   - Update the homepage hero in `src/pages/index.astro` with a sentence introducing consulting capabilities and a link to the new services page.
