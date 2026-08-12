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

Finding that out is part of your job. You count what is in every column and write down every problem you find. Fixing those issues happens in the next part, and it goes faster once you know what needs fixing.

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

### The concept

Before you can clean or analyse data, you need to understand what is actually in it. Exploratory data analysis — EDA for short — is the process of systematically examining a dataset to answer four questions about every column: Is the data complete? Are the values consistent? Are the values valid? Does the structure make sense for the analysis you plan to do?

**Completeness** means checking for missing values. A clinical dataset may have patient identifiers and diagnoses recorded reliably, while a geographic column like county is missing for a large proportion of records. Knowing that before analysis prevents conclusions built on data that does not represent the full picture.

**Consistency** means checking whether the same concept is recorded the same way throughout. A gender column containing "Female", "female", "F", "f", and "FEMALE" as separate entries will produce five categories in any breakdown instead of one. Without finding and fixing that, every analysis involving gender will be wrong.

**Validity** means checking whether values fall within a reasonable range. An age field containing -5 or 999 holds impossible values. A copay amount field with negative numbers contains values that violate the meaning of that column. These are not edge cases to ignore — they affect every average and total computed from those columns.

This is not a casual browse. It is a structured checklist you work through before touching anything.

### How AI can help

Writing exploration code is repetitive. For each column you want to check, you need code to count missing values, list unique values, find out-of-range entries, and detect duplicates. AI can generate that entire script from a clear description of what you want checked, turning 30 minutes of writing into two or three minutes of prompting.

Beyond writing code, AI can help you interpret what you find. If you paste exploration results into an AI chat and describe the context, AI can suggest plausible explanations — 14 different spellings of gender in a clinical dataset suggests a free-text entry field that was never validated; a high percentage of missing county values may point to an intake workflow that skips that field for certain visit types. AI generates these hypotheses quickly, giving you a starting framework even before you investigate further.

### How to use AI

The most effective approach is a numbered, multi-task prompt that lists every check you want. Numbered prompts produce structured outputs that are easy to verify systematically.

<pre class="prompt">I have a dataset stored in a variable called df with columns: patient_id,
visit_id, visit_date, icd_code, icd_description, visit_type, gender, age,
insurance_type, provider_id, county, copay_amount, follow_up_required.

Write Python code to check the following:
1. Shape of the dataset (rows and columns).
2. Data type of each column.
3. Number and percentage of missing values for each column.
4. Number of exact duplicate rows, with a sample of 3 shown.
5. All unique values in: gender, insurance_type, visit_type, follow_up_required.
6. Any rows where age is below 0 or above 120.
7. Any rows where copay_amount is negative.

Print a clear label before each result.</pre>

Once you have results, a second prompt helps interpret them. Paste the output into the AI chat and ask what the patterns suggest, which problems are worth addressing, and which checks need a closer look.

### Evaluating AI output

AI-generated exploration code should be verified, not accepted without checking. Three failure modes are common.

**Truncated output.** When you ask for all unique values in a column, AI may show a few and add "...and others" if the column has many distinct values. Always run a count of unique values yourself to confirm the total. A gender column showing 5 variants in the AI output may have 14 in the real data. The difference matters for the next step.

**Incorrect column names.** AI writes code based on the names you give it. A small typo in your prompt produces a KeyError when the code runs. Always check error messages against the actual column names in your dataset and correct the mismatch before re-running.

**Missing checks.** Count the numbered tasks in your prompt and count the sections in the output. If you asked for seven checks and AI's code only handles six, the seventh is absent. You need to notice that and add it.

One principle to hold: AI cannot see your data file. It responds to what you describe. The only way to confirm that results are correct is to run the code yourself and read every section of the output.

### Best practices

**Use numbered prompts.** Numbered tasks produce numbered outputs that are easy to verify one by one.

**Paste real output back to AI for interpretation.** Once you have results, share the actual output — not a description of it — and ask what the patterns suggest. This gives AI something concrete to respond to.

**Document every problem you find.** Write down every quality issue discovered during exploration. This list becomes the exact to-do list for Part 3. If you skip this step, you will carry problems into your analysis without realising it.

**Explore before you clean.** It is tempting to jump straight to cleaning, but exploration tells you what needs cleaning and why. Starting with a cleaning prompt before a thorough exploration almost always results in missing something.

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
