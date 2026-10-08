/* Review mode: mapping between page text and the DOM.
   Marks are anchored on a section's text with whitespace collapsed (see
   core.js). textIndex builds that text along with, for every character, the
   text node and offset it came from, so offsets can be turned back into DOM
   positions and DOM selections into offsets. */

/* Not page text: review UI, the hidden section markers, activity frames and
   their title bars, and buttons. */
const SKIP = "[data-rv-ui], .sectionbar, .activity-embed, iframe, script, style, button";

/* Block boundaries read as a space even when the DOM has no whitespace
   between them: shell.js moves elements into sections and leaves the
   whitespace between them behind. */
const BLOCK = "p, li, dt, dd, h1, h2, h3, h4, h5, h6, div, section, details, summary, " +
  "blockquote, pre, figure, figcaption, table, tr, td, th, ul, ol";

const BREAK = "br, hr";

export function textIndex(root) {
  /* { node, start, offsets[] } — start is the normalized index. A virtual
     space between blocks gets a segment with node null. */
  const segs = [];
  let text = "";
  let lastSpace = true; /* collapse leading whitespace too */
  let lastBlock = null;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => n.nodeType === 1
      ? (n.matches(SKIP) ? NodeFilter.FILTER_REJECT : n.matches(BREAK) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP)
      : NodeFilter.FILTER_ACCEPT,
  });
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node.nodeType === 1) { /* <br>, <hr>: a line break reads as a space */
      if (!lastSpace) {
        segs.push({ node: null, start: text.length, offsets: [-1] });
        text += " ";
        lastSpace = true;
      }
      continue;
    }
    if (!/\S/.test(node.data) && lastSpace) continue;
    const block = node.parentElement.closest(BLOCK);
    if (block !== lastBlock && !lastSpace) {
      segs.push({ node: null, start: text.length, offsets: [-1] });
      text += " ";
      lastSpace = true;
    }
    lastBlock = block;
    const seg = { node, start: text.length, offsets: [] };
    const raw = node.data;
    for (let i = 0; i < raw.length; i++) {
      const space = /\s/.test(raw[i]);
      if (space && lastSpace) continue;
      text += space ? " " : raw[i];
      seg.offsets.push(i);
      lastSpace = space;
    }
    if (seg.offsets.length) segs.push(seg);
  }
  return {
    text,
    segs,
    locate(i) {
      for (const s of segs) {
        if (s.node && i < s.start + s.offsets.length) return { node: s.node, offset: s.offsets[Math.max(0, i - s.start)] };
      }
      return null;
    },
  };
}

/* A selection Range → normalized offsets in root, trimmed of edge spaces.
   null when the range holds no page text. */
export function offsetsOf(root, range) {
  const { text, segs } = textIndex(root);
  let start = -1, end = -1;
  for (const s of segs) {
    if (!s.node) continue; /* a virtual space is inside whenever text on both sides is */
    if (range.comparePoint(s.node, s.node.length) < 0) continue; /* wholly before */
    if (range.comparePoint(s.node, 0) > 0) break;                /* wholly after */
    for (let k = 0; k < s.offsets.length; k++) {
      const o = s.offsets[k];
      /* character [o, o+1) lies inside the range */
      if (range.comparePoint(s.node, o) >= 0 && range.comparePoint(s.node, o + 1) <= 0) {
        if (start < 0) start = s.start + k;
        end = s.start + k + 1;
      }
    }
  }
  if (start < 0) return null;
  while (start < end && text[start] === " ") start++;
  while (end > start && text[end - 1] === " ") end--;
  return start < end ? { start, end } : null;
}

/* Wraps normalized [start, end) of root in <mark> elements, one per text
   node touched. attrs: { className, dataset }. Returns the marks in order. */
export function wrap(root, start, end, attrs) {
  const { segs } = textIndex(root);
  const cuts = [];
  for (const s of segs) {
    const a = Math.max(start, s.start), b = Math.min(end, s.start + s.offsets.length);
    if (a >= b || !s.node) continue;
    cuts.push({ node: s.node, from: s.offsets[a - s.start], to: s.offsets[b - 1 - s.start] + 1 });
  }
  return cuts.map(({ node, from, to }) => {
    const mid = from > 0 ? node.splitText(from) : node;
    if (to - from < mid.data.length) mid.splitText(to - from);
    const mark = document.createElement("mark");
    mark.className = attrs.className;
    Object.assign(mark.dataset, attrs.dataset || {});
    mid.parentNode.insertBefore(mark, mid);
    mark.appendChild(mid);
    return mark;
  });
}

export function unwrapAll(root) {
  root.querySelectorAll(".rv-ins").forEach((el) => el.remove());
  root.querySelectorAll("mark.rv-mark").forEach((m) => m.replaceWith(...m.childNodes));
  root.normalize();
}

export function sectionOf(node) {
  const el = node && (node.nodeType === 1 ? node : node.parentElement);
  const sec = el && el.closest("section[data-sec]");
  return sec ? sec.dataset.sec : null;
}
