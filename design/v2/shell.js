/* v2 course shell.
   Every content page is just a <main> of <section data-sec data-title> blocks
   plus <body class="shell" data-page="...">. This script builds the topbar,
   the module sidebar, and the section-at-a-time navigation, and keeps
   progress in localStorage so the sidebar can show what's done. */

(function () {
  var COURSE = {
    title: "AI in Data Science",
    home: "index.html",
    modules: [
      { id: "m1", num: "01", title: "Module 1", built: false },
      { id: "m2", num: "02", title: "Module 2", built: false },
      {
        id: "m3", num: "03", title: "Preparing, Exploring & Analyzing Data with AI", built: true,
        pages: [
          { id: "m3-index", file: "m3-index.html", num: "0", label: "Overview" },
          { id: "m3-01", file: "m3-01-ask.html", num: "1", label: "Ask" },
          { id: "m3-02", file: "m3-02-explore.html", num: "2", label: "Explore" },
          { id: "m3-03", file: "m3-03-transform.html", num: "3", label: "Transform" },
          { id: "m3-04", file: "m3-04-analyze.html", num: "4", label: "Analyze" },
          { id: "m3-05", file: "m3-05-share.html", num: "5", label: "Share" },
          { id: "m3-06", file: "m3-06-apply.html", num: "6", label: "Apply" }
        ]
      },
      { id: "m4", num: "04", title: "Module 4", built: false },
      { id: "m5", num: "05", title: "Module 5", built: false },
      { id: "m6", num: "06", title: "Module 6", built: false }
    ]
  };

  var PKEY = "aids-v2-progress", LKEY = "aids-v2-last";
  function loadP() { try { return JSON.parse(localStorage.getItem(PKEY) || "{}"); } catch (e) { return {}; } }
  function saveP(p) { try { localStorage.setItem(PKEY, JSON.stringify(p)); } catch (e) {} }

  /* ---- theme toggle (shared with the rest of the prototypes) ---- */
  document.body.insertAdjacentHTML("beforeend",
    '<button id="theme-toggle" type="button" aria-label="Toggle dark mode" title="Toggle dark mode">' +
    '<svg class="sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2"></circle><path d="M12 2.4v2.2M12 19.4v2.2M4.2 12H2M22 12h-2.2M5.6 5.6 4.1 4.1M19.9 19.9l-1.5-1.5M18.4 5.6l1.5-1.5M4.1 19.9l1.5-1.5"></path></svg>' +
    '<svg class="moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.2A8.4 8.4 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7z"></path></svg></button>');
  document.getElementById("theme-toggle").addEventListener("click", function () {
    var root = document.documentElement;
    var dark = root.getAttribute("data-theme") === "dark" ||
      (!root.getAttribute("data-theme") && matchMedia("(prefers-color-scheme: dark)").matches);
    var next = dark ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("aids-theme", next); } catch (e) {}
  });

  var pageId = document.body.dataset.page;
  if (!pageId) return; // course home handles itself

  var mod = null, page = null, pageIdx = -1;
  COURSE.modules.forEach(function (m) {
    (m.pages || []).forEach(function (p, i) {
      if (p.id === pageId) { mod = m; page = p; pageIdx = i; }
    });
  });
  if (!page) return;

  var prevPage = pageIdx > 0 ? mod.pages[pageIdx - 1] : null;
  var nextPage = pageIdx < mod.pages.length - 1 ? mod.pages[pageIdx + 1] : null;

  var sections = [].slice.call(document.querySelectorAll("main section[data-sec]"));
  var secIds = sections.map(function (s) { return s.dataset.sec; });

  /* ---- progress ---- */
  var prog = loadP();
  var mine = prog[pageId] || (prog[pageId] = { seen: [], total: secIds.length });
  mine.total = secIds.length;
  function isDone(pid) {
    var e = prog[pid];
    return !!e && e.total > 0 && e.seen.length >= e.total;
  }

  /* ---- build the frame: sidebar + content wrapper ---- */
  var main = document.querySelector("main");
  var content = document.createElement("div");
  content.className = "content";

  /* the overview is numbered 0 in the nav, but never called "Part 0" */
  var partLabel = (page.id === "m3-index" ? "" : "Part " + page.num + " · ") + page.label;
  content.innerHTML =
    '<div class="topbar">' +
      '<button class="menu-btn" type="button" aria-label="Open module menu">☰ Menu</button>' +
      '<nav class="crumbs" aria-label="Breadcrumb">' +
        '<a class="root" href="' + COURSE.home + '">' + COURSE.title + '</a><span class="sep">›</span>' +
        '<a href="m3-index.html">Module ' + mod.num + '</a><span class="sep">›</span>' +
        '<span class="here">' + partLabel + '</span>' +
      '</nav>' +
    '</div>' +
    '<div class="scrim" data-scrim></div>';

  var side = document.createElement("aside");
  side.className = "sidebar";
  side.innerHTML =
    '<div class="side-top">' +
      '<a class="backlink" href="' + COURSE.home + '">← All modules</a>' +
      '<p class="modtitle">' + mod.title + '</p>' +
    '</div>' +
    '<ul class="side-parts">' + mod.pages.map(function (p) {
      var cur = p.id === pageId;
      var li = '<li class="' + (cur ? "current" : "") + (isDone(p.id) ? " done" : "") + '" data-part="' + p.id + '">' +
        '<a class="part-link" href="' + p.file + '">' +
        '<span class="pnum">' + p.num + '</span><span class="ptitle">' + p.label + '</span>' +
        '<span class="pcheck">✓</span></a>';
      if (cur) {
        li += '<ul class="side-secs">' + sections.map(function (s) {
          return '<li data-sec="' + s.dataset.sec + '"><a href="#' + s.dataset.sec + '">' +
            s.dataset.title + '</a></li>';
        }).join("") + '</ul>';
      }
      return li + "</li>";
    }).join("") + "</ul>";

  document.body.prepend(content);
  document.body.prepend(side);
  content.appendChild(main);

  /* the topbar hosts the theme toggle on shell pages */
  content.querySelector(".topbar").appendChild(document.getElementById("theme-toggle"));

  /* page heading (filled with the current section title) + content column */
  var col = document.createElement("div");
  col.className = "pagecol";
  col.innerHTML = '<div class="parthead"><h1 data-heading></h1></div>';
  while (main.firstChild) col.appendChild(main.firstChild);
  main.appendChild(col);
  var heading = col.querySelector("[data-heading]");

  /* section footer nav */
  var nav = document.createElement("nav");
  nav.className = "secnav";
  nav.innerHTML = '<a class="navbtn" data-back></a><span class="pos" data-pos></span>' +
    '<span class="spacer"></span><a class="navbtn primary" data-fwd></a>';
  col.appendChild(nav);
  var backBtn = nav.querySelector("[data-back]"), fwdBtn = nav.querySelector("[data-fwd]"),
      pos = nav.querySelector("[data-pos]");

  /* ---- mobile drawer ---- */
  var scrim = content.querySelector("[data-scrim]");
  content.querySelector(".menu-btn").addEventListener("click", function () {
    side.classList.add("open"); document.body.classList.add("drawer-open");
  });
  scrim.addEventListener("click", closeDrawer);
  side.addEventListener("click", function (e) { if (e.target.closest("a")) closeDrawer(); });
  function closeDrawer() { side.classList.remove("open"); document.body.classList.remove("drawer-open"); }

  /* ---- section switching ---- */
  var current = 0;
  function idxFromHash() {
    var h = location.hash.replace("#", "");
    var i = secIds.indexOf(h);
    return i >= 0 ? i : 0;
  }
  function paint() {
    sections.forEach(function (s, i) { s.classList.toggle("current", i === current); });
    [].forEach.call(side.querySelectorAll(".side-secs li"), function (li, i) {
      li.classList.toggle("active", i === current);
      li.classList.toggle("seen", mine.seen.indexOf(secIds[i]) >= 0);
    });
    pos.textContent = (current + 1) + " / " + sections.length;
    heading.textContent = sections[current].dataset.title;

    if (current === 0) {
      if (prevPage) { backBtn.style.display = ""; backBtn.textContent = "← " + prevPage.label; backBtn.href = prevPage.file; }
      else { backBtn.style.display = ""; backBtn.textContent = "← All modules"; backBtn.href = COURSE.home; }
    } else {
      backBtn.style.display = ""; backBtn.textContent = "← Back"; backBtn.href = "#" + secIds[current - 1];
    }
    if (current === sections.length - 1) {
      if (nextPage) { fwdBtn.textContent = "Next: " + (nextPage.num !== "·" ? "Part " + nextPage.num + " · " : "") + nextPage.label + " →"; fwdBtn.href = nextPage.file; }
      else { fwdBtn.textContent = "Module " + mod.num + " overview →"; fwdBtn.href = "m3-index.html"; }
    } else {
      fwdBtn.textContent = "Continue →"; fwdBtn.href = "#" + secIds[current + 1];
    }

    var li = side.querySelector('[data-part="' + pageId + '"]');
    if (li) li.classList.toggle("done", isDone(pageId));
  }
  function visit(i, scroll) {
    current = i;
    if (mine.seen.indexOf(secIds[i]) < 0) mine.seen.push(secIds[i]);
    prog[pageId] = mine; saveP(prog);
    try { localStorage.setItem(LKEY, JSON.stringify({ file: page.file, sec: secIds[i], label: partLabel, mod: mod.num })); } catch (e) {}
    paint();
    if (scroll !== false) window.scrollTo({ top: 0 });
  }

  window.addEventListener("hashchange", function () { visit(idxFromHash()); });
  if (!location.hash && secIds.length) history.replaceState(null, "", "#" + secIds[0]);
  visit(idxFromHash(), false);

  /* keyboard: arrows move between sections (and into adjacent parts) */
  document.addEventListener("keydown", function (e) {
    if (e.target.closest("input,textarea") || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === "ArrowRight") { fwdBtn.click(); }
    if (e.key === "ArrowLeft") { backBtn.click(); }
  });

  /* activities report their height */
  window.addEventListener("message", function (e) {
    if (e.data && e.data.type === "activity-height") {
      [].forEach.call(document.querySelectorAll("iframe.activity"), function (f) {
        if (f.contentWindow === e.source) f.style.height = e.data.height + "px";
      });
    }
  });
})();
