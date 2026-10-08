/* Review mode: keeping marks in step with the shared sync server
   (review-server/server.js). Everything is saved locally first, so nothing
   is lost when the server is down; writes wait in a queue until it answers.
   Other reviewers' marks arrive through pull() and the live event stream and
   are kept as loaded marks, read-only, exactly like ones loaded from a file. */

const PENDING = "aids-review-pending";

export class SyncStore {
  /* deps are injectable for the tests */
  constructor(local, { server, passcode }, deps = {}) {
    this.local = local;
    this.server = String(server || "").replace(/\/+$/, "");
    this.passcode = passcode || "";
    this.fetch = deps.fetch || globalThis.fetch.bind(globalThis);
    this.EventSource = deps.EventSource || globalThis.EventSource;
    this.netOk = true;
    this.denied = false;
    this.esOpen = false;
    this.serverIds = new Set(); /* other reviewers' marks last seen on the server */
    this.flushing = null;
  }

  /* ---- the LocalStore interface ---- */
  me() { return this.local.me(); }
  setName(name) {
    this.local.setName(name);
    this.local.own().forEach((m) => this.enqueue("save", m.id)); /* the name travels on each mark */
    this.flush();
  }
  isOn() { return this.local.isOn(); }
  setOn(on) { this.local.setOn(on); }
  own() { return this.local.own(); }
  loaded() { return this.local.loaded(); }
  all() { return this.local.all(); }
  addLoaded(marks) { return this.local.addLoaded(marks); }
  removeLoaded(id) { this.local.removeLoaded(id); }
  loadFiles(files) { return this.local.loadFiles(files); }
  clearLoaded() { this.local.clearLoaded(); }
  exportFile() { return this.local.exportFile(); }
  unexportedCount() { return this.local.unexportedCount(); }
  onChange(cb) { this.local.onChange(cb); }

  save(mark) {
    const r = this.local.save(mark);
    if (r.ok) { this.enqueue("save", mark.id); this.flush(); }
    return r;
  }
  remove(id) {
    const r = this.local.remove(id);
    if (r.ok) { this.enqueue("remove", id); this.flush(); }
    return r;
  }
  clearMine() {
    this.local.own().forEach((m) => this.enqueue("remove", m.id));
    this.local.clearMine();
    this.flush();
  }

  /* ---- sync state ---- */
  status() {
    if (this.denied) return "denied";
    if (!this.netOk) return "offline";
    return this.esOpen ? "live" : "connecting";
  }
  pending() { return this.local.read(PENDING, []); }
  pendingCount() { return this.pending().length; }

  /* One entry per mark: the latest operation wins. */
  enqueue(op, id) {
    const q = this.pending().filter((p) => p.id !== id);
    q.push({ op, id });
    this.local.write(PENDING, q);
  }

  headers(json) {
    const h = { "X-Review-Key": this.passcode, "X-Review-Owner": this.me().ownerToken };
    if (json) h["Content-Type"] = "application/json";
    return h;
  }

  setState(changes) {
    const before = this.status();
    Object.assign(this, changes);
    if (this.status() !== before) this.local.changed();
  }

  /* Sends queued writes in order. Stops at the first network failure or a
     rejected passcode; anything else the server refuses is dropped, since
     sending it again would get the same answer. */
  flush() {
    if (this.flushing) return this.flushing.then(() => this.flush());
    this.flushing = (async () => {
      for (const item of this.pending()) {
        const url = `${this.server}/marks/${encodeURIComponent(item.id)}`;
        let res;
        try {
          if (item.op === "save") {
            const mark = this.local.own().find((m) => m.id === item.id);
            if (!mark) { this.dequeue(item); continue; }
            res = await this.fetch(url, { method: "PUT", headers: this.headers(true), body: JSON.stringify(mark) });
          } else {
            res = await this.fetch(url, { method: "DELETE", headers: this.headers(false) });
          }
        } catch (e) {
          this.setState({ netOk: false });
          return;
        }
        if (res.status === 401) { this.setState({ denied: true, netOk: true }); return; }
        this.setState({ netOk: true, denied: false });
        this.dequeue(item);
      }
    })().finally(() => { this.flushing = null; });
    return this.flushing;
  }
  dequeue(item) {
    this.local.write(PENDING, this.pending().filter((p) => !(p.id === item.id && p.op === item.op)));
    this.local.changed();
  }

  /* Fetches every mark. Others' become loaded marks (ones gone from the
     server are dropped); mine that the server lacks, or has an older copy
     of, are queued for upload. */
  async pull() {
    let res;
    try {
      res = await this.fetch(`${this.server}/marks`, { headers: { "X-Review-Key": this.passcode } });
    } catch (e) {
      this.setState({ netOk: false });
      return { error: "Couldn't reach the server." };
    }
    if (res.status === 401) {
      this.setState({ denied: true, netOk: true });
      if (this.es) this.es.close();
      return { error: "The server rejected the passcode." };
    }
    if (!res.ok) return { error: `The server answered ${res.status}.` };
    const { marks } = await res.json();
    this.setState({ netOk: true, denied: false });
    const myId = this.me().reviewerId;
    const theirs = marks.filter((m) => m.reviewerId !== myId);
    const now = new Set(theirs.map((m) => m.id));
    this.serverIds.forEach((id) => { if (!now.has(id)) this.local.removeLoaded(id); });
    this.serverIds = now;
    this.local.addLoaded(theirs);
    const onServer = new Map(marks.filter((m) => m.reviewerId === myId).map((m) => [m.id, m]));
    this.own().forEach((m) => {
      const s = onServer.get(m.id);
      if (!s || s.updated < m.updated) this.enqueue("save", m.id);
    });
    if (this.pendingCount()) this.flush();
    return { count: marks.length };
  }

  /* Opens the live stream. EventSource reconnects by itself after a
     dropped connection; a refused one (wrong passcode) is checked with pull(). */
  connect() {
    if (!this.EventSource || !this.server) return;
    const es = this.es = new this.EventSource(`${this.server}/events?key=${encodeURIComponent(this.passcode)}`);
    es.addEventListener("open", () => {
      this.setState({ esOpen: true, netOk: true });
      this.pull();
      this.flush();
    });
    es.addEventListener("error", () => {
      this.setState({ esOpen: false });
      if (es.readyState === 2) {
        this.pull().then(() => { if (!this.denied) setTimeout(() => this.connect(), 5000); });
      }
    });
    es.addEventListener("save", (e) => {
      const { mark } = JSON.parse(e.data);
      if (mark.reviewerId === this.me().reviewerId) return;
      this.serverIds.add(mark.id);
      this.local.addLoaded([mark]);
    });
    es.addEventListener("delete", (e) => {
      const { id } = JSON.parse(e.data);
      this.serverIds.delete(id);
      if (this.local.loaded().some((m) => m.id === id)) this.local.removeLoaded(id);
    });
  }
}
