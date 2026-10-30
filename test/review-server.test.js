import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createServer, importFiles } from "../review-server/server.js";

const KEY = "test-pass";
const dir = mkdtempSync(join(tmpdir(), "aids-review-"));
let n = 0;
/* Every server is closed at the end even when an assertion fails first,
   or its open socket keeps the test process alive. */
const open = new Set();
test.after(async () => {
  await Promise.all([...open].map((close) => close()));
  rmSync(dir, { recursive: true, force: true });
});

/* A fresh server on a random port; returns { url, close, dbPath }. */
async function start(dbPath = join(dir, `db-${n++}.sqlite`)) {
  const server = createServer({ key: KEY, dbPath, origins: ["http://localhost:8318"] });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const url = `http://127.0.0.1:${server.address().port}`;
  const close = () => {
    if (!open.has(close)) return Promise.resolve();
    open.delete(close);
    return new Promise((r) => { server.closeAllConnections(); server.close(r); });
  };
  open.add(close);
  return { url, dbPath, close };
}

const mark = (over = {}) => ({
  id: "m1", reviewerId: "r-a", reviewer: "Sam", kind: "comment", page: "/p/", src: "./src/p.md",
  section: "s", quote: { exact: "x", prefix: "", suffix: "" }, activity: "", comment: "c", replacement: "",
  created: "2026-10-07T00:00:00.000Z", updated: "2026-10-07T00:00:00.000Z", version: "abc1234", ...over,
});
const put = (url, m, owner, id = m.id) => fetch(`${url}/marks/${id}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json", "X-Review-Key": KEY, "X-Review-Owner": owner },
  body: JSON.stringify(m),
});
const del = (url, id, owner) => fetch(`${url}/marks/${id}`, {
  method: "DELETE", headers: { "X-Review-Key": KEY, "X-Review-Owner": owner },
});
const list = (url, key = KEY) => fetch(`${url}/marks`, { headers: key ? { "X-Review-Key": key } : {} });

test("health needs no key; listing needs the right one", async () => {
  const s = await start();
  assert.equal((await fetch(`${s.url}/health`)).status, 200);
  assert.equal((await list(s.url, null)).status, 401);
  assert.equal((await list(s.url, "wrong")).status, 401);
  const r = await list(s.url);
  assert.equal(r.status, 200);
  assert.deepEqual(await r.json(), { marks: [] });
  await s.close();
});

test("a saved mark is listed without any owner secret", async () => {
  const s = await start();
  const r = await put(s.url, { ...mark(), ownerToken: "owner-a" }, "owner-a");
  assert.equal(r.status, 200);
  const text = await (await list(s.url)).text();
  assert.equal(JSON.parse(text).marks[0].id, "m1");
  assert.ok(!text.includes("owner-a"));
  assert.ok(!text.includes("owner_hash"));
  await s.close();
});

test("only the creator can change a mark", async () => {
  const s = await start();
  await put(s.url, mark(), "owner-a");
  assert.equal((await put(s.url, mark({ comment: "hijack" }), "owner-b")).status, 403);
  assert.equal((await put(s.url, mark({ comment: "edited" }), "owner-a")).status, 200);
  assert.equal((await (await list(s.url)).json()).marks[0].comment, "edited");
  await s.close();
});

test("only the creator can delete a mark", async () => {
  const s = await start();
  await put(s.url, mark(), "owner-a");
  assert.equal((await del(s.url, "m1", "owner-b")).status, 403);
  assert.equal((await del(s.url, "m1", "owner-a")).status, 204);
  assert.equal((await del(s.url, "m1", "owner-a")).status, 404);
  await s.close();
});

test("bad bodies are refused", async () => {
  const s = await start();
  assert.equal((await put(s.url, mark(), "owner-a", "other-id")).status, 400);
  const { kind, ...noKind } = mark();
  assert.equal((await put(s.url, noKind, "owner-a")).status, 400);
  assert.equal((await put(s.url, mark({ comment: "x".repeat(70 * 1024) }), "owner-a")).status, 400);
  assert.equal((await put(s.url, mark(), "")).status, 400);
  const { quote, ...noQuote } = mark();
  assert.equal((await put(s.url, noQuote, "owner-a")).status, 400);
  assert.equal((await put(s.url, mark({ page: "javascript:alert(1)" }), "owner-a")).status, 400);
  assert.equal((await put(s.url, mark({ page: "//evil.example/" }), "owner-a")).status, 400);
  await s.close();
});

test("CORS allows the configured origin only", async () => {
  const s = await start();
  const ok = await fetch(`${s.url}/marks`, { method: "OPTIONS", headers: { Origin: "http://localhost:8318" } });
  assert.equal(ok.status, 204);
  assert.equal(ok.headers.get("access-control-allow-origin"), "http://localhost:8318");
  const no = await fetch(`${s.url}/marks`, { method: "OPTIONS", headers: { Origin: "https://evil.example" } });
  assert.equal(no.headers.get("access-control-allow-origin"), null);
  await s.close();
});

test("the event stream announces saves and deletes", async () => {
  const s = await start();
  assert.equal((await fetch(`${s.url}/events?key=wrong`)).status, 401);
  const res = await fetch(`${s.url}/events?key=${KEY}`);
  assert.equal(res.headers.get("content-type"), "text/event-stream");
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let got = "";
  const until = async (needle) => {
    while (!got.includes(needle)) got += decoder.decode((await reader.read()).value);
  };
  await put(s.url, mark(), "owner-a");
  await until("event: save");
  assert.match(got, /"id":"m1"/);
  await del(s.url, "m1", "owner-a");
  await until("event: delete");
  await reader.cancel();
  await s.close();
});

test("marks survive a restart", async () => {
  const s = await start();
  await put(s.url, mark(), "owner-a");
  await s.close();
  const again = await start(s.dbPath);
  assert.equal((await (await list(again.url)).json()).marks.length, 1);
  await again.close();
});

const reviewFile = (marks, name = "review-sam.json") =>
  ({ name, text: JSON.stringify({ format: "aids-review", formatVersion: 1, reviewer: "Sam", reviewerId: "r-a", marks }) });
const as = (reviewer) => (url, m, owner, id = m.id) => fetch(`${url}/marks/${id}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json", "X-Review-Key": KEY, "X-Review-Owner": owner, "X-Review-Reviewer": reviewer },
  body: JSON.stringify(m),
});
const delAs = (reviewer) => (url, id, owner) => fetch(`${url}/marks/${id}`, {
  method: "DELETE", headers: { "X-Review-Key": KEY, "X-Review-Owner": owner, "X-Review-Reviewer": reviewer },
});

test("importing review files adds new marks and leaves existing ones alone", async () => {
  const s = await start();
  await put(s.url, mark({ comment: "live" }), "owner-a");
  const r = importFiles(s.dbPath, [
    reviewFile([mark({ comment: "old copy" }), mark({ id: "m2", ownerToken: "secret" })]),
    { name: "notes.txt", text: "not json" },
    { name: "other.json", text: JSON.stringify({ format: "something-else" }) },
    reviewFile([mark({ id: "m3", page: "javascript:x" })], "damaged.json"),
  ]);
  assert.equal(r.added, 1);
  assert.equal(r.skipped, 1);
  assert.equal(r.errors.length, 3);
  const text = await (await list(s.url)).text();
  const marks = JSON.parse(text).marks;
  assert.deepEqual(marks.map((m) => m.id).sort(), ["m1", "m2"]);
  assert.equal(marks.find((m) => m.id === "m1").comment, "live");
  assert.ok(!text.includes("secret"));
  await s.close();
});

test("an imported mark can be claimed only by its own reviewer", async () => {
  const s = await start();
  importFiles(s.dbPath, [reviewFile([mark(), mark({ id: "m2" })])]);
  assert.equal((await put(s.url, mark({ comment: "hijack" }), "owner-b")).status, 403);
  assert.equal((await as("r-b")(s.url, mark({ comment: "hijack" }), "owner-b")).status, 403);
  assert.equal((await as("r-b")(s.url, mark({ reviewerId: "r-b", comment: "hijack" }), "owner-b")).status, 403);
  assert.equal((await delAs("r-b")(s.url, "m1", "owner-b")).status, 403);
  assert.equal((await as("r-a")(s.url, mark({ comment: "mine" }), "owner-a")).status, 200);
  assert.equal((await as("r-a")(s.url, mark({ comment: "again" }), "owner-c")).status, 403);
  assert.equal((await put(s.url, mark({ comment: "edited" }), "owner-a")).status, 200);
  assert.equal((await delAs("r-a")(s.url, "m2", "owner-a")).status, 204);
  const marks = (await (await list(s.url)).json()).marks;
  assert.deepEqual(marks.map((m) => [m.id, m.comment]), [["m1", "edited"]]);
  await s.close();
});
