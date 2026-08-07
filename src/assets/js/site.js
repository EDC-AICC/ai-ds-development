/* ============================================================
   Site behaviour
   1. theme toggle (light / dark / follow system)
   2. activity embed height

   Each activity reserves the height of its tallest state, so the number
   it reports holds steady while a student clicks through it. That height
   still depends on how wide the embed is, because the text rewraps, so
   the shortcode's height is a starting value and this corrects it.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- 1. theme ----------
     The no-flash inline script in <head> has already set data-theme.
     Here we only wire the button.                                   */
  var THEME_KEY = "aids-theme";

  function currentTheme() {
    var set = document.documentElement.getAttribute("data-theme");
    if (set) return set;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function initTheme() {
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
      btn.setAttribute("aria-label", next === "dark" ? "Switch to light mode" : "Switch to dark mode");
    });
  }

  /* ---------- 2. activity embed height ----------
     Activities post their height on load and on resize. Match the frame
     to it so there is no scrollbar inside and no dead space below. */
  function initActivityHeights() {
    var frames = [].slice.call(document.querySelectorAll(".activity-embed iframe"));
    if (!frames.length) return;

    window.addEventListener("message", function (e) {
      var d = e.data;
      if (!d || d.type !== "activity-height" || typeof d.height !== "number") return;
      frames.forEach(function (f) {
        if (f.contentWindow === e.source) f.style.height = d.height + "px";
      });
    });

    /* An activity may have loaded before the listener above existed, so
       ask each one to report again. */
    frames.forEach(function (f) {
      function ping() {
        try { f.contentWindow.postMessage({ type: "activity-height-request" }, "*"); } catch (err) {}
      }
      /* Activities re-measure themselves after their fonts land, and that can
         race the load-time report. Re-ask a couple of times so the frame
         always settles on the final height. */
      function pingSoonAndLater() { ping(); setTimeout(ping, 1000); setTimeout(ping, 3000); }
      f.addEventListener("load", pingSoonAndLater);
      pingSoonAndLater();
    });
  }

  function init() { initTheme(); initActivityHeights(); }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
