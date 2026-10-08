/* Theme toggle, activity frames (fullscreen button and reported heights),
   and a lightbox for figures. */
(function () {
  "use strict";

  /* Resolved now: document.currentScript is only set while this file runs. */
  var SCRIPT_SRC = document.currentScript ? document.currentScript.src : "";

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

  /* The recordings have captions burned into the picture, so Vimeo's own
     caption track would print the same words twice. Turn it off once the
     player says it is ready, and again on play in case it comes back. */
  function initVimeoCaptions() {
    var frames = [].slice.call(document.querySelectorAll("iframe[data-vimeo]"));
    if (!frames.length) return;
    var ORIGIN = "https://player.vimeo.com";

    function send(f, method, value) {
      try { f.contentWindow.postMessage(JSON.stringify({ method: method, value: value }), ORIGIN); } catch (e) {}
    }

    window.addEventListener("message", function (e) {
      if (e.origin !== ORIGIN) return;
      var d = e.data;
      if (typeof d === "string") { try { d = JSON.parse(d); } catch (err) { return; } }
      if (!d || (d.event !== "ready" && d.event !== "play")) return;
      frames.forEach(function (f) {
        if (f.contentWindow !== e.source) return;
        if (d.event === "ready") send(f, "addEventListener", "play");
        send(f, "disableTextTrack");
      });
    });

    /* Asking the player to say "ready" covers one that finished loading
       before the listener above existed. */
    frames.forEach(function (f) {
      f.addEventListener("load", function () { send(f, "addEventListener", "ready"); });
    });
  }

  function initTranscriptCopy() {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-copy-transcript]");
      if (!btn) return;
      var body = btn.closest("details.transcript").querySelector(".transcript-body");
      var text = [].map.call(body.querySelectorAll("p"), function (p) { return p.textContent; }).join("\n\n");
      var label = btn.textContent;
      function done(msg) { btn.textContent = msg; setTimeout(function () { btn.textContent = label; }, 1600); }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done("Copied"); }, function () { done("Copy failed"); });
      } else {
        done("Copy failed");
      }
    });
  }

  /* Review mode for course staff (see /review/). Students never load it: the
     module is requested only after a reviewer turns review mode on, or opens
     a link with ?review, and never inside an LMS embed. A module script tag
     rather than import(), so older browsers can still parse this file. */
  function initReview() {
    if (!SCRIPT_SRC || /(^|[?&])embed(=|&|$)/.test(location.search)) return;
    var on = false;
    try {
      if (/(^|[?&])review(=|&|$)/.test(location.search)) {
        localStorage.setItem("aids-review", '"on"');
        /* Drop ?review once honoured, or Exit (which reloads) would turn
           review mode straight back on. */
        var u = new URL(location.href);
        u.searchParams.delete("review");
        history.replaceState(history.state, "", u.pathname + u.search + u.hash);
      }
      on = localStorage.getItem("aids-review") === '"on"';
    } catch (e) {}
    if (!on) return;
    var s = document.createElement("script");
    s.type = "module";
    s.src = new URL("../review/review.js", SCRIPT_SRC).href;
    document.body.appendChild(s);
  }

  function init() { initTheme(); initActivityHeights(); initFullscreen(); initLightbox(); initVimeoCaptions(); initTranscriptCopy(); initReview(); }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
