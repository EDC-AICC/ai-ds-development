/* Review mode: pure logic shared by the page, the stores and the tests.
   No DOM and no storage here. A "mark" is one reviewer comment, suggested
   edit, or activity note; its fields are listed in the design spec. */

export const FORMAT = "aids-review";
export const FORMAT_VERSION = 1;
export const KINDS = ["comment", "suggest", "activity"];
const CONTEXT = 32;

export function normalize(text) {
  return String(text).replace(/\s+/g, " ");
}

/* text is already normalized; start/end are offsets into it. */
export function makeQuote(text, start, end) {
  return {
    exact: text.slice(start, end),
    prefix: text.slice(Math.max(0, start - CONTEXT), start),
    suffix: text.slice(end, end + CONTEXT),
  };
}

function sharedTail(a, b) {
  let n = 0;
  while (n < a.length && n < b.length && a[a.length - 1 - n] === b[b.length - 1 - n]) n++;
  return n;
}
function sharedHead(a, b) {
  let n = 0;
  while (n < a.length && n < b.length && a[n] === b[n]) n++;
  return n;
}

/* Where the quoted text is now. The exact text with its full context wins;
   otherwise the occurrence whose neighbours still look most like the ones the
   reviewer saw, so editing a nearby word doesn't move the comment. */
export function findQuote(text, quote) {
  const { exact, prefix = "", suffix = "" } = quote || {};
  if (!exact) return null;
  const whole = text.indexOf(prefix + exact + suffix);
  if (whole >= 0) return { start: whole + prefix.length, end: whole + prefix.length + exact.length };
  let best = null, bestScore = -1;
  for (let i = text.indexOf(exact); i >= 0; i = text.indexOf(exact, i + 1)) {
    const end = i + exact.length;
    const score = sharedTail(text.slice(Math.max(0, i - prefix.length), i), prefix) +
      sharedHead(text.slice(end, end + suffix.length), suffix);
    if (score > bestScore) { best = { start: i, end }; bestScore = score; }
  }
  return best;
}

export function newMark(fields, me) {
  const now = new Date().toISOString();
  const { ownerToken, ...rest } = fields;
  return {
    activity: "", comment: "", replacement: "", section: null,
    quote: { exact: "", prefix: "", suffix: "" },
    ...rest,
    id: crypto.randomUUID(),
    reviewerId: me.reviewerId,
    reviewer: me.name || "",
    created: now,
    updated: now,
  };
}

function slug(s) {
  return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "reviewer";
}
function localDate(d) {
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function buildExport(me, marks, now = new Date()) {
  return {
    filename: `review-${slug(me.name)}-${localDate(now)}.json`,
    data: {
      format: FORMAT,
      formatVersion: FORMAT_VERSION,
      reviewer: me.name || "",
      reviewerId: me.reviewerId,
      exported: now.toISOString(),
      marks: marks.map(({ ownerToken, ...m }) => m),
    },
  };
}

function isMark(m) {
  return m && typeof m === "object" && typeof m.id === "string" && m.id &&
    typeof m.reviewerId === "string" && m.reviewerId && KINDS.includes(m.kind);
}

export function parseImport(json, filename) {
  let data;
  try { data = JSON.parse(json); } catch (e) {
    return { error: `${filename} is not a review file (it isn't valid JSON).` };
  }
  if (!data || data.format !== FORMAT) return { error: `${filename} is not a review file.` };
  if (!(data.formatVersion <= FORMAT_VERSION)) {
    return { error: `${filename} was made by a newer version of review mode. Reload the site and try again.` };
  }
  if (!Array.isArray(data.marks) || !data.marks.every(isMark)) {
    return { error: `${filename} is damaged: some comments are missing required fields.` };
  }
  return { marks: data.marks.map(({ ownerToken, ...m }) => m) };
}

export function mergeLoaded(existing, incoming, myReviewerId) {
  const out = { ...existing };
  for (const m of incoming) {
    if (m.reviewerId === myReviewerId) continue;
    out[m.id] = m;
  }
  return out;
}

export function colorIndex(reviewerId, n) {
  let h = 0;
  for (const ch of String(reviewerId)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h % n;
}
