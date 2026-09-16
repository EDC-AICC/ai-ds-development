# AI in Data Science

Course site. Static HTML built with [Eleventy](https://www.11ty.dev/) from markdown, deployed to GitHub Pages by `.github/workflows/pages.yml` on every push to `main`.

## Running it

```bash
npm install
npm run dev
```

Serves at <http://localhost:8080>. `npm run build` writes the site to `_site/`.

## Files

```
src/
  index.md              home page (module cards are generated from unit data)
  teaching-model.md     design notes for course staff
  course-details/       one unit: a single page
  module-1/             one unit: overview + parts
  module-3/             one unit: overview + parts
  activities/           self-contained interactive HTML, one file per activity
                        (see AUTHORING.md there before writing one)
  assets/css, js, img   site styles, scripts, images
  data/                 CSVs the notebooks load
  _includes/            layouts and shared partials
  _data/site.json       site name and footer
notebooks/              Colab notebooks
design/embed-demo.html  example of embedding one section in an LMS page
```

## Units and pages

A unit is a folder under `src/` with a `<folder>.11tydata.json` file:

```json
{
  "layout": "shell.njk",
  "module": {
    "key": "m1",
    "label": "Module 1",
    "title": "The AI-Enhanced Data Practitioner",
    "url": "/module-1/",
    "rank": 1,
    "kicker": "Module 01 · draft",
    "blurb": "One or two sentences for the home page card.",
    "status": "Full draft"
  }
}
```

`key` must be unique. `rank` orders the home page cards. Everything else is display text.

Each page in the unit is a markdown file with this frontmatter:

```yaml
---
order: 1            # 0 is the unit's overview page; parts count up from 1
title: Ask
navLabel: Ask       # optional: shorter name for the sidebar
crumb: Ask          # optional: replaces "Part 1 · Ask" in the breadcrumb and Next button
---
```

The sidebar, breadcrumb, and Back/Next buttons are generated from `order`. Adding a page means adding a file. Adding a unit means adding a folder and its data file.

## Writing a page

Content is split into sections. Each section starts with a marker and becomes one screen:

```
{% section "The setup", "setup" %}
```

The first argument is the title. The second is a required id (lowercase letters, digits, hyphens). The id is used in the URL hash and in embed links, so do not change it after the page is published.

Between markers, write markdown. Fenced code blocks tagged with a language (```python) are highlighted.

## Snippets

| Snippet | Use |
|---|---|
| `{% activity "file.html", "Title", "600px" %}` | Embed an activity from `src/activities/`. |
| `{% figure "file.png", "alt text", "caption" %}` | Image from `src/assets/img/`. Caption is optional. |
| `{% q "Question?" %}…{% endq %}` | Click-to-reveal answer. |
| `{% check "hint" %}…{% endcheck %}` | Groups several `q` blocks under a "Check yourself" label. |
| `{% fold "Title" %}…{% endfold %}` | Collapsed block. |
| `{% accordion %}…{% endaccordion %}` | Wraps several `fold` blocks and numbers them. |
| `{% optional "Title" %}…{% endoptional %}` | Collapsed block labeled Optional. |
| `{% callout %}…{% endcallout %}` | Side-rule note. Kinds: `"warn"`, `"highlight"`, `"checkpoint"`, `"takeaways"`. Titled: `{% callout "checkpoint", "Title" %}`. |
| `{% assignment "Title" %}…{% endassignment %}` | Work to set up as an Assignment in the CMS. |
| `{% discussion "Title" %}…{% enddiscussion %}` | Work to set up as a Discussion in the CMS. |
| `{% concept %}…{% endconcept %}` | Lesson summary box. Also `aihelps`, `aiprompt`, `aieval`. |
| `{% notebook "Title", "file.ipynb" %}…{% endnotebook %}` | Colab link for a notebook in `notebooks/`. |
| `{% slot "video", "note", "180px" %}` | Placeholder for something not built yet. Kinds: activity, video, notebook, figure, lesson. |
| `{% todo %}…{% endtodo %}` | Author note, shown muted. |
| `{% feedback %}` | Feedback form. Fills in the unit and page automatically. |

Snippets are defined in `eleventy.config.js`. Markdown works inside paired snippets.

## Embedding in an LMS

Add `?embed` to any page URL to get the content without the sidebar and navigation. Add `#section-id` to show one section, or leave it off for the whole page. Add `&theme=light` or `&theme=dark` to match the host page.

```html
<iframe src="https://SITE/module-1/04-decision-lab/?embed&theme=light#try-it-yourself-hr-retention-and-burnout-risk-model"
        width="100%" height="900" style="border:none"></iframe>
```

The frame posts `{type: "embed-height", height}` to its parent when its size changes; `design/embed-demo.html` shows how a host page can use that to size the iframe.

## Deployment

The site is a GitHub Pages project site, served from `/<repo>/`. The workflow sets `ELEVENTY_PATH_PREFIX` so links get that prefix; locally the prefix is `/`. Colab links point at `EDC-AICC/ai-ds-development` on the `main` branch.
