/* Review mode on lesson pages: highlights, comment cards, the review bar.
   Loaded by site.js only when review mode is on. */

import { openStore } from "./open.js";

export default function start() {
  /* The /review/ control page has its own script. */
  if (document.querySelector("[data-review-panel]")) return;
  openStore();
}

start();
