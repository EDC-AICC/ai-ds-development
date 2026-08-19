---
order: 4
title: Analyze
---

{% section "The setup" %}

{% todo "To write" %}
TODO: The opening.
{% endtodo %}

{% section "Get a feel for it" %}

{% slot "activity", "An activity and two check questions, the shape Parts 1 and 2 use. The idea for this part is committing to what you expect before the answer appears, so the gap between the guess and the result is where the student's attention lands.", "200px" %}

{% section "Lesson" %}

### Analyse: Finding Patterns in Clean Data

#### The Concept

Analysis is the step where clean data produces answers. Using grouping, counting, averaging, and comparing, a data scientist converts rows and columns into findings that can inform decisions. The goal is not to generate every possible statistic. It is to answer the specific questions framed in the Ask step using the clean data prepared in the Transform step.

A clinical visit dataset supports many types of analysis. Frequency analysis counts how often something occurs, such as which diagnoses appear most often, which months see the highest visit volume, or how many patients have had four or more visits. Breakdown analysis compares one variable across the levels of another, such as whether follow-up rates differ by insurance type or whether high utilizers have different diagnoses than low utilizers. Trend analysis looks at how a variable changes over time, such as whether monthly visit volume is growing, declining, or seasonal. Each type of question requires a different approach and produces a different kind of finding.

Good analysis also generates new questions. When a frequency analysis shows that five diagnoses account for a large share of all visits, the natural follow-up is whether that concentration is consistent across age groups or varies significantly. When a breakdown analysis shows that patients with one type of insurance have a substantially lower follow-up rate, the next question is whether that gap is consistent across providers and visit types. This iterative quality is one of the things that makes data science valuable: each finding points toward the next question.

{% concept %}Analysis converts clean data into findings by grouping, counting, averaging, and comparing. Good analysis answers specific questions, but it also generates new ones. The goal is findings the recipient can act on, not the maximum number of statistics possible.{% endconcept %}

#### How AI Can Help

AI changes the economics of analysis significantly. Writing groupby operations, crosstabs, conditional filters, and sorting logic by hand takes time. With AI, the code for a specific analysis takes minutes once you describe what you want. That shift in time allocation, less time writing code and more time thinking about results, is one of the most concrete benefits of using AI as a data science tool.

AI can help in two distinct ways during analysis. First, it can suggest what to investigate when direction is unclear. If you describe the dataset and the business context, AI can propose analysis questions you may not have considered and name the columns each would use. Second, it can write code for an analysis you have already decided to do. You describe the grouping, the measure, the sort order, and the output format, and AI produces working code ready to run.

AI is also useful after analysis is complete. Once you have results, you can paste the output into an AI chat and ask for help interpreting what it shows, what follow-up questions it raises, or how to present it to a non-technical audience. This conversational interpretation helps you extract more value from the results and think through implications you might have missed.

{% aihelps %}AI helps by suggesting analysis directions when the path is unclear, writing analysis code on demand from a specific description, and helping interpret results once they are available. This allows a data scientist to spend more time on the thinking and less on the typing.{% endaihelps %}

#### How to Use AI

There are two productive approaches to using AI for analysis. The first is to ask AI to suggest what is worth investigating. This works well when the direction is not yet clear. A good prompt for this approach describes the dataset, the business goal, and asks AI to suggest questions along with the columns each would require:

{% aiprompt %}I have a cleaned outpatient clinic dataset with patient visit records. The columns include icd_description (medical diagnosis), visit_type (Office Visit, Telehealth, Follow-Up, Urgent Care), gender, age, insurance_type (Medicaid, Medicare, Private, Uninsured), provider_id, county, copay_amount, follow_up_required, and derived columns for visit month, visit year, age group, whether a patient is a high utilizer (4 or more visits), and days since last visit. The clinic director wants to understand visit patterns and access equity. Suggest 5 analysis questions worth investigating. For each, name the columns involved and suggest a pandas approach.{% endaiprompt %}

The second approach is to ask AI to write code for a specific analysis you have already decided to do. This approach requires a precise prompt that names the variable, the grouping column, the measure, the sort direction, and the output format:

{% aiprompt %}Using a DataFrame called df_clean, write Python code to answer this question: Which are the 10 most common diagnoses, and how many visits does each account for? Group by the icd_description column, count visits, sort in descending order, and show the top 10 results. Store the output in a variable called top_diagnoses. Print the result with a clear heading.{% endaiprompt %}

The level of detail in this prompt matters. Naming the variable (df_clean), the grouping column (icd_description), the measure (count of visits), the sort direction (descending), the number of results (10), and the output variable name (top_diagnoses) leaves AI very little room to guess. Each piece of information you omit is a decision AI makes on your behalf, sometimes correctly and sometimes not.

For written summaries of analysis results, give AI your verified numbers explicitly and prohibit it from adding statistics you did not provide. This is a critical habit:

{% aiprompt %}Here are my verified findings from the clinic visit analysis: [paste your actual numbers here]. Write a 4-sentence summary for a non-technical clinic director. Use only the numbers I have provided. Do not add any statistics I have not given you. End with one sentence noting a data limitation the director should be aware of.{% endaiprompt %}

#### Evaluating AI Output

Analysis output from AI-generated code requires two levels of verification. The first is technical: did the code run correctly and produce what you intended? The second is interpretive: does AI describe the results accurately, and does it stay within what the data actually shows?

For technical verification, check that the grouping column is correct (diagnosis description rather than diagnosis code, for example), that the sort direction is what you asked for, and that the count represents the unit you intended (visits rather than unique patients, or the reverse, depending on your question). Each of these is an easy error to make, and each produces a meaningfully different result.

For interpretive verification, be especially careful when AI generates written summaries or commentary about your findings. AI has a consistent tendency to add numbers that were not in the results you provided, to round figures to different values than your actual output, or to make causal or clinical claims that the data does not support. If you ask AI to summarise findings about follow-up rates by insurance type, it may add an interpretation about why those differences exist. That interpretation is not supported by your data. It is AI extrapolating beyond what it was given.

The most important habit in this step is checking every number in any AI-generated narrative against your verified analysis output. If AI includes a number you did not provide, it must be removed, not adjusted. A professional deliverable can only contain numbers that came from your actual analysis.

{% aieval %}Verify analysis output by: (1) confirming grouping, measure, and sort direction are correct, (2) checking every number in any AI-generated summary against your actual results — remove any number AI added that was not in your verified output, (3) removing any causal or clinical interpretation AI added that the data does not support. These checks are non-negotiable.{% endaieval %}

#### Best Practices

{% todo %}Not yet written in the source document.{% endtodo %}

#### Learn More

<ul class="learnmore">
<li><strong>DataCamp: Introduction to ChatGPT for Data Science (free intro)</strong><br><span class="lm-desc">AI workflows for data analysis specifically</span></li>
<li><strong>Towards Data Science: Prompt Engineering for Data Scientists</strong><br><span class="lm-desc">Guide to writing better analysis prompts</span></li>
<li><strong>StatQuest on YouTube: Statistics Fundamentals</strong><br><span class="lm-desc">Build intuition for what analysis results actually mean</span></li>
<li><strong>Kaggle: Pandas Course (free, browser-based)</strong><br><span class="lm-desc">Understand what AI-generated analysis code is doing</span></li>
</ul>

{% section "Do it for real" %}

{% todo "To write" %}
The job statement for this part, the way Parts 1 and 2 state theirs.
{% endtodo %}

{% slot "notebook", "The notebook for this part, opening in Colab the way Part 2's does. It loads the course's cleaned file, the output of Part 3, so everyone analyzes identical data.", "180px" %}

{% section "How a practitioner did it" %}

{% slot "video", "The practitioner. The most valuable recording in the module. A time missing data turned out to mean something: how they worked out which kind of missing it was, and who they asked.", "180px" %}

{% todo "To write" %}
The two comparisons the student makes against the recording, chosen for this part.
{% endtodo %}

{% feedback "3", "4" %}
