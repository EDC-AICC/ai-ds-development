# Review Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let course staff select text on any page of the course site and leave comments or suggested edits, saved in their browser or synced to a small self-hosted server, exportable to a file that names the exact source file, section and words, and loadable many-at-once by the author.

**Architecture:** Review code is a set of ES modules under `src/assets/review/`, loaded by `site.js` only when review mode is on. Pure logic (`core.js`) and storage (`store.js`, `sync.js`) are DOM-free and unit-tested with `node --test`; DOM work (`dom.js`, `review.js`, `page.js`) is verified in the browser. The layouts stamp each page with its source file and git version at build time. Sync talks to our own zero-dependency Node server (`node:http` + `node:sqlite`) over `fetch` and `EventSource`.

**Tech Stack:** Eleventy 3, vanilla JS (ES modules), `node:test` (Node 26), `node:sqlite` (Node ≥ 22.13), Caddy for deployment.

**Spec:** `docs/superpowers/specs/2026-10-07-review-mode-design.md`

## Global Constraints

- No new npm dependencies. No CDN or third-party requests from review code; the only network target is the configured sync server URL.
- Author and example names: only "Keller Flint" (the repo author) or neutral placeholders such as "Sam". No committed file may contain an absolute path under `/Users/`; check `git diff --cached` before every commit.
- Students never load review code: `site.js` imports it only when `localStorage["aids-review"] === "on"` or the URL has `?review`, and never when the URL has `?embed`.
- Review modules may use modern JS (const/let, arrows, async). Edits to existing `site.js`/`shell.js` keep their ES5 IIFE style.
- localStorage keys: `aids-review` ("on"/absent), `aids-review-me` (`{reviewerId, ownerToken, name}`), `aids-review-marks` (own marks, object keyed by id), `aids-review-loaded` (loaded marks, keyed by id), `aids-review-exported` (ISO time of last download), `aids-review-sync` (`{mode:"local"|"sync", server, passcode}`), `aids-review-pending` (array of `{op:"save"|"remove", id}`). Every access wrapped in try/catch.
- Export file: `{ "format": "aids-review", "formatVersion": 1, "reviewer", "reviewerId", "exported", "marks": [...] }`, filename `review-<slugified name>-<YYYY-MM-DD>.json`.
- Mark fields exactly as the spec's record: `id, reviewerId, reviewer, kind ("comment"|"suggest"|"activity"), page, src, section, quote {exact,prefix,suffix}, activity, comment, replacement, created, updated, version`. `ownerToken` is never in a mark or an export.
- Quote context length: 32 characters each side, measured on whitespace-collapsed text.
- Sync headers: `X-Review-Key` (passcode), `X-Review-Owner` (ownerToken). The event stream takes the passcode as `?key=`.
- All review UI elements carry the attribute `data-rv-ui` and are excluded from text indexing and from selection handling.
- Review UI uses the site's existing CSS color tokens and must work in light and dark themes and at 375px width.

## Review Focus

1. **Text the reviewer selected appears more than once on the page** (e.g. "812" in two paragraphs): the highlight must land on the occurrence they selected, decided by prefix/suffix context. Test in Task 2.
2. **A selection that starts or ends inside a `<code>`, link, or bold run, or crosses paragraph boundaries within one section**: it must save and re-highlight across element boundaries without breaking the surrounding markup. Test in Task 5.
3. **localStorage unavailable or full** (private window, quota): review mode must show a clear message in the bar instead of silently losing comments. Test in Task 3 (store reports failure) and Task 7 (bar shows it).
4. **Loading a file that is the user's own earlier export, or a malformed/non-review JSON**: own marks must not appear twice (loaded marks whose `reviewerId` equals mine are skipped), and bad files are rejected with a message naming the file. Test in Task 2.
5. **Sync server unreachable or passcode wrong**: comments still save locally, the bar says "N not synced" / "passcode rejected", and the queue drains when it comes back. Unit tests in Task 9; end to end in Task 10.

---

### Task 1: Build stamps and test harness

**Files:**
- Modify: `eleventy.config.js` (add global data), `src/_data/site.json`, `src/_includes/base.njk`, `src/_includes/shell.njk`, `src/_includes/head.njk`, `package.json`, `.gitignore`
- Create: `test/build-stamp.test.js`

**Interfaces:**
- Produces: global data `build = { version: string }` (`"17c2e93"` or `"17c2e93-dirty"`, `"unknown"` if git fails); `site.reviewServer` (string, default `""`); on the content container in both layouts the attributes `data-review-root`, `data-review-src="{{ page.inputPath }}"`, `data-review-version="{{ build.version }}"`, `data-review-base="{{ '/' | url }}"`; `<meta name="review-server" content="{{ site.reviewServer }}">` in `head.njk`.

The content container is `[data-content]` in `shell.njk` and `main > .col` in `base.njk`.

- [ ] **Step 1: Add `"test": "node --test"` to package.json scripts; add `tools/` to `.gitignore`.**
- [ ] **Step 2: Write `test/build-stamp.test.js`**: runs `npx eleventy --quiet` into a temp output dir (`--output=<tmp>`) and asserts that `<tmp>/module-3/explore/index.html` contains `data-review-src="./src/module-3/03-explore.md"` and a `data-review-version="[0-9a-f]{7}(-dirty)?"` match, and `<tmp>/index.html` contains `data-review-root`.
- [ ] **Step 3: Run `npm test`.** Expected: FAIL (attributes absent).
- [ ] **Step 4: Implement** `build.version` in `eleventy.config.js` via `execSync("git rev-parse --short HEAD")` plus `-dirty` when `git status --porcelain` is non-empty, registered with `eleventyConfig.addGlobalData("build", ...)`; add the attributes and meta tag.
- [ ] **Step 5: Run `npm test`.** Expected: PASS.
- [ ] **Step 6: Commit** `Review mode: stamp pages with source file and version`.

---

### Task 2: Core logic (`core.js`)

**Files:**
- Create: `src/assets/review/core.js`, `test/review-core.test.js`

**Interfaces:**
- Produces (all named exports, all pure):
  - `normalize(text: string) -> string`: collapse runs of whitespace to one space.
  - `makeQuote(text: string, start: number, end: number) -> {exact, prefix, suffix}`: on already-normalized text; prefix/suffix up to 32 chars.
  - `findQuote(text: string, quote) -> {start, end} | null`: exact match of `prefix+exact+suffix` first; otherwise among all occurrences of `exact`, the one whose surrounding text shares the longest common suffix with `prefix` plus longest common prefix with `suffix`; `null` if `exact` absent.
  - `newMark(fields, me) -> mark`: fills `id` (crypto.randomUUID), `reviewerId`, `reviewer`, `created`, `updated`; never copies `ownerToken`.
  - `buildExport(me, marks: mark[], now: Date) -> {filename, data}`.
  - `parseImport(json: string, filename: string) -> {marks: mark[]} | {error: string}`: error text names the file; rejects wrong `format`, `formatVersion > 1`, non-array `marks`, marks missing `id`/`reviewerId`/`kind`.
  - `mergeLoaded(existing: {[id]: mark}, incoming: mark[], myReviewerId) -> {[id]: mark}`: incoming replaces by id; marks with `reviewerId === myReviewerId` are skipped.
  - `colorIndex(reviewerId: string, n: number) -> number`: stable hash into `0..n-1`.

- [ ] **Step 1: Write failing tests** in `test/review-core.test.js`:
  - `normalize("a \n\t b") === "a b"`.
  - `makeQuote` on a 100-char string, selecting 50–55: `prefix.length === 32`, `suffix.length === 32`; at start of text `prefix === ""`.
  - `findQuote`: text `"We counted 812 rows. Then 812 again later."`, quote made from the second `812` → returns the second occurrence's offsets.
  - `findQuote` with context edited (prefix words changed) still finds the right occurrence; with `exact` absent returns `null`.
  - `buildExport` filename for name `"Sam Lee"` on 2026-10-07 is `review-sam-lee-2026-10-07.json`; `data.format === "aids-review"`; no `ownerToken` anywhere in `JSON.stringify(data)`.
  - `parseImport` round-trips `buildExport(...).data`; `parseImport("{}", "x.json").error` includes `"x.json"`; `formatVersion: 2` → error; `"not json"` → error.
  - `mergeLoaded`: loading the same file twice yields the same keys; a newer copy of a mark replaces the old; marks with my `reviewerId` are skipped.
  - `colorIndex` is stable across calls and within range.
- [ ] **Step 2: Run `npm test`.** Expected: FAIL (module not found).
- [ ] **Step 3: Implement `core.js`.**
- [ ] **Step 4: Run `npm test`.** Expected: PASS.
- [ ] **Step 5: Commit** `Review mode: core anchoring, export and merge logic`.

---

### Task 3: Local store (`store.js`)

**Files:**
- Create: `src/assets/review/store.js`, `test/review-store.test.js`

**Interfaces:**
- Consumes: `newMark`, `mergeLoaded`, `buildExport`, `parseImport` from Task 2.
- Produces: `class LocalStore { constructor(storage = globalThis.localStorage) }` with
  - `me() -> {reviewerId, ownerToken, name}` (creates and persists ids on first call), `setName(name)`
  - `isOn() -> boolean`, `setOn(on: boolean)`
  - `own() -> mark[]`, `loaded() -> mark[]`, `all() -> mark[]` (own + loaded)
  - `save(mark) -> {ok: true} | {ok: false, error: string}` (sets `updated`; own marks only)
  - `remove(id) -> {ok, error?}`
  - `loadFiles(files: {name, text}[]) -> {added: number, errors: string[]}`
  - `clearLoaded()`, `clearMine()`
  - `exportFile() -> {filename, data}` (records `aids-review-exported`)
  - `unexportedCount() -> number` (own marks with `updated` later than last export)
  - `onChange(cb)`: called after any mutation; also fires on the window `storage` event when available.

- [ ] **Step 1: Write failing tests** using an in-memory fake `{getItem, setItem, removeItem}`:
  - `me()` returns the same ids on two calls and on a new `LocalStore` over the same storage.
  - save → `own()` has it; `unexportedCount()` is 1; after `exportFile()` it is 0; after editing it is 1.
  - `loadFiles` with one good and one bad file → `added === n`, one error naming the bad file; loaded marks appear in `all()` but not in `exportFile().data.marks`.
  - A fake whose `setItem` throws → `save` returns `{ok:false}` with a non-empty error.
  - `clearLoaded` leaves own marks intact.
- [ ] **Step 2: Run `npm test`.** Expected: FAIL.
- [ ] **Step 3: Implement `store.js`.**
- [ ] **Step 4: Run `npm test`.** Expected: PASS.
- [ ] **Step 5: Commit** `Review mode: local mark store`.

---

### Task 4: Loader and the /review/ control page

**Files:**
- Modify: `src/assets/js/site.js` (add `initReview`), `.claude/launch.json` (nothing yet; "site" config is on port 8318)
- Create: `src/review.njk`, `src/assets/review/page.js`, `src/assets/review/review.css` (control-page styles only for now)

**Interfaces:**
- Consumes: `LocalStore` (Task 3).
- Produces: `site.js` resolves the review module URL from its own `document.currentScript.src` (`new URL("../review/review.js", src)`) and `import()`s it when on; `?review` in the URL calls `localStorage.setItem("aids-review","on")` first. `review.js` must default-export `start(store)`; until Task 5, a stub that logs nothing and returns.
- `/review/` page: `layout: base.njk`, `permalink: /review/`, `eleventyExcludeFromCollections: true`, title "Review mode", loads `page.js` as a module unconditionally.

`page.js` renders, in order: name field (saved on input), Enter/Exit review mode button (label reflects state), storage choice Local only / Sync with server URL (prefilled from the `review-server` meta) and passcode fields (the Sync option stays disabled until Task 9 enables it), Download my review, Load review files (`<input type=file multiple accept=".json">`, result line "Loaded N comments from M files" plus each error), Clear loaded reviews, Clear my data (`confirm()` first), and a table of all marks grouped by page then section: reviewer (colored dot via `colorIndex`), kind, quote or activity name, comment/replacement, link to `<base><page>#<section>`. Unplaced status is not known here; the table lists everything.

- [ ] **Step 1: Implement** the loader, page and page.js.
- [ ] **Step 2: Verify in browser** (preview "site", port 8318): `/review/` renders in light and dark and at 375px; enter review mode, reload any lesson → network shows `review.js` requested; exit → not requested; `/module-3/explore/?embed` with mode on → not requested; `?review` on a lesson turns it on.
- [ ] **Step 3: Verify download/load round trip** by seeding a mark from the console with `store.save(newMark(...))`, downloading, clearing my data, loading the file in a second browser profile/private window → table shows it as loaded.
- [ ] **Step 4: Commit** `Review mode: loader and /review/ control page`.

---

### Task 5: Highlights (`dom.js` + rendering in `review.js`)

**Files:**
- Create: `src/assets/review/dom.js`
- Modify: `src/assets/review/review.js`, `src/assets/review/review.css`

**Interfaces:**
- Consumes: `normalize`, `findQuote`, `colorIndex` (Task 2); `LocalStore.all()`, `onChange` (Task 3).
- Produces (dom.js):
  - `textIndex(root: Element) -> {text: string, locate(i: number) -> {node: Text, offset: number}}`: normalized text of `root`, skipping `[data-rv-ui]`, `.sectionbar`, `iframe`, and `script`/`style`. Text inside a closed `<details>` is included.
  - `offsetsOf(root, range: Range) -> {start, end} | null`: inverse of `locate` for a selection.
  - `wrap(root, start, end, attrs: object) -> HTMLElement[]`: wraps the text in one or more `<mark data-rv-ui-mark>` elements (one per text node), returning them.
  - `unwrapAll(root)`: removes every review mark and inserted replacement, then `root.normalize()`.
  - `sectionOf(node) -> string | null`: `closest("section[data-sec]")?.dataset.sec ?? null`.
- `review.js` gains `render()`: `unwrapAll`, then for each mark on this page (match `page` to `location.pathname` minus `data-review-base`): look in its section, then the whole root; wrap with class `rv-mark`, `rv-c<colorIndex>` (or `rv-own`), `data-ids` (space-separated mark ids when overlapping); for `suggest`, add class `rv-del` and insert `<ins data-rv-ui class="rv-ins">replacement</ins>` after the last wrapped node. Returns `{placed: mark[], unplaced: mark[]}`. Re-render on `store.onChange`.

`.rv-mark` text-index exclusion: marks themselves are *not* `data-rv-ui` (their text is page text); only `.rv-ins` and UI chrome are.

- [ ] **Step 1: Implement dom.js and render().**
- [ ] **Step 2: Verify in browser** on `/module-3/explore/` by seeding from the console: (a) a mark on a plain phrase; (b) a mark whose quote spans `**bold**` and plain text; (c) a mark spanning two paragraphs in one section; (d) a mark inside a closed `{% q %}` answer; (e) a suggest mark; (f) two overlapping marks; (g) a mark whose quote no longer exists → reported unplaced. All highlight correctly, switching sections with Continue keeps them, page markup is otherwise unchanged after `unwrapAll` (compare `[data-content].innerHTML` before seeding and after clearing).
- [ ] **Step 3: Commit** `Review mode: anchor and draw highlights`.

---

### Task 6: Creating, editing and deleting marks

**Files:**
- Modify: `src/assets/review/review.js`, `src/assets/review/review.css`

**Interfaces:**
- Consumes: `textIndex`, `offsetsOf`, `sectionOf` (Task 5); `makeQuote`, `newMark` (Task 2); `LocalStore.save/remove/me` (Task 3).

Behavior:
- On `mouseup`/`keyup` (and `selectionchange` debounced 150ms for touch) with a non-collapsed selection inside `[data-review-root]`, not inside `[data-rv-ui]`: if start and end `sectionOf` differ, show a toast "Comments can't cross sections — select within one section." Otherwise show a popup next to the selection with **Comment** and **Suggest edit**.
- Comment opens an editor card (textarea, Save, Cancel). Suggest opens it with a second textarea prefilled with the exact selected text, labeled "Replace with". Save builds a mark with `page`, `src` (`data-review-src`), `section`, `quote` (via `makeQuote` on the section's `textIndex`, or the root's when there are no sections), `version` (`data-review-version`), and saves. If the reviewer has no name yet, the editor shows a required name field first.
- Clicking a `.rv-mark` opens a card listing every mark in its `data-ids`: reviewer (color dot), kind, comment, replacement, time; own marks have Edit and Delete (delete asks `confirm`).
- Each `.activity-embed .activity-header` gets a `data-rv-ui` button **Comment on this activity** → editor; saves `kind: "activity"`, `activity: <iframe src filename>`, empty quote. Activity marks display as a count badge on that button; clicking it opens the card.
- Escape closes any popup/card; all buttons are real `<button>`s with focus styles.

- [ ] **Step 1: Implement.**
- [ ] **Step 2: Verify in browser:** create a comment, a suggestion (shows struck text + insertion), an activity note on `/module-3/explore/`; edit and delete each; cross-section selection shows the toast; reload — all persist; works with keyboard selection (shift+arrows) and at 375px.
- [ ] **Step 3: Commit** `Review mode: create, edit and delete comments`.

---

### Task 7: Review bar, comment list and sidebar badges

**Files:**
- Modify: `src/assets/review/review.js`, `src/assets/review/review.css`

**Interfaces:**
- Consumes: `render()` result `{placed, unplaced}` (Task 5); `LocalStore.unexportedCount/exportFile/loadFiles` (Task 3); `colorIndex`.

Behavior:
- **Bar** (fixed bottom-right, `data-rv-ui`): "Reviewing as <name> · N comments · N not downloaded" (N comments = own marks site-wide). Buttons: List, Download, Load (hidden file input, multiple), Exit (sets off, reloads). When a store call returned `{ok:false}`, the bar shows the error in place of the counts until the next successful save. In sync mode (Task 9) a status slot shows connection state.
- **List drawer** (right side): this page's marks grouped by section in page order, then **Unplaced** (shows quote, comment, and "made against <version>"). Reviewer filter chips (one per reviewer present, toggle). Clicking an entry sets `location.hash` to its section, waits a frame, scrolls the first wrapped element into view, and adds a 1s `rv-flash` class.
- **Sidebar badges:** for each `[data-secs] a[href="#id"]`, append `<span data-rv-ui class="rv-badge">n</span>` with that section's placed-mark count (all reviewers); omitted when 0.
- Reviewer colors: 8 classes `rv-c0`…`rv-c7` defined with light and dark values; own marks use `rv-own`.

- [ ] **Step 1: Implement.**
- [ ] **Step 2: Verify in browser:** counts update on add/delete; Download produces the named file and zeroes "not downloaded"; Load two exports from two private-window reviewers → both colors, filter chips hide/show each, badges count all; clicking a list entry in another section switches to it and flashes; unplaced entry shows version; both themes; 375px (drawer goes full width, bar stays usable). Simulate storage failure by overriding `localStorage.setItem` to throw in the console → bar shows the error.
- [ ] **Step 3: Commit** `Review mode: review bar, comment list and section counts`.

---

### Task 8: Sync server

**Files:**
- Create: `review-server/server.js`, `review-server/README.md`, `test/review-server.test.js`
- Modify: `package.json` (script), `.claude/launch.json` (config)

**Interfaces:**
- Produces: `export function createServer({key, dbPath, origins: string[]}) -> http.Server` (not listening; caller calls `.listen`), plus a CLI entry when run directly reading `REVIEW_KEY` (required; exit with a message if unset), `PORT` (8090), `HOST` (127.0.0.1), `REVIEW_DB` (`./tools/review.db`), `REVIEW_ORIGINS` (default `http://localhost:8318,http://localhost:8080`).
- Routes exactly as the spec's table. Responses JSON with `Content-Type: application/json`. CORS: echo `Origin` when it is in `origins`; preflight `OPTIONS` allows methods `GET, PUT, DELETE` and headers `Content-Type, X-Review-Key, X-Review-Owner`.
- SSE messages: `event: save\ndata: {"mark":{...}}` and `event: delete\ndata: {"id":"..."}`; `: ping` every 25 s.
- npm script `review-server`: `REVIEW_KEY=${REVIEW_KEY:-review} node review-server/server.js`. launch.json entry `review-server` (port 8090).

- [ ] **Step 1: Write failing tests** in `test/review-server.test.js`, each starting `createServer` on port 0 with a temp db file:
  - `GET /health` → 200 without a key; `GET /marks` without key → 401, wrong key → 401, right key → `{marks: []}`.
  - PUT mark (owner A) → 200; GET returns it; response bodies never contain `owner_hash` or `ownerToken`; a body that includes `ownerToken` is stored without it.
  - PUT same id with owner B → 403; with owner A → 200 and updated.
  - DELETE with owner B → 403; with owner A → 204; again → 404.
  - PUT with URL id ≠ body id → 400; missing `kind` → 400; 70 KB body → 400.
  - CORS: `OPTIONS /marks` with `Origin: http://localhost:8318` → 204 and `Access-Control-Allow-Origin` echoed; unknown origin → no allow header.
  - Events: open `GET /events?key=right` (read the stream with `fetch`), PUT a mark → stream yields `event: save` containing its id; `?key=wrong` → 401.
  - Persistence: close server, create a new one on the same db file → mark still listed.
- [ ] **Step 2: Run `npm test`.** Expected: FAIL.
- [ ] **Step 3: Implement `server.js`** with `DatabaseSync` from `node:sqlite`, prepared statements, `crypto.createHash("sha256")` for `owner_hash`, an in-memory `Set` of SSE responses.
- [ ] **Step 4: Run `npm test`.** Expected: PASS.
- [ ] **Step 5: Write README**: local run (`npm run review-server`); Ubuntu deploy: Node ≥ 22.13, copy `review-server/` to `/opt/aids-review`, systemd unit (`ExecStart=/usr/bin/node /opt/aids-review/server.js`, `Environment=REVIEW_KEY=… REVIEW_DB=/var/lib/aids-review/review.db REVIEW_ORIGINS=https://edc-aicc.github.io`, `StateDirectory=aids-review`, `DynamicUser=yes`, `Restart=on-failure`); both Caddy options (`reviews.kellerflint.com { reverse_proxy 127.0.0.1:8090 }`, or `handle_path /review-api/* { reverse_proxy 127.0.0.1:8090 }` inside the existing `courses.kellerflint.com` block, with `flush_interval -1` for the event stream); changing the passcode (edit the unit, `systemctl restart`); backing up (copy the db file); setting `reviewServer` in `site.json`.
- [ ] **Step 6: Commit** `Review mode: sync server`.

---

### Task 9: Sync client (`sync.js`)

**Files:**
- Create: `src/assets/review/sync.js`, `test/review-sync.test.js`

**Interfaces:**
- Consumes: `LocalStore` (Task 3), `mergeLoaded` (Task 2); server API (Task 8).
- Produces: `class SyncStore` with the same public methods as `LocalStore` plus `status() -> "connecting"|"live"|"offline"|"denied"` and `pendingCount()`. Constructor `(local: LocalStore, {server, passcode}, deps = {fetch, EventSource})`.
  - `save`/`remove`: delegate to `local` first, append `{op, id}` to `aids-review-pending` (collapsing repeats of the same id to the latest op), then `flush()`.
  - `flush()`: in order, `PUT /marks/:id` (body = the own mark) or `DELETE /marks/:id`; drop on 2xx, and on 404 for delete; stop on network error (`offline`) or 401 (`denied`).
  - `pull()`: `GET /marks`; marks whose `reviewerId` is mine are ignored, the rest replace the loaded set's server-sourced marks via `mergeLoaded`.
  - Events: `new EventSource(server + "/events?key=" + encodeURIComponent(passcode))`; on `open` → status `live`, `pull()`, `flush()`; on `save`/`delete` events update loaded marks and fire `onChange`; on `error` → `offline` (EventSource reconnects by itself). A 401 is detected by `pull()` failing with 401 → `denied` and the EventSource is closed.
- `review.js`/`page.js` construct `SyncStore` when `aids-review-sync.mode === "sync"`, else `LocalStore`. `page.js` enables the Sync option and fields (server defaults to the meta tag) and a "Test connection" button that runs `pull()` and reports the count or the error.

- [ ] **Step 1: Write failing tests** with a fake `fetch` and fake `EventSource`:
  - save while fetch rejects → `pendingCount() === 1`, `status() === "offline"`, `local.own()` contains the mark; `flush()` with working fetch → one PUT with headers `X-Review-Key` and `X-Review-Owner`, body without `ownerToken`, pending 0.
  - save then remove of the same id while offline → pending has one `remove`.
  - remove → DELETE; 404 still clears it.
  - `pull()` skips my `reviewerId`; 401 → `status() === "denied"`.
  - fake EventSource `open` → status `live`; dispatching a `save` event with another reviewer's mark → it appears in `all()` and `onChange` fires; a `delete` event removes it.
- [ ] **Step 2: Run `npm test`.** Expected: FAIL.
- [ ] **Step 3: Implement `sync.js` and wire store selection.**
- [ ] **Step 4: Run `npm test`.** Expected: PASS.
- [ ] **Step 5: Commit** `Review mode: sync client`.

---

### Task 10: End-to-end sync check, docs, final pass

**Files:**
- Modify: `README.md` (short "Review mode" section: `/review/` page, `?review` link, `npm run review-server`, pointer to `review-server/README.md`), spec's file list if anything moved.

- [ ] **Step 1: Two-reviewer check in the browser** with `site` and `review-server` running: window A (Sam) and private window B (Keller) both in Sync with server `http://127.0.0.1:8090`, passcode `review`. A comments → appears in B within ~2s without reload, in A's color. B cannot edit A's mark (no buttons; a direct PUT from B's console → 403). Wrong passcode in B → bar shows "passcode rejected", B's new comment stays local, fix passcode → it syncs. Stop the server, add a comment in A → "1 not synced"; restart → drains.
- [ ] **Step 2: Run `npm test`** (all pass) and `npm run build` (no errors); confirm `_site/review/index.html` exists and `grep -rl "review/review.js" _site/module-*/` finds no page that loads it statically.
- [ ] **Step 3: Author and path check:** review `git diff main` for names and paths (see Global Constraints); `grep -rn "/Users/" --exclude-dir=node_modules --exclude-dir=_site --exclude-dir=tools .` prints nothing new.
- [ ] **Step 4: Commit** `Review mode: docs`.
