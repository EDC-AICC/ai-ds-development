---
order: 1
title: Ask
kicker: Module 3 · Part 1
standfirst: >
  Somebody asks you a question. Working out what they actually need, and what would count as an answer, comes before anything you can type.
prev:
  url: /module-3/
  label: Module 3 overview
next:
  url: /module-3/02-explore/
  label: Part 2 · Explore
---

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

{% section "Lessons" %}

### The concept

Every data science project begins with a question. Before you open any dataset or write any code, you need to know what problem you are solving, who needs the answer, and whether the data you have can actually provide it. This is called problem framing.

A well-framed question is specific, answerable, and connected to a decision. Compare these two:

- *"Tell me about our patients."*
- *"Which age groups have the highest rate of follow-up appointments, and does that rate differ by insurance type?"*

The first is a topic. The second names the population, the measure, and the comparison. That specificity determines which columns you need, what analysis you run, and what you deliver. It also tells you what to leave out.

Problem framing also means knowing the limits of your data before you commit to a question. A clinical visit dataset that records diagnoses, insurance type, copay amounts, and follow-up status can answer many operational questions about visit patterns. It cannot answer questions about patient outcomes or long-term health, because those variables are not in it. Knowing what your data cannot do is as important as knowing what it can.

### How AI can help

AI is a useful thinking partner at this stage. When you describe your dataset and the business situation, it can quickly suggest multiple directions, surface angles you have not considered, and help you check whether a question is actually answerable with the columns you have.

If you describe the clinic dataset columns and ask AI whether you can measure patient satisfaction, it will correctly tell you there is no satisfaction column. That sanity check takes ten seconds and saves a significant amount of time. AI is also useful when the stakeholder has not given you clear direction. A director who says "understand our patients better" has not given you a question. AI can help you turn that vague request into a list of candidate questions, each tied to specific columns, so you can have a more focused conversation.

### How to use AI

The key is giving AI enough context. It cannot read your data file or know your organisation. You have to describe the dataset, the business situation, and the intended audience explicitly.

A strong prompt at this stage gives AI three things: what the dataset contains, who will use the findings and for what decision, and a request for candidate questions that includes which columns each would require.

<pre class="prompt">I have a dataset from a community outpatient clinic. It records patient
visits and includes: patient identifiers, visit dates, medical diagnosis
codes and descriptions, visit type (Office Visit, Telehealth, Follow-Up,
Urgent Care), patient gender, age, insurance type (Medicaid, Medicare,
Private, Uninsured), provider ID, county, copay amount, and whether a
follow-up was required.

The clinic director wants to understand visit patterns and identify access
or equity concerns before a board meeting. Suggest 5 specific questions I
could investigate with this data. For each question, name the columns you
would use and explain why the answer would be useful to the director.</pre>

Asking AI to name the columns for each suggestion forces a feasibility check. If AI proposes a question that requires a column that does not exist in your dataset, it will be unable to name one — that is your signal to discard it.

### Evaluating AI output

After AI suggests questions, run every suggestion through three filters before adopting it.

**Is it answerable?** AI sometimes suggests questions that require data not in your dataset. Questions about patient satisfaction or treatment outcomes need columns a clinic visit file does not have. Those questions must be set aside.

**Is it useful?** A question about the statistical distribution of provider IDs may be technically answerable but has no obvious value to the director. Prioritise questions where the finding could lead to a concrete action.

**Are the required columns reliable?** In a dataset where 30 percent of county values are missing, a question that depends heavily on county will produce findings based on incomplete information. The question is not worthless, but the answer will need a clear caveat.

AI will not apply these filters itself. That judgment is yours.

### Best practices

**Write your own question first.** Before prompting AI, write down the one question you think matters most. Then compare it to what AI suggests. Your question benefits from context and organisational knowledge that AI does not have.

**Treat AI suggestions as a menu, not a mandate.** AI generates options. You choose the question that best serves the analysis goal.

**Confirm with the stakeholder before starting.** Once you have narrowed to one or two questions, check with the person who will use the findings. A question that seems analytically interesting may not be what they actually need.

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
