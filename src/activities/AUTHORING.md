# Writing an activity

An activity is a small interactive page. Each one is a single self-contained HTML file in this folder, carrying its own markup, styles and script, and making no external requests.

A lesson page embeds it in an iframe:

```
{% activity "analysts-toolkit.html", "The analyst's toolkit", "660px" %}
```

That draws a card with a title bar linking to the activity on its own, a fullscreen button, and the iframe beneath. The third argument is the frame's height before any JavaScript runs. The activity finds its height on load, so it only has to be approximate.

## The two shared files

Include both, with relative paths so they resolve from the dev server, the deployed site and the file system alike:

```html
<link rel="stylesheet" href="../assets/activity/base.css">  <!-- before your <style> -->
<script src="../assets/activity/embed.js"></script>         <!-- before </body> -->
```

**base.css** gives you the color variables, `box-sizing`, and the transparent `html,body` reset that lets the activity sit flush in its frame. Activities are light-themed no matter what the page around them is doing.

**embed.js** measures the activity and tells the page how tall to make the frame, so there is never a scrollbar inside it and never dead space under it. It needs `class="activity"` on your outer element. Nothing to configure, and no height handling of your own.

The frame follows your content, which means it grows and shrinks as a student clicks. That is the accepted trade: content below the activity shifts a little, and in exchange nothing scrolls and nothing is padded out.

The rest is yours.

## Before it ships

- Reads well at 571px, the real width of the embed on a lesson page
- Still works at 335px, a small phone
- No sideways scrollbar, and no scrollbar inside the frame, in any state at either width
- No title inside the activity, since the card's title bar already shows it
- Anything clickable is a real `<button>` with a visible focus state
