import { test } from "node:test";
import assert from "node:assert/strict";
import { parseSetupLink, setupLink } from "../src/assets/review/open.js";

test("a setup link round-trips the server and passcode", () => {
  const link = setupLink("https://site.test/review/#old", { server: "https://srv.test:8443", passcode: "a b&c=d#" });
  assert.ok(link.startsWith("https://site.test/review/#"));
  assert.ok(!link.includes("#old"));
  assert.deepEqual(parseSetupLink(new URL(link).hash), { mode: "sync", server: "https://srv.test:8443", passcode: "a b&c=d#" });
});

test("only an http(s) server address counts as a setup link", () => {
  assert.equal(parseSetupLink(""), null);
  assert.equal(parseSetupLink("#section-2"), null);
  assert.equal(parseSetupLink("#server=javascript:alert(1)&key=x"), null);
  assert.equal(parseSetupLink("#server=not a url&key=x"), null);
  assert.deepEqual(parseSetupLink("#server=http%3A%2F%2F127.0.0.1%3A8090"), { mode: "sync", server: "http://127.0.0.1:8090", passcode: "" });
});
