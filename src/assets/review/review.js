/* Review mode on lesson pages: highlights, comment cards, the review bar.
   Loaded by site.js only when review mode is on. */

import { closeAll, editorOpen, openCard, openEditor, showPopup, toast } from "./cards.js";
import { findQuote, makeQuote, newMark } from "./core.js";
import { offsetsOf, sectionOf, textIndex, unwrapAll, wrap } from "./dom.js";
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
  renderActivityButtons(placed);
  return { placed, unplaced };
}

/* ---------- making and changing comments ---------- */

const byId = (id) => store.all().find((m) => m.id === id);

/* Saves through the store; returns an error message for the editor, or null. */
function commit(mark, name) {
  if (name) store.setName(name);
  const r = store.save({ ...mark, reviewer: store.me().name });
  return r.ok ? null : r.error;
}

function edit(m, rect) {
  openEditor({
    rect, kind: m.kind, quote: m.quote, activity: m.activity, comment: m.comment, replacement: m.replacement,
    onSave: (f) => commit({ ...m, comment: f.comment, replacement: m.kind === "suggest" ? f.replacement : "" }),
  });
}

function remove(m) {
  if (!confirm("Delete this comment?")) return;
  closeAll();
  const r = store.remove(m.id);
  if (!r.ok) toast(r.error);
}

function create(rect, fields) {
  openEditor({
    rect, ...fields, needName: !store.me().name,
    onSave: (f) => commit(newMark({
      ...fields,
      comment: f.comment,
      replacement: fields.kind === "suggest" ? f.replacement : "",
      page: pagePath(),
      src: root.dataset.reviewSrc,
      version: root.dataset.reviewVersion,
    }, { ...store.me(), name: f.name || store.me().name }), f.name),
  });
}

/* What the reader has selected, as a quote in its section; or an error. */
function currentSelection() {
  const sel = getSelection();
  if (!sel.rangeCount || sel.isCollapsed) return null;
  const range = sel.getRangeAt(0);
  const inUi = (n) => (n.nodeType === 1 ? n : n.parentElement).closest("[data-rv-ui]");
  if (!root.contains(range.commonAncestorContainer) || inUi(range.startContainer) || inUi(range.endContainer)) return null;
  const section = sectionOf(range.startContainer);
  if (section !== sectionOf(range.endContainer)) {
    return { error: "Comments can't cross sections. Select text within one section." };
  }
  const scope = sectionEl(section) || root;
  const at = offsetsOf(scope, range);
  if (!at) return null;
  /* A drag that starts or ends mid-word takes the whole word, as reviewers
     mean it and as the author will read it in the file. */
  const text = textIndex(scope).text, word = /[\p{L}\p{N}'’]/u;
  while (at.start > 0 && word.test(text[at.start - 1]) && word.test(text[at.start])) at.start--;
  while (at.end < text.length && word.test(text[at.end]) && word.test(text[at.end - 1])) at.end++;
  return { section, quote: makeQuote(text, at.start, at.end), rect: range.getBoundingClientRect() };
}

let selTimer = 0;
function onSelection() {
  clearTimeout(selTimer);
  selTimer = setTimeout(() => {
    if (editorOpen()) return;
    const s = currentSelection();
    if (!s) return;
    if (s.error) { closeAll(); toast(s.error); return; }
    showPopup(s.rect, {
      comment: () => create(s.rect, { kind: "comment", section: s.section, quote: s.quote }),
      suggest: () => create(s.rect, { kind: "suggest", section: s.section, quote: s.quote }),
    });
  }, 10);
}

/* Every comment under the click: the highlight and any it sits inside. */
function onMarkClick(e) {
  if (!getSelection().isCollapsed) return;
  const hit = e.target.closest("mark.rv-mark, .rv-ins");
  if (!hit || !root.contains(hit)) return;
  const ids = [];
  for (let el = hit; el && el !== root; el = el.parentElement) {
    if (el.matches("mark.rv-mark, .rv-ins") && !ids.includes(el.dataset.id)) ids.push(el.dataset.id);
  }
  showMarks(ids.map(byId).filter(Boolean), hit.getBoundingClientRect());
}

function showMarks(marks, rect, onAdd) {
  openCard({
    rect, marks, myId: store.me().reviewerId, onAdd,
    onEdit: (m) => edit(m, rect),
    onDelete: remove,
  });
}

/* ---------- activities: commented on as a whole ---------- */

function renderActivityButtons(placed) {
  root.querySelectorAll(".activity-embed").forEach((card) => {
    const name = card.querySelector("iframe").getAttribute("src").split("/").pop();
    let btn = card.querySelector(".rv-activity-btn");
    if (!btn) {
      btn = document.createElement("button");
      btn.type = "button";
      btn.className = "rv-activity-btn";
      btn.setAttribute("data-rv-ui", "");
      btn.addEventListener("click", () => {
        const rect = btn.getBoundingClientRect();
        const marks = store.all().filter((m) => m.kind === "activity" && m.activity === name && m.page === pagePath());
        const add = () => create(rect, { kind: "activity", activity: name, section: sectionOf(card) });
        if (marks.length) showMarks(marks, rect, add);
        else add();
      });
      const header = card.querySelector(".activity-header");
      header.insertBefore(btn, header.querySelector(".activity-fullscreen-btn"));
    }
    const n = placed.filter((m) => m.kind === "activity" && m.activity === name).length;
    btn.setAttribute("aria-label", `Comment on this activity${n ? `, ${n} so far` : ""}`);
    btn.innerHTML = `Comment<span class="rv-long"> on this activity</span>${n ? ` <span class="rv-badge">${n}</span>` : ""}`;
  });
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
  document.addEventListener("mouseup", onSelection);
  document.addEventListener("keyup", (e) => { if (e.shiftKey || e.key === "Shift") onSelection(); });
  document.addEventListener("selectionchange", () => {
    /* touch selection has no mouseup; wait for the handles to settle */
    if (matchMedia("(pointer: coarse)").matches) { clearTimeout(selTimer); selTimer = setTimeout(onSelection, 400); }
  });
  root.addEventListener("click", onMarkClick);
}

start();
