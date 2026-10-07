---
order: 3
title: "Explore: Getting to Know Your Data"
navLabel: Explore
---

{% section "The Easiest Question in the Building", "the-easiest-question" %}

The director asks what sounds like the easiest question in the building. How many visits did we get last year?

The file has 812 rows, so the ten-second answer is 812. It is wrong in several ways. Fifteen of those rows are the same visit entered twice. Four of the dates never happened, February 30th among them. And "last year" means filtering on a date column that is still text, written several different ways. Answering any question depends on knowing exactly what is in the file.

Finding that out is part of your job. You count what is in every column and write down every problem you find. Fixing those issues happens in Part 4, and it goes faster once you know what needs fixing.

{% section "Try It: The Analyst's Toolkit", "try-it-the-analysts-toolkit" %}

This is the real clinic file, all 812 rows of it, hooked up to the five checks every data analyst runs on a new dataset. There are some defects hiding in the data. Find them all, and pay attention to which check catches each one. In the notebook later in this part, you will ask an AI to write similar checks.

{% activity "analysts-toolkit.html", "The analyst's toolkit", "660px" %}

{% check "Think it through before you open the answers." %}

{% q "The gender column contains f, F, female, Female, and FEMALE. Every one of those rows records a real patient accurately. So what is the problem?" %}
No single value is wrong. The column disagrees with itself, and code takes things literally. A filter on `'Female'` keeps one spelling and drops the other four without telling you. The patient was recorded but the analysis still comes out wrong, which is why inconsistency is a problem.
{% endq %}

{% q "You scroll the first hundred rows of a new data set and everything looks fine at a glance. Why is this not enough?" %}
Four bad dates in 812 rows means a random hundred rows will usually contain zero of them. Thirty-three missing ages are easy to scroll past. Fifteen duplicated rows look like ordinary rows unless their twin happens to sit on screen at the same time. Problems this sparse live in the file's totals, and totals only show up when you count. That is why a practitioner's first move is a census of every column, and why "it looked fine when I opened it" is not enough.
{% endq %}

{% endcheck %}

{% section "Learn: Exploratory Data Analysis", "learn-exploratory-data-analysis" %}

Before a data scientist can clean or analyze data, they need to understand what is actually in it. This process is called **exploratory data analysis**, or **EDA**. It is systematic rather than casual. You are not browsing the data hoping to notice something interesting. You are working through a structured checklist to answer four questions about every column:

- Is the data complete?
- Are the values consistent?
- Are the values valid?
- Does the structure make sense for the analysis you plan to do?

Click each quality check below to read more.

{% accordion %}
{% fold "Completeness" %}
Completeness means checking for missing values. A clinical dataset may have patient identifiers, visit dates, and diagnoses recorded reliably, while a geographic column like county is missing for a large portion of records. Knowing that before you start analysis prevents you from building conclusions on data that does not represent the full picture.
{% endfold %}
{% fold "Consistency" %}
Consistency means checking whether the same concept is recorded the same way throughout. A gender column that contains "Female", "female", "F", "f", and "FEMALE" as separate entries will produce five categories in any analysis instead of one. Those five groups represent the same concept recorded inconsistently. Without finding and fixing this, every breakdown by gender will be wrong.
{% endfold %}
{% fold "Validity" %}
Validity means checking whether values fall within a reasonable range for what they represent. An age field that contains -5 or 999 contains impossible values. A copay amount field that contains negative numbers contains values that violate the meaning of that column. These are not edge cases to ignore. They affect averages, totals, and any analysis that uses those columns.
{% endfold %}
{% endaccordion %}

{% callout "highlight" %}
Exploratory data analysis is the systematic examination of a dataset's completeness, consistency, and validity before any cleaning or analysis begins. Problems found in this step, if ignored, produce wrong conclusions in every step that follows.
{% endcallout %}

{% section "Where AI Can Help", "where-ai-can-help" %}

Writing data exploration code is repetitive and time-consuming. For each column you want to check, you need to write code to count missing values, list unique values, find out-of-range entries, and detect duplicates. AI can generate that entire exploration script from a clear description of what you want checked, reducing what would take thirty minutes of writing to two or three minutes of prompting.

Beyond writing code, AI can help you interpret findings. If you paste exploration results into an AI chat and describe the context, AI can suggest plausible explanations for what you see. Fourteen different spellings of gender in a clinical dataset suggests a free-text entry field that was never validated. A high percentage of missing county values may point to an intake workflow that skips that field for walk-in patients. AI can generate these hypotheses quickly, giving you a starting framework even before you investigate further.

AI can also help you decide which findings are worth acting on. If your exploration reveals that one column has 0.5 percent missing values and another has 30 percent missing values, the appropriate response is different in each case. AI can help you think through the options, even if it cannot make the final call for you.

{% callout %}
**In short:** AI can write your complete exploration script from a structured prompt, saving significant time. It can also help interpret findings and suggest explanations for patterns in the data. The actual results still depend on you running the code against the real dataset.
{% endcallout %}

{% section "How to Use AI", "how-to-use-ai" %}

The most effective way to use AI in the Explore step is to write a numbered, multi-task prompt that lists every check you want performed. A numbered prompt produces a structured output that is easy to verify systematically. A vague prompt produces partial output that requires significant editing.

A well-designed exploration prompt for a clinical visit dataset names the data variables and columns, lists specific checks with exact criteria, and asks for labeled output so each result is easy to identify. Here is an example:

> I have a dataset stored in a variable called df with columns: patient_id, visit_id, visit_date, icd_code, icd_description, visit_type, gender, age, insurance_type, provider_id, county, copay_amount, follow_up_required. Write Python code to check the following:
>
> 1. Shape of the dataset (rows and columns).
> 2. Data type of each column.
> 3. Number and percentage of missing values for each column.
> 4. Number of exact duplicate rows, with a sample of 3 shown.
> 5. All unique values in: gender, insurance_type, visit_type, follow_up_required.
> 6. Any rows where age is below 0 or above 120.
> 7. Any rows where copay_amount is negative.
>
> Print a clear label before each result.

This prompt is specific about the column names, the criteria for invalid values, and the output format. It asks for labeled output, which makes the results easy to scan. Running this code against the actual data reveals concrete findings: the number of duplicate records, the exact percentage of missing values per column, every spelling variant of gender and insurance type, and any patient records with impossible age or negative copay values.

Once you have results, a second prompt can help you interpret them. Paste the output into an AI chat and ask what the patterns suggest. For example, if the missing value check shows that county is missing far more often for one insurance type than for others, AI can help you think through what might explain that pattern and whether it affects your planned analysis.

{% section "Evaluating AI Output", "evaluating-ai-output" %}

Getting AI to write exploration code or summarize a dataset is only the first step. Before you move on to cleaning, you need to verify what AI produced. How you do that depends on how you used AI. Click each case below to read more.

{% accordion %}
{% fold "When AI wrote code that you ran yourself" %}
Read the code before you run it. Confirm it checks the columns you asked about, uses the right definitions for missing or invalid values, and does not remove or change any records. At the Explore stage, the goal is to find problems, not fix them yet. Any code that drops rows or modifies values is doing cleaning work before you have finished looking.

After you run the code, check the results against what you know about the data:

- Does the row and column count match the source file?
- Do the missing value percentages divide by the total number of rows, not just the rows that have a value?
- Do the records flagged as duplicates or invalid actually look wrong when you open them?
- Were the rules applied correctly? For example, does the age check catch values below zero and above 120, not just one of those conditions?

A clean run with no errors does not mean the analysis is correct. It means the code ran. Those are different things.
{% endfold %}
{% fold "When you uploaded data to an AI tool and asked it to explore" %}
Here the risk is different. AI is producing findings directly, not code you can inspect line by line. You do not need to verify every number independently. That would cancel out the time AI saved you. Instead, focus your checks on the findings that matter most for the next step.

A practical approach is to verify selectively based on what your analysis depends on. If your question is about visit patterns by insurance type, confirm the missing value count for `insurance_type` yourself. If you plan to group patients by age, check that the age range looks right and that any invalid values were caught. For columns that are less central to your question, a quick scan of AI's output is enough.

One area worth checking regardless of column importance is categorical variables. AI tools sometimes condense long lists of unique values in their responses rather than showing every entry. A gender column with fourteen variants may appear in AI's summary as four or five. This matters because undercounting category variants leads to underestimating the cleaning work ahead, and that problem compounds in every step that follows.
{% endfold %}
{% endaccordion %}

Finally, as with any AI output, be alert to explanations attached to findings. A missing value percentage is a fact you can verify. A suggested reason for why those values are missing is a hypothesis. Note it, but do not treat it as established until you have evidence from the data or from someone who knows how it was collected.

{% callout "checkpoint", "Human Judgment Checkpoint" %}
Before moving on to cleaning, verify the exploration output by:

1. confirming every requested check appears, and re-prompting for anything missing;
2. independently verifying key counts for the columns your analysis depends on most;
3. checking that unique value lists for categorical columns look complete, since AI sometimes condenses long lists;
4. ensuring any AI-generated code only examines the data and does not modify it; and
5. treating AI explanations for patterns as hypotheses to investigate, not conclusions to accept.
{% endcallout %}

{% section "Best Practices", "best-practices" %}

**Use numbered prompts.** Numbered tasks produce numbered outputs that are easy to verify one by one. Unnumbered prompts produce dense outputs that are harder to cross-check.

**Paste real output back to AI for interpretation.** Once you have results, share the actual output with AI and ask what patterns it suggests. This gives AI something concrete to respond to rather than hypothetical descriptions.

**Write down every problem you find.** Document every quality issue discovered during exploration. This list becomes the exact to-do list for the cleaning step. If you skip documenting, you will carry problems into your analysis without realizing it.

**Explore before you clean.** It is tempting to jump straight to cleaning, but exploration tells you what needs cleaning and why. Starting with a cleaning prompt before a thorough exploration almost always results in missing something.

{% optional "Learn More" %}
<ul class="learnmore">
<li><a href="https://www.youtube.com/watch?v=C75TROiiEa0" target="_blank" rel="noopener"><strong>YouTube: Using ChatGPT for Data Exploration (Thu Vu Data Analytics)</strong></a><br><span class="lm-desc">Walkthrough of AI-assisted EDA</span></li>
<li><a href="https://towardsdatascience.com/exploratory-data-analysis-8fc1cb20fd15" target="_blank" rel="noopener"><strong>Towards Data Science: Exploratory Data Analysis</strong></a><br><span class="lm-desc">Core EDA concepts and techniques</span></li>
<li><a href="https://github.com/Sinaptik-AI/pandas-ai" target="_blank" rel="noopener"><strong>PandasAI: Chat with your DataFrame</strong></a><br><span class="lm-desc">Tool for asking plain-language questions about a dataset</span></li>
<li><a href="https://www.kaggle.com/learn/data-cleaning" target="_blank" rel="noopener"><strong>Kaggle: Intro to Data Cleaning (free course)</strong></a><br><span class="lm-desc">Hands-on practice with real datasets</span></li>
</ul>
{% endoptional %}

{% section "Set Up Your Workspace", "set-up-your-workspace" %}

This is the first part of the module where you work in a notebook. Every notebook opens in Google Colab and loads the clinic file for you.

{% accordion %}
{% fold "Save your own copy" %}
When a notebook opens, choose **File → Save a copy in Drive**. You will be working in that copy, so your changes are saved to your own Google Drive.
{% endfold %}
{% fold "Turn off Colab's built-in AI" %}
Colab has its own AI features that suggest code as you type. Turn them off so that every piece of code comes from a prompt you wrote and decided on. Look for the AI assistance options in **Tools → Settings**.
{% endfold %}
{% fold "Set the ground rules for your AI chat" %}
Paste this at the start of any AI session for this module. It covers how the AI should work with you, whatever the task is, and it is a good example of a careful prompt.

> I'm a student learning data analysis. I'll be asking you to help me write Python and pandas code for a dataset I'm working with. Here is how I want you to work with me.
>
> - If what I ask for is ambiguous, ask me a question instead of guessing.
> - Write the code I ask for. Don't decide what the analysis should be.
> - Keep the code simple and standard. Use the plain, common way to do something rather than a clever one.
> - Comment every line with what it does, so I can follow the code without already knowing pandas.
{% endfold %}
{% endaccordion %}

{% callout %}
**If anything stops working:** Runtime → Restart session and run all. Try that before you debug anything else.
{% endcallout %}

{% section "Try It: Explore the Clinic Data", "try-it-explore-the-clinic-data" %}

{% tryit %}
Find out what is in this file and write down every problem, in a notebook, with an AI writing the code from your prompts. Change nothing yet. The fixing is Part 4.

Keep your brief from Part 2 next to you. It tells you which columns matter most, and those are the ones to check most carefully.

{% notebook "Notebook 1 · Explore", "m3-explore.ipynb" %}
Opens in Colab and loads the clinic file for you. Three steps: a first look at the whole file, targeted checks on the columns your brief depends on, and your quality report.
{% endnotebook %}

### What to Write Down

Your quality report should list, for every problem you found:

- the column;
- what is wrong, with a count (for example, how many rows, how many spellings);
- which check found it; and
- why it matters for your question.
{% endtryit %}

{% section "See It in Practice: A First Look at the Clinic File", "see-it-in-practice" %}

In this video, Habeeba walks through her own exploration notebook for the same clinic file. Watch how she sets up her AI chat, reads each piece of AI-generated code before running it, and makes sure nothing changes the data yet.

{% video "1227484644", "Explore: a first look at the clinic file (Habeeba Siddiqui, 7:22)", "m3-explore.txt" %}

{% notebook "Habeeba's Notebook · Explore", "m3-explore-practitioner.ipynb" %}
The notebook from the video: each prompt she gave her AI tool, the code it returned, and the output. Open it after you have finished your own.
{% endnotebook %}

**Compare her routine with yours.** Habeeba started with a broad look at the whole file, then wrote a second prompt targeted at the columns her brief depends on, and told AI not to modify the data. Which of her checks did you never think to run, and which of yours did she skip?

**Compare her quality report with yours.** What did she flag that you missed, and what did you flag that she passed over? She found hundreds of dates that could not be parsed on the first try. Did you look at *why* they failed, or only count them?

{% section "Key Takeaways", "key-takeaways" %}

{% callout "takeaways", "Key Takeaways" %}
- Explore before you change anything. Count what is in every column, because sparse problems hide in the totals, not in the first hundred rows.
- Check every column for completeness, consistency, and validity.
- Read AI-generated code before you run it, and make sure exploration code only looks at the data and does not modify it.
- A clean run is not a correct result. Verify the counts your question depends on, and treat AI's explanations for patterns as hypotheses.
- Write down every problem you find. That list is your to-do list for Part 4.
{% endcallout %}

### Before You Continue

You now have a list of what is wrong with the file. In Part 4, you will fix those problems and build the new columns your question needs, and you will find that every fix is a decision.

{% section "Feedback", "feedback" %}

This module is a draft, and what you write here shapes the next revision. A sentence about what confused you, or what worked, is enough.

{% feedback %}
