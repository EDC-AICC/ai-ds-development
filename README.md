# AI in Data Science

Course site for an AI in Data Science module aimed at community college students. Built with [Eleventy](https://www.11ty.dev/), deployed to GitHub Pages by `.github/workflows/pages.yml` on every push to `main`.

## Running it

```bash
npm install
npm run dev
```

That serves at <http://localhost:8080>. `npm run build` writes to `_site/`.

## Layout

```
src/
  index.md            all-modules landing page
  module-3/           the module: index, six parts, and an unlisted workshop page
  activities/         self-contained interactive HTML, one file per activity
  assets/             css and js
  data/               the CSVs the notebooks load
  _includes/          layouts
  _data/              site name and footer
notebooks/            Colab notebooks, generated (see below)
scripts/              generators for the notebooks and the cleaned CSV
```

Pages are markdown with a set of shortcodes defined in `eleventy.config.js`: `{% section %}`, `{% activity %}`, `{% slot %}`, `{% check %}` / `{% q %}`, `{% notebook %}`, `{% todo %}`, `{% callout %}`, `{% feedback %}`.

## Regenerating notebooks and data

Notebooks are JSON, and hand-editing JSON invites drift, so they are generated and committed.

```bash
python3 scripts/make_notebooks.py
python3 scripts/make_clean_csv.py
```

## Where the repo name lives

Two files hardcode `owner/repo` so that Colab and the notebooks can reach files over HTTP:

- `eleventy.config.js` — `GITHUB_REPO`, used to build every "Open in Colab" link
- `scripts/make_notebooks.py` — the same value in the raw-CSV URLs baked into notebook setup cells

Renaming or moving the repo means changing both, then re-running the notebook generator.

## Status

Module 3 is a scaffolded proposal rather than a finished course. Parts 1 and 2 are written through their activities; Parts 3 to 6 carry marked placeholders where teaching content goes. The gaps are deliberate and visible. See the hand-back notes in the `data-curriculum` working repo for the open questions behind them.
