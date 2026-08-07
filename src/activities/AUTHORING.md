# Writing an activity

An activity is one HTML file in this folder. It owns its own markup, styling and behaviour, makes no third-party requests, and works when opened on its own. A page embeds it with `{% activity "filename.html", "Title", "620px" %}`.

Two things are shared rather than copied, and both are pulled in with **relative** paths so they resolve the same from the dev server, from a path-prefixed GitHub Pages deploy, and from the file system:

```html
<link rel="stylesheet" href="../assets/activity/base.css">
<script src="../assets/activity/embed.js"></script>
```

The stylesheet goes before your own `<style>` block. The script goes just before `</body>`. Nothing else is shared, and nothing else should be: everything past the palette and the box model differs from one activity to the next, and forcing it into a common file would just make both harder to read.

## What `base.css` gives you

The fifteen palette variables, `*{box-sizing:border-box}`, and the transparent `html,body` reset that lets an activity sit flush in its frame. Use `var(--accent)`, `var(--card)`, `var(--slate)` and so on freely.

Activities are light-themed whatever the page around them is doing. Never reference a variable from the site stylesheet — it does not reach inside the iframe. Your own `<style>` sets the type scale and everything specific to this activity.

## What `embed.js` gives you

It measures `.activity`, or `document.body` if there is no `.activity` card, and reports the height to the page embedding it, which sizes the frame to match. Without it the frame stays at whatever height the shortcode declared, which means a scrollbar or a gap.

There is nothing to configure. Give your outermost element `class="activity"` and it works.

The height argument in the shortcode is still worth setting, because it is the height *before* any of this runs. Getting it roughly right stops the frame appearing at the iframe default and then jumping once the activity reports. It is also the fallback if the script never runs.

## Height locking

Content height varies about twofold between a phone and a desktop for the same activity, so no single declared height works everywhere. `embed.js` handles that.

What it does not handle is the frame resizing while a student clicks around, which is jarring. So an activity measures every state it can be in and reserves the tallest. See `lockHeight()` in `p2c-analysts-toolkit.html`. Three rules:

- Guard against measuring in a hidden pane, or you freeze a garbage height: `if(!document.body.clientWidth){ requestAnimationFrame(lockHeight); return; }`
- Re-run it on resize and after `document.fonts.ready`.
- Measure states, not widths. Which state is tallest can change with width: in `p2c` the output table is `white-space:pre` so its height is width-independent, while the note under it wraps. The tallest state at 632px is not the tallest at 335px.

A deliberate reveal, like a result appearing after a button press, may grow the frame. Browsing between states may not.

## Checklist

- Reads correctly at 571px, the real embed width, and degrades cleanly at 335px
- No horizontal overflow and no inner scrollbar at either width
- Frame height matches content height on load, at both widths
- Clicking between states never changes the frame height
- No title inside the activity; the embed header carries it
- Instruction text at the top says what to do in a sentence or two
- Clickable things are real buttons with focus states

## A note on testing

The in-editor browser pane does not fire `resize` or `ResizeObserver` callbacks, and its viewport can report `0×0`. Height behaviour that depends on resizing cannot be verified there, and a frame that looks stuck in that pane is usually the pane. Load the page at the width you care about instead of resizing into it, or check in a real browser.
