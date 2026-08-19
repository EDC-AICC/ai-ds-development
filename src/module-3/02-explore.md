---
order: 2
title: Explore
---

{% section "The setup" %}

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

{% section "The Concept" %}

### Explore: Getting to Know Your Data

Before a data scientist can clean or analyse data, they need to understand what is actually in it. This process is called exploratory data analysis, or EDA. It is systematic rather than casual. You are not browsing the data hoping to notice something interesting. You are working through a structured checklist to answer four questions about every column: Is the data complete? Are the values consistent? Are the values valid? Does the structure make sense for the analysis you plan to do?

Completeness means checking for missing values. A clinical dataset may have patient identifiers, visit dates, and diagnoses recorded reliably, while a geographic column like county is missing for a large portion of records. Knowing that before you start analysis prevents you from building conclusions on data that does not represent the full picture.

Consistency means checking whether the same concept is recorded the same way throughout. A gender column that contains "Female", "female", "F", "f", and "FEMALE" as separate entries will produce five categories in any analysis instead of one. Those five groups represent the same concept recorded inconsistently. Without finding and fixing this, every breakdown by gender will be wrong.

Validity means checking whether values fall within a reasonable range for what they represent. An age field that contains -5 or 999 contains impossible values. A copay amount field that contains negative numbers contains values that violate the meaning of that column. These are not edge cases to ignore. They affect averages, totals, and any analysis that uses those columns.

{% concept %}Exploratory data analysis is the systematic examination of a dataset's completeness, consistency, and validity before any cleaning or analysis begins. Problems found in this step, if ignored, produce wrong conclusions in every step that follows.{% endconcept %}

{% section "How AI Can Help" %}

Writing data exploration code is repetitive and time-consuming. For each column you want to check, you need to write code to count missing values, list unique values, find out-of-range entries, and detect duplicates. AI can generate that entire exploration script from a clear description of what you want checked, reducing what would take thirty minutes of writing to two or three minutes of prompting.

Beyond writing code, AI can help you interpret findings. If you paste exploration results into an AI chat and describe the context, AI can suggest plausible explanations for what you see. Fourteen different spellings of gender in a clinical dataset suggests a free-text entry field that was never validated. A high percentage of missing county values may point to an intake workflow that skips that field for walk-in patients. AI can generate these hypotheses quickly, giving you a starting framework even before you investigate further.

AI can also help you decide which findings are worth acting on. If your exploration reveals that one column has 0.5 percent missing values and another has 30 percent missing values, the appropriate response is different in each case. AI can help you think through the options, even if it cannot make the final call for you.

{% aihelps %}AI can write your complete exploration script from a structured prompt, saving significant time. It can also help interpret findings and suggest explanations for patterns in the data. The actual results still depend on you running the code against the real dataset.{% endaihelps %}

{% section "How to Use AI" %}

The most effective way to use AI in the Explore step is to write a numbered, multi-task prompt that lists every check you want performed. A numbered prompt produces a structured output that is easy to verify systematically. A vague prompt produces partial output that requires significant editing.

A well-designed exploration prompt for a clinical visit dataset names the data variables and columns, lists specific checks with exact criteria, and asks for labelled output so each result is easy to identify. Here is an example:

{% aiprompt %}I have a dataset stored in a variable called df with columns: patient_id, visit_id, visit_date, icd_code, icd_description, visit_type, gender, age, insurance_type, provider_id, county, copay_amount, follow_up_required. Write Python code to check the following: 1. Shape of the dataset (rows and columns). 2. Data type of each column. 3. Number and percentage of missing values for each column. 4. Number of exact duplicate rows, with a sample of 3 shown. 5. All unique values in: gender, insurance_type, visit_type, follow_up_required. 6. Any rows where age is below 0 or above 120. 7. Any rows where copay_amount is negative. Print a clear label before each result.{% endaiprompt %}

This prompt is specific about the column names, the criteria for invalid values, and the output format. It asks for labelled output, which makes the results easy to scan. Running this code against the actual data reveals concrete findings: the number of duplicate records, the exact percentage of missing values per column, every spelling variant of gender and insurance type, and any patient records with impossible age or negative copay values.

Once you have results, a second prompt can help you interpret them. Paste the output into an AI chat and ask what the patterns suggest. For example, if the missing value check shows that county is missing far more often for one insurance type than for others, AI can help you think through what might explain that pattern and whether it affects your planned analysis.

{% section "Evaluating AI Output" %}

AI-generated exploration code should be verified, not accepted without checking. Three failure modes are common and worth knowing.

The first is truncated output. When you ask for all unique values in a column, AI may show five or ten and add "...and others" if the column has many distinct values. Always run a count of unique values yourself to confirm the total. A gender column showing five variants in the AI output may actually have fourteen in the real data. The difference matters for cleaning.

The second is incorrect column names. AI writes code based on the names you give it. A small typo in your prompt produces a KeyError when the code runs. Always check error messages against the actual column names in your dataset and correct the mismatch before re-running.

The third is missing checks. Count the numbered tasks in your prompt and count the sections in the output. If you asked for seven checks and AI's code only handles six, the seventh is absent. You need to identify which check is missing and add it manually or prompt AI again for that specific task.

A key verification principle: AI only sees what you paste into the chat. It has not read your actual data file. Its output is based entirely on your description. That means any result AI produces is only as reliable as the description you gave it, and the only way to confirm those results are correct is to run the code yourself and check the numbers.

{% aieval %}Verify exploration output by: (1) confirming unique-value counts match a manual check, (2) checking that all column names in the code match your actual dataset, (3) confirming every requested check appears in the output. AI cannot see your data directly — always run the code yourself.{% endaieval %}

{% section "Resources" %}

#### Best Practices

{% todo %}{% endtodo %}

#### Learn More

<ul class="learnmore">
<li><a href="https://www.youtube.com/watch?v=C75TROiiEa0" target="_blank" rel="noopener"><strong>YouTube: Using ChatGPT for Data Exploration (Thu Vu Data Analytics)</strong></a><br><span class="lm-desc">Walkthrough of AI-assisted EDA</span></li>
<li><a href="https://towardsdatascience.com/exploratory-data-analysis-8fc1cb20fd15" target="_blank" rel="noopener"><strong>Towards Data Science: Exploratory Data Analysis</strong></a><br><span class="lm-desc">Core EDA concepts and techniques</span></li>
<li><a href="https://github.com/Sinaptik-AI/pandas-ai" target="_blank" rel="noopener"><strong>PandasAI: Chat with your DataFrame</strong></a><br><span class="lm-desc">Tool for asking plain-language questions about a dataset</span></li>
<li><a href="https://www.kaggle.com/learn/data-cleaning" target="_blank" rel="noopener"><strong>Kaggle: Intro to Data Cleaning (free course)</strong></a><br><span class="lm-desc">Hands-on practice with real datasets</span></li>
</ul>

{% section "Do it for real" %}

The job. Find out what is in this file and write down every problem, in a notebook, with an AI writing the code from your prompts. Change nothing yet. The fixing is Part 3.

{% notebook "Notebook 1 · Explore", "m3-explore.ipynb" %}
Opens in Colab and loads the clinic file for you. Everything after that first cell is open space, waiting on the lesson format above.
{% endnotebook %}

{% section "How a practitioner did it" %}

{% slot "video", "The practitioner. Their first-look routine on an unfamiliar file, and what they check before anything else.", "180px" %}

**Compare their routine against yours.** What do they look at, and why? Which of their checks did you never think to run, and which of yours did they skip?

**Compare their quality report against yours.** What did they flag that you missed, and what did you flag that they passed over without a note?

{% section "Feedback" %}

This module is a draft, and what you say here directly shapes the next revision. A sentence about what confused you or what worked is genuinely useful.

{% feedback "3", "2" %}
