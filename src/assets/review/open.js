/* Review mode: the one place that decides which store a page uses. */

import { LocalStore } from "./store.js";
import { SyncStore } from "./sync.js";

const SYNC = "aids-review-sync";

/* { mode: "local"|"sync", server, passcode }; server defaults to the one the
   site was built with (site.json → <meta name="review-server">). */
export function syncSettings() {
  let s = {};
  try { s = JSON.parse(localStorage.getItem(SYNC)) || {}; } catch (e) {}
  const meta = document.querySelector('meta[name="review-server"]');
  return { mode: s.mode === "sync" ? "sync" : "local", server: s.server || (meta && meta.content) || "", passcode: s.passcode || "" };
}
export function saveSyncSettings(s) {
  try { localStorage.setItem(SYNC, JSON.stringify(s)); } catch (e) {}
}

/* Sync is off unless the site was built with a server (site.json
   reviewServer). A browser left in sync mode from earlier falls back to
   local; its comments are all still here. */
export function syncEnabled() {
  const meta = document.querySelector('meta[name="review-server"]');
  return !!(meta && meta.content);
}

export function openStore({ connect = true } = {}) {
  const local = new LocalStore();
  const s = syncSettings();
  if (!syncEnabled() || s.mode !== "sync" || !s.server) return local;
  const sync = new SyncStore(local, s);
  if (connect) sync.connect();
  return sync;
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
/* Only ever a path on this site: marks come from files and other people. */
export function pageUrl(page, section) {
  if (typeof page !== "string" || !page.startsWith("/") || page.startsWith("//")) return "#";
  return siteBase().replace(/\/$/, "") + page + (section ? "#" + encodeURIComponent(section) : "");
}
