---
order: 6
title: "Share: Communicating Findings"
navLabel: Share
---

{% section "Handing Off the Work", "handing-off-the-work" %}

Analysis only creates value when someone can understand and act on the findings. Everything up to this point has been preparation. This part is where you hand the work to someone who has not seen the dataset, has no interest in the code, and needs to make a decision.

That shift in audience changes almost everything. A table of numbers becomes a chart. A correct statistic becomes a sentence a non-statistician can follow. A finding becomes a recommendation. And every one of those translations introduces a place where the meaning can slip, where AI can sound confident while saying something the data does not actually support, and where the person receiving your work has no way to check.

You ran the code. You checked the numbers. The summary carries your name.

{% section "Try It: Red-Pen the Draft", "try-it-red-pen-the-draft" %}

{% slot "activity", "An activity and two check questions, the shape Parts 2 and 3 use. The idea for this part is red-penning an AI draft whose numbers are all correct, so the student learns to catch the sentence rather than the arithmetic.", "200px" %}

{% section "Learn: Accurate, Honest, and Actionable", "learn-accurate-honest-actionable" %}

The Share step is where a data scientist translates results into a form that a non-technical audience can use: clear charts, accurate written summaries, and specific recommendations connected to evidence. This requires a different mode of thinking than the technical steps that came before. You are no longer thinking about how to process data. You are thinking about what someone needs to know and what they should do with it.

Effective data communication has three requirements. Click each one to read more.

{% accordion %}
{% fold "Accuracy" %}
Every number in your deliverable must match your verified analysis results. No rounding that changes the meaning, no numbers added to make the story more complete, no statistics that came from somewhere other than your actual output.
{% endfold %}
{% fold "Honesty" %}
Acknowledge the limits of the data clearly, not buried in footnotes. If a key column is missing for a significant proportion of records, that fact belongs in the summary, not hidden.
{% endfold %}
{% fold "Actionability" %}
Frame findings so the recipient knows what to do with them. A finding stated as "September had 50 visits" is less useful than "September had the lowest visit volume of the year at 50 visits, which may indicate an opportunity for targeted outreach during that month."
{% endfold %}
{% endaccordion %}

Before sharing findings, a data scientist also checks for patterns that could indicate inequity or bias in the data or in the population it represents. This is not optional. A clinical dataset can reveal whether certain patient groups are missing from the data, whether access to certain visit types differs across demographics, or whether some providers carry disproportionate shares of complex diagnoses. These patterns may have explanations, but finding them is part of responsible data science.

{% callout "highlight" %}
Sharing findings means translating verified results into accurate, honest, and actionable communication. It includes visualization, written summary, bias and equity checks, and clear statements of what the data shows and what it does not.
{% endcallout %}

{% section "Where AI Can Help", "where-ai-can-help" %}

AI is useful in the Share step for three distinct tasks. Click each one to read more.

{% accordion %}
{% fold "Building visualizations" %}
You describe the data and the audience, AI recommends a chart type with a rationale, and it writes the code. This is significantly faster than building chart code from scratch, especially when you need to customize labels, titles, colors, and layout for a specific audience.
{% endfold %}
{% fold "Drafting written summaries" %}
Converting a list of verified statistics into plain language that a non-technical reader can follow is time-consuming. AI can produce a first draft in seconds. The draft almost always requires editing, but having a starting point is faster than writing from a blank page.
{% endfold %}
{% fold "Generating a bias and equity checklist" %}
Clinical datasets carry inherent risks of bias: missing data concentrated in specific demographics, access disparities that appear as statistical differences across groups, or collection gaps that make certain populations invisible in the data. AI can generate a structured list of checks appropriate for a clinical visit dataset, giving you a framework to work through rather than relying on memory.
{% endfold %}
{% endaccordion %}

{% callout %}
**In short:** AI helps you build visualizations faster, draft plain-language summaries from verified numbers, and generate bias detection checklists. In every case, AI produces a first draft that you verify, refine, and take professional responsibility for. The final deliverable reflects your judgment.
{% endcallout %}

{% section "How to Use AI", "how-to-use-ai" %}

### Visualizations

A strong prompt names the data variable, describes the columns being plotted, states the audience, and asks AI to justify its chart type recommendation before writing the code:

> I want to visualize the most common diagnoses in an outpatient clinic dataset. The data is in a variable called top_diagnoses with columns icd_description (the diagnosis name) and count (number of visits). The audience is a non-technical clinic director.
>
> 1. What chart type do you recommend and why?
> 2. Write Python code using matplotlib to create this chart. Include a descriptive title, labeled axes, and text large enough to read on a projected screen.

Asking AI to justify its chart choice is deliberate. The explanation tells you whether AI understood the problem. A good answer will explain that horizontal bars are appropriate because diagnosis names are long and would be cut off on a vertical axis. A weak answer will just name a chart type without reasoning. Learning to distinguish those two types of responses is part of developing your evaluation skills.

### Written Summaries

Always provide your verified numbers and explicitly prohibit AI from adding statistics you did not give it:

> Write a 4-sentence summary of these clinic visit findings for a non-technical director: [paste your verified numbers]. Use only the numbers I have provided above. Do not add any statistics not listed here. End with one sentence noting a data limitation the director should know about.

### Bias and Equity Checks

Ask AI to generate a structured checklist specific to the type of dataset you are working with:

> I have a clinical outpatient visit dataset with columns including patient identifiers, visit dates, diagnosis codes, visit type, gender, age, insurance type, provider, county, copay amount, and follow-up status. It also has derived columns for age group and a high utilizer flag. What types of bias or equity concerns should I check for before sharing findings with the clinic director? List 5 specific checks, and for each describe what the concern is, how to detect it in the data, and why it matters for a clinical equity analysis.

{% section "Evaluating AI Output", "evaluating-ai-output" %}

The Share step carries the highest stakes for evaluation errors. The people who receive your deliverable cannot check the numbers themselves. If an error passes through unchecked, it becomes part of the record. This is the step where you do not want to sidestep rigorous evaluation. Click each check below to read more.

{% accordion %}
{% fold "Trace every number" %}
For written summaries, trace every number in AI's output back to your verified analysis results. If AI includes a statistic you did not provide, it must be removed, not corrected. AI did not make a rounding error on a number you gave it. It generated a number on its own. That is called a **hallucination**, and it is a well-documented behavior of AI language models. The number may be plausible. It is not yours. It does not belong in your deliverable.
{% endfold %}
{% fold "Remove interpretive claims" %}
AI also has a tendency to make interpretive claims that go beyond what the data shows. If your data shows that Medicaid patients have a lower follow-up rate than privately insured patients, AI might write "Medicaid patients face significant barriers to follow-up care." That is an interpretation, not a finding. Your data shows a rate difference. The cause of that difference, whether it is financial, logistical, cultural, or related to provider behavior, is not in the data. AI should not be adding that interpretation, and you should not let it stay in your deliverable.
{% endfold %}
{% fold "Report bias patterns as observations" %}
AI can detect a statistical pattern, such as county data being missing more often for one insurance group than another. What AI cannot determine is whether that pattern is a data collection gap, a privacy policy, an intake workflow issue, or something specific to how a particular site operates. That determination requires organizational knowledge. Your deliverable should report the pattern and flag that its cause is unknown, not present an AI-generated explanation as fact.
{% endfold %}
{% fold "Look at every chart as the audience would" %}
Evaluate the output as if you are the clinic director seeing it for the first time. Is the title descriptive enough to understand without additional explanation? Are the axis labels clear? Is the text large enough to read? Would you be comfortable presenting this chart in a meeting? Visual evaluation requires looking at the chart as a communication product, not as code that ran without errors.
{% endfold %}
{% endaccordion %}

{% callout "checkpoint", "Human Judgment Checkpoint" %}
Before sharing any AI-generated content:

1. trace every number to your verified results and remove any that are not there;
2. remove any interpretive or causal claims AI added that the data does not support;
3. evaluate visualizations visually, as a communication product; and
4. report bias patterns as observations with unknown causes, not as AI-explained conclusions.

These are your professional standards, not AI's.
{% endcallout %}

{% section "Best Practices", "best-practices" %}

**Verify before you send.** Read every AI-generated sentence and trace every number back to your analysis output. This step is non-negotiable regardless of how confident you feel about the content.

**State limitations explicitly and prominently.** A deliverable that buries a significant data limitation in a footnote is not honest communication. If 30 percent of county records are missing, that caveat belongs in the main text, not hidden.

**Frame findings as actions.** Every major finding should be paired with a sentence about what the clinic could do with that information. Analysis that produces no suggested action has limited value to a decision-maker.

**Run bias checks before every final deliverable.** Checking for missing data concentration, demographic imbalances, and access pattern differences is part of responsible data science, not an optional extra step.

**Own the deliverable.** The summary, the charts, and the recommendations you share with the clinic director carry your name and your professional judgment. AI produced a draft. You produced the deliverable.

{% optional "Learn More" %}
<ul class="learnmore">
<li><a href="https://www.storytellingwithdata.com/" target="_blank" rel="noopener"><strong>Storytelling with Data (book and blog)</strong></a><br><span class="lm-desc">Standard reference for communicating data to non-technical audiences</span></li>
<li><a href="https://www.youtube.com/watch?v=5Zg-C8AAIGg" target="_blank" rel="noopener"><strong>YouTube: Data Visualization Best Practices (Harvard University)</strong></a><br><span class="lm-desc">Practical and immediately applicable principles</span></li>
<li><a href="https://ai.google/responsibility/responsible-ai-practices/" target="_blank" rel="noopener"><strong>Google: Responsible AI Practices</strong></a><br><span class="lm-desc">Framework for evaluating AI outputs before sharing</span></li>
<li><a href="https://datajournalism.com/read/handbook/two" target="_blank" rel="noopener"><strong>Data Journalism Handbook (free online)</strong></a><br><span class="lm-desc">How journalists communicate data findings to general audiences</span></li>
<li><a href="https://seaborn.pydata.org/tutorial.html" target="_blank" rel="noopener"><strong>Seaborn Visualization Library Tutorial</strong></a><br><span class="lm-desc">Understand and customize AI-generated chart code</span></li>
</ul>
{% endoptional %}

{% section "Try It: Report to the Board and the Funder", "try-it-report-to-the-board-and-the-funder" %}

{% tryit %}
Turn your Part 5 findings into something two audiences can read and act on: the clinic board, deciding whether to hire a care coordinator, and the county funder, asking whether the clinic serves uninsured patients.

{% notebook "Notebook 4 · Share", "m3-share.ipynb" %}
Opens in Colab and loads the cleaned clinic file, so your numbers come from the same place your findings did.
{% endnotebook %}

The notebook walks you through it:

1. Know your audience: what each one needs to decide.
2. Prioritize your findings: which two or three belong in each deliverable, and which to leave out.
3. Build one chart that communicates a finding, not just displays the data.
4. Write a short summary in which every number comes from a computed variable.
5. Ask AI for three bias and equity questions, then write the code to check each one.
6. Write a two-sentence recommendation using only verified numbers.
7. Reflect on what changed between the two audiences.
{% endtryit %}

{% section "See It in Practice: Making It Readable and True", "see-it-in-practice" %}

In this video, Habeeba turns the clinic analysis into deliverables for the board and the funder. Watch how she evaluates each chart, keeps every number tied to a computed result, and handles the bias checks.

{% video "1229644467", "Share: making it readable and true (Habeeba Siddiqui, 5:19)", "m3-share.txt" %}

{% notebook "Habeeba's Notebook · Share", "m3-share-practitioner.ipynb" %}
Her charts, the prompts behind them, the written summaries built from computed variables, a hallucinated number she caught, and her bias checks. Open it after you have finished your own.
{% endnotebook %}

**Compare her summary with yours.** Habeeba fills every number in her written summary from a computed variable rather than typing it by hand. Could you trace each number in your summary back to a specific line of output? Where her wording differs from yours, which version is more useful to the reader, and which does the data actually support?

**Compare her charts with yours.** Habeeba chose each chart because it answers a question her audience needs answered. Do yours? Same data, two visualizations: which communicates the finding more clearly, and what would you borrow from her version?

**Compare your bias checks with hers.** She asked AI for questions to check, not answers, and reported any pattern without explaining its cause. Did any sentence in your summary explain *why* a pattern exists? If so, what evidence in the data supports it?

{% section "Key Takeaways", "key-takeaways" %}

{% callout "takeaways", "Key Takeaways" %}
- Communication has three requirements: accuracy, honesty, and actionability.
- Every number in a deliverable must trace back to your verified analysis. Remove any number AI added. Do not adjust it.
- Your data shows patterns, not causes. Remove causal claims AI adds, and report bias findings as observations with unknown causes.
- Look at every chart the way your audience will see it for the first time.
- **AI produced a draft. You produced the deliverable.**
{% endcallout %}

### Before You Continue

You have now carried one request all the way from a vague email to a finished deliverable. In Part 7, you will do the whole process again, on your own, with a dataset you have not seen.

{% section "Feedback", "feedback" %}

This module is a draft, and what you write here shapes the next revision. A sentence about what confused you, or what worked, is enough.

{% feedback %}
