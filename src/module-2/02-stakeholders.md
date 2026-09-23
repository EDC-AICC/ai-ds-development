---
order: 2
title: Stakeholders, Users, Goals, and Success Criteria
navLabel: Stakeholders and Success
---

{% section "Who Needs to Be Considered?", "who-needs-to-be-considered" %}

You will often hear the word **stakeholder** in workplace data projects. A **stakeholder** is someone who has an interest in the work or may be affected by its outcome. A **user** is the person or group who will actually use the analysis, recommendation, or tool to take an action or make a decision. These roles are not always the same person.

In the grocery-chain example, reducing waste affects more than the executive who requested the project. Inventory managers, data teams, store employees, customers, and food-safety staff may all have different needs and concerns. Review the graphic below to see the different people and roles you may need to consider when framing a data problem, along with the questions and concerns each brings to the work.

{% figure "module2-stakeholders.svg", "Stakeholder types, a question to ask, an example, and what they care about. Decision owner: who can approve or change what happens? Example, Regional Inventory Director. Cares whether ordering, markdown, or other practices should change. Data owner or steward: who manages or defines the data? Example, Retail Data/IT Team. Cares whether the data are valid and terms such as waste are correctly understood. Affected parties: who experiences the real-world effects? Example, customers and store employees. Customers may find empty shelves; employees may face added work or complaints. Risk or compliance owner: who sets limits on what is allowed? Example, food-safety or compliance staff. Cares about food safety, regulations, privacy, and other unacceptable risks. Primary user: who will actually use the analysis or recommendation? Example, Store Inventory Manager. Needs useful recommendations that can be acted on during day-to-day work." %}

{% section "Goals: What Are You Actually Trying to Improve?", "goals" %}

Different stakeholders may define success differently. A project can improve one number and still fail overall. For example, a grocery chain could dramatically reduce produce waste by ordering much less produce. But if customers frequently find empty shelves, that would not be a successful result. A stronger goal might be:

> **Minimize the cost of avoidable produce waste while maintaining the required level of product availability.**

This goal recognizes the needs of more than one stakeholder.

{% section "Defining Success Criteria", "defining-success-criteria" %}

**Success criteria** are measurable conditions that tell you whether the project actually worked. Instead of saying simply, "reduce waste," you need to decide what successful improvement would look like.

| Success Criterion | What It Measures | Example |
|---|---|---|
| **Waste reduction** | Reduction in produce discarded because of spoilage or overstock | At least X% reduction in waste |
| **Waste cost reduction** | Financial value of avoided waste | At least $X in annual savings |
| **Availability maintained** | Whether customers can still find expected products | Stockout rate does not increase by more than X% |
| **Sales maintained** | Whether waste reduction causes lost sales | Produce sales remain within +/- X% of previous sales |
| **Decision adoption** | Whether inventory planners actually use the recommendations | At least X% of eligible recommendations are reviewed or acted upon |
| **Prediction performance** | Whether the analytical system is reliable enough to be useful | Meets an agreed accuracy or reliability target |
| **Operational feasibility** | Whether the recommendations can actually be carried out | Recommendations respect supplier, shelf-life, and ordering limits |

Success criteria should reflect real organizational conditions. A recommendation that cannot reach the user in time to act, for example, may not be useful even if the analysis itself is accurate.

{% section "Try It: Public Transport Reliability", "try-it-public-transport-reliability" %}

{% tryit %}
A metropolitan transit agency wants to improve bus reliability. Leadership asks the data team to analyze on-time performance and recommend where schedules should change. The current metric counts a bus as "on time" if it arrives within an approved time window at selected locations. An AI system might recommend:

- shortening the time buses spend at stops;
- removing lightly used stops; or
- adding more time to the schedule.

Those actions might improve the **on-time percentage** while making the service worse for riders who depend on predictable transfers, use mobility devices, or rely on stops with low average ridership but high individual importance.

### Consider the Stakeholders

| Stakeholder | Primary Goal | Possible Risk |
|---|---|---|
| **Operations director** | Reliable service within budget | Overall averages may hide problems on particular routes. |
| **Dispatchers** | Timely, useful information | Too many alerts may become difficult to manage. |
| **Bus operators** | Realistic schedules and safe operations | Performance measures may unfairly become individual blame. |
| **Riders** | Predictable travel and clear communication | On-time averages may ignore cancellations or buses that pass riders without stopping. |
| **Accessibility advocates** | Reliable, accessible service | A stop with few riders may still be essential to people who need it. |
| **Data and IT teams** | Stable definitions, good data coverage, and reliable systems | Missing data may affect some routes or equipment more than others. |
| **City or regulator** | Equitable and accountable public service | Budget goals may outweigh access needs. |

### Active Learning: Stakeholder, User, Goal, and Success Criterion Activity

{% accordion %}
{% fold "Step 1" %}
Review the stakeholder table. Notice how the goal and risk change depending on whose perspective you consider.
{% endfold %}
{% fold "Step 2" %}
Ask AI to identify:

- stakeholders that may be missing;
- additional stakeholder goals;
- concerns about the current on-time metric; and
- one issue that requires human discussion or negotiation rather than simply more data.

Use the suggested prompt:

> For this public transit reliability problem, generate a stakeholder map that distinguishes decision owners, primary users, affected people, data owners, and oversight groups. For each, list one goal, one concern, and one possible success measure. Then identify where the measures may conflict. Do not assume that improving the current on-time percentage automatically improves the rider experience.
{% endfold %}
{% endaccordion %}

{% callout "checkpoint", "Data Practitioner Audit" %}
Check whether AI:

- focuses mainly on organizational leaders;
- treats all riders as if they have the same needs;
- overlooks accessibility or worker impacts; or
- presents a stakeholder disagreement as if it were simply a technical problem.
{% endcallout %}

### Reflect

- Where do stakeholder goals conflict?
- Which conflict might be helped by better data?
- Which conflict requires a human value, policy, or organizational decision?
{% endtryit %}

{% section "AI Output Critique: The \"Efficient\" Recommendation", "ai-output-critique" %}

Suppose AI recommends: **"To improve on-time performance, remove stops with fewer than 10 daily boardings and limit dwell time at each stop to 30 seconds."** Before accepting the recommendation, consider the questions below. Click each one to reveal a possible answer.

{% q "What stakeholders are missing?" %}
Riders, people with disabilities, bus operators, accessibility advocates, and possibly city or regulatory representatives may need to be considered.
{% endq %}

{% q "What assumptions are built into the 10-rider threshold?" %}
The recommendation assumes that a stop with fewer than 10 daily riders is not important enough to keep. But low ridership does not tell you **who** uses the stop or whether it provides essential access to work, health care, school, or another service.
{% endq %}

{% q "What additional information would you need to understand whether a stop is important?" %}
You might examine when people use the stop, transfer connections, accessibility needs, nearby destinations, alternative transportation, cancellations, and whether particular riders depend heavily on that stop.
{% endq %}

{% q "What parts of this decision should not be delegated to AI?" %}
AI should not decide whose access is important enough to protect or what tradeoff between efficiency, accessibility, cost, and public service is acceptable. Those decisions require human judgment and organizational accountability.
{% endq %}

{% section "Key Takeaways", "key-takeaways" %}

{% callout "takeaways", "Key Takeaways" %}
- Improving a single metric can sometimes make the real-world result worse.
- The primary user, decision owner, and people affected by the work may be different.
- Success criteria should consider multiple stakeholders and should be measurable.
- AI can help identify stakeholders, but it cannot decide **whose needs should govern a conflict**.
{% endcallout %}

### Before You Continue

You now have a clearer problem, know who needs to be considered, and have defined what success might look like. The next question is: **Do you actually have the information you need to solve the problem responsibly?** Having data does not automatically mean you have the **right** data, or that you can appropriately use it.

{% section "Feedback", "feedback" %}

This module is a draft, and what you write here shapes the next revision. A sentence about what confused you, or what worked, is enough.

{% feedback %}
