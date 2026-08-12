---
order: 4
title: Analyze
kicker: Module 3 · Part 4
standfirst: >
  Answer the question you settled on in Part 1, then work out who is missing from the answer before anyone acts on it.
prev:
  url: /module-3/03-transform/
  label: Part 3 · Transform
next:
  url: /module-3/05-share/
  label: Part 5 · Share
---

You have a clean dataset and a specific question. Now you answer it. This is the step that looks the most like "data science" from the outside — the grouping, the counting, the comparisons — and it is the step where a data scientist actually spends the least amount of creative energy, because the real decisions happened in Parts 1, 2, and 3. The question was settled in Part 1. The data was made trustworthy in Parts 2 and 3. Analysis mostly executes those earlier decisions.

What does require judgment here: working out who is missing from your answer before anyone acts on it. A finding about follow-up rates across insurance types is only reliable if the insurance type column is complete. A finding about visit patterns by county is only meaningful if county is not missing for 30 percent of the records. Every analysis has a version of this problem, and it is your job to find it before the director's board meeting does.

{% section "Get a feel for it" %}

{% slot "activity", "An activity and two check questions, the shape Parts 1 and 2 use. The idea for this part is committing to what you expect before the answer appears, so the gap between the guess and the result is where the student's attention lands.", "200px" %}

{% section "Lessons" %}

### The concept

Analysis converts clean data into findings by grouping, counting, averaging, and comparing. The goal is not to generate every possible statistic from the dataset. It is to answer the specific question settled in Part 1, then check whether the answer can be trusted.

A clinical visit dataset supports several types of analysis. **Frequency analysis** counts how often something occurs — which diagnoses appear most often, which months see the highest visit volume, how many patients have had four or more visits. **Breakdown analysis** compares one variable across the levels of another — whether follow-up rates differ by insurance type, whether high-utilizer patients have different diagnoses than others. **Trend analysis** looks at how a variable changes over time — whether monthly visit volume is growing, declining, or seasonal across different years.

Good analysis generates new questions as it answers the original one. When a frequency analysis shows that five diagnoses account for a large share of all visits, the natural follow-up is whether that concentration is consistent across age groups or varies significantly. When a breakdown shows that patients with one insurance type have a lower follow-up rate, the next question is whether that gap is consistent across providers or concentrated in one location. This iterative quality is part of what makes analysis valuable.

### How AI can help

AI changes the economics of analysis significantly. Writing groupby operations, crosstabs, conditional filters, and sorting logic by hand takes time. With AI, the code for a specific analysis takes minutes once you describe what you want precisely. That shift — less time writing code, more time thinking about results — is one of the most practical benefits of using AI as a data science tool.

AI can help in two distinct ways. First, it can suggest what is worth investigating when the direction is unclear. If you describe the dataset and the business context, AI can propose analysis angles you may not have considered. Second, it can write code for an analysis you have already decided to do. You describe the grouping, the measure, the sort order, and the output format, and AI produces working code.

Once results are in, AI is also useful for interpretation. Paste the output into an AI chat and ask what follow-up questions the finding raises, or how you might explain it to a non-technical audience. This helps extract more value from what you have already computed.

### How to use AI

There are two productive approaches. The first is asking AI to suggest what is worth investigating, when direction is not yet clear:

<pre class="prompt">I have a cleaned outpatient clinic dataset. Columns include: icd_description
(medical diagnosis), visit_type (Office Visit, Telehealth, Follow-Up,
Urgent Care), gender, age, insurance_type (Medicaid, Medicare, Private,
Uninsured), provider_id, county, copay_amount, follow_up_required, visit_month,
visit_year, age_group, and a high-utilizer flag (4 or more visits).

The clinic director wants to understand visit patterns and access equity.
Suggest 5 analysis questions worth investigating. For each, name the columns
involved and suggest a pandas approach.</pre>

The second approach is asking AI to write code for a specific analysis you have already decided to do. This requires a precise prompt:

<pre class="prompt">Using a DataFrame called df_clean, write Python code to answer this question:
which are the 10 most common diagnoses, and how many visits does each account
for?

Group by the icd_description column, count visits, sort in descending order,
and show the top 10 results. Store the output in a variable called
top_diagnoses. Print the result with a clear heading.</pre>

Every piece of detail in this prompt — the DataFrame name, the grouping column, the measure, the sort direction, the number of results, the output variable name — is a decision AI would otherwise make on your behalf. Some of those defaults will be right. Some will not. Specifying them means the first run of the code usually produces what you intended.

When asking AI to write a plain-language summary of your findings, always provide the verified numbers yourself and explicitly prohibit AI from adding statistics you did not give it:

<pre class="prompt">Here are my verified findings from the clinic visit analysis:
[paste your actual numbers here]

Write a 4-sentence summary for a non-technical clinic director. Use only the
numbers I have provided. Do not add any statistics I have not given you. End
with one sentence noting a data limitation the director should be aware of.</pre>

### Evaluating AI output

Analysis output from AI-generated code requires two levels of checking.

**Technical verification.** Did the code run correctly and produce what you intended? Check that the grouping column is correct, that the sort direction is what you asked for, and that the count represents the unit you intended — visits rather than unique patients, or the reverse, depending on your question. Each of these is an easy error to make and each produces a meaningfully different result.

**Interpretive verification.** Does AI describe the results accurately, and does it stay within what the data actually shows? AI has a consistent tendency to add numbers that were not in the results you provided, to round figures differently than your actual output, or to make causal claims the data does not support.

If you ask AI to summarise findings about follow-up rates by insurance type, it may add an explanation about why those differences exist. That interpretation is not supported by your data. It is AI extrapolating beyond what it was given. Every number in any AI-generated narrative must be traced back to your verified output. If AI includes a number you did not provide, remove it — do not adjust it. A professional deliverable can only contain numbers that came from your actual analysis.

### Best practices

**Give AI your numbers, not the task of generating them.** When asking for summaries or narratives, always provide the numbers you have already verified. Do not ask AI to generate the statistics and the story at the same time.

**Confirm you are working on clean data.** Always verify that your analysis is running on the cleaned variable, not the original raw data. Running analysis on uncleaned data with inconsistent categories will produce misleading breakdowns.

**Spot-check one finding manually.** For any key result, calculate the number yourself using a simple filter or count and compare it to what AI's code produced. They should match exactly. If they do not, something is wrong.

**Separate observation from interpretation.** Your analysis shows what the data contains. What it means for the clinic is a question for you and the stakeholder, not for AI.

{% section "Do it for real" %}

The job. Answer the question you settled on in Part 1 using the clean dataset from Part 3. Show at least three findings. For each one, identify which column or columns it depends on and note whether that column is complete enough to trust the finding.

{% slot "notebook", "The notebook for this part, opening in Colab the way Part 2's does. It loads the course's cleaned file, the output of Part 3, so everyone analyzes identical data.", "180px" %}

{% section "How a practitioner did it" %}

{% slot "video", "The practitioner. The most valuable recording in the module. A time missing data turned out to mean something: how they worked out which kind of missing it was, and who they asked.", "180px" %}

**Compare their findings against yours.** Did they answer the same question differently, or discover something you missed? What does the difference suggest about what they were paying attention to?

**Compare how they handled incompleteness.** When a column was missing data, did they note it, work around it, or dig into it? What would you do differently having seen their approach?

{% feedback "3", "4" %}
