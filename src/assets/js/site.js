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
     An activity reports how tall it is; we make its frame that tall, so there
     is no scrollbar inside it and no dead space below it.

     We also ask every frame to re-measure when this window resizes. An
     activity watches for that itself, so this is redundant on paper, but a
     frame left at a stale height shows a scrollbar and that is the one
     failure worth paying five lines to avoid. */
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

    function ping(f) {
      try { f.contentWindow.postMessage({ type: "activity-height-request" }, "*"); } catch (err) {}
    }
    function pingAll() { frames.forEach(ping); }

    /* A lazily-loaded frame can finish before the listener above exists, so
       ask each one again once it is there. */
    frames.forEach(function (f) {
      f.addEventListener("load", function () { ping(f); });
      ping(f);
    });

    var t;
    window.addEventListener("resize", function () {
      clearTimeout(t);
      t = setTimeout(pingAll, 120);
    });
  }

  function init() { initTheme(); initActivityHeights(); }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
