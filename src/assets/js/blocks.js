/* Practice blocks: {% choice %}, {% answer %} and {% sort %}.
   Each block is plain HTML that can be read and opened with no script (the
   feedback sits in <details>). This file adds the checking: one option open
   at a time, a typed answer compared with the accepted ones, and pile buttons
   with a count at the end. Nothing is saved or sent anywhere.
   {% reflect %} needs no script. */

(function () {
  "use strict";

  function each(root, sel, fn) { [].forEach.call(root.querySelectorAll(sel), fn); }

  /* "$1,840.00" and "1840" are the same answer; so are "Completed." and "completed". */
  function norm(s) {
    return String(s).toLowerCase().trim().replace(/\s+/g, " ")
      .replace(/^["'$]+/, "").replace(/["'.]+$/, "").replace(/(\d),(?=\d{3}(\D|$))/g, "$1");
  }
  function same(a, b) {
    a = norm(a); b = norm(b);
    if (a === b) return true;
    return a !== "" && b !== "" && !isNaN(a) && !isNaN(b) && Number(a) === Number(b);
  }

  /* choice: opening an option closes the others */
  each(document, ".pb-choice", function (root) {
    each(root, ".pb-opt", function (opt) {
      opt.addEventListener("toggle", function () {
        if (!opt.open) return;
        each(root, ".pb-opt", function (other) { if (other !== opt) other.open = false; });
      });
    });
  });

  /* answer: check what was typed */
  each(document, ".pb-answer", function (root) {
    var form = root.querySelector(".pb-form"), input = root.querySelector(".pb-input");
    var msg = root.querySelector(".pb-msg"), reveal = root.querySelector(".pb-reveal");
    var accept = [];
    try { accept = JSON.parse(root.dataset.accept || "[]"); } catch (e) { return; }
    form.hidden = false;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var typed = input.value;
      if (!norm(typed)) return;
      msg.hidden = false;
      if (accept.some(function (a) { return same(a, typed); })) {
        msg.className = "pb-msg good";
        msg.textContent = "Correct.";
        reveal.open = true;
        return;
      }
      var nudge = null;
      each(root, "[data-when]", function (n) { if (!nudge && same(n.dataset.when, typed)) nudge = n; });
      nudge = nudge || root.querySelector("[data-hint]");
      msg.className = "pb-msg warn";
      if (nudge) msg.innerHTML = nudge.innerHTML;
      else msg.textContent = "Check your work and try again.";
    });
  });

  /* sort: one pick per item, then a count */
  each(document, ".pb-sort", function (root) {
    var msg = root.querySelector(".pb-msg");
    var total = root.querySelectorAll(".pb-item").length, done = 0, right = 0;
    root.classList.add("js");
    each(root, ".pb-item", function (item) {
      var btns = item.querySelector(".pb-btns");
      btns.hidden = false;
      btns.addEventListener("click", function (e) {
        var b = e.target.closest("button");
        if (!b || item.dataset.done) return;
        item.dataset.done = "1";
        done++;
        var ok = b.dataset.v === item.dataset.b;
        if (ok) right++;
        b.classList.add("on");
        each(btns, "button", function (x) { x.disabled = true; });
        item.classList.add(ok ? "right" : "miss");
        item.querySelector(".pb-reveal").open = true;
        if (done === total) {
          msg.hidden = false;
          msg.className = "pb-msg" + (right === total ? " good" : "");
          msg.textContent = "You matched " + right + " of " + total + ".";
        }
      });
    });
  });
})();
