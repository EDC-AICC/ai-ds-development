---
order: 4
title: AI-Assisted Framing and Human Judgment
navLabel: AI-Assisted Framing
---

{% section "AI as a Question Generator and Critical Reviewer", "ai-as-question-generator" %}

AI can be useful during problem framing. It can generate questions, organize issues, compare possibilities, and challenge assumptions. But it cannot decide:

- which tradeoffs are acceptable;
- whether a problem is worth solving;
- whose priorities should matter most; or
- which decisions people should delegate to an automated system.

In this final activity, you will use AI as a **question generator and critical reviewer**, while you remain responsible for the decisions.

{% section "Final Activity: Regional Parcel Delivery Network", "final-activity-regional-parcel-delivery-network" %}

{% tryit %}
### The Workplace Request

A regional parcel-delivery company has experienced a decline in on-time delivery during busy seasonal periods. The chief operating officer asks the data team to: **"Build an AI system that predicts late deliveries and tells dispatchers what to do."** Dispatch supervisors may be able to reroute work, shift packages between vehicles, contact customers, or prioritize facility processing. But the actions they are actually allowed to take, and when they can take them, have not yet been confirmed.

### What You Know So Far

| Area | Available Information |
|---|---|
| **Package and scan events** | Package ID, service level, promised delivery window, facility scans, timestamps |
| **Route and facility operations** | Planned route, actual sequence, facility volume, departure time, backlog |
| **Location and outside conditions** | Available GPS information, traffic estimates, weather |
| **Workforce and shifts** | Shift schedules and staffing levels; the project may not rank individual drivers |
| **Customer service information** | Delivery instructions, complaints, addresses, and location details are sensitive information |

### Known Constraints and Open Questions

- The pilot must cover two sites and begin within eight weeks.
- Dispatchers can review no more than six active alerts at one time.
- GPS coverage is incomplete on rural routes.
- Workforce policy prohibits using the tool to rank individual driver performance.
- Customer addresses and detailed location histories require strict access controls.
- An alert must arrive early enough for a dispatcher to take an approved action.
- False alerts can create unnecessary rerouting, additional workload, fuel costs, and customer confusion.
- The meaning of "late" varies by service level and exception code.
{% endtryit %}

{% section "Activity Tasks", "activity-tasks" %}

Work through the four phases in order. The Problem Framing Canvas is in [Appendix A](#appendix-a-problem-framing-canvas) and the three prompts are in the [AI Prompt Sequence](#ai-prompt-sequence).

{% accordion %}
{% fold "Phase 1: Create Your Own Draft (10 Minutes)" %}
Without using AI, complete the first six sections of the **Problem Framing Canvas**.

If you do not know something, **mark it as unknown**. Do not invent information just to complete the form.
{% endfold %}
{% fold "Phase 2: Generate Clarifying Questions With AI (10 Minutes)" %}
Use **Prompt A** to generate additional questions. Review the questions and decide which ones matter most.
{% endfold %}
{% fold "Phase 3: Challenge Your Assumptions (10 Minutes)" %}
Use **Prompt B** to identify assumptions, missing context, and possible harms.
{% endfold %}
{% fold "Phase 4: Review, Critique, and Revise (15 Minutes)" %}
Use **Prompt C** to review the feasibility of your framing, your measures of success, and your guardrails.

Then complete the remaining sections of the Problem Framing Canvas.
{% endfold %}
{% endaccordion %}

### Data Practitioner Review Protocol

When you review your own or someone else's problem framing, use four steps:

| Step | Ask Yourself |
|---|---|
| **Clarify** | What statement, term, measure, or stakeholder role is still unclear? |
| **Value** | What part of the framing is especially useful or well supported? |
| **Concern** | What important context, assumption, risk, or tradeoff is missing? |
| **Suggest** | What specific revision or validation step would make the framing stronger? |

{% section "AI Prompt Sequence", "ai-prompt-sequence" %}

{% accordion %}
{% fold "Prompt A: Clarifying Questions" %}
> Act as a skeptical data practitioner lead. For the parcel-delivery problem statement [insert your statement], ask the questions that must be answered before data project work begins. Do not recommend a model or write code.
>
> Organize the questions by:
>
> - decision and action;
> - users and stakeholders;
> - definitions and scope;
> - data and context;
> - success criteria; and
> - constraints and risk.
>
> Identify the five questions that could most change the direction of the project, but make clear that the data team and stakeholders must confirm their priority.

{% callout "checkpoint", "Audit Reminder" %}
Reject questions that are generic, repeated, based on invented facts, or jump too quickly to a solution.

Add locally important questions that AI missed.
{% endcallout %}
{% endfold %}
{% fold "Prompt B: Assumption Challenger" %}
> Using the draft problem-framing statement, list every assumption you can identify. For each assumption, explain what could go wrong if it is false and suggest a practical way to verify it with a stakeholder, documentation, or a small data check. Separate assumptions about data, workflow, people, policy, and outside conditions.

{% callout "checkpoint", "Audit Reminder" %}
AI may invent policies or workflows that are not actually part of the scenario.

Treat those as **possibilities to investigate**, not as facts.
{% endcallout %}
{% endfold %}
{% fold "Prompt C: Review the Problem Framing Statement" %}
> Using the draft problem-framing statement, look for:
>
> - jumping too quickly to a solution;
> - unclear definitions;
> - missing stakeholders;
> - data that may not be usable;
> - unrealistic workflow assumptions;
> - weak measures of success;
> - missing guardrails; and
> - decisions being given to AI without appropriate authority.
>
> Return the three most serious issues and one low-cost validation step for each.

{% callout "checkpoint", "Audit Reminder" %}
AI criticism can also be wrong or overly general.

Keep only issues that are supported by the scenario or are important enough to verify with a specific stakeholder.
{% endcallout %}
{% endfold %}
{% endaccordion %}

{% section "Example Draft Problem Framing Statement", "example-draft-problem-framing-statement" %}

A draft statement for this scenario might be:

> For dispatch supervisors at two pilot facilities, identify in-progress routes or packages at high risk of missing the correct customer promise window early enough for an approved operational action. The pilot will examine scan locations and timestamps, in-progress delivery routes, package identifiers, facility load, weather, traffic, and available GPS data.
>
> Success will be evaluated by improvement in on-time delivery and dispatcher usefulness, with guardrails for alert volume, privacy, and the prohibition on driver ranking. Before prediction work begins, the data team will validate exception codes, GPS coverage, alert timing, and which interventions are feasible.

Notice what this statement **does not do**.

It does not decide which AI model or technical solution should be used.

The problem comes first. The technical approach comes later.

### Decisions You Should Not Delegate to AI

AI can help you think through a problem, but people must remain responsible for decisions such as:

- whether reducing late deliveries is the right priority compared with safety, employee workload, cost, or customer communication;
- which stakeholders have authority and which affected groups need to be consulted;
- what balance between false alerts and missed alerts is acceptable;
- whether using location, workforce, or customer data is appropriate and permitted;
- whether an intervention is fair, practical, and consistent with policy;
- whether the expected benefits justify the cost and effort required to implement and monitor the system; and
- who is responsible for approving, overriding, monitoring, and eventually stopping use of the solution.

{% section "Final Deliverable: Problem Framing Brief", "final-deliverable-problem-framing-brief" %}

{% assignment "Problem Framing Brief" %}
To complete this module, you will create a **one-page Problem Framing Brief**.

Your brief should be understandable to a **nontechnical decision-maker** and specific enough to guide the next stage of the data work. You will also submit:

- a short **AI Use Record** (see [Appendix B](#appendix-b-ai-question-and-recommendation-audit)); and
- your responses to the reflection questions below.

**Your Problem Framing Brief Should Include:**

- the organizational question and why it matters;
- the decision the work needs to support;
- the primary user and when they need to act;
- important stakeholders and affected groups;
- unresolved conflicts among stakeholder goals;
- a clear data problem statement that does not choose a solution too early;
- the scope and important definitions;
- measurable success criteria;
- data needed, available data, contextual information, and important gaps;
- organizational, user, ethical, data, and technical constraints;
- assumptions and a practical plan for checking them;
- appropriate roles for AI and decisions that must remain with people; and
- the first validation step you recommend before analysis or modeling begins.
{% endassignment %}

{% assignment "Reflection" %}
Respond briefly to each question.

**1. AI Contribution**

What is one question generated by AI that meaningfully improved your problem framing? Why was it useful?

**2. AI Limitation**

What is one AI suggestion that you rejected, revised, or left unverified? Why?

**3. Human Decision**

What is one decision in this activity that must remain with you and other people rather than being delegated to AI?

**4. Assumption Check**

What is one important assumption you would verify before beginning the data analysis?
{% endassignment %}

{% section "Coming Next: Module 3", "coming-next-module-3" %}

In this module, you framed the problem and identified the context you need before beginning analysis. In **Module 3: Understanding, Exploring, Preparing, Analyzing, and Sharing Data with AI**, you will carry that work forward into the data itself. Your Problem Framing Brief will help you understand what the data are supposed to represent, what questions you are trying to answer, what limitations to watch for, and what your audience will ultimately need from the results. The next step is to **explore, prepare, analyze, and share the data while continuing to verify the work AI helps you produce**.

{% section "Appendix A: Problem Framing Canvas", "appendix-a-problem-framing-canvas" %}

**Use concise notes. Mark unknown information clearly. Do not invent information just to make the canvas look complete.**

| Framing Element | Questions to Guide Your Thinking |
|---|---|
| **1. Organizational concern** | What is happening? Why does it matter now? |
| **2. Decision and action** | What decision could change? What actions are actually available? When must the decision be made? |
| **3. Decision owner and primary user** | Who has authority to approve the action? Who will use the output during actual work? |
| **4. Affected stakeholders** | Who may experience benefits, burdens, errors, or changes even if they never use the tool? |
| **5. Problem statement** | **[User/Decision Owner] needs to [take an action/make a decision] for [scope], subject to [constraints and policies], with success measured by [outcome/target], so that [organizational benefit], requiring [data, definitions, timing, and context].** |
| **6. Definitions and scope** | What do important terms mean? What is included or excluded? What is the unit of analysis? What time period matters? |
| **7. Success criteria** | What outcome, usefulness, or adoption measures would show that the work has value? |
| **8. Guardrails** | What must not get worse? What errors, inequities, privacy harms, workload issues, or safety risks are unacceptable? |
| **9. Data and context** | What data are needed, available, and usable? What policy, workflow, outside, or field-specific context is required? |
| **10. Constraints and risks** | What organizational, user, data, technical, ethical, policy, timing, budget, or capacity limits need to be considered? |
| **11. Assumptions and verification** | What are you assuming? How will you check the assumptions that could have the greatest impact? |
| **12. AI and human roles** | Where can AI assist? What must people decide, verify, approve, monitor, or own? |

{% section "Appendix B: AI Question and Recommendation Audit", "appendix-b-ai-question-and-recommendation-audit" %}

Use this table to make your judgment about AI-generated ideas visible.

Possible categories include:

- **Essential Now**
- **Useful Later**
- **Premature or Solution-Jumping**
- **Unsupported Assumption**
- **Inappropriate or Unsafe**
- **Needs Stakeholder Verification**

| AI Question or Recommendation | Category | Why Did You Make This Judgment? | Action: Accept / Revise / Reject / Verify |
|---|---|---|---|
| | | | |
| | | | |
| | | | |

### AI Use Record

| Reflection Element | Your Notes |
|---|---|
| **Purpose for using AI** | What thinking task did you ask AI to help with? |
| **Prompt changes** | How did you change your prompt to add context or avoid jumping too quickly to a solution? |
| **Most valuable contribution** | What did AI identify that you had not considered? |
| **Most important limitation** | Where was AI too general, incorrect, incomplete, biased, or based on an invented assumption? |
| **Human decision** | What did you decide, and what evidence or stakeholder input supported your decision? |

{% section "Feedback", "feedback" %}

This module is a draft, and what you write here shapes the next revision. A sentence about what confused you, or what worked, is enough.

{% feedback %}
