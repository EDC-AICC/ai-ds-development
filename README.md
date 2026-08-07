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
  module-3/           module pages
  activities/         self-contained interactive HTML one file per activity
                      see AUTHORING.md there before writing one
  assets/             css and js
  data/               CSVs the notebooks load
  _includes/          layouts
  _data/              site name and footer
notebooks/            Colab notebooks
```

Pages are markdown with a set of shortcodes defined in `eleventy.config.js`: `{% section %}`, `{% activity %}`, `{% slot %}`, `{% check %}` / `{% q %}`, `{% notebook %}`, `{% todo %}`, `{% callout %}`, `{% feedback %}`.
