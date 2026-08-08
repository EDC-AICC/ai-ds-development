/* Tells the embedding page how tall this activity is, so the frame matches
   its content. Shared by every activity in /activities/. */

(function () {
  "use strict";
  if (window.parent === window) return;

  /* Measure the card, not documentElement: scrollHeight is clamped to the
     iframe's own height, so it can report growth but never a shrink. */
  var card = document.querySelector(".activity") || document.body;
  var last = 0;

  function post() {
    var h = Math.ceil(card.getBoundingClientRect().height);
    if (h === last) return;
    last = h;
    window.parent.postMessage({ type: "activity-height", height: h }, "*");
  }

  function postSoon() { setTimeout(post, 0); }

  /* Keep click and keyup even though ResizeObserver looks like it covers them.
     RO delivers callbacks before paint, so it goes silent in a hidden tab or a
     headless pane while clicks still change the content. */
  window.addEventListener("load", post);
  window.addEventListener("resize", post);
  document.addEventListener("click", postSoon);
  document.addEventListener("keyup", postSoon);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(post);
  if (window.ResizeObserver) new ResizeObserver(post).observe(card);

  window.addEventListener("message", function (e) {
    if (e.data && e.data.type === "activity-height-request") { last = 0; post(); }
  });

  post();
})();
