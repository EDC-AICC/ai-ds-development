import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

/* One real build into a temp dir; the review stamps are layout output, so
   the only honest check is the rendered HTML. */
const out = mkdtempSync(join(tmpdir(), "aids-build-"));
execFileSync("npx", ["@11ty/eleventy", "--quiet", `--output=${out}`], { stdio: "pipe" });
const read = (p) => readFileSync(join(out, p), "utf8");
test.after(() => rmSync(out, { recursive: true, force: true }));

test("lesson pages name their source file and version", () => {
  const html = read("module-3/03-explore/index.html");
  assert.match(html, /data-review-src="\.\/src\/module-3\/03-explore\.md"/);
  assert.match(html, /data-review-version="[0-9a-f]{7,}(-dirty)?"/);
  assert.match(html, /data-review-base="\/"/);
});

test("base-layout pages are review roots too", () => {
  assert.match(read("index.html"), /data-review-root/);
});

test("pages carry the review server meta tag", () => {
  assert.match(read("index.html"), /<meta name="review-server" content="[^"]*">/);
});

test("the shared-server option is hidden until a review server is configured", () => {
  const html = read("review/index.html");
  assert.match(html, /data-review-panel/);
  assert.doesNotMatch(html, /name="rv-mode"/);
});

test("the home page links to review mode under instructor resources", () => {
  const html = read("index.html");
  assert.match(html, /Instructor resources/);
  assert.match(html, /href="\/review\/"/);
});
