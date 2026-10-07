---
order: 7
title: Module 3 Deliverable and Reflection
navLabel: Deliverable and Reflection
---

{% section "On Your Own", "on-your-own" %}

In Parts 2 through 6, you carried one request from a vague email to a finished deliverable, with activities, examples, and a practitioner to compare against at every step. Now you do it again on your own: a different organization, a different manager, a different question, and a dataset you have not seen.

Imagine you have just started as a data analyst at a city animal shelter. Your manager sends you this:

> **From:** Shelter Operations Manager<br>**Subject:** last year's intakes
>
> We're starting to plan staffing and foster recruitment for next year. Can you look at what came through our doors last year and tell me what we should be getting ready for? Thanks!

The dataset is every animal that came into the City of Austin's animal shelter in 2024, about 11,800 records, published on the city's open data portal and left exactly as the city released it. Nobody planted problems in this file for you to find. Whatever is wrong with it is wrong the way real data is wrong.

{% section "Module Deliverable", "module-deliverable" %}

{% assignment "Shelter Intake Analysis" %}
Work through all five stages with an AI writing the code from your prompts, and hand in one piece of work for each stage:

| Stage | What to Hand In |
|---|---|
| **Understand** | A one-page brief: the question, the audience and the decision, what the data can and cannot answer, and the questions you would still ask the manager. Where the request is unclear, state the assumption you made. |
| **Explore** | A quality report: every problem you found, by column, with a count and the check that found it. |
| **Prepare** | A decision log: every change you made, how many rows it affected, why you made it, and how you checked it. |
| **Analyze** | At least three findings, each with the code that produced it, one check that confirms it, and a note on who might be missing from it. |
| **Share** | A short summary and one or two charts for the manager, with the data's limits stated plainly and the results of a bias check reported as observations. |

{% notebook "Notebook 5 · Module Deliverable", "m3-build.ipynb" %}
Opens in Colab and loads the shelter file. Everything after the setup cell is yours.
{% endnotebook %}

You will also submit a short **AI Use Record**:

| Reflection Element | Your Notes |
|---|---|
| **Purpose for using AI** | What did you ask AI to help with at each stage? |
| **Prompt changes** | Where did you have to revise a prompt to get what you needed, and what did you add? |
| **Most valuable contribution** | What did AI do that saved you the most time or caught something you missed? |
| **Most important correction** | Where was AI's output wrong, incomplete, or based on an assumption that did not fit this data? How did you find out? |
| **Human decision** | What is one decision you made that AI could not have made for you, and what evidence supported it? |
{% endassignment %}

{% callout "checkpoint", "Before You Submit" %}
Check that:

- every number in your summary traces back to a line of output in your notebook;
- your decision log would let someone else rebuild your cleaned file from the raw one;
- each finding names the columns it depends on and how complete they are; and
- your summary reports patterns without claiming causes the data does not show.
{% endcallout %}

{% section "Reflection", "reflection" %}

{% assignment "Final Reflection" %}
Respond briefly to each question.

### 1. The Brief

**How did the question you settled on in the Understand stage shape what you did in the later stages?** Give one example of something you left out because of it.

### 2. A Silent Error

**Describe one moment in this module when AI-generated code ran without an error but did not do what you intended.** How did you notice?

### 3. Your Judgment

**What is one decision you made, at any stage, that you would not hand to AI next time either?** Why?

### 4. Comparing With a Practitioner

**Looking back at Habeeba's videos, what is one habit of hers that you will keep?**
{% endassignment %}

{% section "Before You Move On", "before-you-move-on" %}

AI wrote much of the code in this module. You decided what question to answer, what counted as a problem, how each problem should be fixed, what to calculate, and what the results could and could not support. Those decisions are what made the work trustworthy.

As you go on, keep asking the same three questions:

{% callout "highlight" %}
How can AI support my work?

How do I know whether its output is trustworthy and appropriate?

What knowledge and judgment do I need to contribute?
{% endcallout %}

{% section "Coming Next: Module 4", "coming-next-module-4" %}

In Module 3, you carried a problem through the data itself. In **Module 4: Communicating Insights, Responsible AI, and Future Trends**, you will go further with the last stage. You will practice communicating data findings through visualizations, summaries, dashboards, and presentations, thinking about who your audience is and how to avoid presenting data in a misleading way. You will also look at the larger questions that come with using AI in data work, including privacy, bias, accountability, and regulation, and at how data jobs are changing as AI tools evolve.

{% section "Feedback", "feedback" %}

This module is a draft, and what you write here shapes the next revision. A sentence about what confused you, or what worked, is enough.

{% feedback %}
