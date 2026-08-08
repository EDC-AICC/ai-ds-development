---
order: 2
title: Explore
kicker: Module 3 · Part 2
standfirst: >
  Find out what you have been handed before you change any of it. Shape, types, ranges, what is missing, and what the categories actually contain.
prev:
  url: /module-3/01-ask/
  label: Part 1 · Ask
next:
  url: /module-3/03-transform/
  label: Part 3 · Transform
---

The director asks what sounds like the easiest question in the building. How many visits did we get last year?

The file has 812 rows, so the ten-second answer is 812. It is wrong in several ways. Fifteen of those rows are the same visit entered twice. Four of the dates never happened, February 30th among them. And "last year" means filtering on a date column that is still text, written several different ways. Answering any question depends on knowing exactly what is in the file.

Finding that out is part of your job. You count what is in every column and write down every problem you find. Fixing those issues happens in the next module, and it goes faster once you know what needs fixing.

{% section "Get a feel for it" %}

This is the real clinic file, all 812 rows of it, hooked up to the five checks every data analyst runs on a new dataset. There are some defects hiding in the data. Find them all, and pay attention to which check catches each one. In the notebook below you will be asking an AI to write similar checks.

{% activity "analysts-toolkit.html", "The analyst's toolkit", "660px" %}

{% check "Think it through before you open the answers." %}

{% q "The gender column contains f, F, female, Female, and FEMALE. Every one of those rows records a real patient accurately. So what is the problem?" %}
No single value is wrong. The column disagrees with itself, and code takes things literally. A filter on `'Female'` keeps one spelling and drops the other four without telling you. The patient was recorded but the analysis still comes out wrong, which is why inconsistency is a problem.
{% endq %}

{% q "You scroll the first hundred rows of a new data set and everything looks fine at a glance. Why is this not enough?" %}
Four bad dates in 812 rows means a random hundred rows will usually contain zero of them. Thirty-three missing ages are easy to scroll past. Fifteen duplicated rows look like ordinary rows unless their twin happens to sit on screen at the same time. Problems this sparse live in the file's totals, and totals only show up when you count. That is why a practitioner's first move is a census of every column, and why "it looked fine when I opened it" is not enough.
{% endq %}

{% endcheck %}

{% section "Before your first run" %}

You need two things for the rest of this module. A Google account, for Colab. And a free AI chat tool, any of the major ones.

{% slot "video", "A Colab walkthrough. Copying to your own Drive, turning off Colab's built-in AI assistance, line numbers, sessions.", "180px" %}

{% callout %}
**If anything stops working:** Runtime → Restart session and run all. Try that before you debug anything else.
{% endcallout %}

### The ground rules

Paste this at the start of any AI session for this module. It covers how the AI should work with you, whatever the task is, and it is a decent example of a careful prompt.

<pre class="prompt">I'm a student learning data analysis. I'll be asking you to help me write
Python and pandas code for a dataset I'm working with. Here is how I want
you to work with me.

- If what I ask for is ambiguous, ask me a question instead of guessing.
- Write the code I ask for. Don't decide what the analysis should be.
- Keep the code simple and standard. Use the plain, common way to do
  something rather than a clever one.
- Comment every line with what it does, so I can follow the code without
  already knowing pandas.</pre>

{% section "Lessons" %}

{% slot "lesson", "The teaching content for this part goes here, between getting a feel for the idea and doing it for real. What form it takes is still open. A recorded walkthrough, written explanation on this page, worked examples the student modifies, or nothing beyond the job statement with the rest handled in the notebook.", "200px" %}

{% section "Do it for real" %}

The job. Find out what is in this file and write down every problem, in a notebook, with an AI writing the code from your prompts. Change nothing yet. The fixing is Part 3.

{% notebook "Notebook 1 · Explore", "m3-explore.ipynb" %}
Opens in Colab and loads the clinic file for you. Everything after that first cell is open space, waiting on the lesson format above.
{% endnotebook %}

{% section "How a practitioner did it" %}

{% slot "video", "The practitioner. Their first-look routine on an unfamiliar file, and what they check before anything else.", "180px" %}

**Compare their routine against yours.** What do they look at, and why? Which of their checks did you never think to run, and which of yours did they skip?

**Compare their quality report against yours.** What did they flag that you missed, and what did you flag that they passed over without a note?

{% feedback "3", "2" %}
