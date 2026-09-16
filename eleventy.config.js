import markdownIt from "markdown-it";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import "prismjs/components/prism-python.js"; /* loaded before init() below extends it */

/* Also used to render markdown inside paired shortcodes, which CommonMark
   would otherwise leave alone once it is wrapped in a <div>. */
const md = markdownIt({ html: true, breaks: false, linkify: true });
/* Every table is wrapped so wide ones scroll sideways on small screens
   instead of widening the page. */
md.renderer.rules.table_open = () => '<div class="tablescroll"><table>';
md.renderer.rules.table_close = () => "</table></div>";

const inline = (s) => md.renderInline((s || "").trim());
const block  = (s) => md.render((s || "").trim());
/* For shortcode arguments that land inside an HTML attribute. */
const attr = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/* GitHub Pages serves a project site at /<repo>/, so the workflow passes
   ELEVENTY_PATH_PREFIX. Hand-built URLs must go through withPrefix(); the
   `| url` filter covers the rest. */
const PATH_PREFIX = process.env.ELEVENTY_PATH_PREFIX || "/";
const withPrefix = (p) =>
  ("/" + PATH_PREFIX + "/" + p).replace(/\/{2,}/g, "/");

/* Colab opens notebooks straight out of the repo. The notebooks hold this
   same value in the raw-CSV URL of their setup cell. */
const GITHUB_REPO = "EDC-AICC/ai-ds-development";
const colabUrl = (notebook) =>
  `https://colab.research.google.com/github/${GITHUB_REPO}/blob/main/notebooks/${notebook}`;

export default function (eleventyConfig) {
  eleventyConfig.setLibrary("md", md);

  /* Fenced code (```python) is highlighted at build time; the colors live in
     style.css so they follow the site's light/dark tokens. */
  eleventyConfig.addPlugin(syntaxHighlight, {
    init({ Prism }) {
      /* Prism's Python grammar only colors names after "def"; treat any
         name followed by "(" as a call so df.fillna(0) reads the same way. */
      Prism.languages.insertBefore("python", "punctuation", {
        "function": /\b[a-zA-Z_]\w*(?=\s*\()/,
      });
    },
  });

  /* A unit's pages in reading order. Each unit folder declares itself in its
     directory data file ({ module: { key, label, title, url } }); the shell
     layout builds the sidebar and prev/next from this, so authors never
     write navigation by hand. */
  eleventyConfig.addFilter("unitPages", (coll, key) =>
    coll.filter((p) => p.data.module && p.data.module.key === key)
      .sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99)));

  /* The front page of every unit, in home-page order (module.rank). */
  eleventyConfig.addFilter("units", (coll) =>
    coll.filter((p) => p.data.module && p.data.order === 0)
      .sort((a, b) => (a.data.module.rank ?? 99) - (b.data.module.rank ?? 99)));

  eleventyConfig.addFilter("adjacent", (coll, url) => {
    const i = coll.findIndex((p) => p.url === url);
    return {
      prev: i > 0 ? coll[i - 1] : null,
      next: i >= 0 && i < coll.length - 1 ? coll[i + 1] : null,
    };
  });

  /* Activities are copied verbatim: the ignore keeps their inline JS away
     from Nunjucks, and the html-only copy keeps AUTHORING.md out of the site. */
  eleventyConfig.ignores.add("src/activities/**");
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/activities/*.html": "activities" });
  eleventyConfig.addPassthroughCopy("src/**/*.csv");

  eleventyConfig.addWatchTarget("src/assets/");

  eleventyConfig.addShortcode("activity", function (filename, title, height = "620px") {
    const src = withPrefix(`activities/${filename}`);
    const label = title || filename.replace(/\.html$/, "").replace(/-/g, " ");
    return `<div class="activity-embed">
  <div class="activity-header">
    <a class="activity-title" href="${src}" target="_blank" rel="noopener">${inline(label)}</a>
    <button class="activity-fullscreen-btn" type="button" title="Open fullscreen" data-fullscreen>
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
      Fullscreen
    </button>
  </div>
  <iframe src="${src}" title="${attr(label)}" style="height:${attr(height)}" loading="lazy" allowfullscreen></iframe>
</div>`;
  });

  /* {% section "Title", "id" %}. The id names the section in the sidebar
     link, the URL hash, and any embed URL, so it must not change when the
     title is edited. */
  eleventyConfig.addShortcode("section", function (title, id) {
    if (!id || !/^[a-z0-9][a-z0-9-]*$/.test(id)) {
      throw new Error(`{% section "${title}" %} in ${this.page.inputPath} needs an id: {% section "${title}", "short-id" %} (lowercase letters, digits, hyphens)`);
    }
    return `<div class="sectionbar" data-sec="${id}"><span class="sectiontitle">${inline(title)}</span></div>`;
  });

  eleventyConfig.addPairedShortcode("todo", function (content, label = "To write") {
    return `<div class="todo"><p class="todolabel">${inline(label)}</p>\n${block(content)}\n</div>`;
  });

  eleventyConfig.addShortcode("slot", function (kind, note = "", height = "220px") {
    const kinds = {
      activity: { label: "Activity", icon: "▦" },
      video:    { label: "Video",    icon: "▶" },
      notebook: { label: "Notebook", icon: "⌘" },
      figure:   { label: "Figure",   icon: "◫" },
      lesson:   { label: "Lesson",   icon: "▤" },
    };
    const k = kinds[kind] || kinds.activity;
    return `<div class="slot" style="min-height:${attr(height)}">
  <div class="slothead"><span class="sloticon">${k.icon}</span><span class="slotlabel">${k.label}</span></div>
  <div class="slotbody">${note ? inline(note) : "Not built yet."}</div>
</div>`;
  });

  eleventyConfig.addPairedShortcode("check", function (content, hint) {
    const h = hint
      ? `<p class="think-hint">${inline(hint)}</p>`
      : "";
    return `<div class="check"><p class="check-label">Check yourself</p>${h}\n${content}\n</div>`;
  });

  eleventyConfig.addPairedShortcode("q", function (content, question) {
    return `<details class="q"><summary>${inline(question)}</summary><div class="answer">\n${block(content)}\n</div></details>`;
  });

  /* {% callout %}, {% callout "warn" %}, {% callout "highlight" %} for a
     filled accent box, or {% callout "checkpoint", "Human Judgment Checkpoint" %}
     for a titled box (kinds: checkpoint, takeaways). */
  eleventyConfig.addPairedShortcode("callout", function (content, kind = "", title = "") {
    const t = title ? `<p class="callout-title">${inline(title)}</p>\n` : "";
    return `<div class="callout ${kind}">\n${t}${block(content)}\n</div>`;
  });

  /* Click-to-open blocks. {% fold "Title" %}…{% endfold %} is one item; wrap
     several in {% accordion %}…{% endaccordion %} to number them. */
  eleventyConfig.addPairedShortcode("fold", function (content, title) {
    return `<details class="fold"><summary>${inline(title)}</summary><div class="fold-body">\n${block(content)}\n</div></details>`;
  });
  eleventyConfig.addPairedShortcode("accordion", function (content) {
    return `<div class="accordion">\n${content}\n</div>`;
  });

  /* Optional material stays collapsed until the student opens it. */
  eleventyConfig.addPairedShortcode("optional", function (content, title) {
    return `<details class="optional"><summary><span class="pill pill-optional">Optional</span> ${inline(title)}</summary><div class="optional-body">\n${block(content)}\n</div></details>`;
  });

  /* Work that gets set up as an Assignment or Discussion in the course
     management system, presented on the page so every delivery looks the same. */
  const cmsBlock = (kind, label) =>
    function (content, title = "") {
      const h = title ? `<h4>${inline(title)}</h4>\n` : "";
      return `<div class="cms cms-${kind}"><p class="cms-label">${label}</p>\n${h}${block(content)}\n</div>`;
    };
  eleventyConfig.addPairedShortcode("assignment", cmsBlock("assignment", "Assignment"));
  eleventyConfig.addPairedShortcode("discussion", cmsBlock("discussion", "Discussion"));

  /* Images live in src/assets/img/. {% figure "file.png", "alt text", "caption" %} */
  eleventyConfig.addShortcode("figure", function (file, alt = "", caption = "") {
    const src = withPrefix(`assets/img/${file}`);
    const cap = caption ? `<figcaption>${inline(caption)}</figcaption>` : "";
    return `<figure class="figure"><img src="${src}" alt="${attr(alt)}" loading="lazy">${cap}</figure>`;
  });

  /* Lesson summary boxes, one per recurring beat of the theory segments:
     {% concept %}…{% endconcept %}, {% aihelps %}, {% aiprompt %}, {% aieval %}. */
  const lessonBox = (kind, label) =>
    function (content) {
      return `<div class="lbox lbox-${kind}"><p><strong class="lbox-label">${label}:</strong> ${inline(content)}</p></div>`;
    };
  eleventyConfig.addPairedShortcode("concept", lessonBox("concept", "Concept"));
  eleventyConfig.addPairedShortcode("aihelps", lessonBox("helps", "How AI Helps"));
  eleventyConfig.addPairedShortcode("aiprompt", lessonBox("prompt", "Example AI Prompt"));
  eleventyConfig.addPairedShortcode("aieval", lessonBox("eval", "Evaluating AI Output"));

  eleventyConfig.addPairedShortcode("notebook", function (content, title, notebook = "") {
    const link = notebook
      ? `<a class="btn-colab" href="${colabUrl(notebook)}">Open in Colab →</a>`
      : `<a class="btn-colab is-placeholder" href="#" onclick="return false;">Open in Colab →</a>`;
    return `<div class="notebook"><h4>${inline(title)}</h4>\n${block(content)}\n${link}</div>`;
  });

  /* {% feedback %} with no arguments. The Tally form's hidden "module" and
     "part" fields get the unit label and page title, so responses stay
     readable if numbering ever changes. */
  const TALLY_FORM = "NpxLEO";
  eleventyConfig.addShortcode("feedback", function () {
    const unit = this.ctx.module ? this.ctx.module.label : "";
    const part = this.ctx.order === 0 ? `${this.ctx.title} (overview)` : this.ctx.title;
    const q = [
      "alignLeft=1",
      "hideTitle=1",
      "transparentBackground=1",
      "dynamicHeight=1",
      `module=${encodeURIComponent(unit)}`,
      `part=${encodeURIComponent(part)}`,
    ].join("&");
    return `<div class="tally-embed-wrapper">
<iframe data-tally-src="https://tally.so/embed/${TALLY_FORM}?${q}" loading="lazy" width="100%" height="340" frameborder="0" marginheight="0" marginwidth="0" title="Course feedback"></iframe>
</div>`;
  });

  return {
    pathPrefix: PATH_PREFIX,
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["md", "njk", "html"],
  };
}
