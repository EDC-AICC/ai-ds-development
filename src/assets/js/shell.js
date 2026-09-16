/* Course shell behavior.
   The layout renders the sidebar and breadcrumb; the page content arrives as
   one flow with {% section "Title", "id" %} markers (rendered as .sectionbar).
   This script wraps each marker's content into a <section>, shows one at a
   time, fills the sidebar's section list, and wires Back/Continue, with
   prev/next pages read from data attributes the layout computed at build
   time. No content knowledge lives here. */

(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var main = document.querySelector("main");
  var body = document.querySelector("[data-content]");
  if (!main || !body) return;

  /* ---- split content at .sectionbar markers ---- */
  var sections = [];
  var bucket = null;
  function startSection(id, title) {
    var sec = document.createElement("section");
    sec.dataset.sec = id;
    sec.dataset.title = title;
    sections.push(sec);
    body.appendChild(sec);
    return sec;
  }
  [].slice.call(body.children).forEach(function (el) {
    if (el.classList && el.classList.contains("sectionbar")) {
      var t = el.querySelector(".sectiontitle");
      bucket = startSection(el.dataset.sec, t ? t.textContent.trim() : "Section");
      bucket.appendChild(el); /* keep the marker inside; CSS hides it */
    } else {
      /* content before the first marker: authors open with a section, but
         don't lose anything if one is missing */
      if (!bucket) bucket = startSection("introduction", "Introduction");
      bucket.appendChild(el);
    }
  });
  if (!sections.length) return;
  var secIds = sections.map(function (s) { return s.dataset.sec; });
  var heading = document.querySelector("[data-heading]");

  /* ---- embed mode ----
     ?embed on the URL drops the sidebar, breadcrumb and Continue buttons and
     shows just the section named in the hash (or the whole page when there is
     no hash), so a course management system can iframe one piece of a lesson.
     The frame reports its height to the host page so the iframe can be sized. */
  if (/(^|[?&])embed(=|&|$)/.test(location.search)) {
    document.documentElement.classList.add("embed");
    var theme = /[?&]theme=(light|dark)\b/.exec(location.search);
    if (theme) document.documentElement.setAttribute("data-theme", theme[1]);
    var only = secIds.indexOf(location.hash.replace("#", ""));
    if (only >= 0) {
      sections[only].classList.add("current");
      heading.textContent = sections[only].dataset.title;
    } else {
      document.documentElement.classList.add("embed-all");
      sections.forEach(function (s) { s.classList.add("current"); });
    }
    var report = function () {
      try { parent.postMessage({ type: "embed-height", height: document.documentElement.scrollHeight }, "*"); } catch (e) {}
    };
    report();
    window.addEventListener("load", report);
    if (window.ResizeObserver) new ResizeObserver(report).observe(document.body);
    return;
  }

  /* ---- sidebar section list ---- */
  var secList = document.querySelector("[data-secs]");
  if (secList) {
    secList.innerHTML = sections.map(function (s) {
      return '<li><a href="#' + s.dataset.sec + '">' + s.dataset.title + "</a></li>";
    }).join("");
  }
  var sideSecs = secList ? [].slice.call(secList.children) : [];

  /* ---- section nav ---- */
  var d = main.dataset;
  var nav = document.querySelector("[data-secnav]");
  nav.hidden = false;
  var backBtn = nav.querySelector("[data-back]"), fwdBtn = nav.querySelector("[data-fwd]"),
      pos = nav.querySelector("[data-pos]");

  function idxFromHash() {
    var i = secIds.indexOf(location.hash.replace("#", ""));
    return i >= 0 ? i : 0;
  }
  function show(i, scroll) {

    sections.forEach(function (s, j) { s.classList.toggle("current", j === i); });
    sideSecs.forEach(function (li, j) { li.classList.toggle("active", j === i); });
    heading.textContent = sections[i].dataset.title;
    pos.textContent = (i + 1) + " / " + sections.length;

    if (i > 0) {
      backBtn.textContent = "← Back"; backBtn.href = "#" + secIds[i - 1];
    } else if (d.prevUrl) {
      backBtn.textContent = "← " + d.prevLabel; backBtn.href = d.prevUrl;
    } else {
      backBtn.textContent = "← All modules"; backBtn.href = d.homeUrl;
    }
    if (i < sections.length - 1) {
      fwdBtn.textContent = "Continue →"; fwdBtn.href = "#" + secIds[i + 1];
    } else if (d.nextUrl) {
      fwdBtn.textContent = "Next: " + d.nextLabel + " →"; fwdBtn.href = d.nextUrl;
    } else if (d.moduleUrl === location.pathname) {
      fwdBtn.textContent = "All modules →"; fwdBtn.href = d.homeUrl;
    } else {
      fwdBtn.textContent = d.moduleLabel + " overview →"; fwdBtn.href = d.moduleUrl;
    }
    if (scroll !== false) window.scrollTo({ top: 0 });
  }

  window.addEventListener("hashchange", function () { show(idxFromHash()); });
  if (!location.hash) history.replaceState(null, "", "#" + secIds[0]);
  show(idxFromHash(), false);

  document.addEventListener("keydown", function (e) {
    if (e.target.closest("input,textarea") || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === "ArrowRight") fwdBtn.click();
    if (e.key === "ArrowLeft") backBtn.click();
  });

  /* ---- mobile drawer ---- */
  var side = document.getElementById("sidebar");
  var menu = document.querySelector("[data-menu]");
  var scrim = document.querySelector("[data-scrim]");
  function closeDrawer() { side.classList.remove("open"); document.body.classList.remove("drawer-open"); }
  if (menu) menu.addEventListener("click", function () {
    side.classList.add("open"); document.body.classList.add("drawer-open");
  });
  if (scrim) scrim.addEventListener("click", closeDrawer);
  side.addEventListener("click", function (e) { if (e.target.closest("a")) closeDrawer(); });
})();
