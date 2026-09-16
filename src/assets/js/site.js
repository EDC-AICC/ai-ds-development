/* Theme toggle, activity frames (fullscreen button and reported heights),
   and a lightbox for figures. */
(function () {
  "use strict";

  /* The no-flash script in <head> has already set data-theme; wire the button. */
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

  /* Re-asking on resize is redundant: an activity watches for that itself.
     A frame left at a stale height shows a scrollbar, which is the one
     failure worth five lines to avoid. */
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

  function initFullscreen() {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-fullscreen]");
      if (!btn) return;
      var f = btn.closest(".activity-embed").querySelector("iframe");
      var go = f.requestFullscreen || f.webkitRequestFullscreen;
      if (go) go.call(f);
    });
  }

  /* Click a figure to see it large; Esc, the X, or a click outside closes it. */
  function initLightbox() {
    var figures = document.querySelectorAll("figure.figure img");
    if (!figures.length || typeof HTMLDialogElement === "undefined") return;

    var dlg = document.createElement("dialog");
    dlg.className = "lightbox";
    dlg.innerHTML = '<button type="button" class="lightbox-close" aria-label="Close">×</button><img alt="">';
    document.body.appendChild(dlg);
    var big = dlg.querySelector("img");

    dlg.querySelector(".lightbox-close").addEventListener("click", function () { dlg.close(); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && dlg.open) dlg.close(); });

    [].forEach.call(figures, function (img) {
      img.setAttribute("tabindex", "0");
      img.setAttribute("role", "button");
      function open() { big.src = img.currentSrc || img.src; big.alt = img.alt; dlg.showModal(); }
      img.addEventListener("click", open);
      img.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    });
  }

  function init() { initTheme(); initActivityHeights(); initFullscreen(); initLightbox(); }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
