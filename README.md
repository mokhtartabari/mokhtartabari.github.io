# mokhtartabari.github.io

Personal academic website for **Dr. Mokhtar Tabari**, Assistant Professor of Economics at University Canada West.

Built with [Astro 5](https://astro.build/) + [Tailwind CSS v4](https://tailwindcss.com/), deployed to GitHub Pages.

## Local development

```bash
npm install
npm run dev       # start the dev server on http://localhost:4321
npm run build     # production build → ./dist
npm run preview   # serve the production build locally
```

Requires Node.js 22+.

## Project structure

```
src/
├── components/         Header, Footer, ThemeToggle, SocialLinks, PublicationCard
├── content/
│   ├── publications/   One markdown file per paper (frontmatter-driven)
│   └── posts/          Blog posts (markdown / MDX)
├── data/               Site config, biography, talks list
├── layouts/            BaseLayout shared by all pages
├── pages/              Routes (index, about, publications, talks, contact, posts)
├── styles/             Global CSS with theme tokens
└── content.config.ts   Content collection schemas
public/                 Static assets (img/, files/, robots.txt, .nojekyll)
```

## Adding content

### A new publication

Create a file in `src/content/publications/your-paper-slug.md`:

```yaml
---
title: "Your paper title"
authors: ["Mokhtar Tabari", "Co-Author"]
year: 2026
venue: "Journal Name"
status: "working-paper"  # published | accepted | revise-and-resubmit | working-paper
featured: false           # true → shows on home page
order: 7
tags: ["International Trade"]
abstract: "Your abstract here."
links:
  - label: "PDF"
    href: "https://..."
    icon: "pdf"            # pdf | doi | code | data | slides | media | preprint | external
---
```

### A new blog post

Create a file in `src/content/posts/your-post-slug.md`:

```yaml
---
title: "Post title"
description: "One-sentence summary."
date: 2026-01-15
category: "announcement"
---

Markdown content here.
```

### Updating biography / experience / talks

Edit the relevant file under `src/data/` — `about.ts` for bio, education, experience, awards, courses; `talks.ts` for presentations; `site.ts` for social links and affiliations.

## Deployment

A GitHub Actions workflow (`.github/workflows/deploy.yml`) builds the site on every push to `main` and publishes to GitHub Pages.

**One-time setup in the GitHub repo:**

1. Go to **Settings → Pages**
2. Set **Source** to **GitHub Actions**

After that, every push to `main` redeploys automatically.

## Custom domain

To point `mokhtartabari.ca` at the site:

1. In your GitHub repo, **Settings → Pages → Custom domain**: enter `mokhtartabari.ca` (this creates a `CNAME` file in the repo).
2. In GoDaddy DNS, turn off domain forwarding and add:
   - **A** records for `@` pointing to GitHub Pages IPs: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - **CNAME** record for `www` → `mokhtartabari.github.io`
3. Wait a few minutes, then in GitHub enable **Enforce HTTPS**.
