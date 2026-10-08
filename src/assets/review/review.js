/* Review mode on lesson pages: highlights, comment cards, the review bar.
   Loaded by site.js only when review mode is on. */

import { findQuote } from "./core.js";
import { textIndex, unwrapAll, wrap } from "./dom.js";
import { openStore, pagePath } from "./open.js";
import { colorClass } from "./ui.js";

const root = document.querySelector("[data-review-root]");
let store;

function sectionEl(id) {
  return id ? root.querySelector(`section[data-sec="${CSS.escape(id)}"]`) : null;
}

function activityFrame(name) {
  return [...root.querySelectorAll(".activity-embed iframe")]
    .find((f) => f.getAttribute("src").split("/").pop() === name) || null;
}

/* Draws every mark for this page. A mark is looked for in its own section,
   then anywhere on the page; one that can't be found is "unplaced" and shows
   only in the comment list. */
export function render() {
  unwrapAll(root);
  const myId = store.me().reviewerId;
  const here = pagePath();
  const placed = [], unplaced = [];
  const marks = store.all().filter((m) => m.page === here)
    .sort((a, b) => a.created.localeCompare(b.created));
  for (const m of marks) {
    if (m.kind === "activity") {
      (activityFrame(m.activity) ? placed : unplaced).push(m);
      continue;
    }
    let scope = sectionEl(m.section) || root;
    let at = findQuote(textIndex(scope).text, m.quote);
    if (!at && scope !== root) { scope = root; at = findQuote(textIndex(root).text, m.quote); }
    if (!at) { unplaced.push(m); continue; }
    const els = wrap(scope, at.start, at.end, {
      className: `rv-mark ${colorClass(m.reviewerId, myId)}${m.kind === "suggest" ? " rv-del" : ""}`,
      dataset: { id: m.id },
    });
    if (m.kind === "suggest" && els.length) {
      const ins = document.createElement("ins");
      ins.className = `rv-ins ${colorClass(m.reviewerId, myId)}`;
      ins.setAttribute("data-rv-ui", "");
      ins.dataset.id = m.id;
      ins.textContent = m.replacement;
      els[els.length - 1].after(ins);
    }
    placed.push(m);
  }
  return { placed, unplaced };
}

export default function start() {
  /* The /review/ control page has its own script. */
  if (!root || document.querySelector("[data-review-panel]")) return;
  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = new URL("./review.css", import.meta.url).href;
  document.head.appendChild(css);
  store = openStore();
  store.onChange(render);
  render();
}

start();
