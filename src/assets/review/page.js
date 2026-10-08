/* Review mode: the /review/ control page. */

import { openStore, pageUrl, saveSyncSettings, syncSettings } from "./open.js";
import { KIND_LABEL, colorClass, downloadJson, esc, loadMessage, markBody, readFiles, reviewerChips } from "./ui.js";

const store = openStore();
const $ = (id) => document.getElementById(id);
const hidden = new Set();

function renderState() {
  const on = store.isOn();
  $("rv-toggle").textContent = on ? "Turn off review mode" : "Turn on review mode";
  $("rv-toggle").classList.toggle("primary", !on);
  $("rv-state").textContent = on
    ? "Review mode is on in this browser. Open any course page to start."
    : "Review mode is off.";
  const n = store.unexportedCount();
  const total = store.own().length;
  $("rv-unexported").textContent = total
    ? `${total} comment${total === 1 ? "" : "s"} of yours` + (n ? `, ${n} not downloaded yet.` : ", all downloaded.")
    : "You haven't made any comments yet.";
}

function renderTable() {
  const myId = store.me().reviewerId;
  const all = store.all();
  const filter = $("rv-filter");
  filter.replaceWith(Object.assign(reviewerChips(all, myId, hidden, (id) => {
    hidden.has(id) ? hidden.delete(id) : hidden.add(id);
    renderTable();
  }), { id: "rv-filter" }));

  const marks = all.filter((m) => !hidden.has(m.reviewerId))
    .sort((a, b) => a.page.localeCompare(b.page) || a.created.localeCompare(b.created));
  if (!marks.length) {
    $("rv-table").innerHTML = `<p class="rv-help">No comments yet.</p>`;
    return;
  }
  const pages = new Map();
  marks.forEach((m) => {
    if (!pages.has(m.page)) pages.set(m.page, new Map());
    const secs = pages.get(m.page);
    const key = m.section || "";
    if (!secs.has(key)) secs.set(key, []);
    secs.get(key).push(m);
  });
  let html = "";
  pages.forEach((secs, page) => {
    html += `<h3 class="rv-page"><a href="${esc(pageUrl(page))}">${esc(page)}</a></h3>`;
    secs.forEach((list, section) => {
      if (section) html += `<p class="rv-sec"><a href="${esc(pageUrl(page, section))}">#${esc(section)}</a></p>`;
      html += `<ul class="rv-list">` + list.map((m) => `
        <li class="rv-item ${colorClass(m.reviewerId, myId)}">
          <p class="rv-meta"><span class="rv-dot"></span><b>${esc(m.reviewer || "Unnamed")}</b>${m.reviewerId === myId ? " (you)" : ""}
            · ${KIND_LABEL[m.kind] || m.kind} · <span class="rv-src">${esc(m.src)}</span></p>
          ${markBody(m)}
        </li>`).join("") + `</ul>`;
    });
  });
  $("rv-table").innerHTML = html;
}

function render() { renderState(); renderTable(); }

$("rv-name").value = store.me().name;
let nameTimer = 0;
$("rv-name").addEventListener("input", (e) => {
  clearTimeout(nameTimer);
  nameTimer = setTimeout(() => store.setName(e.target.value), 500);
});

/* ---- where comments are saved (only when a sync server is configured) ---- */
if ($("rv-sync")) initSyncSettings();
function initSyncSettings() {
  const sync = syncSettings();
  document.querySelector(`input[name=rv-mode][value=${sync.mode}]`).checked = true;
  $("rv-sync").hidden = sync.mode !== "sync";
  $("rv-server").value = sync.server;
  $("rv-passcode").value = sync.passcode;
  /* Settings are read when a page opens its store, so a change reloads this
     page to switch it over too. */
  function storeSettings(reload) {
    const mode = document.querySelector("input[name=rv-mode]:checked").value;
    saveSyncSettings({ mode, server: $("rv-server").value.trim(), passcode: $("rv-passcode").value });
    if (reload) location.reload();
}
document.querySelectorAll("input[name=rv-mode]").forEach((r) => r.addEventListener("change", () => {
  $("rv-sync").hidden = r.value !== "sync";
  storeSettings($("rv-server").value.trim() !== "" || r.value === "local");
}));
$("rv-server").addEventListener("change", () => storeSettings(true));
$("rv-passcode").addEventListener("change", () => storeSettings(true));
/* A plain request, so testing never changes what's stored. */
$("rv-test").addEventListener("click", async () => {
  const out = $("rv-test-result");
  const server = $("rv-server").value.trim().replace(/\/+$/, "");
  out.textContent = "Checking…";
  try {
    const res = await fetch(`${server}/marks`, { headers: { "X-Review-Key": $("rv-passcode").value } });
    if (res.status === 401) out.textContent = "The server rejected the passcode.";
    else if (!res.ok) out.textContent = `The server answered ${res.status}.`;
    else {
      const n = (await res.json()).marks.length;
      out.textContent = `Connected. The server has ${n} comment${n === 1 ? "" : "s"}.`;
    }
  } catch (e) {
    out.textContent = "Couldn't reach that address.";
  }
});
}
$("rv-toggle").addEventListener("click", () => { store.setOn(!store.isOn()); render(); });
$("rv-download").addEventListener("click", () => {
  const { filename, data } = store.exportFile();
  downloadJson(filename, data);
});
$("rv-files").addEventListener("change", async (e) => {
  const files = await readFiles(e.target.files);
  $("rv-load-result").textContent = loadMessage(store.loadFiles(files), files.length);
  e.target.value = "";
});
$("rv-clear-loaded").addEventListener("click", () => store.clearLoaded());
$("rv-clear-mine").addEventListener("click", () => {
  const n = store.own().length;
  if (!n) return;
  if (confirm(`Delete all ${n} of your comments from this browser? Download your review first if you want to keep them.`)) {
    store.clearMine();
  }
});
store.onChange(render);
render();
