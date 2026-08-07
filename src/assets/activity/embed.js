/* Shared by every activity in /activities/.

   Reports the activity's height to the page embedding it, so the frame ends
   up exactly as tall as its content. Loaded with a relative path
   (../assets/activity/embed.js) so it resolves the same from the dev server,
   from a path-prefixed deploy, and from disk.

   Triggers, each covering something the others do not:

     post()          the initial measurement
     load            subresources can change the height after parse
     resize          the frame's width changed, so the text rewrapped
     fonts.ready     webfonts land late and reflow everything
     click / keyup   the student changed what the activity is showing
     ResizeObserver  anything else that changes the layout

   ResizeObserver arguably subsumes all of them. They are kept because the
   redundancy is a few lines and the failure it guards against, a frame stuck
   at a stale height with a scrollbar inside it, is the exact thing this file
   exists to prevent. The interaction listeners in particular are not
   decoration: ResizeObserver delivers its callbacks before paint, so in an
   environment that never paints, a hidden tab or a headless pane, it can go
   quiet while clicks still change the content.

   The page embedding the activity also asks for a fresh measurement when the
   window resizes, for the same reason.

   This replaced a set of timers firing at 700, 1600, 3200 and 5000ms that
   were guessing at when webfonts would land. fonts.ready is that same guard
   made exact.

   Measure the card rather than documentElement: scrollHeight is clamped to
   the iframe's own height, so it can report growth but never a shrink. */

(function () {
  "use strict";
  if (window.parent === window) return;

  var card = document.querySelector(".activity") || document.body;
  var last = 0;

  function post() {
    var h = Math.ceil(card.getBoundingClientRect().height);
    if (h === last) return;
    last = h;
    window.parent.postMessage({ type: "activity-height", height: h }, "*");
  }

  /* Interaction handlers run after the click has been handled, so the DOM has
     already changed by the time we measure. */
  function postSoon() { setTimeout(post, 0); }

  window.addEventListener("load", post);
  window.addEventListener("resize", post);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(post);
  document.addEventListener("click", postSoon);
  document.addEventListener("keyup", postSoon);
  if (window.ResizeObserver) new ResizeObserver(post).observe(card);

  /* A lazily-loaded frame can finish before the parent attaches its listener,
     so the parent can ask us to report again. */
  window.addEventListener("message", function (e) {
    if (e.data && e.data.type === "activity-height-request") { last = 0; post(); }
  });

  post();
})();
