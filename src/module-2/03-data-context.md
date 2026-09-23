---
order: 3
title: Data, Context, Constraints, Assumptions, and Risk
navLabel: Data, Constraints, and Risk
---

{% section "Needed, Available, and Usable Data Are Not the Same Thing", "needed-available-usable" %}

It is easy to create a wish list of information that would be helpful. Real data work requires you to distinguish between what you **would like to have** and what you can actually use. Review the graphic below to see the difference between data you need, data you have available, data you can actually use, and the additional context you may need to understand the problem correctly.

{% figure "module2-needed-data.svg", "Four categories with what each means and an important caution. Data needed: information that would ideally help answer the question. Caution: it may not exist, may be too expensive to collect, or may be inappropriate to collect. Data available: information the organization currently stores or can access. Caution: available data may still have unclear definitions, poor quality, incomplete coverage, or restrictions on use. Data usable: data that are accurate enough, timely, relevant, understandable, and permitted for this purpose. Caution: you need to confirm usability with people who understand the data and the work. Contextual information: policies, workflows, incentives, outside events, coding conventions, and other real-world conditions. Caution: important context may exist in documentation, other systems, or in the knowledge of people rather than in the dataset itself." %}

{% section "Know What Your Data Mean", "know-what-your-data-mean" %}

Before you use organizational data, you need to understand:

- what each field represents;
- whether definitions are clear;
- whether the data are complete and accurate enough;
- whether they are current enough for the decision; and
- whether you have permission to use them for this purpose.

Consider this example:

| Column | Data Type | Description | Example |
|---|---|---|---|
| **Customer ID** | Text | Anonymous identifier for each customer | C1042 |
| **Contract Start Date** | Text | Start date in YYYY-MM-DD format | 2015-12-31 |
| **Contract End Date** | Text | End date in YYYY-MM-DD format; 1970-01-01 is used for an existing customer | 1970-01-01 |
| **Contract Length** | Text | Monthly or Annual | Annual |
| **Contract Price** | Number | Contract price amount | 199.50 |

Look closely at **Contract Price**.

What does 199.50 mean? US dollars? Euros? Canadian dollars? The dataset does not tell you. Before using that field, you need to resolve the missing context.

### Check Data Quality

You should also examine basic data quality.

| Data Quality Issue | Example |
|---|---|
| **Accuracy** | A contract price contains an impossible or unrealistic value, such as a negative number. |
| **Completeness** | An important value, such as Contract Start Date, is missing. |
| **Consistency** | The same idea is recorded in different ways, such as Annual and Yearly in the Contract Length field. |

### Where AI Can Help, and Where You Need to Decide

**AI Can Help You:**

- draft preliminary data definitions;
- generate code to check data accuracy, validity, and completeness; and
- suggest other places where useful information might exist.

**You Still Need To:**

- check whether AI's work is correct;
- confirm what local data actually mean; and
- resolve unclear definitions or conflicts with people who understand the data and the organization.

{% section "Constraints, Assumptions, and Risks", "constraints-assumptions-and-risks" %}

Before choosing an approach, you also need to know whether the project can actually work in practice. Three useful concepts are **constraints, assumptions, and risks**, as explained in the graphic below.

{% figure "module2-constraint-assumption-risk.svg", "Three definitions with examples. Constraint: a known boundary or condition the project must respect. Example: the customer-retention team can review no more than 5,000 accounts each week. Assumption: something you are currently treating as true but have not yet verified. Example: a Contract End Date of 2030-01-01 means the account is still active. Risk: something that might happen or go wrong and could reduce success or cause harm. Example: outreach could be sent to customers who did not agree to receive marketing messages." %}

### Where AI Can Help With Constraints, Assumptions, and Risks

AI can help you:

- brainstorm constraints or risks you may have overlooked;
- turn vague assumptions into questions you can investigate;
- organize a risk and feasibility checklist;
- suggest ways to validate information; and
- generate possible scenarios for the team to consider.

But you still need to:

- verify local facts with the people who own or understand the data;
- interpret policies and permissions;
- decide which tradeoffs are acceptable;
- determine who is accountable; and
- change or stop a project if evidence shows that it is not practical, appropriate, or ethical.

{% section "Try It: Subscription Renewal Outreach", "try-it-subscription-renewal-outreach" %}

{% tryit %}
A streaming company asks its data team to identify subscribers who may not renew within the next 30 days so the customer-retention team can decide who to contact. Available data include:

- customer and contract identifiers;
- contract dates;
- contract length;
- price; and
- viewing activity.

The retention team can review only **5,000 accounts each week**, and any outreach must follow consent, privacy, and customer-contact policies. Before choosing an analytical approach, you need to separate what you **know** from what you only **think you know**.

{% accordion %}
{% fold "Step 1: Work Without AI" %}
Identify:

- one **data question**;
- one **constraint**;
- one **assumption**; and
- one **risk**.
{% endfold %}
{% fold "Step 2: Plan How to Verify Your Assumption" %}
For the assumption you identified:

- How would you check whether it is true?
- What would change if it turns out to be false?
{% endfold %}
{% fold "Step 3: Use AI to Expand Your List" %}
Use the prompt below.

> Act as a skeptical data practitioner reviewing a proposed subscription-renewal outreach project. Using only the scenario information provided [insert scenario], create a preliminary list with four categories: data or context needed, constraints, assumptions, and risks.
>
> For each item, explain why it matters and how it could be verified or addressed. Clearly label anything that cannot be known from the scenario. Do not invent company policies, data fields, thresholds, or legal conclusions. Do not recommend a model or write code.
{% endfold %}
{% fold "Step 4: Audit the AI Output" %}
Label each AI suggestion:

- **New and Useful**
- **Duplicate**
- **Unsupported**
- **Not Relevant**

Then choose the **three issues that should be resolved first** and explain why.
{% endfold %}
{% endaccordion %}

{% callout "checkpoint", "Data Practitioner Audit" %}
Check whether AI:

- treats an assumption as if it were a fact;
- treats a policy as something that can simply be ignored or changed;
- recommends collecting unnecessary personal information; or
- presents something as certain without evidence.

Keep only items that are relevant and can be verified.
{% endcallout %}
{% endtryit %}

{% section "AI Output Critique: The Confident Recommendation", "ai-output-critique" %}

Suppose AI says: **"Customers with fewer than five viewing hours in the past 30 days should automatically receive a discount offer. Because the dataset includes contract dates and viewing history, no additional validation is needed."**

Consider the questions below. Click each one to reveal a possible answer.

{% q "What unsupported assumptions appear in this recommendation?" %}
The recommendation assumes that watching fewer than five hours means a customer is likely to cancel. It also assumes that a discount would be useful and that five hours is an appropriate cutoff. None of those claims has been established.
{% endq %}

{% q "What constraints or permissions are missing?" %}
The recommendation ignores customer consent, privacy and contact policies, and the team's limit of reviewing 5,000 accounts per week.
{% endq %}

{% q "What risks could automatic outreach create?" %}
The company could contact people who did not consent to marketing, unnecessarily discount subscriptions for customers who planned to stay anyway, annoy customers with unwanted messages, or unfairly target particular groups.
{% endq %}

{% q "What evidence would you need before deciding whether viewing hours are useful for this purpose?" %}
You would need to investigate whether viewing activity is actually related to renewal behavior, whether the relationship differs among customer groups, whether the data are accurate and current, and whether customer outreach based on this information is permitted and useful.
{% endq %}

The key warning sign is the statement **"no additional validation is needed."** AI should not decide that for you.

{% section "Key Takeaways", "key-takeaways" %}

{% callout "takeaways", "Key Takeaways" %}
- Having data does not mean the data are appropriate or usable.
- You need to check definitions, quality, timing, relevance, and permission.
- Important context may exist outside the dataset.
- Constraints are boundaries, assumptions are unverified beliefs, and risks are possible problems or harmful outcomes.
- AI can help create a checklist, but it cannot verify local meaning, permissions, or whether the project will work in practice.
{% endcallout %}

### Before You Continue

You now have the major pieces of problem framing:

- the organizational question;
- the decision and user;
- stakeholders;
- goals and success criteria;
- data and context;
- constraints;
- assumptions; and
- risks.

In the final part of the module, you will bring those pieces together into one complete problem-framing activity.

{% section "Feedback", "feedback" %}

This module is a draft, and what you write here shapes the next revision. A sentence about what confused you, or what worked, is enough.

{% feedback %}
