/* Review mode: the floating pieces — the popup on a selection, the comment
   editor, the card that shows comments on a highlight, and a short toast.
   Only one floating piece is open at a time. Knows nothing about storage;
   review.js passes in what to show and what to do. */

import { KIND_LABEL, colorClass, esc, markBody } from "./ui.js";

let open = null;

export function closeAll() {
  if (open) { open.remove(); open = null; }
}
export function isOpen() { return !!open; }

/* Places el under (or, without room, above) a viewport rect, kept on screen. */
function place(el, rect) {
  el.style.visibility = "hidden";
  document.body.appendChild(el);
  const w = el.offsetWidth, h = el.offsetHeight, gap = 8;
  let left = rect.left + rect.width / 2 - w / 2;
  left = Math.max(12, Math.min(left, document.documentElement.clientWidth - w - 12));
  let top = rect.bottom + gap;
  if (top + h > innerHeight && rect.top - gap - h > 0) top = rect.top - gap - h;
  el.style.left = left + scrollX + "px";
  el.style.top = top + scrollY + "px";
  el.style.visibility = "";
}

function float(className, html, rect) {
  closeAll();
  const el = document.createElement("div");
  el.className = "rv-float " + className;
  el.setAttribute("data-rv-ui", "");
  el.innerHTML = html;
  place(el, rect);
  open = el;
  return el;
}

/* actions: { comment(), suggest() } */
export function showPopup(rect, actions) {
  const el = float("rv-pop", `
    <button type="button" class="rv-btn" data-act="comment">Comment</button>
    <button type="button" class="rv-btn" data-act="suggest">Suggest edit</button>`, rect);
  /* mousedown would collapse the selection before click fires */
  el.addEventListener("mousedown", (e) => e.preventDefault());
  el.addEventListener("click", (e) => {
    const b = e.target.closest("[data-act]");
    if (b) actions[b.dataset.act]();
  });
}

/* opts: { rect, kind, quote, activity, comment, replacement, needName,
           onSave({ name, comment, replacement }) -> string|null (error) } */
export function openEditor(opts) {
  const title = opts.kind === "suggest" ? "Suggest an edit"
    : opts.kind === "activity" ? "Comment on this activity" : "Comment";
  const el = float("rv-editor", `
    <form>
      <p class="rv-editor-title">${title}</p>
      ${opts.kind === "activity" ? `<p class="rv-quote rv-activity">${esc(opts.activity)}</p>`
        : opts.kind === "suggest" ? "" : `<p class="rv-quote">“${esc(opts.quote.exact)}”</p>`}
      ${opts.needName ? `<label class="rv-field">Your name <input name="name" required autocomplete="name"></label>` : ""}
      ${opts.kind === "suggest" ? `<label class="rv-field">Replace with
        <textarea name="replacement" rows="3" required>${esc(opts.replacement ?? opts.quote.exact)}</textarea></label>` : ""}
      <label class="rv-field">${opts.kind === "suggest" ? "Why (optional)" : "Comment"}
        <textarea name="comment" rows="3" ${opts.kind === "suggest" ? "" : "required"}>${esc(opts.comment || "")}</textarea></label>
      <p class="rv-error" role="alert" hidden></p>
      <div class="rv-row">
        <button type="submit" class="rv-btn primary">Save</button>
        <button type="button" class="rv-btn" data-cancel>Cancel</button>
        <span class="rv-help">⌘/Ctrl + Enter</span>
      </div>
    </form>`, opts.rect);
  const form = el.querySelector("form");
  const first = form.querySelector("input, textarea");
  first.focus();
  if (first.select && opts.kind === "suggest" && !opts.needName) first.select();
  form.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); form.requestSubmit(); }
  });
  form.querySelector("[data-cancel]").addEventListener("click", closeAll);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(form);
    const err = opts.onSave({
      name: (f.get("name") || "").trim(),
      comment: (f.get("comment") || "").trim(),
      replacement: f.get("replacement") ?? "",
    });
    if (err) {
      const p = form.querySelector(".rv-error");
      p.textContent = err;
      p.hidden = false;
    } else {
      closeAll();
    }
  });
}

/* opts: { rect, marks, myId, onEdit(mark), onDelete(mark), onAdd? } */
export function openCard(opts) {
  const items = opts.marks.map((m) => `
    <li class="rv-item ${colorClass(m.reviewerId, opts.myId)}" data-id="${esc(m.id)}">
      <p class="rv-meta"><span class="rv-dot"></span><b>${esc(m.reviewer || "Unnamed")}</b>${m.reviewerId === opts.myId ? " (you)" : ""}
        · ${KIND_LABEL[m.kind]} · ${new Date(m.updated).toLocaleDateString()}</p>
      ${markBody(m)}
      ${m.reviewerId === opts.myId ? `<div class="rv-row">
        <button type="button" class="rv-btn" data-edit>Edit</button>
        <button type="button" class="rv-btn danger" data-delete>Delete</button></div>` : ""}
    </li>`).join("");
  const el = float("rv-card", `<ul class="rv-list">${items}</ul>
    ${opts.onAdd ? `<div class="rv-row"><button type="button" class="rv-btn primary" data-add>Add a comment</button></div>` : ""}`,
  opts.rect);
  el.addEventListener("click", (e) => {
    const li = e.target.closest("[data-id]");
    const m = li && opts.marks.find((x) => x.id === li.dataset.id);
    if (e.target.closest("[data-edit]")) opts.onEdit(m);
    else if (e.target.closest("[data-delete]")) opts.onDelete(m);
    else if (e.target.closest("[data-add]")) opts.onAdd();
  });
  const btn = el.querySelector("button");
  if (btn) btn.focus({ preventScroll: true });
}

export function toast(message) {
  const el = document.createElement("div");
  el.className = "rv-toast";
  el.setAttribute("data-rv-ui", "");
  el.setAttribute("role", "status");
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });
/* A click elsewhere closes popups and cards, but never an editor with
   writing in it; that takes Cancel or Escape. */
document.addEventListener("mousedown", (e) => {
  if (open && !open.contains(e.target) && !open.classList.contains("rv-editor")) closeAll();
});
export function editorOpen() { return !!open && open.classList.contains("rv-editor"); }
