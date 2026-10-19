# How the site accesses the Google Sheet

The **System Design Roadmap** (`/system-design-roadmap` and `/system-design/fundamentals`) is
generated from a personal Google Sheet. This document explains the full path a sheet cell takes
to become a rendered route, the authentication involved, and how to re-run the pipeline.

```
Google Sheet ──read──▶ local Python (OAuth) ──write──▶ committed JSON in src/data/
                                                              │
                                                              ▼
                                              Astro build imports the JSON
                                                              │
                                                              ▼
                                     static HTML ──▶ Cloudflare Workers (CI deploy)
```

The one rule to remember: **the sheet is only ever read locally, by you.** Nothing at build time
on GitHub, and nothing in the browser, talks to Google. What gets committed is plain JSON, and
the site renders from that committed JSON. That keeps the deployed site zero-JS, secret-free,
and immune to Google outages or quota errors.

---

## 1. The spreadsheet

The spreadsheet ID lives in `.secrets/spreadsheet_id.txt` (gitignored; a single line, no
quotes). It has these tabs:

| Tab                     | Columns            | Role |
| :---------------------- | :----------------- | :--- |
| `Fundamentals`          | Section, Topic, …  | Own fundamentals notes, grouped by section (section written as a left cell once, then topics) |
| `GFG`                   | Part, Section, Topic, Link | GFG-style topic list with external links |
| `GFG_with_Fundamentals` | Part, Section, Topic, Link, Source | **The union tab the roadmap build actually reads** (playlist of both sources) |
| `All_Topics`            | Section, Topic, Source, Link | Automated fuzzy merge of the two tabs, written back by `make_union.py` (kept as curation aid) |

Notes on how readers parse the layout:

- Section cells are "carried down" - a blank section cell means "same section as the row above".
  The scripts track a current section while iterating.
- Header rows are skipped by the readers (the union tab read starts at the data by checking
  `sec == "Section"`); `Part` and `Source` columns are read but never rendered.

---

## 2. Authentication (`scripts/sheets_auth.py`, one-time)

Access is **OAuth user credentials, not a service account**. The docstring is honest about the
reason: service-account key creation was blocked by the org, and user OAuth is simpler for a
personal tracker.

One-time setup:

```bash
pip install google-api-python-client google-auth google-auth-oauthlib
```

1. GCP console → **APIs & Services → Credentials → Create Credentials → OAuth client ID →
   Desktop app** → download the JSON → save as `.secrets/client_secret.json`.
2. Enable the **Google Sheets API** for that GCP project.
3. Run:

   ```bash
   python3 scripts/sheets_auth.py
   ```

   It opens a browser (`InstalledAppFlow.run_local_server`), you consent, and the resulting
   credentials (including a long-lived refresh token) are written to `.secrets/token.json`.

Scopes requested: `https://www.googleapis.com/auth/spreadsheets` (full read **and** write, so the
same token also serves the write-back scripts like `make_union.py`). Treat `token.json` like a
password - the whole `.secrets/` directory is gitignored, plus `scripts/`, `token.json` and
`client_secret.json` have their own `.gitignore` entries.

**Token lifecycle:** `google-auth` silently refreshes the access token using the stored refresh
token. If you ever get a 401/invalid-grant (revoked consent, changed password, long dormancy),
delete `.secrets/token.json` and re-run `sheets_auth.py`.

---

## 3. The API access layer (`scripts/sheets_client.py`)

Every other script imports from this file instead of touching the API directly:

```python
def service():
    creds = Credentials.from_authorized_user_file(str(TOKEN), SCOPES)
    return build("sheets", "v4", credentials=creds)

def read_range(spreadsheet_id: str, tab_range: str):
    return service().spreadsheets().values().get(
        spreadsheetId=spreadsheet_id, range=tab_range
    ).execute().get("values", [])
```

- `read_range(sid, "GFG_with_Fundamentals!A1:Z3000")` → list of row lists; missing trailing
  columns are simply absent, which is why callers pad rows (`r = (r + ["", ...])[:n]`) before
  indexing.
- `service()` is reused by the write-back scripts, which call
  `spreadsheets().get` (tab discovery), `batchUpdate` (addSheet), `values().clear` and
  `values().update(..., valueInputOption="RAW")` - the same pattern as the official quickstart.

Everything runs through the Sheets v4 REST API endpooints wrapped by
`googleapiclient.discovery`; there are **no runtime fetches to `docs.google.com` from the site**.

---

## 4. The generator (`scripts/build_sheet_roadmap.py`)

This is the only script that matters day-to-day. What it reads and writes:

**Reads:**

- `GFG_with_Fundamentals!A1:Z3000` - columns `Part | Section | Topic | Link | Source`
  (skips the header row; Part and Source are read but not rendered)
- `Fundamentals!A2:D1000` - only the merged sections need extra topics from this tab

**Writes:**

| Output | Shape | Purpose |
| :-- | :-- | :-- |
| `src/data/system-design-sheet.json` | `[{center, left?, right?, below?, parent?, note?}]` | The roadmap the pages render |
| `src/data/topic-pages.json` | `[{slug, title, section}]` | Slug registry minted during this run (reference/debug aid; not imported by the pages) |
| `src/content/system-design/<slug>.md` | Stub markdown ("Full notes coming soon.") | One page per topic so every roadmap box resolves to a real URL; **existing files are never overwritten** |

**Layout rules** (graph-only editorial knobs, all defined as top constants - the sheet itself is
never edited by the build):

- Sections with ≤ 6 topics become a single spine node with side boxes (first half on the right,
  the rest on the left).
- Larger sections become a below-node two-column grid (`below` groups).
- `ORDER` pins the pedagogical spine top-to-bottom; unlisted sections keep sheet order at the end.
- `SKIP` removes whole sections from the graph (currently `Design Patterns`).
- `MERGE` folds named `Fundamentals` sections into a union section, appending unseen topics.
- `SPLIT` divides a big section into labeled sub-nodes by topic keywords (first keyword match
  wins; anything unmatched lands in an `Other` block, so nothing is dropped).
- `BALANCE` overrides the split rule for one section (`System Architectural Styles`).
- `PARENT` / `NOTES` add eyebrow lines and centered notes above nodes.
- `LINKS` forces specific topic boxes to an article URL (e.g. the functional requirements
  write-up); every other box links to `/system-design/<minted-slug>/`.
- Slugs are minted per topic with collision fallbacks: `topic-smash` → `section-topic-smash` →
  `...-2` (a per-(section, topic) pool handles duplicates).

Run it, then rebuild the site:

```bash
python3 scripts/build_sheet_roadmap.py
npm run build
```

The script prints counts (topic pages, stubs written, sections, side boxes, grid topics) so you
can sanity-check the output before committing.

---

## 5. How the pages consume the JSON (build time)

Both pages are **static** and import the JSON directly at build time:

```astro
// src/pages/system-design-roadmap.astro
import roadmapRows from '../data/system-design-sheet.json';

type Row = {
    center: string;
    left?: Child[];
    right?: Child[];
    below?: Child[];
    note?: string;
};
```

```astro
// src/pages/system-design/fundamentals.astro
import roadmapRows from '../../data/system-design-sheet.json';
```

`TopicBox.astro` renders the three node flavors (`box`, `card`, `group`) with theme-aware CSS
variables (`var(--text-main)`, `var(--bg-main)`), so the same committed JSON serves the light
and dark themes. Topic boxes link to `/system-design/<slug>/`, pages that come from the content
collection plus the generated stubs. Because everything is decided before deploy, the JSON
committed to the repo is the single source of truth for what renders - the sheet only changes
the site when you regenerate and push.

`src/data/system-design-roadmap.json` is an earlier hand-built snapshot kept for reference; it
is no longer imported by any page.

---

## 6. Re-running the pipeline end to end

```bash
# 0) First time only: OAuth (section 2)
python3 scripts/sheets_auth.py       # writes .secrets/token.json

# 1) Edit the sheet freely (tabs or ordering). Optionally refresh the union merge:
python3 scripts/make_union.py        # fuzzy-matches Fundamentals x GFG, writes All_Topics tab

# 2) Regenerate the committed JSON + stub pages
python3 scripts/build_sheet_roadmap.py

# 3) Local check
npm run build && npm run preview

# 4) Commit the regenerated JSON (+ any new stub .md files) and push
git add src/data src/content/system-design
git commit -m "roadmap: regenerate from sheet"
git push             # Workers Builds deploys automatically
```

If GitHub CI builds the site, it does **not** need python, `.secrets/` or the sheet at all -
only the committed `src/data/*.json`, which is why `scripts/` and `.secrets/` are safely
gitignored.

---

## 7. Script catalog

Core pipeline (run these):

| Script | Purpose |
| :-- | :-- |
| `sheets_auth.py` | One-time OAuth consent → `.secrets/token.json` |
| `sheets_client.py` | Shared Sheets v4 helper (`service()`, `read_range`); callable standalone with `python3 scripts/sheets_client.py <sid>` |
| `build_sheet_roadmap.py` | Sheet → `system-design-sheet.json`, `topic-pages.json`, stub articles |
| `make_union.py` | Automated fuzzy merge of `Fundamentals` × `GFG` (similarity ≥ 0.55 → `Both`) written back to the `All_Topics` tab |

One-off curation / diagnostic helpers (not part of the build path; used while the tabs were
being assembled - kept for archaeology):

`dump_tabs.py`, `inspect_gfg.py`, `list_gfg_full.py`, `list_topics.py`, `make_gfg_copy.py`,
`make_roadmap.py`, `merge_sections.py`, `compare_fund_gfg.py`, `check_roadmap.py`,
`check_sections.py`, `write_comparison.py`

---

## 8. Security notes

- `.secrets/` (client secret, OAuth token, spreadsheet ID) and all of `scripts/` are gitignored.
  The token has full spreadsheet *write* scope - never commit it, and never embed the
  spreadsheet ID in anything public; the doc deliberately references it only by filename
  (`spreadsheet_id.txt`).
- The deployed site ships no Google URLs, tokens or IDs: recruiters' browsers only download
  prebuilt HTML/CSS.
- Deleting the sheet or revoking consent can never take the site down - the newest
  regeneration on your machine remains committed; regeneration just fails loudly until fixed.
