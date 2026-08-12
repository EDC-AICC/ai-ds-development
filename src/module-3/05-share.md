---
order: 5
title: Share
kicker: Module 3 · Part 5
standfirst: >
  Four sentences for someone who will only ever read the summary. The AI writes them better than you do, using only your numbers, and you should still hold some of them back.
prev:
  url: /module-3/04-analyze/
  label: Part 4 · Analyze
next:
  url: /module-3/06-build/
  label: Apply
---

Analysis only creates value when someone can understand and act on the findings. Everything up to this point has been preparation. This part is where you hand the work to someone who has not seen the dataset, has no interest in the code, and needs to make a decision by end of day.

That shift in audience changes almost everything. A table of numbers becomes a chart. A correct statistic becomes a sentence a non-statistician can parse. A finding becomes a recommendation. And every one of those translations introduces a place where the meaning can slip, where AI can sound confident while saying something the data does not actually support, and where the person receiving your work has no way to check.

Part 5 is the step you are professionally responsible for in a way the earlier steps are not. You ran the code. You checked the numbers. The summary carries your name.

{% section "Get a feel for it" %}

{% slot "activity", "An activity and two check questions, the shape Parts 1 and 2 use. The idea for this part is red-penning an AI draft whose numbers are all correct, so the student learns to catch the sentence rather than the arithmetic.", "200px" %}

{% section "Lessons" %}

### The concept

Effective data communication has three requirements. **Accuracy** means every number in your deliverable matches your verified analysis results — no rounding that changes the meaning, no statistics that came from anywhere other than your actual output. **Honesty** means acknowledging the limits of the data clearly, not burying them in a footnote. If a key column is missing for a significant proportion of records, that fact belongs in the summary, not hidden. **Actionability** means framing findings so the recipient knows what to do with them. "September had 50 visits" is less useful than "September had the lowest visit volume of the year at 50 visits, which may indicate an opportunity for outreach during that month."

Before sharing findings, a data scientist also checks for patterns that could indicate inequity or bias in the data or in the population it represents. A clinical dataset can reveal whether certain patient groups are underrepresented in the data, whether access to follow-up care differs across demographics, or whether some providers carry a disproportionate share of complex diagnoses. These patterns may have explanations, but identifying them is part of responsible data science — not an optional extra step.

### How AI can help

AI is useful in the Share step for three distinct tasks.

**Building visualisations.** You describe the data and the audience, AI recommends a chart type with a rationale, and it writes the code. This is significantly faster than building chart code from scratch, especially when you need to customise labels, titles, and layout for a specific audience. A clinic dataset with long diagnosis names benefits from horizontal bar charts — AI will usually recommend this correctly, but asking it to justify the recommendation is a useful check on whether it understood the problem.

**Drafting written summaries.** Converting a list of verified statistics into plain language that a non-technical reader can follow is time-consuming. AI can produce a first draft in seconds. The draft almost always requires editing, but having a starting point is faster than writing from blank. The critical rule: give AI your verified numbers explicitly and prohibit it from adding statistics you did not provide.

**Generating a bias and equity checklist.** Clinical datasets carry inherent risks of bias — missing data concentrated in specific demographics, access disparities that appear as statistical differences across groups, or collection gaps that make certain populations invisible. AI can generate a structured list of checks appropriate for a clinical visit dataset, giving you a framework to work through rather than relying on memory alone.

### How to use AI

For visualisations, a strong prompt names the data variable, describes the columns being plotted, states the audience, and asks AI to justify its chart type recommendation before writing the code:

<pre class="prompt">I want to visualise the most common diagnoses in an outpatient clinic
dataset. The data is in a variable called top_diagnoses with columns
icd_description (the diagnosis name) and count (number of visits).
The audience is a non-technical clinic director.

1. What chart type do you recommend and why?
2. Write Python code using matplotlib to create this chart. Include a
   descriptive title, labelled axes, and text large enough to read on a
   projected screen.</pre>

For written summaries, always provide your verified numbers and prohibit AI from adding statistics you did not give it:

<pre class="prompt">Write a 4-sentence summary of these clinic visit findings for a
non-technical director:
[paste your verified numbers here]

Use only the numbers I have provided above. Do not add any statistics
not listed here. End with one sentence noting a data limitation the
director should know about.</pre>

For bias and equity checking, ask AI to generate a structured checklist specific to your dataset type:

<pre class="prompt">I have a clinical outpatient visit dataset with columns including patient
identifiers, visit dates, diagnosis codes, visit type, gender, age,
insurance type, provider ID, county, copay amount, and follow-up status.
It also has derived columns for age group and a high-utilizer flag.

What types of bias or equity concerns should I check for before sharing
findings? List 5 specific checks. For each, describe what the concern is,
how to detect it in the data, and why it matters for a clinical equity
analysis.</pre>

### Evaluating AI output

The Share step carries the highest stakes for evaluation errors. The person receiving your deliverable cannot check the numbers themselves. If an error passes through unchecked, it becomes part of the record.

**Trace every number.** Check every number in AI's written output against your verified analysis results. If AI includes a statistic you did not provide, remove it — do not adjust it. AI generated a number on its own. That is called a hallucination, and it is a well-documented behaviour of AI language models. The number may be plausible. It is not yours and does not belong in your deliverable.

**Remove interpretive overreach.** AI has a tendency to make causal or clinical claims that go beyond what the data shows. If your data shows that patients with one insurance type have a lower follow-up rate, AI might write that those patients "face significant barriers to care." That is an interpretation. Your data shows a rate difference. The cause of that difference is not in the data, and AI should not be adding that interpretation. Remove it.

**Evaluate visualisations as a communication product.** Run the chart code and look at the output as if you are the clinic director seeing it for the first time. Is the title descriptive enough to understand without additional explanation? Are the axis labels clear? Is the text large enough to read? Would you be comfortable presenting this in a meeting? These are the questions that matter, not whether the code ran without errors.

**Report bias patterns as observations, not conclusions.** AI can detect that county data is missing more often for one insurance group than another. What AI cannot determine is whether that pattern reflects a data collection gap, a privacy policy, or an intake workflow issue. Your deliverable should report the pattern and flag that its cause is unknown — not present an AI-generated explanation as fact.

### Best practices

**Verify before you send.** Read every AI-generated sentence and trace every number back to your analysis output. This step is non-negotiable.

**State limitations explicitly and prominently.** A deliverable that buries a significant data limitation in a footnote is not honest communication. If 30 percent of county records are missing, that caveat belongs in the main text.

**Frame findings as actions.** Every major finding should be paired with a sentence about what the clinic could do with that information. Analysis that produces no suggested action has limited value to a decision-maker.

**Own the deliverable.** The summary, the charts, and the recommendations you share carry your name and your professional judgment. AI produced a draft. You produced the deliverable.

{% section "Do it for real" %}

The job. Turn your Part 4 findings into something the clinic director could read in three minutes and act on. A short narrative, one or two charts, and a clear statement of what the data does and does not show. Every number in the narrative should appear in your Part 4 output. Every chart should be readable without a key or explanation.

{% slot "notebook", "The notebook for this part, opening in Colab the way Part 2's does. It loads the cleaned clinic file, so your numbers come from the same place your findings did.", "180px" %}

{% section "How a practitioner did it" %}

{% slot "video", "The practitioner. When is AI worth skipping? Their rubric with examples.", "180px" %}

**Compare their summary against yours.** Where they chose different words, which version is more useful to the director — and why? Where their summary differs from yours in what it claims, which version does the data actually support?

**Compare their charts against yours.** Same data, two visualisations. Which communicates the finding more clearly, and what would you borrow from their version if you could revise yours?

{% feedback "3", "5" %}
