# Deployment — Cloudflare Workers (static assets)

Status: **planned, not implemented yet.** Decision made 2026-10-18: deploy the
portfolio to **Cloudflare Workers** using static assets (assets-only Worker, no
worker script). Do **not** use Cloudflare Pages.

## Why Workers over Pages

| | Workers | Pages |
|---|---|---|
| Strategic direction | where Cloudflare invests; docs recommend it for new projects | still supported but in maintenance |
| Config in repo | one `wrangler.jsonc` | none (dashboard-only) |
| Push-to-deploy via GitHub | Workers Builds (same connect-repo UX as Pages) | Git integration |
| Static asset requests | free & unmetered | free & unmetered |
| Future (SSR, API, KV/D1/Cron) | official `@astrojs/cloudflare` adapter + bindings, no re-platform | would need a migration |

Build output is pure static (`dist/`, zero client JS, Mermaid rendered at build
time), so an assets-only Worker serves everything with no application code.

## Current state (verified 2026-10-18)

- Cloudflare account: zone `bhuvneshverma.dev` active (zone id
  `3e3e44fc68c19644dcc5608eda689987`), **zero** Pages projects, **zero** Workers.
- Site is *not* serving from Cloudflare today. Apex A records point to two AWS
  IPs — `54.149.79.189`, `34.216.117.25` (proxied). An HTTPS fetch to
  bhuvneshverma.dev timed out, so these records look stale/dead. Low-risk cutover.
- Email Routing is live on the zone (MX → `route1-3.mx.cloudflare.net`, SPF,
  DKIM). `hello@bhuvneshverma.dev` receives mail. **Deleting the A records does
  not touch email** — MX/TXT are separate records.
- Repo: `MasterBhuvnesh/bhuvii`, deploys trigger on push to `master`.
- Build: `npm run build` → `dist/` with `_astro/` hashed assets, `index.html`,
  `robots.txt`, `rss.xml`, `sitemap-0.xml`, `sitemap-index.xml`, `theme-toggle.js`, `bhuvii.png`,
  favicon pack (`.ico`, 16/32 PNG, 180 apple-touch, 192/512 PWA), `site.webmanifest`, `resume.pdf`,
  plus section folders.
- No `404.astro` exists yet.

## Implementation steps

### 1. Repo changes

- [ ] Add `wrangler.jsonc` at repo root:

```jsonc
{
  "name": "portfolio",
  "compatibility_date": "2026-10-01",
  "assets": {
    "directory": "dist",
    "not_found_handling": "none",
    "html_handling": "auto-trailing-slash"
  }
}
```

(`html_handling` is the default; listed explicitly for documentation. Flip to
`"404-page"` once a 404 page exists — see follow-ups.)

- [ ] `npm i -D wrangler@^4`
- [ ] `package.json` scripts: `"deploy": "wrangler deploy"` (and optionally
  `"preview": "wrangler dev"`)

### 2. First deploy (local, one-time)

```sh
npm run build
npx wrangler deploy
```

- [ ] Verify the `*.workers.dev` URL serves `/`, `/rss.xml`, `/sitemap-index.xml`,
  `/robots.txt`, and one deep article page (trailing-slash HTML).

### 3. Workers Builds (push-to-deploy)

Dashboard: Workers & Pages → `portfolio` → Settings → Build → connect
`MasterBhuvnesh/bhuvii`.

- [ ] Build command: `npm ci && npm run build`
- [ ] Deploy command: `npx wrangler deploy`
- [ ] Env variable: `NODE_VERSION=22.12` (README requires Node ≥ 22.12.0)
- [ ] Production branch: `master` — every push deploys, non-production branches
  get preview deployments
- [ ] Confirm a green build after the first push

### 4. DNS cutover

**Order matters** — the Worker custom domain must be the apex, so clear the
conflicting records first:

- [ ] Delete both A records (`54.149.79.189`, `34.216.117.25`)
- [ ] Attach custom domain: Workers & Pages → `portfolio` → Settings →
  Domains & Routes → Add Custom Domain → `bhuvneshverma.dev`
  (Cloudflare auto-creates the proxied apex record. Can also be done later via
  the Cloudflare MCP tools / API.)

### 5. Post-cutover verification

- [ ] `https://bhuvneshverma.dev/` renders (check `cf-ray` header, no old origin)
- [ ] Deep link, e.g. `/system-design/introduction-to-high-level-design/`
- [ ] `/rss.xml`, `/sitemap-index.xml`, `/robots.txt` all respond
- [ ] Fonts/images load; light + dark themes intact
- [ ] GitHub repo About link still points to `https://bhuvneshverma.dev`

## Optional follow-ups (not required for cutover)

- [ ] ~~Add `src/pages/404.astro`~~ **done** — `404.astro` is in place (and `500.astro`); remaining: set
  `"not_found_handling": "404-page"` in `wrangler.jsonc` during the Workers migration
- [ ] Add `public/_headers` with `/_astro/* → Cache-Control: public,
  max-age=31536000, immutable` (files are content-hashed, so long cache is safe)

## Rollback

If cutover needs reverting: detach the custom domain, re-add the two A records
(`54.149.79.189`, `34.216.117.25`, proxied). Workers deployment can remain in
place harmlessly (nothing pointing at it).
