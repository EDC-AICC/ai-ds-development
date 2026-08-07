# Writing an activity

An activity is one self-contained HTML file in this folder. It carries its own CSS and its own JavaScript, makes no external requests, and works when opened on its own. A page embeds it with `{% activity "filename.html", "Title", "620px" %}`.

Self-containment is deliberate, and it is why two blocks get copied into every file rather than shared from `assets/`. Copying them costs about 1.5KB per activity. Sharing them would mean an activity only works while served next to the file it depends on, which breaks three things worth keeping: opening an activity directly from its title link, handing a single file to somebody, and pasting an activity into an LMS page. Neither block has changed since the first activity was written, so the duplication is inert.

If you do change one, change it in every file in this folder.

## Block 1 — the palette

Activities are light-themed whatever the page around them is doing, so they define their own colours rather than inheriting the site's. Copy the `:root` block from any existing activity. Never reference a `var(--…)` from the site stylesheet; it will not reach inside the iframe.

Keep `html,body{margin:0; padding:0; background:transparent}` so the activity sits flush in its frame.

## Block 2 — the embed helper

Paste this verbatim, just before `</body>`, changing only the `id` to match the filename:

```html
<script>
/* Embed helper: reports the activity's height so the parent page can size the frame. */
(function(){
  "use strict";
  if(window.parent === window) return;
  const card = document.querySelector(".activity");
  let last = 0;
  function post(){
    const h = Math.ceil(card.getBoundingClientRect().height);
    if(h === last) return;
    last = h;
    window.parent.postMessage({type:"activity-height", id:"YOUR-FILENAME", height:h}, "*");
  }
  window.addEventListener("load", post);
  window.addEventListener("resize", post);
  window.addEventListener("message", function(e){
    if(e.data && e.data.type === "activity-height-request"){ last = 0; post(); }
  });
  if(window.ResizeObserver) new ResizeObserver(post).observe(card);
  /* settle-timers: fonts and late reflows can land after every event above,
     so post a few extra times; the last===h guard keeps it quiet. */
  [700, 1600, 3200, 5000].forEach(function(ms){ setTimeout(post, ms); });
  document.addEventListener("click", ()=>setTimeout(post, 0));
  post();
})();
</script>
```

`assets/js/site.js` listens for those messages and sets the frame height. Without this block the frame stays at whatever height the shortcode was given, which means a scrollbar or a gap.

## Height locking

Content height varies about twofold between a phone and a desktop for the same activity, so no fixed frame height works everywhere. The helper above handles that. What it does not handle is the frame resizing while a student clicks around, which is jarring.

So an activity measures every state it can be in, at load, and reserves the tallest. See `lockHeight()` in `p2c-analysts-toolkit.html`. Two rules:

- Guard against measuring in a hidden pane, or you will freeze a garbage height: `if(!document.body.clientWidth){ requestAnimationFrame(lockHeight); return; }`
- Re-run it on resize and after `document.fonts.ready`.

A deliberate reveal, like a result appearing after a button press, may grow the frame. Browsing between states may not.

## Checklist

- Reads correctly at 571px, the real embed width, and degrades cleanly at 335px
- No horizontal overflow and no inner scrollbar at either width
- Height locked, so clicking between states never resizes the frame
- No title inside the activity; the embed header carries it
- Instruction text at the top says what to do in a sentence or two
- Clickable things are real buttons with focus states
- The `{% activity %}` height argument is close to the measured desktop height
