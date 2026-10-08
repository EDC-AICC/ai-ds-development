---
order: 5
title: "Analyze: Finding Patterns in Clean Data"
navLabel: Analyze
---

{% section "Answering the Question", "answering-the-question" %}

You have a clean dataset and a specific question. Now you answer it. This is the step that looks the most like "data science" from the outside: the grouping, the counting, the comparisons. It is also the step where many of the real decisions have already been made. The question was settled in Part 2. The data was made trustworthy in Parts 3 and 4. Analysis mostly carries out those earlier decisions.

What does require judgment here is working out who is missing from your answer before anyone acts on it. A finding about follow-up rates across insurance types is only reliable if the insurance type column is complete. A finding about visit patterns by county is only meaningful if county is not missing for 30 percent of the records. Every analysis has a version of this problem, and it is your job to find it before the director's board meeting does.

{% section "Try It: One Question, Many Answers", "try-it-one-question-many-answers" %}

The county funder asks how many uninsured people the clinic serves. It sounds like a lookup. Make the choices that sit underneath it, and watch what happens to the answer.

{% activity "one-question-many-answers.html", "One question, many answers", "1100px" %}

{% check "Think it through before you open the answers." %}

{% q "The file gave you more than a dozen answers to one question, and none of them came from a calculation error. So where did the differences come from?" %}
From definitions. Each switch decided what counts: a person or a visit, whether Self-Pay is uninsured, whether records without a county stay in. The code computes whatever definition it is handed, and computes it correctly. If your prompt does not say which one you mean, AI picks one for you, and that number arrives looking just as certain as all the others. The definition belongs in the prompt before the code runs, and in the sentence that carries the number afterward.
{% endq %}

{% q "Keeping only the rows with a known county looked like a harmless setting. The count went down and the percentage went up. What happened?" %}
The filter dropped 62 of the 200 patients, the ones with no county on any visit, and it did not drop them evenly. Only 2 of those 62 were uninsured, so the uninsured share rose from 9.5% to 12.3%. The filter did not just shrink the file. It changed who was in it. That is the question to ask of every result before anyone acts on it: who is missing from this answer, and does their absence move the number?
{% endq %}

{% endcheck %}

{% section "Learn: Types of Analysis", "learn-types-of-analysis" %}

Analysis is the step where we use clean data to answer our questions. Using grouping, counting, averaging, and comparing, a data scientist converts rows and columns into findings that can inform decisions. The goal is not to generate every possible statistic. It is to answer the specific questions framed in the Understand step using the clean data prepared in the Prepare step.

A clinical visit dataset supports many types of analysis. Each type of question requires a different approach and produces a different kind of finding. Click each type to read more.

{% accordion %}
{% fold "Frequency analysis" %}
Frequency analysis counts how often something occurs, such as which diagnoses appear most often, which months see the highest visit volume, or how many patients have had four or more visits.
{% endfold %}
{% fold "Breakdown analysis" %}
Breakdown analysis compares one variable across the levels of another, such as whether follow-up rates differ by insurance type or whether high utilizers have different diagnoses than low utilizers.
{% endfold %}
{% fold "Trend analysis" %}
Trend analysis looks at how a variable changes over time, such as whether monthly visit volume is growing, declining, or seasonal.
{% endfold %}
{% endaccordion %}

Good analysis also generates new questions. When a frequency analysis shows that five diagnoses account for a large share of all visits, the natural follow-up is whether that concentration is consistent across age groups or varies significantly. When a breakdown analysis shows that patients with one type of insurance have a substantially lower follow-up rate, the next question is whether that gap is consistent across providers and visit types. This iterative quality is one of the things that makes data science valuable: each finding points toward the next question.

{% callout "highlight" %}
Analysis converts clean data into findings by grouping, counting, averaging, and comparing. Good analysis answers specific questions, but it also generates new ones. The goal is findings the recipient can act on, not the maximum number of statistics possible.
{% endcallout %}

{% section "Where AI Can Help", "where-ai-can-help" %}

AI changes the economics of analysis significantly. Writing groupby operations, crosstabs, conditional filters, and sorting logic by hand takes time. With AI, the code for a specific analysis takes minutes once you describe what you want. That shift in time allocation, less time writing code and more time thinking about results, is one of the most concrete benefits of using AI as a data science tool.

AI can help in two distinct ways during analysis. First, it can suggest what to investigate when direction is unclear. If you describe the dataset and the business context, AI can propose analysis questions you may not have considered and name the columns each would use. Second, it can write code for an analysis you have already decided to do. You describe the grouping, the measure, the sort order, and the output format, and AI produces working code ready to run.

AI is also useful after analysis is complete. Once you have results, you can paste the output into an AI chat and ask for help interpreting what it shows, what follow-up questions it raises, or how to present it to a non-technical audience. This conversational interpretation helps you extract more value from the results and think through implications you might have missed.

{% callout %}
**In short:** AI helps by suggesting analysis directions when the path is unclear, writing analysis code on demand from a specific description, and helping interpret results once they are available. This allows a data scientist to spend more time on the thinking and less on the typing.
{% endcallout %}

{% section "How to Use AI", "how-to-use-ai" %}

There are two productive approaches to using AI for analysis.

### Approach 1: Ask AI What Is Worth Investigating

This works well when the direction is not yet clear. A good prompt for this approach describes the dataset, the business goal, and asks AI to suggest questions along with the columns each would require:

> I have a cleaned outpatient clinic dataset with patient visit records. The columns include icd_description (medical diagnosis), visit_type (Office Visit, Telehealth, Follow-Up, Urgent Care), gender, age, insurance_type (Medicaid, Medicare, Private, Uninsured), provider_id, county, copay_amount, follow_up_required, and derived columns for visit month, visit year, age group, whether a patient is a high utilizer (4 or more visits), and days since last visit. The clinic director wants to understand visit patterns and access equity. Suggest 5 analysis questions worth investigating. For each, name the columns involved and suggest a pandas approach.

### Approach 2: Ask AI to Write Code for a Specific Analysis

This approach requires a precise prompt that names the variable, the grouping column, the measure, the sort direction, and the output format:

> Using a DataFrame called df_clean, write Python code to answer this question: Which are the 10 most common diagnoses, and how many visits does each account for? Group by the icd_description column, count visits, sort in descending order, and show the top 10 results. Store the output in a variable called top_diagnoses. Print the result with a clear heading.

The level of detail in this prompt matters. Naming the variable (`df_clean`), the grouping column (`icd_description`), the measure (count of visits), the sort direction (descending), the number of results (10), and the output variable name (`top_diagnoses`) leaves AI very little room to guess. Each piece of information you omit is a decision AI makes on your behalf, sometimes correctly and sometimes not.

### Summarizing Results

For written summaries of analysis results, give AI your verified numbers explicitly and prohibit it from adding statistics you did not provide. This is a critical habit:

> Here are my verified findings from the clinic visit analysis: [paste your actual numbers here]. Write a 4-sentence summary for a non-technical clinic director. Use only the numbers I have provided. Do not add any statistics I have not given you. End with one sentence noting a data limitation the director should be aware of.

{% section "Evaluating AI Output", "evaluating-ai-output" %}

Analysis output from AI-generated code requires two levels of verification. Click each level to read more.

{% accordion %}
{% fold "Technical verification: did the code do what you intended?" %}
Check that the grouping column is correct (diagnosis description rather than diagnosis code, for example), that the sort direction is what you asked for, and that the count represents the unit you intended (visits rather than unique patients, or the reverse, depending on your question). Each of these is an easy error to make, and each produces a meaningfully different result.
{% endfold %}
{% fold "Interpretive verification: does AI stay within what the data shows?" %}
Be especially careful when AI generates written summaries or commentary about your findings. AI may add numbers that were not in the results you provided, or make causal or clinical claims that the data does not support. If you ask AI to summarize findings about follow-up rates by insurance type, it may add an interpretation about why those differences exist. That interpretation is not supported by your data. It is AI extrapolating beyond what it was given.
{% endfold %}
{% endaccordion %}

The most important habit in this step is checking every number in any AI-generated narrative against your verified analysis output. If AI includes a number you did not provide, it must be removed, not adjusted. A professional deliverable can only contain numbers that came from your actual analysis.

{% callout "checkpoint", "Human Judgment Checkpoint" %}
Verify analysis output by:

1. confirming grouping, measure, and sort direction are correct;
2. checking every number in any AI-generated summary against your actual results, and removing any number AI added that was not in your verified output; and
3. removing any causal or clinical interpretation AI added that the data does not support.

These checks are non-negotiable.
{% endcallout %}

{% section "Best Practices", "best-practices" %}

**Give AI your numbers, not the task of generating them.** When asking for summaries or narratives, always provide the numbers you have already verified. Do not ask AI to generate the statistics and the story at the same time.

**Confirm you are working on clean data.** Always verify that your analysis is running on the cleaned variable, not the original raw data. Running analysis on uncleaned data with inconsistent categories will produce misleading breakdowns.

**Spot-check one finding manually.** For any key finding, calculate the number yourself using a simple filter or count and compare it to what AI's code produced. They should match exactly. If they do not, something is wrong.

**Separate observation from interpretation.** Your analysis shows what the data contains. What it means for the clinic is a question for you and the stakeholder, not for AI. Keep those two things clearly separated in your deliverables.

{% optional "Learn More" %}
<ul class="learnmore">
<li><a href="https://www.datacamp.com/courses/introduction-to-chatgpt" target="_blank" rel="noopener"><strong>DataCamp: Introduction to ChatGPT for Data Science (free intro)</strong></a><br><span class="lm-desc">AI workflows for data analysis specifically</span></li>
<li><a href="https://towardsdatascience.com/prompt-engineering-for-data-scientists-a-practical-guide-73d3c67a06e4" target="_blank" rel="noopener"><strong>Towards Data Science: Prompt Engineering for Data Scientists</strong></a><br><span class="lm-desc">Guide to writing better analysis prompts</span></li>
<li><a href="https://www.youtube.com/@statquest" target="_blank" rel="noopener"><strong>StatQuest on YouTube: Statistics Fundamentals</strong></a><br><span class="lm-desc">Build intuition for what analysis results actually mean</span></li>
<li><a href="https://www.kaggle.com/learn/pandas" target="_blank" rel="noopener"><strong>Kaggle: Pandas Course (free, browser-based)</strong></a><br><span class="lm-desc">Understand what AI-generated analysis code is doing</span></li>
</ul>
{% endoptional %}

{% section "Try It: Answer the Brief", "try-it-answer-the-brief" %}

{% tryit %}
Analyze the cleaned clinic data for the director's two decisions: whether to hire a care coordinator, and how to show the county funder that the clinic serves uninsured patients.

{% notebook "Notebook 3 · Analyze", "m3-analyze.ipynb" %}
Opens in Colab and loads the course's cleaned file, the output of Part 4, so everyone analyzes identical data.
{% endnotebook %}

The notebook works in two phases:

- **Planning, done once.** Use AI to explore possible goals, finalize your goals in your own words, use AI to suggest metrics for each goal, then decide which metrics you will actually calculate.
- **Execution, repeated for each goal.** Spot the pitfalls before you write any code, prompt AI for the code, verify the output, and interpret what it means for the director or the funder.

It ends with a short recommendation and a reflection.
{% endtryit %}

{% section "See It in Practice: From Goals to a Defensible Number", "see-it-in-practice" %}

In this video, Habeeba works through the analysis for the clinic's two decisions. Notice how she uses AI to suggest goals and metrics, and where she overrules it.

{% video "1229643522", "Analyze: from goals to a defensible number (Habeeba Siddiqui, 6:15)", "m3-analyze.txt" %}

{% notebook "Habeeba's Notebook · Analyze", "m3-analyze-practitioner.ipynb" %}
Her five investigations, each with its metrics, the pitfalls she caught in the output, and her interpretation. Open it after you have finished your own.
{% endnotebook %}

**Compare how you chose what to calculate.** Habeeba asked AI for analytical goals before any metrics or code, kept five of the seven it suggested, and dropped two that did not help the decisions. Which of your goals would she have dropped, and which of hers did you not think of?

**Compare how you counted uninsured patients.** AI's default was to label each patient with their most common insurance type, which made some uninsured visits disappear from the count. Habeeba changed one rule: a patient counts as uninsured if they had any uninsured visit. How did your analysis handle patients whose insurance changed between visits? Can you defend your rule to the county funder?

**Compare where the interpretation came from.** AI produced a county ranking, but Habeeba made the call about where the clinic should start. In your recommendation, which sentences are observations from the data, and which are interpretations you, or AI, added?

{% section "Key Takeaways", "key-takeaways" %}

{% callout "takeaways", "Key Takeaways" %}
- Decide what to calculate before you calculate it. Start from the decisions in your brief, then choose goals and metrics that serve them.
- The more precisely you specify a calculation, such as a 30-day return window, the fewer decisions AI makes on your behalf.
- Verify, spot the anomaly, and apply a guardrail: check results on a small slice, look for defaults that do not fit your context, and change the rule when they do.
- Check every finding for who is missing from it before anyone acts on it.
- AI can rank and summarize. **What a result means for the organization is your call.**
{% endcallout %}

### Before You Continue

You now have findings you can defend. In Part 6, you will turn them into something the director and the board can read, understand, and act on.

{% section "Feedback", "feedback" %}

This module is a draft, and what you write here shapes the next revision. A sentence about what confused you, or what worked, is enough.

{% feedback %}
