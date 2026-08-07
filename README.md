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
  module-3/           the module: index
  activities/         self-contained interactive HTML one file per activity
  assets/             css and js
  data/               the CSVs the notebooks load
  _includes/          layouts
  _data/              site name and footer
notebooks/            Colab notebooks, edited directly
```

Pages are markdown with a set of shortcodes defined in `eleventy.config.js`: `{% section %}`, `{% activity %}`, `{% slot %}`, `{% check %}` / `{% q %}`, `{% notebook %}`, `{% todo %}`, `{% callout %}`, `{% feedback %}`.

## If the repo is renamed or moved

Three places hardcode `owner/repo`, because Colab and the notebooks reach these files over HTTP and need absolute URLs:

- `eleventy.config.js` — `GITHUB_REPO`, which builds every "Open in Colab" link
- `notebooks/m3-explore.ipynb` and `notebooks/m3-build.ipynb` — the raw-CSV URL in each setup cell

Miss one and the button opens a notebook that cannot find its data.

`src/data/outpatient_visits_clean.csv` is not loaded by anything yet. It is the cleaned file the Analyze and Share notebooks will want once those are written.

## Status

Module 3 is a scaffolded proposal rather than a finished course. Parts 1 and 2 are written through their activities; Parts 3 to 6 carry marked placeholders where teaching content goes. The gaps are deliberate and visible. See the hand-back notes in the `data-curriculum` working repo for the open questions behind them.
