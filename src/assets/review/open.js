/* Review mode: the one place that decides which store a page uses. */

import { LocalStore } from "./store.js";

export function openStore() {
  return new LocalStore();
}

/* Where the site lives (/ locally, /<repo>/ on GitHub Pages) and this page's
   path within it, so marks match across both. */
export function siteBase() {
  const root = document.querySelector("[data-review-root]");
  return (root && root.dataset.reviewBase) || "/";
}
export function pagePath() {
  const base = siteBase();
  const path = location.pathname;
  return path.startsWith(base) ? "/" + path.slice(base.length) : path;
}
export function pageUrl(page, section) {
  return siteBase().replace(/\/$/, "") + page + (section ? "#" + section : "");
}
