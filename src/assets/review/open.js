/* Review mode: the one place that decides which store a page uses. */

import { LocalStore } from "./store.js";
import { SyncStore } from "./sync.js";

const SYNC = "aids-review-sync";

/* { mode: "local"|"sync", server, passcode }. The server's address is never
   built into the site, which is public: each reviewer enters it on /review/
   or opens a setup link. */
export function syncSettings() {
  let s = {};
  try { s = JSON.parse(localStorage.getItem(SYNC)) || {}; } catch (e) {}
  return { mode: s.mode === "sync" ? "sync" : "local", server: s.server || "", passcode: s.passcode || "" };
}
export function saveSyncSettings(s) {
  try { localStorage.setItem(SYNC, JSON.stringify(s)); } catch (e) {}
}

/* A setup link is /review/#server=…&key=…, which sets a reviewer up for the
   shared server in one click. What follows # never leaves the browser, so
   the address and passcode stay out of GitHub's logs. */
export function setupLink(pageUrl, { server, passcode }) {
  return pageUrl.split("#")[0] + "#" + new URLSearchParams({ server, key: passcode });
}
export function parseSetupLink(hash) {
  const p = new URLSearchParams(String(hash || "").replace(/^#/, ""));
  const server = (p.get("server") || "").trim();
  try {
    if (!["http:", "https:"].includes(new URL(server).protocol)) return null;
  } catch (e) {
    return null;
  }
  return { mode: "sync", server, passcode: p.get("key") || "" };
}

/* Sync is off unless the site was built with it (site.json reviewSync). A
   browser left in sync mode from earlier falls back to local; its comments
   are all still here. */
export function syncEnabled() {
  const meta = document.querySelector('meta[name="review-sync"]');
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
