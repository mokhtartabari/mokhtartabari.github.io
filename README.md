# mokhtartabari.github.io

Personal academic website for **Mokhtar Tabari**, Economist. Built with [Astro 5](https://astro.build/) + [Tailwind CSS v4](https://tailwindcss.com/), deployed to GitHub Pages at [mokhtartabari.ca](https://mokhtartabari.ca).

## Development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # production build → ./dist
```

Requires Node.js 22+.

## Adding content

**New publication** — create `src/content/publications/<slug>.md`:

```yaml
---
title: ""
authors: ["Mokhtar Tabari"]
year: 2025
status: "working-paper"  # published | accepted | revise-and-resubmit | working-paper
abstract: ""
featured: false          # true → shows on homepage
order: 0
tags: []
links: []                # each link needs label, href, icon (pdf|doi|code|data|slides|media|preprint|external)
---
```

**Everything else** — edit the relevant file in `src/data/`:

| File | Contents |
|---|---|
| `site.ts` | Name, title, social links, research interests |
| `about.ts` | Bio, education, experience, awards |
| `talks.ts` | Conference presentations |
| `teaching.ts` | Teaching philosophy, interests, course history |

**CV** — replace `public/files/cv.pdf`.

## Deployment

Every push to `main` triggers the GitHub Actions workflow and redeploys to GitHub Pages automatically.
