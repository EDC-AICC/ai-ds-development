import { test } from "node:test";
import assert from "node:assert/strict";
import {
  normalize, makeQuote, findQuote, newMark, buildExport, parseImport, mergeLoaded, colorIndex,
} from "../src/assets/review/core.js";

const me = { reviewerId: "r-me", ownerToken: "secret-token", name: "Sam Lee" };
const mark = (over = {}) => ({
  ...newMark({ kind: "comment", page: "/module-3/03-explore/", src: "./src/module-3/03-explore.md",
    section: "s", quote: { exact: "812", prefix: "", suffix: "" }, comment: "hm", version: "abc1234" }, me),
  ...over,
});

test("normalize collapses whitespace runs to one space", () => {
  assert.equal(normalize("a \n\t b"), "a b");
});

test("makeQuote keeps up to 32 characters of context on each side", () => {
  const text = "x".repeat(50) + "HELLO" + "y".repeat(45);
  const q = makeQuote(text, 50, 55);
  assert.equal(q.exact, "HELLO");
  assert.equal(q.prefix.length, 32);
  assert.equal(q.suffix.length, 32);
  assert.equal(makeQuote(text, 0, 5).prefix, "");
});

const repeated = "We counted 812 rows. Then 812 again later.";
const second = repeated.indexOf("812", 15);

test("findQuote picks the occurrence the reviewer selected", () => {
  const q = makeQuote(repeated, second, second + 3);
  assert.deepEqual(findQuote(repeated, q), { start: second, end: second + 3 });
});

test("findQuote uses surviving context when nearby words were edited", () => {
  const q = makeQuote(repeated, second, second + 3);
  const edited = "We counted 812 rows. After that, 812 again later.";
  const at = edited.indexOf("812", 15);
  assert.deepEqual(findQuote(edited, q), { start: at, end: at + 3 });
});

test("findQuote returns null when the quoted text is gone", () => {
  const q = makeQuote(repeated, second, second + 3);
  assert.equal(findQuote("Nothing to see here.", q), null);
});

test("newMark fills identity and times but never the owner token", () => {
  const m = mark();
  assert.match(m.id, /^[0-9a-f-]{36}$/);
  assert.equal(m.reviewerId, "r-me");
  assert.equal(m.reviewer, "Sam Lee");
  assert.ok(m.created && m.updated);
  assert.ok(!JSON.stringify(m).includes("secret-token"));
});

test("buildExport names the file and carries the format", () => {
  const { filename, data } = buildExport(me, [mark()], new Date(2026, 9, 7, 12));
  assert.equal(filename, "review-sam-lee-2026-10-07.json");
  assert.equal(data.format, "aids-review");
  assert.equal(data.formatVersion, 1);
  assert.equal(data.marks.length, 1);
  assert.ok(!JSON.stringify(data).includes("secret-token"));
});

test("parseImport round-trips an export", () => {
  const { data } = buildExport(me, [mark()], new Date());
  const r = parseImport(JSON.stringify(data), "a.json");
  assert.equal(r.error, undefined);
  assert.equal(r.marks.length, 1);
});

test("parseImport rejects other files and names them", () => {
  assert.match(parseImport("{}", "x.json").error, /x\.json/);
  assert.match(parseImport("not json", "y.json").error, /y\.json/);
  const { data } = buildExport(me, [mark()], new Date());
  assert.ok(parseImport(JSON.stringify({ ...data, formatVersion: 2 }), "z.json").error);
  assert.ok(parseImport(JSON.stringify({ ...data, marks: "nope" }), "z.json").error);
  assert.ok(parseImport(JSON.stringify({ ...data, marks: [{ id: "1" }] }), "z.json").error);
});

test("mergeLoaded replaces by id and skips my own marks", () => {
  const other = mark({ reviewerId: "r-other", reviewer: "Keller" });
  const once = mergeLoaded({}, [other], "r-me");
  const twice = mergeLoaded(once, [other], "r-me");
  assert.deepEqual(Object.keys(twice), [other.id]);
  const newer = { ...other, comment: "changed" };
  assert.equal(mergeLoaded(twice, [newer], "r-me")[other.id].comment, "changed");
  assert.deepEqual(mergeLoaded({}, [mark()], "r-me"), {});
});

test("colorIndex is stable and in range", () => {
  const a = colorIndex("r-other", 8);
  assert.equal(a, colorIndex("r-other", 8));
  for (const id of ["a", "b", "c", "a-long-reviewer-id"]) {
    const i = colorIndex(id, 8);
    assert.ok(Number.isInteger(i) && i >= 0 && i < 8);
  }
});
