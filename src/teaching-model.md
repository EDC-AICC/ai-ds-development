---
layout: base.njk
title: How students work through a module
kicker: AI in Data Science · module design
standfirst: >
  Students build the vocabulary first without touching code, then prompt an AI against real
  data and verify what comes back. They write the prompts and decide how to check. We supply
  the concepts first and the professional comparison afterwards.
description: A six-phase model for AI in Data Science module design.
eleventyExcludeFromCollections: true
---

## What the module has to produce

This module covers two major course outcomes:

{% callout %}
**Outcome 2** — Use AI tools to assist with core data science tasks, including data preparation,
analysis, visualization, coding, documentation, and communication.

**Outcome 3** — Evaluate AI outputs critically, using foundational data knowledge and human
judgment to identify errors, limitations, bias, hallucinations, and inappropriate
recommendations.
{% endcallout %}

So this module is fundamentally about **prompting and verification.**

Notably, the course does not ask students to write code from scratch. The prerequisites
section already routes that elsewhere and Module 4
owns code-level work like debugging and refactoring. Module 3's job is data judgment.

Therefore the design question is **if students aren't writing code, what are they doing?**

### The concern with demo notebooks

The material itself is strong. The clinic scenario is well chosen, the dataset is deliberately
designed, the outcomes are mapped clearly, and the comparison rubric is good. None of that needs replacing.

The problem is structural. It's about sequence and about who performs each step. Take one tasks from the clinic scenario and mark who makes each decision (including the with and without AI sections).

<div class="whoblock">
  <div class="whohead">Who does the thinking · <b>as currently structured</b></div>
  <div class="whobody">
    <p class="task">Task: standardise the messy visit_type column</p>
    <ul class="steps">
      <li><span class="who us">we do it</span><span class="what">We run <code>value_counts()</code> and discover 16 spellings</span></li>
      <li><span class="who us">we do it</span><span class="what">We decide which spellings map to which category</span></li>
      <li><span class="who us">we do it</span><span class="what">We write those mappings into the prompt</span></li>
      <li><span class="who ai">the AI</span><span class="what">AI transcribes the mapping into pandas syntax</span></li>
      <li><span class="who them">student</span><span class="what">Student pastes the code and runs it</span></li>
      <li><span class="who us">we do it</span><span class="what">We supply the reference answer</span></li>
      <li><span class="who them">student</span><span class="what">Student compares the two outputs</span></li>
    </ul>
    <div class="tally bad">The student only performs 5 and 7. Every decision (what the problem
    is, how to solve it, how to evaluate if it worked) has been made by someone else.</div>
  </div>
</div>

How does this impact our course objectives?

- **Prompting.** All AI prompts are written for the student and several contain the complete
  answer. The model is just transcribing a pre-written specification. This does not build the framing and directive skills we want students to develop.
- **Verification.** Students compare AI's output against a reference cell they were given.
  They aren't learning to critically construct a verification approach. They're essentially being handed a pre-written answer key and asked to check the diffs.

## The six phases approach

Each unit of work (data cleaning, bias detection, exploratory analysis, etc) runs the same loop.
Click through to see each phase.

{% activity "six-phases.html", "The six phases", "680px" %}

**The loop repeats.** Phases 1 through 5 run again for every self-contained unit of work
(clean the categories, handle the dates, check for bias). Each time, the student learns the
idea, attempts it with AI, checks it, sees how a practitioner approached it, and talks it
through. Batching the comparisons to the end doesn't work because students will have forgotten
their reasoning by then, and an unnoticed error in cleaning can poison downstream work.

Phase 6 happens once, after every unit is done.

**The order.** Prompting is limited by
vocabulary. A student who has internalised *"missing data can be non-random, and dropping it can
change who your analysis is about"* can ask for exactly the right thing. A student who hasn't
will type "clean this data" and accept whatever comes back.

### The same task, restructured

Here is the identical task from earlier, run through this model. The material is almost
unchanged — same dataset, same column, same 16 spellings, and the practitioner's version is
still there. Only the order and the ownership move.

<div class="whoblock">
  <div class="whohead">Who does the thinking · <b>under the proposed structure</b></div>
  <div class="whobody">
    <p class="task">Task: standardise the messy visit_type column</p>
    <ul class="steps">
      <li><span class="who them">student</span><span class="what">Student runs an exploratory prompt and discovers the 16 spellings</span></li>
      <li><span class="who them">student</span><span class="what">Student decides which spellings map together — and which need a stakeholder</span></li>
      <li><span class="who them">student</span><span class="what">Student writes the prompt, specifying the mapping and asking what it will cost</span></li>
      <li><span class="who ai">the AI</span><span class="what">AI writes the pandas code</span></li>
      <li><span class="who them">student</span><span class="what">Student runs it and checks for silently nulled values</span></li>
      <li><span class="who them">student</span><span class="what">Student records what they checked and what they concluded</span></li>
      <li><span class="who us">we do it</span><span class="what">We show how a practitioner did it, and why</span></li>
    </ul>
    <div class="tally good">The student performs five of the seven steps — every judgment call,
    plus the checking. The AI writes code, which is the one thing it should be doing. We enter
    once, at the end, as a comparison rather than as an instruction.</div>
  </div>
</div>

The discovery, the judgment calls, and the checking move to the student. The professional version
becomes the thing they compare against *after* committing, instead of the thing they copy from —
which is a better use for it, and the reason most of the existing material carries over intact.

## Practical design notes

### Teaching students to prompt at all

Before students prompt an AI about data, they need a little instruction on prompting generally.
This is the first place in the course where it becomes load-bearing, so it probably gets
developed here even if it eventually moves earlier.

Two habits matter more than the rest:

- **Be specific about the data, not just the task.** "Clean this data" produces whatever the
  model assumes. Naming the columns, the target values, and what you want reported back produces
  something you can check.
- **Start a fresh chat for each step.** Long conversations accumulate stale assumptions — the
  model remembers a column you renamed forty messages ago and quietly writes code for the old
  version. Re-pasting the current state into a clean chat is faster than debugging that.

### A ground-rules prompt

Students paste this at the start of an AI session. It says nothing about the task — it just sets
the terms on which the AI helps, and it doubles as a worked example of what a considered prompt
looks like:

<pre class="prompt">I'm a student learning data analysis. I'll be asking you to help me write
Python and pandas code for a dataset I'm working with. Some ground rules:

- Create new DataFrames rather than modifying existing ones in place, so I
  can re-run cells without corrupting my data.
- Before any operation that removes or changes rows, tell me how many rows
  it will affect.
- If what I ask for is ambiguous, ask me a question instead of guessing.
- Write the code I ask for. Don't decide what the analysis should be.</pre>

The first rule is doing double duty: it is a prompting habit that happens to prevent the most
common way a student's notebook breaks.

### Keeping the notebook recoverable

The moment students paste AI-generated code into a notebook they can corrupt their own state — a
cell that mutates `df` in place, run twice, silently produces something no later step can use.
This problem doesn't exist in the current draft only because nothing is interactive.

1. **The ground-rules prompt handles most of it.** New DataFrame each time, never in place.
2. **The practitioner's cells are always available.** Every unit of work ships with a working
   version. A student whose state is beyond saving deletes their attempt, runs the practitioner's
   cells instead, and continues from a known-good position without falling behind.
3. **Publish the recovery move.** "If anything looks wrong: Runtime → Restart session and run
   all." At the top of the notebook, in bold, before anyone needs it.

The notebook stays reasonably self-contained rather than being split into one file per phase —
students should see the whole arc run start to finish, and re-importing a dataset they just
modified between several separate Colab files creates more problems than it solves.

### Videos

The practitioner walkthroughs should be recorded wherever a judgment is being explained rather
than a fact stated, and embedded directly in the notebook at the point they're needed. Short —
under five minutes, one question each.

Written text is fine for what the code does. Video is for why it was chosen, including where the
practitioner hesitated — which is the part students cannot get anywhere else.

## What a student leaves with

Under this model, a student finishing the module has:

- A working vocabulary of data quality decisions and what each one costs
- Prompts they wrote themselves, against a dataset they had not seen
- Documented evidence that they checked the result, and how
- A comparison between their approach and a practitioner's
- Something they built without guidance

That is a portfolio artifact, and it matches the course's own framing of each module ending in a
practitioner deliverable and a reflection.

It also answers the question a student will ask on day one and an employer will ask later:
**what can you actually do now that you couldn't before?**
