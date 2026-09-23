---
order: 1
title: From a Workplace Request to a Clear Data Problem
navLabel: Workplace Request
---

{% section "Start With the Problem, Not the Technology", "start-with-the-problem" %}

Effective data work starts by understanding the problem, not by choosing a technology, model, or analysis technique. In this section, you will practice turning a workplace request or concern into a data problem that is specific enough to guide the work.

A well-framed problem connects:

- what the organization is concerned about;
- what decision or action could change;
- who will use the results;
- who may be affected;
- what information is needed;
- what success would look like; and
- what should **not** get worse as a result.

The goal is not to decide on a technical solution yet. First, you need to understand the problem.

{% section "The Problem Framing Process", "the-problem-framing-process" %}

To help understand your problem, you need to frame it by asking yourself a series of important questions. Click each of the Framing Steps below to see the question you must ask yourself about the context.

{% accordion %}
{% fold "Organizational concern" %}
What is happening, and why does the organization care?
{% endfold %}
{% fold "Decision or action" %}
What decision or action could change because of the data work?
{% endfold %}
{% fold "User and stakeholders" %}
Who will use the result, who owns the decision, and who may be affected?
{% endfold %}
{% fold "Analytical question and outcomes" %}
What needs to be described, explained, predicted, evaluated, or modeled?
{% endfold %}
{% fold "Evidence and context" %}
What data, definitions, policies, and outside information are needed?
{% endfold %}
{% fold "Success and guardrails" %}
How will success be measured, and what harm or unwanted tradeoff must not increase?
{% endfold %}
{% endaccordion %}

{% iconbox "guardrail-icon.png" %}
A **guardrail** is a limit or condition that helps prevent an unwanted outcome. For example, reducing grocery-store waste may be a goal, but increasing empty shelves would be an important guardrail to avoid.
{% endiconbox %}

{% section "A Problem Framing Statement", "a-problem-framing-statement" %}

You can use this structure to help organize what you know:

> **[User/Decision Owner] needs to [take an action/make a decision] for [scope], subject to [constraints and policies], with success measured by [outcome/target], so that [organizational benefit], requiring [data, definitions, timing, and context].**

### Example

> The marketing team needs to identify and re-engage customers who are at risk of canceling their subscriptions across active paid accounts, subject to budget and privacy limits, with success measured by a 15% reduction in cancellations during the quarter, so that recurring revenue increases, requiring customer viewing history, billing records, and a clear definition of when a customer is considered to have canceled.

{% tip %}
In business and data work, you may hear customer cancellations referred to as **customer churn**.
{% endtip %}

{% section "See It in Practice: Regional Grocery Chain", "see-it-in-practice-regional-grocery-chain" %}

A 60-store grocery chain is losing money because produce is being discarded when it spoils. The chief operating officer asks the analytics team to: **"Use AI to reduce produce waste."** At the same time, store employees report that previous attempts to reduce waste have sometimes resulted in empty shelves and customer complaints.

### Think First: Which Request Is Best Framed?

Consider these three requests.

{% accordion %}
{% fold "Request A" %}
**"Why are we throwing away so much food?"**
{% endfold %}
{% fold "Request B" %}
**"Use AI to reduce produce waste."**
{% endfold %}
{% fold "Request C" %}
**"For inventory planners, identify perishable store-product combinations likely to spoil during the next two weeks so order quantities can be adjusted without increasing out-of-stock products."**
{% endfold %}
{% endaccordion %}

**Which request gives the data team the clearest starting point? Why?**

{% q "Reveal a Possible Answer" %}
**Request C is the best starting point.**

It identifies:

- **who** will use the results: inventory planners;
- **what action** may change: order quantities;
- **what is in scope:** perishable products at particular stores;
- **when the information is needed:** within the next two weeks; and
- an important **guardrail:** reducing spoilage without increasing out-of-stock products.

It is still not complete. You would need to ask additional questions about the data, definitions, constraints, and measures of success before beginning the analysis.
{% endq %}

{% section "Asking the Right Questions", "asking-the-right-questions" %}

When you receive a broad request such as "use AI to reduce produce waste," your first job is often to ask questions. Click on each Area to Clarify below to read critical questions to ask yourself about the context of the request.

{% accordion %}
{% fold "Decision or action" %}
What specific decision should improve? Does this involve ordering, pricing, restocking, markdowns, transfers, donations, or something else?
{% endfold %}
{% fold "Users and decision owners" %}
Who makes the decision? Who will actually use the results?
{% endfold %}
{% fold "Scope" %}
Which stores, regions, products, or categories are included? What is outside the project?
{% endfold %}
{% fold "Outcome" %}
What should the data work produce or help improve?
{% endfold %}
{% fold "Timing" %}
When must the information be available for someone to act on it?
{% endfold %}
{% fold "Data and context" %}
What information exists about inventory, sales, orders, deliveries, spoilage, shelf life, prices, promotions, weather, or other relevant conditions?
{% endfold %}
{% fold "Constraints and thresholds" %}
What limits must the work respect, such as shelf capacity, supplier minimums, delivery schedules, or freshness requirements?
{% endfold %}
{% fold "Success and guardrails" %}
How will you know the project helped? What must not get worse while you improve the main outcome?
{% endfold %}
{% endaccordion %}

These questions help you understand the work **before** you commit to a technical solution.

{% section "Where AI Can Help, and Where You Need to Decide", "where-ai-can-help" %}

Review the graphic below to see where AI can support problem framing and *where your own judgment, organizational knowledge, and accountability are still essential*.

{% figure "module2-ai-help-vs-human.svg", "Two columns. AI can help you: generate possible clarifying questions; organize questions by stakeholder or category; suggest common types of data that may be useful; identify areas where information may be missing. You still need to: decide which questions matter most; interpret organizational policies and local definitions; determine whether those data actually exist and can appropriately be used; negotiate tradeoffs, determine acceptable risks, and remain accountable for the work." %}

The message to keep in mind is that AI can help you **widen the set of questions you consider**, but it cannot tell you which questions your organization should prioritize.

{% section "Draft Problem Framing Statement", "draft-problem-framing-statement" %}

After asking clarifying questions, the grocery-store problem might begin to look like this:

> For grocery store planners, identify store-produce-week combinations that are at high risk of spoiling during the next 14 days so planners can adjust order quantities or markdown timing. Evaluate the pilot by reduction in spoilage cost, while guarding against increased stockouts, excessive manual review, or uneven performance across stores. Before choosing an analytical approach, validate the definition of waste, inventory accuracy, supplier lead-time rules, and which actions planners can actually take.

This is still a **draft**.

Before the data work begins, you would need to validate it with the people who will use the results and others who may be affected by the project.

{% section "Try It: Generate Questions", "try-it-generate-questions" %}

{% tryit %}
Now you will practice framing a workplace problem yourself.

{% accordion %}
{% fold "Step 1: Choose One Workplace Request" %}
Choose one:

{% figure "module2-workplace-requests.svg", "Three workplace requests. A streaming company wants to reduce the number of customers who cancel their subscriptions. A manufacturer wants to reduce unexpected machine downtime. A hospital network wants to reduce missed outpatient appointments." %}
{% endfold %}
{% fold "Step 2: Think Without AI First" %}
Use a pen and paper to jot down **three questions** that you believe need to be answered before you could create a draft problem statement. **Do this before asking AI.**
{% endfold %}
{% fold "Step 3: Ask AI for Additional Questions" %}
Next, use the prompt below to interact with AI:

> Act as a skeptical data analytics team member. The organizational request is: [paste request]. Do not recommend a model or write code. Ask the questions a data practitioner must answer before generating a draft problem statement.
>
> A well-defined problem statement should loosely follow this template: [User/Decision Owner] needs to [take an action/make a decision] for [scope], subject to [constraints and policies], with success measured by [outcome/target], so that [organizational benefit], requiring [data, definitions, timing, and context].
>
> Organize the questions under: Essential, Useful Later, Premature/Solution-Jumping, and Unsupported/Unverifiable. Put the questions in priority order and briefly explain why each matters.

{% tip %}
**Solution-jumping** means moving too quickly to a particular tool or solution before you fully understand the problem.
{% endtip %}
{% endfold %}
{% fold "Step 4: Audit the AI's Questions" %}
Do not assume AI's priorities are correct. Decide which questions **you** would use and why.
{% endfold %}
{% endaccordion %}

### Reflect

- Did an AI-generated question make you think about something you had missed?
- Did any AI question sound useful but depend on an assumption that was not supported by the scenario?
{% endtryit %}

{% section "Key Takeaways", "key-takeaways" %}

{% callout "takeaways", "Key Takeaways" %}
- A workplace request is not the same as a well-framed data problem.
- A strong data problem connects the concern, action, user, outcome, and measures of success.
- You should validate a draft problem with the people who will use the results and those affected by the work.
- AI can help generate questions, but **you must decide which questions actually matter**.
{% endcallout %}

### Before You Continue

Framing the problem is an important first step, but you cannot do it well without understanding **the people involved**. Different people may use the results, approve decisions, manage the data, or experience the consequences of what you recommend. Next, you will look more closely at those different roles.

{% section "Feedback", "feedback" %}

This module is a draft, and what you write here shapes the next revision. A sentence about what confused you, or what worked, is enough.

{% feedback %}
