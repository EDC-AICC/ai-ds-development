/* Review mode: the floating review bar and the comment list drawer.
   review.js owns the marks and rendering; this file draws what it is given
   and reports clicks back through the callbacks passed to mountPanel. */

import { toast } from "./cards.js";
import { KIND_LABEL, colorClass, downloadJson, esc, loadMessage, markBody, readFiles, reviewerChips } from "./ui.js";

let bar, drawer, store, cb;

/* callbacks: { goTo(mark), toggleReviewer(id), hidden: Set, rename() } */
export function mountPanel(theStore, callbacks) {
  store = theStore;
  cb = callbacks;

  bar = document.createElement("div");
  bar.className = "rv-bar";
  bar.setAttribute("data-rv-ui", "");
  bar.innerHTML = `
    <p class="rv-bar-status" role="status"></p>
    <div class="rv-bar-actions">
      <button type="button" class="rv-btn" data-list aria-expanded="false">Comments</button>
      <button type="button" class="rv-btn" data-download>Download</button>
      <label class="rv-btn" tabindex="0">Load<input type="file" class="rv-file" accept=".json,application/json" multiple></label>
      <button type="button" class="rv-btn" data-exit title="Turn off review mode">Exit</button>
    </div>`;
  document.body.appendChild(bar);

  drawer = document.createElement("aside");
  drawer.className = "rv-drawer";
  drawer.setAttribute("data-rv-ui", "");
  drawer.setAttribute("aria-label", "Comments on this page");
  drawer.hidden = true;
  document.body.appendChild(drawer);

  bar.addEventListener("click", (e) => {
    if (e.target.closest("[data-list]")) toggleDrawer();
    else if (e.target.closest("[data-download]")) {
      const { filename, data } = store.exportFile();
      downloadJson(filename, data);
    } else if (e.target.closest("[data-exit]")) {
      store.setOn(false);
      location.reload();
    } else if (e.target.closest("[data-rename]")) cb.rename();
  });
  const file = bar.querySelector("input[type=file]");
  bar.querySelector("label.rv-btn").addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); file.click(); }
  });
  file.addEventListener("change", async () => {
    const files = await readFiles(file.files);
    toast(loadMessage(store.loadFiles(files), files.length));
    file.value = "";
  });
  drawer.addEventListener("click", (e) => {
    if (e.target.closest("[data-close]")) return toggleDrawer(false);
    const item = e.target.closest("[data-goto]");
    if (!item) return;
    const m = store.all().find((x) => x.id === item.dataset.goto);
    if (!m) return;
    if (matchMedia("(max-width: 700px)").matches) toggleDrawer(false);
    cb.goTo(m);
  });
}

/* In sync mode: a dot and a word for the connection, before the counts. */
function syncNote() {
  const st = store.status(), n = store.pendingCount();
  const text = {
    live: "Live",
    connecting: "Connecting…",
    offline: `Offline${n ? ` · ${n} not synced` : ""}`,
    denied: `Passcode rejected${n ? ` · ${n} not synced` : ""}`,
  }[st];
  return `<span class="rv-sync-note rv-sync-${st}"><span class="rv-sync-dot"></span>${text}</span> · `;
}

function toggleDrawer(show = drawer.hidden) {
  drawer.hidden = !show;
  bar.querySelector("[data-list]").setAttribute("aria-expanded", String(show));
  document.body.classList.toggle("rv-drawer-open", show);
}

/* status: { error?, sync? } — an error replaces the counts until cleared. */
export function updatePanel({ placed, unplaced, sections, error }) {
  const me = store.me();
  const own = store.own().length, todo = store.unexportedCount();
  const who = me.name
    ? `Reviewing as <button type="button" class="rv-link" data-rename>${esc(me.name)}</button>`
    : `<button type="button" class="rv-link" data-rename>Set your name</button>`;
  bar.querySelector(".rv-bar-status").innerHTML = (store.status ? syncNote() : "") + (error
    ? `<span class="rv-bar-error">${esc(error)}</span>`
    : `${who} · ${own} comment${own === 1 ? "" : "s"}` +
      (todo ? ` · <b>${todo} not downloaded</b>` : own ? " · all downloaded" : ""));

  const myId = me.reviewerId;
  const all = [...placed, ...unplaced];
  const shown = (m) => !cb.hidden.has(m.reviewerId);
  const item = (m) => `
    <li class="rv-item ${colorClass(m.reviewerId, myId)}">
      <button type="button" class="rv-goto" data-goto="${esc(m.id)}">
        <span class="rv-meta"><span class="rv-dot"></span><b>${esc(m.reviewer || "Unnamed")}</b>${m.reviewerId === myId ? " (you)" : ""} · ${KIND_LABEL[m.kind]}</span>
        ${markBody(m)}
      </button>
    </li>`;
  let html = `<div class="rv-drawer-head"><p><b>Comments on this page</b> <span class="rv-help">${all.length}</span></p>
    <button type="button" class="rv-btn" data-close aria-label="Close comments">✕</button></div>`;
  const placedShown = placed.filter(shown);
  if (!all.length) html += `<p class="rv-help">No comments on this page yet. Select any text to add one.</p>`;
  sections.forEach(({ id, title }) => {
    const list = placedShown.filter((m) => (m.section || "") === (id || ""));
    if (list.length) html += `<p class="rv-sec">${esc(title)}</p><ul class="rv-list">${list.map(item).join("")}</ul>`;
  });
  const lost = unplaced.filter(shown);
  if (lost.length) {
    html += `<p class="rv-sec">Unplaced</p>
      <p class="rv-help">The text these were made on has changed. Each shows the site version it was made against.</p>
      <ul class="rv-list">${lost.map((m) => item(m).replace("</button>",
        `<span class="rv-help">Made against ${esc(m.version)}</span></button>`)).join("")}</ul>`;
  }
  drawer.innerHTML = html;
  drawer.querySelector(".rv-drawer-head").after(reviewerChips(all, myId, cb.hidden, cb.toggleReviewer));
}
