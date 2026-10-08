# Review mode — design

Date: 2026-10-07 · Branch: `review-mode`

## Purpose

Course staff want to comment on the site the way they would in Google Docs
suggesting mode, without using Git or GitHub. Review mode lets a reviewer
select text on any page, leave a comment or a suggested replacement, and
hand the author a file (or sync to a shared server) that says exactly which
source file, section and words each comment is about. The author can load
many reviewers' work at once and see it all in place.

This is for internal reviewers only. The existing Tally feedback forms remain
the channel for students and other outside users.

## Decisions already made

- **No replies or threads.** Review is one-way: reviewers comment, the author
  reads. Anyone who wants to respond adds their own comment on the same text.
- **Two storage modes, one data format.** Phase 1 works with no server
  (browser storage + download/load files). Phase 2 adds optional sync to a
  self-hosted PocketBase so reviewers see each other's comments live. Both
  ship together, and everything is testable on localhost before any DNS work.
- **Activities are commented on as a whole.** Text inside activity iframes is
  not selectable for review.
- **Students never load review code.**

## Architecture

### Loading

`site.js` loads `assets/review/review.js` (an ES module) and `review.css` only
when review mode is on: the `aids-review` key in `localStorage` says so, or the
URL has `?review` (which also turns it on and is remembered). If no reviewer
name is set yet, the bar asks for one before the first comment. Exiting review
mode hides the UI but keeps all stored marks. Never in embed mode (`?embed`).

### Build-time stamps

The Eleventy config adds global data `build`:

- `build.version`: `git rev-parse --short HEAD`, plus `-dirty` when
  `git status --porcelain` is non-empty. Computed once when Eleventy starts.
  On GitHub Actions the checkout provides the commit.
- `build.reviewServer`: the PocketBase URL from `site.json` (`reviewServer`),
  empty if unset.

Both layouts (`shell.njk`, `base.njk`) mark their content container with
`data-review-root`, `data-review-src="{{ page.inputPath }}"` and
`data-review-version="{{ build.version }}"`. `head.njk` exposes the server URL
in a `<meta name="review-server">`.

### Files

```
src/assets/review/
  core.js        pure logic: anchoring, mark records, merge, file format
  store.js       LocalStore
  review.js      on-page UI (selection popup, highlights, cards, panel, bar)
  review.css     review UI styles, using the site's color tokens
  dom.js         text indexing, wrapping and unwrapping highlights
  page.js        the /review/ control page
  sync.js        SyncStore: PocketBase over fetch + EventSource (no SDK)
src/review.njk   the /review/ control page (unlinked, excluded from collections)
review-server/
  pb_migrations/ creates the `marks` collection and its API rules
  README.md      local run + Ubuntu deploy (binary, systemd unit, Caddy block)
test/                      node:test, no new dependencies
tools/           git-ignored; holds the local PocketBase binary and pb_data
```

New npm scripts: `test` (`node --test`), `review-server` (runs
`tools/pocketbase serve --http=127.0.0.1:8090 --migrationsDir=review-server/pb_migrations --dir=tools/pb_data`).
A `review-server` entry is added to `.claude/launch.json`.

## Data

### Reviewer identity

On first entering review mode, the browser generates and stores:

- `reviewerId`: random UUID, public; distinguishes two reviewers with the same name.
- `ownerToken`: random secret, never shown or exported; proves ownership to the sync server.
- `name`: typed on the /review/ page.

### Mark record

```json
{
  "id": "uuid",
  "reviewerId": "uuid",
  "reviewer": "Sam",
  "kind": "comment | suggest | activity",
  "page": "/module-3/explore/",
  "src": "./src/module-3/03-explore.md",
  "section": "the-easiest-question",
  "quote": { "exact": "812", "prefix": "…32 chars before", "suffix": "32 chars after…" },
  "activity": "analysts-toolkit.html",
  "comment": "free text",
  "replacement": "suggested text (kind=suggest only)",
  "created": "ISO time",
  "updated": "ISO time",
  "version": "17c2e93"
}
```

`quote` is empty for `activity` marks; `activity` is empty otherwise. `page`
is stored without the path prefix so the same mark matches on localhost and
GitHub Pages.

### Export file

`review-<name>-<YYYY-MM-DD>.json`:

```json
{ "format": "aids-review", "formatVersion": 1, "reviewer": "Sam",
  "reviewerId": "uuid", "exported": "ISO time", "marks": [ … ] }
```

Only the reviewer's own marks are exported. Loading rejects files without
`format: "aids-review"` or with a newer `formatVersion`, with a clear message.

## Storage

One interface used by the UI: `list()`, `save(mark)`, `remove(id)`,
`onChange(callback)`.

**LocalStore.** Own marks in `localStorage` under `aids-review-marks`.
Loaded (other people's) marks under `aids-review-loaded`, keyed by mark id, so
re-loading a file or a newer file from the same person replaces rather than
duplicates. Loaded marks are read-only and are never exported. "Clear loaded
reviews" empties only the loaded set. Tracks `lastExported` to show
"N not downloaded" (marks created or updated since the last download).

**SyncStore.** Wraps LocalStore. Every save goes to LocalStore first, then to
PocketBase; failures stay in a pending queue that is retried on reconnect and
on page load. Reads merge server marks with local ones. Subscribes to
PocketBase realtime so other reviewers' marks appear without reloading. The
bar shows connection state and "N not synced". Download and Load still work in
sync mode.

## Sync server (PocketBase)

Collection `marks` with the record's fields plus a hidden `owner_token` field.
Access is controlled by API rules only, with no custom server code:

- All rules require `@request.headers.x_review_key` to equal the review
  passcode (set in the migration from an env var, changeable in the admin UI).
- Create also requires the body's `owner_token` to equal
  `@request.headers.x_review_owner`.
- Update and delete require `@request.headers.x_review_owner = owner_token`.
- `owner_token` is hidden, so it is never returned to other reviewers.

The passcode is typed on the /review/ page and kept in `localStorage`. The
server URL comes from `site.json`, with an override field on the /review/ page
for local testing (`http://127.0.0.1:8090`).

To verify while building (fall back if either doesn't hold):
- Realtime subscriptions honor custom headers for rule checks. Fallback: poll
  every 20 s and when the tab regains focus.
- Hidden fields can be referenced in API rules. Fallback: store a hash of the
  token in a visible field.

Deployment (later, not required to try it): either a `reviews.kellerflint.com`
A record plus a Caddy site block, or a `/review-api/` reverse-proxy path on the
existing `courses.kellerflint.com` server. CORS allows the GitHub Pages origin
and localhost.

## On-page UI

- **Floating bar** (bottom-right): "Reviewing as <name> · N comments · N not
  downloaded/synced", with List, Download, Load, Exit, and in sync mode a
  connection dot.
- **Selection popup:** selecting text inside `[data-review-root]` (within one
  section) shows **Comment** and **Suggest edit**. Suggest edit opens a box
  pre-filled with the selection; the page then shows the original struck
  through with the replacement after it. A selection crossing sections is
  refused with a short message.
- **Highlights:** `<mark>` elements wrapped around the anchored text, one
  color for the reviewer's own marks and a distinct color per other reviewer
  (assigned by `reviewerId`). Overlaps stack; clicking opens a card listing
  every mark on that text. Own marks can be edited or deleted.
- **Comment list:** right-side drawer listing this page's marks grouped by
  section, filterable by reviewer. Clicking one switches to its section (the
  shell shows one section at a time), scrolls to the highlight and flashes it.
  Unplaced marks are grouped at the bottom.
- **Sidebar counts:** in review mode each section link in the left sidebar
  shows a count badge.
- **Activities:** each `.activity-embed` header gets **Comment on this
  activity**.
- **/review/ page:** name, Enter/Exit review mode, Local only / Sync (server
  URL, passcode), Download my review, Load review files (multi-select), Clear
  loaded reviews, Clear my data (with confirmation), and a table of every mark
  (own + loaded/synced) across the whole site grouped by page and section,
  with links.

Review UI follows the site's light/dark theme and works at phone width, though
it is designed for desktop.

## Anchoring

On save: record the section id, the exact selected text, and up to 32
characters of text before and after, measured on the section's text content
(whitespace collapsed).

On render, per mark: search the recorded section's text for
`prefix + exact + suffix`; if not found, `exact` with the best-matching
context; if not found, the same across the whole page; if still not found,
the mark is **unplaced** and appears only in the list (with its version, so
the author can `git show <version>:<src>` to see what the reviewer saw).
Highlights are applied to all sections, including hidden ones, so switching
sections needs no re-render.

## Testing

- `core.js` is pure and tested with `node --test`: anchoring (exact,
  context-disambiguated, moved-to-another-section, unplaced), merge/replace by
  id, export shape, import validation.
- UI verified in the in-app browser on the dev server: comment, suggest,
  activity note, highlight across section switches, list navigation, load
  two files, export/import round trip, both themes, phone width.
- Sync verified against local PocketBase with two browser windows as two
  reviewers: live appearance, edit/delete only own, wrong passcode refused,
  offline queue drains on reconnect.

## Out of scope

Replies and threads, resolving or accepting suggestions in the UI, applying
suggestions to source automatically, per-person accounts, selecting text
inside activities, notifications.
