import { test } from "node:test";
import assert from "node:assert/strict";
import { LocalStore } from "../src/assets/review/store.js";
import { SyncStore } from "../src/assets/review/sync.js";
import { newMark } from "../src/assets/review/core.js";

function memory() {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) };
}
const fields = { kind: "comment", page: "/p/", src: "./src/p.md", section: "s",
  quote: { exact: "x", prefix: "", suffix: "" }, comment: "c", version: "v" };
const SERVER = "http://srv.test";

/* fetch stand-in: `routes(method, path)` returns {status, body} or throws. */
function fakeFetch(routes) {
  const calls = [];
  const fn = async (url, opts = {}) => {
    const u = new URL(url);
    const call = { method: opts.method || "GET", path: u.pathname, headers: opts.headers || {}, body: opts.body };
    calls.push(call);
    const r = routes(call);
    return { ok: r.status < 300, status: r.status, json: async () => r.body };
  };
  fn.calls = calls;
  return fn;
}
class FakeES {
  static last = null;
  constructor(url) { this.url = url; this.readyState = 0; this.handlers = {}; FakeES.last = this; }
  addEventListener(type, h) { (this.handlers[type] ||= []).push(h); }
  emit(type, data) { (this.handlers[type] || []).forEach((h) => h(data === undefined ? {} : { data: JSON.stringify(data) })); }
  close() { this.readyState = 2; }
}
const tick = () => new Promise((r) => setTimeout(r, 0));

function setup(routes) {
  const local = new LocalStore(memory());
  const fetch = fakeFetch(routes);
  const sync = new SyncStore(local, { server: SERVER + "/", passcode: "pw" }, { fetch, EventSource: FakeES });
  return { local, sync, fetch };
}

test("a save while offline stays local and queued, then flushes with both headers", async () => {
  let up = false;
  const { local, sync, fetch } = setup((c) => {
    if (!up) throw new TypeError("network");
    return { status: 200, body: {} };
  });
  const m = newMark(fields, local.me());
  assert.equal(sync.save(m).ok, true);
  await tick();
  assert.equal(sync.pendingCount(), 1);
  assert.equal(sync.status(), "offline");
  assert.equal(local.own().length, 1);
  up = true;
  await sync.flush();
  const put = fetch.calls.filter((c) => c.method === "PUT").pop();
  assert.equal(put.path, `/marks/${m.id}`);
  assert.equal(put.headers["X-Review-Key"], "pw");
  assert.equal(put.headers["X-Review-Owner"], local.me().ownerToken);
  assert.ok(!put.body.includes(local.me().ownerToken));
  assert.equal(sync.pendingCount(), 0);
});

test("save then remove while offline leaves a single remove queued", async () => {
  const { local, sync } = setup(() => { throw new TypeError("network"); });
  const m = newMark(fields, local.me());
  sync.save(m);
  sync.remove(m.id);
  await tick();
  assert.equal(sync.pendingCount(), 1);
  assert.equal(sync.pending()[0].op, "remove");
});

test("remove sends DELETE and a 404 still clears it", async () => {
  const { local, sync, fetch } = setup((c) => ({ status: c.method === "DELETE" ? 404 : 200, body: {} }));
  const m = newMark(fields, local.me());
  sync.save(m);
  sync.remove(m.id);
  await sync.flush();
  assert.ok(fetch.calls.some((c) => c.method === "DELETE" && c.path === `/marks/${m.id}`));
  assert.equal(sync.pendingCount(), 0);
});

test("pull keeps other reviewers' marks and skips mine", async () => {
  const other = { reviewerId: "r-other", name: "Keller" };
  let mineOnServer;
  const { local, sync } = setup(() => ({ status: 200, body: { marks: [newMark(fields, other), mineOnServer] } }));
  mineOnServer = newMark(fields, local.me());
  await sync.pull();
  assert.equal(sync.loaded().length, 1);
  assert.equal(sync.loaded()[0].reviewer, "Keller");
});

test("pull uploads my marks the server is missing", async () => {
  const { local, sync, fetch } = setup((c) => ({ status: 200, body: c.method === "GET" ? { marks: [] } : {} }));
  const m = newMark(fields, local.me());
  local.save(m); /* made before sync was turned on */
  await sync.pull();
  await sync.flush();
  assert.ok(fetch.calls.some((c) => c.method === "PUT" && c.path === `/marks/${m.id}`));
});

test("a wrong passcode reports denied", async () => {
  const { sync } = setup(() => ({ status: 401, body: { error: "passcode" } }));
  await sync.pull();
  assert.equal(sync.status(), "denied");
});

test("server marks that disappear are dropped on the next pull", async () => {
  const other = newMark(fields, { reviewerId: "r-other", name: "Keller" });
  let marks = [other];
  const { sync } = setup(() => ({ status: 200, body: { marks } }));
  await sync.pull();
  assert.equal(sync.loaded().length, 1);
  marks = [];
  await sync.pull();
  assert.equal(sync.loaded().length, 0);
});

test("live events add, update and remove other reviewers' marks", async () => {
  const { sync } = setup(() => ({ status: 200, body: { marks: [] } }));
  let changes = 0;
  sync.onChange(() => changes++);
  sync.connect();
  const es = FakeES.last;
  assert.equal(es.url, `${SERVER}/events?key=pw`);
  es.readyState = 1;
  es.emit("open");
  await tick();
  assert.equal(sync.status(), "live");
  const other = newMark(fields, { reviewerId: "r-other", name: "Keller" });
  es.emit("save", { mark: other });
  assert.equal(sync.all().length, 1);
  assert.ok(changes > 0);
  es.emit("delete", { id: other.id });
  assert.equal(sync.all().length, 0);
});

test("a 5xx keeps the write queued and reports offline", async () => {
  const { local, sync } = setup(() => ({ status: 502, body: {} }));
  const m = newMark(fields, local.me());
  local.save(m);
  sync.remove(m.id);
  await sync.flush();
  assert.equal(sync.pendingCount(), 1);
  assert.equal(sync.status(), "offline");
});

test("a mark deleted on the server while this browser was closed is dropped", async () => {
  const storage = memory();
  const other = newMark(fields, { reviewerId: "r-other", name: "Keller" });
  const fileMark = newMark(fields, { reviewerId: "r-file", name: "Pat" });
  let marks = [other];
  const fetch = fakeFetch(() => ({ status: 200, body: { marks } }));
  const first = new SyncStore(new LocalStore(storage), { server: SERVER, passcode: "pw" }, { fetch, EventSource: FakeES });
  await first.pull();
  first.addLoaded([fileMark]); /* loaded from a file, not the server */
  marks = [];
  const later = new SyncStore(new LocalStore(storage), { server: SERVER, passcode: "pw" }, { fetch, EventSource: FakeES });
  await later.pull();
  assert.deepEqual(later.loaded().map((m) => m.id), [fileMark.id]);
});

test("malformed marks from the server are ignored", async () => {
  const good = newMark(fields, { reviewerId: "r-other", name: "Keller" });
  const bad = { id: "x", reviewerId: "r-bad", kind: "comment", page: "/p/" };
  const { sync } = setup(() => ({ status: 200, body: { marks: [good, bad] } }));
  await sync.pull();
  assert.deepEqual(sync.loaded().map((m) => m.id), [good.id]);
});
