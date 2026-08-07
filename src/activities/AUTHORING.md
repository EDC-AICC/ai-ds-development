# Writing an activity

One HTML file in this folder. Every activity includes both shared files, with relative paths so they resolve from the dev server, the Pages deploy and disk alike:

```html
<link rel="stylesheet" href="../assets/activity/base.css">  <!-- before your <style> -->
<script src="../assets/activity/embed.js"></script>         <!-- before </body> -->
```

**base.css** is the palette variables, `box-sizing`, and the transparent `html,body` reset. Activities are light-themed whatever the page around them is doing. Never reference a variable from the site stylesheet; it does not reach inside the iframe.

**embed.js** reports the height so the frame sizes to the content. Its only requirement is `class="activity"` on your outer element.

Everything else is yours.

## Height locking

The frame must not resize while a student clicks around, so measure every state at load and reserve the tallest. See `lockHeight()` in `p2c-analysts-toolkit.html`.

- Retry on `requestAnimationFrame` while `document.body.clientWidth` is 0, or you freeze a garbage height.
- Re-run on resize and after `document.fonts.ready`.
- Which state is tallest changes with width, so measure at the current width and never cache across widths.

## Before it ships

- Reads at 571px, degrades cleanly at 335px
- No horizontal overflow and no inner scrollbar at either width
- Clicking between states never changes the frame height
- No title inside the activity; the embed header carries it
- Clickable things are real buttons with focus states

Test by loading at the width you care about. The editor's browser pane fires no `resize` or `ResizeObserver` callbacks, so resizing into a width proves nothing there.
