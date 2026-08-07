# Writing an activity

An activity is a small interactive page: a simulation, a sorting task, something to click through. Each one is a single self-contained HTML file in this folder, carrying its own markup, styles and script, and making no external requests.

A lesson page embeds it in an iframe:

```
{% activity "p2c-analysts-toolkit.html", "The analyst's toolkit", "660px" %}
```

That draws a card — a title bar linking to the activity on its own, a fullscreen button, and the iframe beneath. The third argument is the frame's height before any JavaScript runs. The activity corrects it on load, so it only has to be close.

Start from the closest existing activity.

## The two shared files

Include both, with relative paths so they resolve from the dev server, the deployed site and the file system alike:

```html
<link rel="stylesheet" href="../assets/activity/base.css">  <!-- before your <style> -->
<script src="../assets/activity/embed.js"></script>         <!-- before </body> -->
```

**base.css** gives you the colour variables, `box-sizing`, and the transparent `html,body` reset that lets the activity sit flush in its frame. Activities are light-themed whatever the page around them is doing. Variables from the site stylesheet do not cross into an iframe, so never reference one.

**embed.js** measures the activity and tells the page how tall to make the frame. It needs `class="activity"` on your outer element, and nothing else.

The rest is yours.

## Height locking

The frame must not change size while a student clicks around. At load, render each thing the activity can display, find the tallest, and reserve that much room. `lockHeight()` in `p2c-analysts-toolkit.html` is the working example.

- While `document.body.clientWidth` is 0 the page has no layout yet. Retry on `requestAnimationFrame` instead of measuring, or you will lock in a garbage height.
- Re-run on resize and after `document.fonts.ready`. Both change how text wraps.
- Narrow text wraps taller, and unevenly, so the tallest state on a desktop may not be the tallest on a phone. Always measure at the current width.

## Before it ships

- Reads well at 571px, the real width of the embed on a lesson page
- Still works at 335px, a small phone
- No sideways scrollbar, and no scrollbar inside the frame, at either width
- Clicking between states never changes the frame height
- No title inside the activity, since the card's title bar already shows it
- Anything clickable is a real `<button>` with a visible focus state
