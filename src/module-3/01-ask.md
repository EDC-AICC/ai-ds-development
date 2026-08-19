---
order: 1
title: Ask
---

{% section "The setup" %}

Monday morning, this is in your inbox.

> **From:** Clinic Director<br>**Subject:** visit data
>
> Before the board meeting next month, can you pull together something on our visit patterns from the last two years? I want to understand what's really going on with our patients. Whatever you think is most useful. Thanks!

It is friendly, it is urgent, and it contains no question. "Visit patterns" could mean who comes in, or how often, or for what, or when. "Really going on" could mean a money problem, a staffing problem, or plain curiosity. The audience might be the director, the board, or somebody the board answers to. Every one of those readings leads to a different month of work, and the email supports all of them.

Answering the wrong reading well is the most expensive mistake in data work, because everything downstream inherits it, and it is the mistake an AI cannot catch for you. The AI answers whatever question you settle on. Settling on the right one happens here, before any file is opened, and it mostly happens by asking.

{% section "Get a feel for it" %}

You get the director for three questions before she disappears into meetings. Choose them well, then choose the brief her answers support.

{% activity "three-questions.html", "Three questions", "700px" %}

{% check "Think it through before you open the answers." %}

{% q "The question that unlocked the most was about the decision, what will change based on this work. Why does that one question do so much?" %}
Because a decision gives every later choice a test. Knowing the work feeds a care-coordination hire tells you repeat visitors matter, tells you which columns count, tells you what the four summary sentences should be about, and tells you what to leave out. Without a decision, every cut of the data is equally defensible and none of it is aimed. The request said "whatever you think is most useful." Useful has no meaning until you know what it is for.
{% endq %}

{% q "The director answered the meaning question with a shrug. You tell me what the data can say. What did that answer actually give you?" %}
Permission, and a warning. Permission to propose the framing yourself, which is a normal part of the job and much better discovered now than after a month of work. And a warning that nobody upstream has thought this through, so whatever you propose becomes the plan. When the framing is yours, writing it down and getting a yes on it before doing the work is what protects both of you. That written framing is exactly the brief you produce below.
{% endq %}

{% endcheck %}

{% section "The Concept" %}

### Ask: Framing the Right Question

Every data science project begins not with data but with a question. Before opening any dataset or writing any code, a data scientist needs to understand what problem they are trying to solve, who needs the answer, and whether the data available can actually provide it. This process is called problem framing, and it shapes everything that follows.

A well-framed question is specific, answerable with the data at hand, and useful for making a real decision. Compare these two questions: "Tell me about our patients" versus "Which age groups have the highest rate of follow-up appointments, and does that rate differ by insurance type?" The first is a topic. The second is a data question. It names the population, the measure, the comparison, and the filter. That specificity determines what columns you need, what analysis you run, and what result you deliver.

Problem framing also means understanding the limits of your data before committing to a question. A clinical outpatient dataset that records patient visits, diagnoses, insurance type, copay amounts, and follow-up status can answer many operational questions about visit patterns and access equity. It cannot answer questions about patient outcomes, treatment effectiveness, or long-term health trajectories, because those variables are not present. Knowing what your data cannot do is as important as knowing what it can.

{% concept %}Problem framing turns a business concern into a specific, data-answerable question. A good question names the population, the measure, and the comparison, and it can be answered with the columns actually available in the dataset.{% endconcept %}

{% section "How AI Can Help" %}

AI is a powerful thinking partner in the Ask step. When you describe your dataset and the business situation to an AI tool, it can rapidly suggest multiple exploration angles, raise questions you might not have considered, and help you think through which questions are most likely to be useful to the person who will act on your findings.

AI is particularly useful when you are new to a domain or when the stakeholder has not given you a clear direction. A clinic director who says "I want to understand our patients better" has not given you a question. AI can help you turn that vague request into five candidate questions, each tied to specific columns, so you can have a more productive conversation with the director about what would be most valuable.

AI can also perform a quick feasibility check. If you describe your columns and ask AI whether you can measure patient satisfaction or treatment outcomes, it will correctly tell you that without a satisfaction score or outcome variable in the dataset, those questions cannot be answered from this data alone. That kind of rapid sanity check saves time.

{% aihelps %}AI helps you brainstorm candidate questions, discover angles you might have missed, and quickly check whether a question is answerable with your available columns. It expands the option space so you can choose the most useful direction.{% endaihelps %}

{% section "How to Use AI" %}

The key to using AI well in the Ask step is giving it enough context. AI cannot read your data file or know your organisation. You have to describe the dataset, the business situation, and the intended audience explicitly. The more context you provide, the more relevant the suggestions.

A strong Ask-step prompt gives AI three things: what the dataset contains (column names and their meaning), who will use the findings and for what decision, and a specific request for candidate questions along with the columns each would use. Here is an example based on an outpatient clinic dataset with columns including patient_id, visit_date, icd_description (medical diagnosis), visit_type, gender, age, insurance_type, provider_id, county, copay_amount, and follow_up_required:

{% aiprompt %}I have a dataset from a community outpatient clinic. It records patient visits and includes information about the patient (age, gender, insurance type, county), the visit (date, type, diagnosis, provider), and the outcome (copay amount, whether a follow-up was required). The clinic director wants to understand visit patterns and identify any access or equity concerns. Suggest 5 specific questions I could investigate with this data. For each question, name the columns you would use and explain why the answer would be useful to the clinic.{% endaiprompt %}

Notice the prompt does not just say "give me questions." It describes the data in plain language, states the business goal, names the audience, and asks AI to justify each suggestion by naming the columns it would use. That last requirement forces a useful check: if AI suggests a question that requires a column not in your dataset, it will be unable to name the column, which is a signal to discard that question.

{% section "Evaluating AI Output" %}

After AI suggests questions, you should not simply use whatever it produces. Every suggestion needs to pass three filters before you adopt it.

The first filter is **feasibility**: can the question actually be answered with the columns in your dataset? AI sometimes suggests questions that sound relevant but require data that does not exist. A suggestion like "identify patients who are not receiving recommended screenings" requires a screenings column. If your dataset does not have one, the question is unanswerable and must be set aside.

The second filter is **usefulness**: will the answer help the clinic director make a better decision? A question about the statistical variance of provider IDs may be technically answerable but has no obvious operational value. Prioritise questions where the finding could lead to a concrete action, such as adjusting staffing, changing a scheduling policy, or directing outreach to a specific population.

The third filter is **data quality**: are the columns the question depends on complete and reliable enough to trust? In a dataset where 30 percent of county values are missing, a question about visit patterns by county will produce findings based on incomplete information. That does not mean the question is worthless, but it means the answer must come with a clear caveat about what is missing.

{% aieval %}Filter every AI-suggested question through three tests: Is it answerable with the available columns? Is the answer useful for a real decision? Are the required columns complete and reliable enough to trust the result? AI will not apply these filters itself. That judgment is yours.{% endaieval %}

{% section "Resources" %}

#### Best Practices

{% todo %}{% endtodo %}

#### Learn More

<ul class="learnmore">
<li><a href="https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview" target="_blank" rel="noopener"><strong>Anthropic: Prompt Engineering Overview</strong></a><br><span class="lm-desc">How to write better AI prompts</span></li>
<li><a href="https://platform.openai.com/docs/guides/prompt-engineering" target="_blank" rel="noopener"><strong>OpenAI: Prompt Engineering Guide</strong></a><br><span class="lm-desc">Practical tips with examples</span></li>
<li><a href="https://www.youtube.com/watch?v=71-GucBaM9U" target="_blank" rel="noopener"><strong>YouTube: Framing Research Questions (Scribbr)</strong></a><br><span class="lm-desc">4-minute intro to sharpening a question</span></li>
<li><a href="https://www.coursera.org/professional-certificates/google-data-analytics" target="_blank" rel="noopener"><strong>Google Data Analytics Certificate (free audit)</strong></a><br><span class="lm-desc">Strong foundation for data science beginners</span></li>
</ul>

{% section "Do it for real" %}

The job. Turn the director's email into a brief you could hand back to her, one page at most, and specific enough that she could reply "yes, that" or "no, more like this." Getting that yes before opening any file is the whole move.

What the brief needs:

- **The question.** The director's request, restated as something with an answer. "Which patients account for most of our visits, and how are we serving uninsured patients" has an answer. "Understand what's going on" does not.
- **The audience and the decision.** Who reads this, and what they will do with it.
- **What the data can and cannot answer.** These are visit records. Name two questions records like that can answer, and one thing the director might want that they cannot.
- **What you still need to ask.** Working through the brief probably surfaced more questions. Write the two you would ask the director next.

{% section "How a practitioner did it" %}

{% slot "video", "The practitioner. A vague request from real work, and how they pinned it down before touching anything.", "180px" %}


**Compare their approach to yours.** How did they take the request apart, and where does that differ from how you did? Look for the move they made that you didn't, and the move you made that they skipped. One of those differences usually matters, and the useful sentence to write is which one, and what picking it up would have changed about your brief.

**Compare their brief against yours.** Same email, two briefs. Do they aim at the same question? Does theirs promise anything yours holds back, or hold back anything yours promises? Where the two disagree, decide which version the director is better served by, because that, and only that, is the test a brief answers to.

The framing decides the work. An AI will do whatever you ask with equal confidence, which is exactly why the framing is the part that stays yours.

{% feedback "3", "1" %}
