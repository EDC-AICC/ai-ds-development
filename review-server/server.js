/* Review mode sync server. One file, no dependencies (Node 22.13+ for the
   built-in node:sqlite). Stores reviewers' marks and pushes changes to every
   open page over Server-Sent Events.

   Access: every request needs the shared review passcode (X-Review-Key, or
   ?key= on the event stream, since EventSource can't send headers). Each
   browser also sends its own secret (X-Review-Owner); a mark can only be
   changed or deleted with the secret that created it. Only a SHA-256 of that
   secret is stored, and it is never sent back out.

   Run: REVIEW_KEY=… node server.js   (see README.md for the other settings) */

import http from "node:http";
import { createHash, timingSafeEqual } from "node:crypto";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { pathToFileURL } from "node:url";
import { DatabaseSync } from "node:sqlite";

const MAX_BODY = 64 * 1024;
const KINDS = ["comment", "suggest", "activity"];
const HEARTBEAT_MS = 25000;

const hash = (s) => createHash("sha256").update(String(s)).digest("hex");
function sameSecret(a, b) {
  const x = Buffer.from(hash(a)), y = Buffer.from(hash(b));
  return timingSafeEqual(x, y);
}

export function createServer({ key, dbPath, origins = [] }) {
  if (dbPath !== ":memory:") mkdirSync(dirname(dbPath), { recursive: true });
  const db = new DatabaseSync(dbPath);
  db.exec(`CREATE TABLE IF NOT EXISTS marks (
    id TEXT PRIMARY KEY, owner_hash TEXT NOT NULL, data TEXT NOT NULL, updated TEXT NOT NULL)`);
  const q = {
    all: db.prepare("SELECT data FROM marks ORDER BY updated"),
    owner: db.prepare("SELECT owner_hash FROM marks WHERE id = ?"),
    upsert: db.prepare(`INSERT INTO marks (id, owner_hash, data, updated) VALUES (?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated = excluded.updated`),
    remove: db.prepare("DELETE FROM marks WHERE id = ?"),
  };
  const listeners = new Set();

  function cors(req, res) {
    const origin = req.headers.origin;
    if (origin && origins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Vary", "Origin");
    }
  }
  function send(res, status, body) {
    if (body === undefined) { res.writeHead(status); return res.end(); }
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(body));
  }
  const authorized = (k) => typeof k === "string" && k.length > 0 && sameSecret(k, key);

  function broadcast(event, payload) {
    const msg = `event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`;
    listeners.forEach((res) => res.write(msg));
  }

  /* An oversized body is read to the end and dropped, so the client still
     gets a 400 rather than a cut connection. */
  function readBody(req) {
    return new Promise((resolve, reject) => {
      let size = 0;
      const chunks = [];
      req.on("data", (c) => {
        size += c.length;
        if (size <= MAX_BODY) chunks.push(c);
      });
      req.on("end", () => (size > MAX_BODY ? reject(new Error("too large")) : resolve(Buffer.concat(chunks).toString("utf8"))));
      req.on("error", reject);
    });
  }

  function validMark(m, id) {
    return m && typeof m === "object" && m.id === id &&
      typeof m.reviewerId === "string" && m.reviewerId && KINDS.includes(m.kind);
  }

  async function handle(req, res) {
    cors(req, res);
    const url = new URL(req.url, "http://localhost");
    const path = url.pathname.replace(/\/+$/, "") || "/";

    if (req.method === "OPTIONS") {
      if (res.hasHeader("Access-Control-Allow-Origin")) {
        res.setHeader("Access-Control-Allow-Methods", "GET, PUT, DELETE");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Review-Key, X-Review-Owner");
        res.setHeader("Access-Control-Max-Age", "86400");
      }
      return send(res, 204);
    }
    if (path === "/health" && req.method === "GET") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      return res.end("ok");
    }

    if (path === "/events" && req.method === "GET") {
      if (!authorized(url.searchParams.get("key"))) return send(res, 401, { error: "passcode" });
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
      });
      res.write(": connected\n\n");
      listeners.add(res);
      const beat = setInterval(() => res.write(": ping\n\n"), HEARTBEAT_MS);
      req.on("close", () => { clearInterval(beat); listeners.delete(res); });
      return;
    }

    if (!authorized(req.headers["x-review-key"])) return send(res, 401, { error: "passcode" });

    if (path === "/marks" && req.method === "GET") {
      return send(res, 200, { marks: q.all.all().map((r) => JSON.parse(r.data)) });
    }

    const one = /^\/marks\/([^/]+)$/.exec(path);
    if (!one) return send(res, 404, { error: "not found" });
    const id = decodeURIComponent(one[1]);
    const owner = req.headers["x-review-owner"];
    if (typeof owner !== "string" || !owner) return send(res, 400, { error: "missing owner" });
    const existing = q.owner.get(id);
    if (existing && existing.owner_hash !== hash(owner)) return send(res, 403, { error: "not yours" });

    if (req.method === "PUT") {
      let mark;
      try { mark = JSON.parse(await readBody(req)); } catch (e) {
        return send(res, 400, { error: "bad body" });
      }
      if (!validMark(mark, id)) return send(res, 400, { error: "bad mark" });
      delete mark.ownerToken;
      q.upsert.run(id, hash(owner), JSON.stringify(mark), String(mark.updated || new Date().toISOString()));
      broadcast("save", { mark });
      return send(res, 200, { mark });
    }
    if (req.method === "DELETE") {
      if (!existing) return send(res, 404, { error: "not found" });
      q.remove.run(id);
      broadcast("delete", { id });
      return send(res, 204);
    }
    return send(res, 405, { error: "method" });
  }

  const server = http.createServer((req, res) => {
    handle(req, res).catch((e) => {
      console.error(e);
      if (!res.headersSent) send(res, 500, { error: "server" });
      else res.end();
    });
  });
  server.on("close", () => db.close());
  return server;
}

/* Run directly: node server.js */
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const key = process.env.REVIEW_KEY;
  if (!key) {
    console.error("Set REVIEW_KEY to the review passcode, e.g. REVIEW_KEY=something node server.js");
    process.exit(1);
  }
  const port = Number(process.env.PORT || 8090);
  const host = process.env.HOST || "127.0.0.1";
  const dbPath = process.env.REVIEW_DB || "./tools/review.db";
  const origins = (process.env.REVIEW_ORIGINS || "http://localhost:8318,http://127.0.0.1:8318,http://localhost:8080")
    .split(",").map((s) => s.trim()).filter(Boolean);
  createServer({ key, dbPath, origins }).listen(port, host, () => {
    console.log(`Review server on http://${host}:${port} (db ${dbPath}; origins ${origins.join(", ")})`);
  });
}
