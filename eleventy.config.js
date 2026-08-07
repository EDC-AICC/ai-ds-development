import markdownIt from "markdown-it";

/* One markdown instance, used both for the page pipeline and for rendering
   markdown that appears *inside* paired shortcodes. Without the second use,
   CommonMark would leave anything wrapped in a <div> unprocessed.          */
const md = markdownIt({ html: true, breaks: false, linkify: true });

const inline = (s) => md.renderInline((s || "").trim());
const block  = (s) => md.render((s || "").trim());

/* Where the site is served from. Root locally; GitHub Pages serves a project
   site at /<repo>/, so the workflow passes ELEVENTY_PATH_PREFIX=/<repo>/.
   Anything that builds a URL by hand has to go through withPrefix() — the
   `| url` filter handles the rest.                                          */
const PATH_PREFIX = process.env.ELEVENTY_PATH_PREFIX || "/";
const withPrefix = (p) =>
  ("/" + PATH_PREFIX + "/" + p).replace(/\/{2,}/g, "/");

/* owner/repo on GitHub. Colab opens notebooks straight out of the repo, so
   this is the one place that knows where the repo lives. Change it here and
   every "Open in Colab" button follows. The notebooks themselves hold the
   same value in the raw-CSV URL of their setup cell. */
const GITHUB_REPO = "kellerflint/AI-DS-development";
const colabUrl = (notebook) =>
  `https://colab.research.google.com/github/${GITHUB_REPO}/blob/main/notebooks/${notebook}`;

export default function (eleventyConfig) {
  eleventyConfig.setLibrary("md", md);

  /* ---- static passthrough ----
     Activities are hand-written, self-contained HTML. They must be copied
     verbatim, never run through the template engine — their inline JS is not
     Nunjucks and must not be parsed as such. The ignore is what keeps them
     out of the template pipeline; the copy is html-only so AUTHORING.md
     stays a source document rather than something the site serves.          */
  eleventyConfig.ignores.add("src/activities/**");
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/activities/*.html": "activities" });
  eleventyConfig.addPassthroughCopy("src/**/*.csv");

  eleventyConfig.addWatchTarget("src/assets/");

  /* =========================================================
     SHORTCODES — so lesson prose stays markdown
     ========================================================= */

  /* {% activity "six-phases.html", "The six phases", "620px" %}

     The title is a real link to the standalone activity, so any activity can be
     opened on its own, linked to, or embedded by someone else. Fullscreen is an
     inline handler on the button — no page-level script to wire it up.

     Every activity lives in the top-level activities/ folder, whatever page
     embeds it.                                                                */
  eleventyConfig.addShortcode("activity", function (filename, title, height = "620px") {
    /* All activities live in the one top-level activities/ folder. */
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

  /* {% section "Do it for real", "~35 min" %} — student-facing divider.
     The six phases shape these pages but are never named on them; phase
     numbers live in HTML comments in the source, for authors only.        */
  eleventyConfig.addShortcode("section", function (title, time = "") {
    return `<div class="sectionbar">
  <span class="sectiontitle">${inline(title)}</span>
  ${time ? `<span class="sectiontime">${time}</span>` : ""}
</div>`;
  });

  /* {% todo %}note to self{% endtodo %} — label + slate text, no box */
  eleventyConfig.addPairedShortcode("todo", function (content, label = "To write") {
    return `<div class="todo"><p class="todolabel">${inline(label)}</p>\n${block(content)}\n</div>`;
  });

  /* {% slot "activity", "what goes here" %} — same shell as a real activity card */
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

  /* {% check %} … {% endcheck %}  — wraps a group of {% q %} blocks */
  eleventyConfig.addPairedShortcode("check", function (content, hint) {
    const h = hint
      ? `<p class="think-hint">${inline(hint)}</p>`
      : "";
    return `<div class="check"><p class="check-label">Check yourself</p>${h}\n${content}\n</div>`;
  });

  /* {% q "the question" %} the answer {% endq %} */
  eleventyConfig.addPairedShortcode("q", function (content, question) {
    return `<details class="q"><summary>${inline(question)}</summary><div class="answer">\n${block(content)}\n</div></details>`;
  });

  /* {% callout %} … {% endcallout %}   ·  {% callout "warn" %} */
  eleventyConfig.addPairedShortcode("callout", function (content, kind = "") {
    return `<div class="callout ${kind}">\n${block(content)}\n</div>`;
  });

  /* {% notebook "Notebook 3.1 — Loading and standardizing", "#" %} … {% endnotebook %} */
  /* Second argument is a notebook filename under notebooks/, not a full URL,
     so the repo lives in GITHUB_REPO alone. Pass nothing for a dead button. */
  eleventyConfig.addPairedShortcode("notebook", function (content, title, notebook = "") {
    const link = notebook
      ? `<a class="btn-colab" href="${colabUrl(notebook)}">Open in Colab →</a>`
      : `<a class="btn-colab is-placeholder" href="#" onclick="return false;">Open in Colab →</a>`;
    return `<div class="notebook"><h4>${inline(title)}</h4>\n${block(content)}\n${link}</div>`;
  });

  /* Tally feedback form. `module` and `part` are hidden fields on the form,
     passed through as query parameters so each response says where it came
     from. The embed loader lives once in base.njk. */
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
