# Bhuvii — Portfolio

Personal portfolio and system design publication for Bhuvnesh Verma, built with Astro.js and Tailwind CSS v4. Live at https://bhuvneshverma.dev.

## What is on the site

- Profile block with bio, key skills, social links, live GitHub stats and a real contribution heatmap (fetched at build time, zero client JS)
- Projects section (WCL exam platform, Skarm issue tracker, Studzee ed-tech) with repo links, stack tags, and live-site status
- Experience timeline from CV data, Skills with capability chips + brand-icon Technologies row, Let's Connect contact closer
- System Design section with long-form articles (URL shortener deep-dive, caching, scaling, chat systems, interview roadmap)
- Visual system design roadmap rendered from a Google Sheet, theme aware with light and dark support
- Mermaid diagrams rendered to inline SVG at build time, LaTeX math via self-hosted KaTeX
- DM Sans self-hosted via Fontsource, no third-party font requests
- Dark and light color mode, RSS feed, sitemap, SEO metadata

## Commands

Requires Node.js `22.12.0` or newer. All commands run from the project root:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run check`           | Type-check the project with `astro check`        |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Roadmap data

The roadmap page reads `src/data/system-design-sheet.json`, generated from the Google Sheet:

1. Put the OAuth client in `.secrets/` (see `scripts/sheets_auth.py`) and the spreadsheet id in `.secrets/spreadsheet_id.txt`
2. Run `python3 scripts/build_sheet_roadmap.py`
3. Rebuild the site

`scripts/` and `.secrets/` are gitignored and never committed. `src/data/system-design-roadmap.json` is a saved snapshot kept for reference.

## Writing articles

Add Markdown files to `src/content/system-design/` with frontmatter:

```yaml
title: My Article
excerpt: One line summary.
section: fundamentals
publishDate: 'Oct 11 2026'
```

`section` is one of `fundamentals`, `platforms` or `piyush-garg`. Fenced ` ```mermaid ` blocks become inline SVG diagrams and `$...$` becomes math automatically.

## Project structure

```text
├── public/                  # static assets (favicon, profile photo)
├── scripts/                 # local-only sheet tooling (gitignored)
├── docs/                    # reference PDFs
├── src/
│   ├── assets/icons/        # svg icon components
│   ├── assets/images/       # project logos/screenshots
│   ├── components/          # Profile, Projects, Experience, Skills, Contact, ...
│   ├── content/system-design/
│   ├── data/                # site config, section lists, roadmap JSON
│   ├── layouts/
│   ├── pages/
│   ├── styles/
│   └── utils/
├── rehype-kroki.mjs         # build-time diagram plugin
├── astro.config.mjs
└── package.json
```

Site-wide metadata (title, description, nav, social image) lives in `src/data/site-config.ts`.
