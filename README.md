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
  teaching-model.md     design notes for course staff (not linked; open /teaching-model/ directly)
  review.njk            review mode controls for course staff (not linked; open /review/ directly)
  course-details/       one unit: a single page
  module-1/             one unit: overview + parts
  module-2/             one unit: overview + parts
  module-3/             one unit: overview + parts
  module-4/             one unit: overview + parts
  activities/           self-contained interactive HTML, one file per activity
                        (see AUTHORING.md there before writing one)
  assets/css, js, img   site styles, scripts, images
  assets/review/        review mode (loaded only for reviewers)
  data/                 CSVs the notebooks load
  _includes/            layouts and shared partials
  _data/site.json       site name and footer
notebooks/              Colab notebooks
review-server/          optional sync server for review mode
test/                   npm test
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
order: 3                    # 0 is the unit's overview page; parts count up from 1
title: "When AI Fails: Risks, Hallucinations, and Silent Logic Bugs"
navLabel: When AI Fails     # optional: shorter name for the sidebar and Next button
---
```

The sidebar, breadcrumb, and Back/Next buttons are generated from `order` and `title`. Adding a page means adding a file. Adding a unit means adding a folder and its data file.

`src/module-1-rebuild/` is a rebuild of Module 1, published beside the current draft in `src/module-1/` so the two can be compared. It uses the practice blocks described below. Once a decision is made, it either replaces `src/module-1/` or is deleted; nothing else depends on it.

## Writing a page

Content is split into sections. Each section starts with a marker and becomes one screen:

```
{% section "The setup", "setup" %}
```

The first argument is the title. The second is a required id (lowercase letters, digits, hyphens). The id is used in the URL hash and in embed links, so do not change it after the page is published.

Between markers, write markdown. Fenced code blocks tagged with a language (```python) are highlighted. Tables scroll sideways on narrow screens automatically.

Plain HTML is allowed where markdown falls short.

## Snippets

| Snippet | Use |
|---|---|
| `{% activity "file.html", "Title", "600px" %}` | Embed an activity from `src/activities/`. |
| `{% figure "file.png", "alt text", "caption" %}` | Image from `src/assets/img/`. Caption is optional. |
| `{% video "1227479005", "Title", "m3-understand.txt" %}` | Vimeo video by its numeric id, kept at 16:9. The optional third argument is a transcript in `src/assets/transcripts/`, shown under the video with Copy and Open buttons. |
| `{% examplecode "module-4/app.py", "Python (Streamlit)" %}` | A code file from `src/assets/code/`, highlighted, in a block that starts closed, with Copy and Download buttons. |
| `{% q "Question?" %}…{% endq %}` | Click-to-reveal answer. |
| `{% check "hint" %}…{% endcheck %}` | Groups several `q` blocks under a "Check yourself" label. |
| `{% fold "Title" %}…{% endfold %}` | Collapsed block. |
| `{% accordion %}…{% endaccordion %}` | Wraps several `fold` blocks and numbers them. |
| `{% optional "Title" %}…{% endoptional %}` | Collapsed block labeled Optional. |
| `{% callout %}…{% endcallout %}` | Side-rule note. Kinds: `"warn"`, `"highlight"`, `"checkpoint"`, `"takeaways"`. Titled: `{% callout "checkpoint", "Title" %}`. |
| `{% assignment "Title" %}…{% endassignment %}` | Work to set up as an Assignment in the CMS. |
| `{% discussion "Title" %}…{% enddiscussion %}` | Work to set up as a Discussion in the CMS. |
| `{% tryit %}…{% endtryit %}` | Hands-on exercise, shown as a card. |
| `{% tip %}…{% endtip %}` | Short aside with a Tip label. |
| `{% iconbox "file.png" %}…{% endiconbox %}` | Shaded box with a small image from `src/assets/img/` on the left. |
| `{% concept %}…{% endconcept %}` | Lesson summary box. Also `aihelps`, `aiprompt`, `aieval`. |
| `{% notebook "Title", "file.ipynb" %}…{% endnotebook %}` | Colab link for a notebook in `notebooks/`. |
| `{% slot "video", "note", "180px" %}` | Placeholder for something not built yet. Kinds: activity, video, notebook, figure, lesson. |
| `{% todo %}…{% endtodo %}` | Author note, shown muted. |
| `{% feedback "module" %}` | Feedback form for a module's closing "Feedback on This Module" section, the last section of its last page. Every page also has a Feedback button in the top bar that opens the same form tagged with the module, page and section. |

Snippets are defined in `eleventy.config.js`. Markdown works inside paired snippets.

## Practice blocks

Four blocks put a question on the page and check it. Each one is written as plain text in the lesson, so changing a question, an option or its feedback is an edit to a sentence. To remove one, delete its lines; the text around it still reads as a lesson. With JavaScript off they still work as click-to-reveal.

**Pause and answer.** A question with a box to type in (nothing is saved) and a sample answer to open.

```
{% reflect "The script ran without an error. What did it get wrong?" %}
The sample answer goes here.
{% endreflect %}
```

**Multiple choice.** Each option starts with `[ ]`, and the right one with `[x]`. The line under an option is what the student sees when they pick it. Keep the options about the same length, and say what the picked option would do instead of "wrong".

```
{% choice "Which next step fixes the list?" %}
[ ] Run the script a second time.
    A second run adds the same rows and returns the same total.
[x] Tell the AI which orders count, then rerun it.
    This puts the shop's rule into the script.
{% endchoice %}
```

**Typed answer.** The right answer is the second value; give several as `"400 | four hundred"`. Numbers match however they are typed (`$400`, `400.00`). A line starting `If 1840:` is shown to a student who types 1840. The `Hint:` line is shown for any other wrong answer. Everything else is the explanation, shown once they are right, and it should state the answer.

```
{% answer "How much has Dana spent, in dollars?", "400" %}
Hint: Read the status of each order before you add its amount.
If 1840: $1,840 comes from adding all four rows.
$400. Two of the four orders were completed.
{% endanswer %}
```

**Sort.** The prompt, then the name of each pile. Each item starts with the number of the pile it belongs in, and the line under it is the reason.

```
{% sort "Decide who can do each one.", "AI can do it", "Needs you" %}
[1] Write the code that joins the two tables
    Joins like this are standard code.
[2] Decide whether a refunded order counts
    This is a rule about how the shop does business.
{% endsort %}
```

`{% smalltable "Dana Whitfield's orders" %}…{% endsmalltable %}` around a markdown table makes a short table fit a phone screen instead of scrolling sideways, and gives it a title. Use it when a question depends on every column being visible. The title is optional; it is shown above the table and is what a screen reader announces as the table's name.

The blocks are defined in `eleventy.config.js` under "practice blocks", styled in `style.css`, and checked by `src/assets/js/blocks.js`. A block written wrongly (no `[x]`, a pile number that doesn't exist) stops the build with a message naming the page.

## Embedding in an LMS

Add `?embed` to any page URL to get the content without the sidebar and navigation. Add `#section-id` to show one section, or leave it off for the whole page. Add `&theme=light` or `&theme=dark` to match the host page.

```html
<iframe src="https://SITE/module-1/04-decision-lab/?embed&theme=light#try-it-yourself-hr-retention-and-burnout-risk-model"
        width="100%" height="900" style="border:none"></iframe>
```

The frame posts `{type: "embed-height", height}` to its parent when its size changes; `design/embed-demo.html` shows how a host page can use that to size the iframe.

## Review mode

Course staff can comment on the site directly. Open `/review/` (linked from the home page under
Instructor resources), enter a name, and turn review mode on (or send someone any page link with `?review` added). Then select text on any page to comment
or suggest an edit; activities get a "Comment on this activity" button. Students never load any
of this: it only runs in a browser where review mode is on, and never in `?embed` frames.

Comments are saved in the reviewer's browser. **Download** makes a review file
(`review-<name>-<date>.json`) where every comment names its source file, section, quoted text
and the site version it was made against. **Load** shows any number of those files on the page at
once, one color per reviewer, without mixing them into your own download.

With the optional sync server, reviewers see each other's comments as they're made instead.
`/review/` offers it while `reviewSync` in `src/_data/site.json` is `true`. The server's address
is never built into the site, which is public: reviewers enter it with the passcode, or open a
setup link (`/review/#server=…&key=…`, made with **Copy setup link**) that fills both in. To try
it locally, run `npm run review-server` (passcode `review`) and open
`/review/#server=http://127.0.0.1:8090&key=review`. `review-server/README.md` covers deploying
it and importing review files people downloaded before it existed.

`npm test` runs the tests for the review logic, the stores and the server.

## Deployment

The site is a GitHub Pages project site, served from `/<repo>/`. The workflow sets `ELEVENTY_PATH_PREFIX` so links get that prefix; locally the prefix is `/`. Colab links point at `EDC-AICC/ai-ds-development` on the `main` branch.
