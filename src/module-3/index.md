---
order: 0
title: Understanding, Exploring, Preparing, Analyzing, and Sharing Data with AI
---

{% section "Overview", "overview" %}

<p class="note"><strong>Estimated time:</strong> Approximately 6–7 hours, including the module deliverable.</p>

In Module 2, you learned to frame a data problem before touching any data. In this module, you carry that framing into the data itself. You will work through the full course process on a real, messy dataset:

{% figure "data-practice-stages.png", "The five stages: Understand, Explore, Prepare, Analyze, Share." %}

A community outpatient clinic has two years of visit records, entered by many hands. The file has missing values, dates written more than one way, the same field spelled several ways, and some records entered twice. The clinic director has a vague request about it. You will turn that request into a clear question, find out what is actually in the file, fix what you find, answer the question, and communicate the answer to someone who will act on it.

AI will write most of the Python along the way. You will describe the data work you want done, run the code AI produces, and check what comes back. AI can explain unfamiliar data, suggest questions, generate code, recommend ways to clean data, and help create visualizations. But you will not simply accept whatever AI produces. You will test the code, check calculations, investigate unusual results, and decide whether AI's suggestions make sense for the problem you are trying to solve.

Each of the five stages follows the same pattern. You start with a short activity, learn the concept and how AI can help with it, do the work yourself in a notebook, and then watch a working data practitioner, Habeeba Siddiqui, approach the same task so you can compare your choices with hers.

Throughout this module, keep one central idea in mind:

{% callout "highlight" %}
A clean run is not a correct answer. Every result AI helps you produce still needs your evidence that it is right.
{% endcallout %}

{% section "Essential Question and Objectives", "essential-question-and-objectives" %}

### Essential Question

**How do you carry a well-framed problem into real data, using AI to speed up the work while making sure every result can be trusted?**

### By the End of This Module, You Will Be Able To:

- **Understand:** Explain what a dataset represents and how it connects to a data problem.
- **Explore:** Investigate data quality, distributions, patterns, relationships, missing values, and unusual results.
- **Prepare:** Clean, transform, organize, and document data.
- **Analyze:** Use AI and other data tools to support analysis, coding, calculations, pattern identification, and visualization.
- **Share:** Communicate findings, visualizations, limitations, and important context clearly.
- Check AI-generated code, calculations, analyses, interpretations, and visualizations.
- Identify errors, bias, hallucinations, unsupported conclusions, and other problems in AI-generated work.
- Explain what AI contributed and what knowledge and judgment you needed to contribute.

{% section "What You Will Need", "what-you-will-need" %}

You need two things for the hands-on parts of this module:

- **A Google account**, for Google Colab. Every notebook opens in Colab and loads its data for you, so there is nothing to install or download.
- **A free AI chat tool**, any of the major ones.

You do not need to write Python from scratch. You do need to read the code AI gives you closely enough to know what it does before you run it. Part 3 shows you how to set up your AI chat so that it explains every line.

{% section "Module Roadmap", "module-roadmap" %}

Here's what you'll explore in Module 3. Parts 2 through 6 follow one piece of work from a vague request to a finished deliverable. Each part hands its result to the next, so do them in order.

{% figure "module3-roadmap.svg", "Module 3 roadmap. Part 1, Before You Begin: see how numbers go wrong on their way through a data system, about 30 minutes. Part 2, Understand: turn a vague request into a question the data can answer, about 45 minutes. Part 3, Explore: find out what is in the data before changing any of it, about 60 minutes. Part 4, Prepare: fix what you found and build the columns your question needs, about 75 minutes. Part 5, Analyze: answer the question and check who is missing from the answer, about 60 minutes. Part 6, Share: turn verified findings into something a decision-maker can act on, about 45 minutes. Part 7, Module Deliverable: run the whole process on your own with a new dataset, about 2 hours." %}

{% section "Feedback", "feedback" %}

This module is a draft, and what you write here shapes the next revision. A sentence about what confused you, or what worked, is enough.

{% feedback %}
