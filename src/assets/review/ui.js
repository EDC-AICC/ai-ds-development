/* Review mode: small DOM helpers shared by the control page and the lesson
   page UI. */

import { colorIndex } from "./core.js";

export const COLORS = 8;
export const KIND_LABEL = { comment: "Comment", suggest: "Suggested edit", activity: "Activity note" };

export function esc(s) {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/* The color class for a reviewer: one fixed color for "me", the rest spread
   across the palette by id so a person keeps their color everywhere. */
export function colorClass(reviewerId, myId) {
  return reviewerId === myId ? "rv-own" : "rv-c" + colorIndex(reviewerId, COLORS);
}

export function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2) + "\n"], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export function readFiles(fileList) {
  return Promise.all([...fileList].map((f) => f.text().then((text) => ({ name: f.name, text }))));
}

export function loadMessage({ added, restored = 0, errors }, fileCount) {
  const ok = fileCount - errors.length;
  const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;
  const head = ok ? `Loaded ${plural(added, "comment")} from ${plural(ok, "file")}.` : "";
  const back = restored ? `Restored ${plural(restored, "comment")} of your own.` : "";
  return [head, back, ...errors].filter(Boolean).join(" ");
}

/* One clickable chip per reviewer present; `hidden` is a Set of reviewerIds. */
export function reviewerChips(marks, myId, hidden, onToggle) {
  const people = new Map();
  marks.forEach((m) => { if (!people.has(m.reviewerId)) people.set(m.reviewerId, m.reviewer || "Unnamed"); });
  const wrap = document.createElement("div");
  wrap.className = "rv-chips";
  if (people.size < 2) return wrap;
  people.forEach((name, id) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "rv-chip " + colorClass(id, myId);
    b.setAttribute("aria-pressed", String(!hidden.has(id)));
    b.innerHTML = `<span class="rv-dot"></span>${esc(name)}${id === myId ? " (you)" : ""}`;
    b.addEventListener("click", () => onToggle(id));
    wrap.appendChild(b);
  });
  return wrap;
}

/* The body of one mark as shown in cards, lists and the table. */
export function markBody(m) {
  const quote = m.kind === "suggest"
    ? `<p class="rv-quote"><del>${esc(m.quote.exact)}</del> <ins>${esc(m.replacement)}</ins></p>`
    : m.kind === "activity"
      ? `<p class="rv-quote rv-activity">${esc(m.activity)}</p>`
      : `<p class="rv-quote">“${esc(m.quote.exact)}”</p>`;
  return quote + (m.comment ? `<p class="rv-comment">${esc(m.comment)}</p>` : "");
}
