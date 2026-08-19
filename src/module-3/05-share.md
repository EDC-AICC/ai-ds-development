---
order: 5
title: Share
---

{% section "The setup" %}

{% todo "To write" %}
TODO: The opening.
{% endtodo %}

{% section "Get a feel for it" %}

{% slot "activity", "An activity and two check questions, the shape Parts 1 and 2 use. The idea for this part is red-penning an AI draft whose numbers are all correct, so the student learns to catch the sentence rather than the arithmetic.", "200px" %}

{% section "The Concept" %}

### Share and Act: Communicating Findings

Analysis only creates value when someone can understand and act on the findings. The Share step is where a data scientist translates results into a form that a non-technical audience can use: clear charts, accurate written summaries, and specific recommendations connected to evidence. This requires a different mode of thinking than the technical steps that came before. You are no longer thinking about how to process data. You are thinking about what someone needs to know and what they should do with it.

Effective data communication has three requirements. Accuracy means every number in your deliverable must match your verified analysis results. No rounding that changes the meaning, no numbers added to make the story more complete, no statistics that came from somewhere other than your actual output. Honesty means acknowledging the limits of the data clearly, not burying them in footnotes. If a key column is missing for a significant proportion of records, that fact belongs in the summary, not hidden. Actionability means framing findings so the recipient knows what to do with them. A finding stated as "September had 50 visits" is less useful than "September had the lowest visit volume of the year at 50 visits, which may indicate an opportunity for targeted outreach during that month."

Before sharing findings, a data scientist also checks for patterns that could indicate inequity or bias in the data or in the population it represents. This is not optional. A clinical dataset can reveal whether certain patient groups are missing from the data, whether access to certain visit types differs across demographics, or whether some providers carry disproportionate shares of complex diagnoses. These patterns may have explanations, but finding them is part of responsible data science.

{% concept %}Sharing findings means translating verified results into accurate, honest, and actionable communication. It includes visualisation, written summary, bias and equity checks, and clear statements of what the data shows and what it does not.{% endconcept %}

{% section "How AI Can Help" %}

AI is useful in the Share step for three distinct tasks. The first is building visualisations. You describe the data and the audience, AI recommends a chart type with a rationale, and it writes the code. This is significantly faster than building chart code from scratch, especially when you need to customise labels, titles, colors, and layout for a specific audience.

The second task is drafting written summaries. Converting a list of verified statistics into plain language that a non-technical reader can follow is time-consuming. AI can produce a first draft in seconds. The draft almost always requires editing, but having a starting point is faster than writing from a blank page.

The third task is generating a bias and equity checklist. Clinical datasets carry inherent risks of bias: missing data concentrated in specific demographics, access disparities that appear as statistical differences across groups, or collection gaps that make certain populations invisible in the data. AI can generate a structured list of checks appropriate for a clinical visit dataset, giving you a framework to work through rather than relying on memory.

{% aihelps %}AI helps you build visualisations faster, draft plain-language summaries from verified numbers, and generate bias detection checklists. In every case, AI produces a first draft that you verify, refine, and take professional responsibility for. The final deliverable reflects your judgment.{% endaihelps %}

{% section "How to Use AI" %}

For visualisation, a strong prompt names the data variable, describes the columns being plotted, states the audience, and asks AI to justify its chart type recommendation before writing the code:

{% aiprompt %}I want to visualise the most common diagnoses in an outpatient clinic dataset. The data is in a variable called top_diagnoses with columns icd_description (the diagnosis name) and count (number of visits). The audience is a non-technical clinic director. 1. What chart type do you recommend and why? 2. Write Python code using matplotlib to create this chart. Include a descriptive title, labelled axes, and text large enough to read on a projected screen.{% endaiprompt %}

Asking AI to justify its chart choice is deliberate. The explanation tells you whether AI understood the problem. A good answer will explain that horizontal bars are appropriate because diagnosis names are long and would be cut off on a vertical axis. A weak answer will just name a chart type without reasoning. Learning to distinguish those two types of responses is part of developing your evaluation skills.

For written summaries, always provide your verified numbers and explicitly prohibit AI from adding statistics you did not give it:

{% aiprompt %}Write a 4-sentence summary of these clinic visit findings for a non-technical director: [paste your verified numbers]. Use only the numbers I have provided above. Do not add any statistics not listed here. End with one sentence noting a data limitation the director should know about.{% endaiprompt %}

For bias and equity checking, ask AI to generate a structured checklist specific to the type of dataset you are working with:

{% aiprompt %}I have a clinical outpatient visit dataset with columns including patient identifiers, visit dates, diagnosis codes, visit type, gender, age, insurance type, provider, county, copay amount, and follow-up status. It also has derived columns for age group and a high utilizer flag. What types of bias or equity concerns should I check for before sharing findings with the clinic director? List 5 specific checks, and for each describe what the concern is, how to detect it in the data, and why it matters for a clinical equity analysis.{% endaiprompt %}

{% section "Evaluating AI Output" %}

The Share step carries the highest stakes for evaluation errors. The people who receive your deliverable cannot check the numbers themselves. If an error passes through unchecked, it becomes part of the record. This is the step where rigorous evaluation matters most.

For written summaries, trace every number in AI's output back to your verified analysis results. If AI includes a statistic you did not provide, it must be removed, not corrected. AI did not make a rounding error on a number you gave it. It generated a number on its own. That is called a hallucination, and it is a well-documented behaviour of AI language models. The number may be plausible. It is not yours. It does not belong in your deliverable.

AI also has a tendency to make interpretive claims that go beyond what the data shows. If your data shows that Medicaid patients have a lower follow-up rate than privately insured patients, AI might write "Medicaid patients face significant barriers to follow-up care." That is an interpretation, not a finding. Your data shows a rate difference. The cause of that difference, whether it is financial, logistical, cultural, or related to provider behaviour, is not in the data. AI should not be adding that interpretation, and you should not let it stay in your deliverable.

For bias checks, AI can detect a statistical pattern, such as county data being missing more often for one insurance group than another. What AI cannot determine is whether that pattern is a data collection gap, a privacy policy, an intake workflow issue, or something specific to how a particular site operates. That determination requires organisational knowledge. Your deliverable should report the pattern and flag that its cause is unknown, not present an AI-generated explanation as fact.

For visualisations, evaluate the output as if you are the clinic director seeing it for the first time. Is the title descriptive enough to understand without additional explanation? Are the axis labels clear? Is the text large enough to read? Would you be comfortable presenting this chart in a meeting? Visual evaluation requires looking at the chart as a communication product, not as code that ran without errors.

{% aieval %}Before sharing any AI-generated content: (1) trace every number to your verified results and remove any that are not there, (2) remove any interpretive or causal claims AI added that the data does not support, (3) evaluate visualisations visually as a communication product, (4) report bias patterns as observations with unknown causes, not as AI-explained conclusions. These are your professional standards, not AI's.{% endaieval %}

{% section "Resources" %}

#### Best Practices

{% todo %}{% endtodo %}

#### Learn More

<ul class="learnmore">
<li><a href="https://www.storytellingwithdata.com/" target="_blank" rel="noopener"><strong>Storytelling with Data (book and blog)</strong></a><br><span class="lm-desc">Standard reference for communicating data to non-technical audiences</span></li>
<li><a href="https://www.youtube.com/watch?v=5Zg-C8AAIGg" target="_blank" rel="noopener"><strong>YouTube: Data Visualization Best Practices (Harvard University)</strong></a><br><span class="lm-desc">Practical and immediately applicable principles</span></li>
<li><a href="https://ai.google/responsibility/responsible-ai-practices/" target="_blank" rel="noopener"><strong>Google: Responsible AI Practices</strong></a><br><span class="lm-desc">Framework for evaluating AI outputs before sharing</span></li>
<li><a href="https://datajournalism.com/read/handbook/two" target="_blank" rel="noopener"><strong>Data Journalism Handbook (free online)</strong></a><br><span class="lm-desc">How journalists communicate data findings to general audiences</span></li>
<li><a href="https://seaborn.pydata.org/tutorial.html" target="_blank" rel="noopener"><strong>Seaborn Visualization Library Tutorial</strong></a><br><span class="lm-desc">Understand and customise AI-generated chart code</span></li>
</ul>

{% section "Do it for real" %}

{% todo "To write" %}
The job statement for this part, the way Parts 1 and 2 state theirs.
{% endtodo %}

{% slot "notebook", "The notebook for this part, opening in Colab the way Part 2's does. It loads the cleaned clinic file, so your numbers come from the same place your findings did.", "180px" %}

{% section "How a practitioner did it" %}

{% slot "video", "The practitioner. When is AI worth skipping? Their rubric with examples.", "180px" %}

{% todo "To write" %}
The two comparisons the student makes against the recording, chosen for this part.
{% endtodo %}

{% section "Feedback" %}

This module is a draft, and what you say here directly shapes the next revision. A sentence about what confused you or what worked is genuinely useful.

{% feedback "3", "5" %}
