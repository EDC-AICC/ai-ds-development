/* Review mode: marks kept in the browser. Own marks and loaded (other
   reviewers') marks are stored apart, so a download only ever contains the
   reviewer's own work and loading a file twice replaces rather than doubles.
   Storage is injected so the tests can use an in-memory stand-in. */

import { buildExport, mergeLoaded, parseImport } from "./core.js";

const KEY = {
  on: "aids-review",
  me: "aids-review-me",
  marks: "aids-review-marks",
  loaded: "aids-review-loaded",
  exported: "aids-review-exported",
};

const FULL = "Couldn't save: this browser's storage is full or turned off. " +
  "Download your review now so nothing is lost.";

export class LocalStore {
  constructor(storage = globalThis.localStorage) {
    this.storage = storage;
    this.listeners = [];
    this.memory = {}; /* fallback when storage can't even be read */
    if (globalThis.addEventListener && storage === globalThis.localStorage) {
      globalThis.addEventListener("storage", (e) => {
        if (e.key && e.key.startsWith("aids-review")) this.changed();
      });
    }
  }

  read(key, fallback) {
    try {
      const v = this.storage.getItem(key);
      return v == null ? (key in this.memory ? this.memory[key] : fallback) : JSON.parse(v);
    } catch (e) {
      return key in this.memory ? this.memory[key] : fallback;
    }
  }
  /* Returns an error message, or null when the write landed. */
  write(key, value) {
    if (value === undefined) delete this.memory[key];
    else this.memory[key] = value;
    try {
      if (value === undefined) this.storage.removeItem(key);
      else this.storage.setItem(key, JSON.stringify(value));
      return null;
    } catch (e) {
      return FULL;
    }
  }

  onChange(cb) { this.listeners.push(cb); }
  changed() { this.listeners.forEach((cb) => cb()); }

  me() {
    let me = this.read(KEY.me, null);
    if (!me || !me.reviewerId || !me.ownerToken) {
      me = { reviewerId: crypto.randomUUID(), ownerToken: crypto.randomUUID(), name: (me && me.name) || "" };
      this.write(KEY.me, me);
    }
    return me;
  }
  /* Also renames the reviewer's existing marks, so a fixed typo reaches
     everything already written. */
  setName(name) {
    const clean = String(name).trim();
    this.write(KEY.me, { ...this.me(), name: clean });
    const marks = this.ownMap();
    Object.values(marks).forEach((m) => {
      if (m.reviewer !== clean) marks[m.id] = { ...m, reviewer: clean, updated: new Date(Date.parse(m.updated) + 1).toISOString() };
    });
    this.write(KEY.marks, marks);
    this.changed();
  }

  isOn() { return this.read(KEY.on, null) === "on"; }
  setOn(on) { this.write(KEY.on, on ? "on" : undefined); }

  ownMap() { return this.read(KEY.marks, {}); }
  loadedMap() { return this.read(KEY.loaded, {}); }
  own() { return Object.values(this.ownMap()); }
  loaded() { return Object.values(this.loadedMap()); }
  all() { return [...this.own(), ...this.loaded()]; }

  result(err) {
    this.changed();
    return err ? { ok: false, error: err } : { ok: true };
  }

  save(mark) {
    const marks = this.ownMap();
    /* `updated` must change on every save, even within the same millisecond,
       or an edit right after a download would look already downloaded. */
    const prev = marks[mark.id] ? Date.parse(marks[mark.id].updated) : 0;
    const updated = new Date(Math.max(Date.now(), prev + 1)).toISOString();
    marks[mark.id] = { ...mark, updated };
    return this.result(this.write(KEY.marks, marks));
  }
  remove(id) {
    const marks = this.ownMap();
    delete marks[id];
    return this.result(this.write(KEY.marks, marks));
  }

  addLoaded(marks) {
    const before = this.loadedMap();
    const after = mergeLoaded(before, marks, this.me().reviewerId);
    const added = marks.filter((m) => after[m.id] === m).length;
    this.write(KEY.loaded, after);
    this.changed();
    return added;
  }
  removeLoaded(id) {
    const loaded = this.loadedMap();
    delete loaded[id];
    this.write(KEY.loaded, loaded);
    this.changed();
  }

  loadFiles(files) {
    const errors = [], marks = [];
    for (const f of files) {
      const r = parseImport(f.text, f.name);
      if (r.error) errors.push(r.error);
      else marks.push(...r.marks);
    }
    return { added: marks.length ? this.addLoaded(marks) : 0, errors };
  }

  clearLoaded() { this.write(KEY.loaded, undefined); this.changed(); }
  clearMine() { this.write(KEY.marks, undefined); this.write(KEY.exported, undefined); this.changed(); }

  /* Remembers each mark's `updated` at download time; anything saved since
     has a different stamp and counts as not downloaded. */
  exportFile() {
    const own = this.own();
    const stamps = {};
    own.forEach((m) => { stamps[m.id] = m.updated; });
    this.write(KEY.exported, stamps);
    this.changed();
    return buildExport(this.me(), own);
  }
  unexportedCount() {
    const stamps = this.read(KEY.exported, {});
    return this.own().filter((m) => stamps[m.id] !== m.updated).length;
  }
}
