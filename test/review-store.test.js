import { test } from "node:test";
import assert from "node:assert/strict";
import { LocalStore } from "../src/assets/review/store.js";
import { newMark, buildExport } from "../src/assets/review/core.js";

function memory() {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
  };
}
const fields = { kind: "comment", page: "/p/", src: "./src/p.md", section: "s",
  quote: { exact: "x", prefix: "", suffix: "" }, comment: "c", version: "v" };

test("me() is created once and persists across stores", () => {
  const s = memory();
  const a = new LocalStore(s).me();
  assert.deepEqual(new LocalStore(s).me(), a);
  assert.ok(a.reviewerId && a.ownerToken && a.reviewerId !== a.ownerToken);
});

test("review mode on/off and name persist", () => {
  const s = memory();
  const st = new LocalStore(s);
  assert.equal(st.isOn(), false);
  st.setOn(true); st.setName("Sam");
  assert.equal(new LocalStore(s).isOn(), true);
  assert.equal(new LocalStore(s).me().name, "Sam");
});

test("unexported count follows saves, downloads and edits", () => {
  const st = new LocalStore(memory());
  const m = newMark(fields, st.me());
  assert.deepEqual(st.save(m), { ok: true });
  assert.equal(st.own().length, 1);
  assert.equal(st.unexportedCount(), 1);
  st.exportFile();
  assert.equal(st.unexportedCount(), 0);
  st.save({ ...m, comment: "edited" });
  assert.equal(st.unexportedCount(), 1);
  assert.equal(st.own()[0].comment, "edited");
});

test("remove deletes an own mark", () => {
  const st = new LocalStore(memory());
  const m = newMark(fields, st.me());
  st.save(m);
  assert.deepEqual(st.remove(m.id), { ok: true });
  assert.equal(st.own().length, 0);
});

test("loaded files show in all() but never in my export", () => {
  const st = new LocalStore(memory());
  st.save(newMark(fields, st.me()));
  const other = { reviewerId: "r-other", name: "Keller", ownerToken: "t" };
  const good = JSON.stringify(buildExport(other, [newMark(fields, other), newMark(fields, other)]).data);
  const r = st.loadFiles([{ name: "good.json", text: good }, { name: "bad.json", text: "{}" }]);
  assert.equal(r.added, 2);
  assert.equal(r.errors.length, 1);
  assert.match(r.errors[0], /bad\.json/);
  assert.equal(st.all().length, 3);
  assert.equal(st.exportFile().data.marks.length, 1);
});

test("my own export loaded back does not duplicate my marks", () => {
  const st = new LocalStore(memory());
  st.save(newMark(fields, st.me()));
  const mine = JSON.stringify(st.exportFile().data);
  assert.equal(st.loadFiles([{ name: "mine.json", text: mine }]).added, 0);
  assert.equal(st.all().length, 1);
});

test("addLoaded and removeLoaded manage other reviewers' marks", () => {
  const st = new LocalStore(memory());
  const other = { reviewerId: "r-other", name: "Keller" };
  const m = newMark(fields, other);
  assert.equal(st.addLoaded([m]), 1);
  assert.equal(st.loaded().length, 1);
  st.removeLoaded(m.id);
  assert.equal(st.loaded().length, 0);
});

test("clearLoaded keeps my marks; clearMine keeps loaded ones", () => {
  const st = new LocalStore(memory());
  st.save(newMark(fields, st.me()));
  st.addLoaded([newMark(fields, { reviewerId: "r-other", name: "K" })]);
  st.clearLoaded();
  assert.equal(st.own().length, 1);
  assert.equal(st.loaded().length, 0);
  st.addLoaded([newMark(fields, { reviewerId: "r-other", name: "K" })]);
  st.clearMine();
  assert.equal(st.own().length, 0);
  assert.equal(st.loaded().length, 1);
});

test("a failing storage reports the error instead of losing it silently", () => {
  const s = memory();
  const st = new LocalStore(s);
  const m = newMark(fields, st.me());
  s.setItem = () => { throw new Error("QuotaExceededError"); };
  const r = st.save(m);
  assert.equal(r.ok, false);
  assert.ok(r.error.length > 0);
});

test("onChange fires after mutations", () => {
  const st = new LocalStore(memory());
  let n = 0;
  st.onChange(() => n++);
  const m = newMark(fields, st.me());
  st.save(m); st.remove(m.id); st.clearLoaded();
  assert.equal(n, 3);
});

test("renaming updates the name on my existing marks", () => {
  const st = new LocalStore(memory());
  st.setName("Sma");
  st.save(newMark(fields, st.me()));
  st.setName("Sam");
  assert.equal(st.own()[0].reviewer, "Sam");
  assert.equal(st.exportFile().data.marks[0].reviewer, "Sam");
});

test("loading my own download back restores my deleted marks", () => {
  const st = new LocalStore(memory());
  st.save(newMark(fields, st.me()));
  const mine = JSON.stringify(st.exportFile().data);
  st.clearMine();
  const r = st.loadFiles([{ name: "mine.json", text: mine }]);
  assert.equal(r.restored, 1);
  assert.equal(st.own().length, 1);
  assert.equal(st.loaded().length, 0);
});
