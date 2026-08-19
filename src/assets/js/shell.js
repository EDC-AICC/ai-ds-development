/* Course shell behavior.
   The layout renders the sidebar and breadcrumb; the page content arrives as
   one flow with {% section "Title" %} markers (rendered as .sectionbar).
   This script wraps each marker's content into a <section>, shows one at a
   time, fills the sidebar's section list, and wires Back/Continue — with
   prev/next pages read from data attributes the layout computed at build
   time. Progress lives in localStorage. No content knowledge lives here. */

(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var main = document.querySelector("main");
  var body = document.querySelector("[data-content]");
  if (!main || !body) return;

  var slug = function (t) {
    return t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  };

  /* ---- split content at .sectionbar markers ---- */
  var sections = [];
  var kids = [].slice.call(body.children);
  var bucket = null;

  function startSection(title) {
    var sec = document.createElement("section");
    sec.dataset.title = title;
    sec.dataset.sec = slug(title) || "s" + sections.length;
    sections.push(sec);
    return sec;
  }
  kids.forEach(function (el) {
    var isMarker = el.classList && el.classList.contains("sectionbar");
    if (isMarker) {
      var t = el.querySelector(".sectiontitle");
      bucket = startSection(t ? t.textContent.trim() : "Section");
      body.appendChild(bucket);
      bucket.appendChild(el); /* keep the marker inside; CSS hides it */
    } else {
      if (!bucket) {
        /* content before the first marker — authors normally open with a
           {% section %}, but don't lose anything if one is missing */
        bucket = startSection("Introduction");
        body.appendChild(bucket);
      }
      bucket.appendChild(el);
    }
  });
  if (!sections.length) return;
  var secIds = sections.map(function (s) { return s.dataset.sec; });

  /* ---- data the layout computed ---- */
  var d = main.dataset;
  var pageKey = location.pathname;

  var PKEY = "aids-shell-progress", LKEY = "aids-shell-last";
  function loadP() { try { return JSON.parse(localStorage.getItem(PKEY) || "{}"); } catch (e) { return {}; } }
  function saveP(p) { try { localStorage.setItem(PKEY, JSON.stringify(p)); } catch (e) {} }
  var prog = loadP();
  var mine = prog[pageKey] || (prog[pageKey] = { seen: [], total: secIds.length });
  mine.total = secIds.length;
  function isDone(key) {
    var e = prog[key];
    return !!e && e.total > 0 && e.seen.length >= e.total;
  }

  /* ---- sidebar: section list + part checkmarks ---- */
  var secList = document.querySelector("[data-secs]");
  if (secList) {
    secList.innerHTML = sections.map(function (s) {
      return '<li data-sec="' + s.dataset.sec + '"><a href="#' + s.dataset.sec + '">' + s.dataset.title + "</a></li>";
    }).join("");
  }
  [].forEach.call(document.querySelectorAll(".side-parts > li[data-part]"), function (li) {
    li.classList.toggle("done", isDone(li.dataset.part));
  });

  /* ---- nav ---- */
  var nav = document.querySelector("[data-secnav]");
  nav.hidden = false;
  var backBtn = nav.querySelector("[data-back]"), fwdBtn = nav.querySelector("[data-fwd]"),
      pos = nav.querySelector("[data-pos]"), heading = document.querySelector("[data-heading]");
  var sideSecs = secList ? [].slice.call(secList.children) : [];
  var current = 0;

  function idxFromHash() {
    var i = secIds.indexOf(location.hash.replace("#", ""));
    return i >= 0 ? i : 0;
  }
  function paint() {
    sections.forEach(function (s, i) { s.classList.toggle("current", i === current); });
    sideSecs.forEach(function (li, i) { li.classList.toggle("active", i === current); });
    heading.textContent = sections[current].dataset.title;
    pos.textContent = (current + 1) + " / " + sections.length;

    if (current > 0) {
      backBtn.textContent = "← Back"; backBtn.href = "#" + secIds[current - 1];
    } else if (d.prevUrl) {
      backBtn.textContent = "← " + d.prevLabel; backBtn.href = d.prevUrl;
    } else {
      backBtn.textContent = "← All modules"; backBtn.href = d.homeUrl;
    }
    if (current < sections.length - 1) {
      fwdBtn.textContent = "Continue →"; fwdBtn.href = "#" + secIds[current + 1];
    } else if (d.nextUrl) {
      fwdBtn.textContent = "Next: " + d.nextLabel + " →"; fwdBtn.href = d.nextUrl;
    } else {
      fwdBtn.textContent = "Module " + d.moduleNum + " overview →"; fwdBtn.href = d.moduleUrl;
    }

    var cur = document.querySelector('.side-parts > li[data-part="' + pageKey + '"]');
    if (cur) cur.classList.toggle("done", isDone(pageKey));
  }
  function visit(i, scroll) {
    current = i;
    if (mine.seen.indexOf(secIds[i]) < 0) mine.seen.push(secIds[i]);
    prog[pageKey] = mine; saveP(prog);
    try { localStorage.setItem(LKEY, JSON.stringify({ url: pageKey + "#" + secIds[i] })); } catch (e) {}
    paint();
    if (scroll !== false) window.scrollTo({ top: 0 });
  }

  window.addEventListener("hashchange", function () { visit(idxFromHash()); });
  if (!location.hash) history.replaceState(null, "", "#" + secIds[0]);
  visit(idxFromHash(), false);

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
