import markdownIt from "markdown-it";

/* Also used to render markdown inside paired shortcodes, which CommonMark
   would otherwise leave alone once it is wrapped in a <div>. */
const md = markdownIt({ html: true, breaks: false, linkify: true });

const inline = (s) => md.renderInline((s || "").trim());
const block  = (s) => md.render((s || "").trim());

/* GitHub Pages serves a project site at /<repo>/, so the workflow passes
   ELEVENTY_PATH_PREFIX. Hand-built URLs must go through withPrefix(); the
   `| url` filter covers the rest. */
const PATH_PREFIX = process.env.ELEVENTY_PATH_PREFIX || "/";
const withPrefix = (p) =>
  ("/" + PATH_PREFIX + "/" + p).replace(/\/{2,}/g, "/");

/* Colab opens notebooks straight out of the repo. The notebooks hold this
   same value in the raw-CSV URL of their setup cell. */
const GITHUB_REPO = "kellerflint/AI-DS-development";
const colabUrl = (notebook) =>
  `https://colab.research.google.com/github/${GITHUB_REPO}/blob/main/notebooks/${notebook}`;

export default function (eleventyConfig) {
  eleventyConfig.setLibrary("md", md);

  /* Module 3's pages in reading order; the shell layout builds the sidebar
     and prev/next from this, so authors never write navigation by hand. */
  eleventyConfig.addCollection("m3", (api) =>
    api.getFilteredByGlob("src/module-3/*.md")
      .sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99)));

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
    <a class="activity-title" href="${src}" target="_blank" rel="noopener">${label}</a>
    <button class="activity-fullscreen-btn" type="button" title="Open fullscreen"
      onclick="(function(b){var f=b.closest('.activity-embed').querySelector('iframe');if(f.requestFullscreen)f.requestFullscreen();else if(f.webkitRequestFullscreen)f.webkitRequestFullscreen();})(this)">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
      Fullscreen
    </button>
  </div>
  <iframe src="${src}" title="${label}" style="height:${height}" loading="lazy" allowfullscreen></iframe>
</div>`;
  });

  eleventyConfig.addShortcode("section", function (title, time = "") {
    return `<div class="sectionbar">
  <span class="sectiontitle">${inline(title)}</span>
  ${time ? `<span class="sectiontime">${time}</span>` : ""}
</div>`;
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
    return `<div class="slot" style="min-height:${height}">
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

  eleventyConfig.addPairedShortcode("callout", function (content, kind = "") {
    return `<div class="callout ${kind}">\n${block(content)}\n</div>`;
  });

  eleventyConfig.addPairedShortcode("notebook", function (content, title, notebook = "") {
    const link = notebook
      ? `<a class="btn-colab" href="${colabUrl(notebook)}">Open in Colab →</a>`
      : `<a class="btn-colab is-placeholder" href="#" onclick="return false;">Open in Colab →</a>`;
    return `<div class="notebook"><h4>${inline(title)}</h4>\n${block(content)}\n${link}</div>`;
  });

  /* module and part are hidden fields on the Tally form; the loader that
     turns data-tally-src into src lives once in base.njk. */
  const TALLY_FORM = "NpxLEO";
  eleventyConfig.addShortcode("feedback", function (module, part) {
    const q = [
      "alignLeft=1",
      "hideTitle=1",
      "transparentBackground=1",
      "dynamicHeight=1",
      `module=${encodeURIComponent(module)}`,
      `part=${encodeURIComponent(part)}`,
    ].join("&");
    return `<div class="tally-embed-wrapper">
<iframe data-tally-src="https://tally.so/embed/${TALLY_FORM}?${q}" loading="lazy" width="100%" height="340" frameborder="0" marginheight="0" marginwidth="0" title="Data Modules Feedback"></iframe>
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
