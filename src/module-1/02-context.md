---
order: 2
title: "Context Is King: Business, Organization, and Users"
navLabel: Context Is King
---

{% section "Concept in Depth: The Gap Between Math and Reality", "concept-in-depth-the-gap-between-math-and-reality" %}

Code and statistical models that are syntactically correct can still be completely wrong, and potentially harmful, for an organizational problem. You need to understand stakeholder constraints, operational realities, and user contexts. If these are ignored, you can end up with a model that does not adequately represent organizational needs. AI can identify statistical patterns and generate technical solutions. **You must supply and investigate the organizational, operational, and human context needed to determine whether the insight actually solves the right problem safely.**

{% section "Concrete Industry Example: Healthcare Readmission Rates", "concrete-industry-example-healthcare-readmission-rates" %}

To explore how organizational context alters data interpretation, imagine that you work in a hospital system analytics department.

### The Prompt

A hospital administrator asks an AI data assistant:

> "Analyze patient readmissions across our database and identify the top risk factor predicting whether a patient will be readmitted within 30 days."

### The AI Output

The model analyzes Electronic Health Record, or EHR, tables, executes a feature-importance script, and identifies:

**Total length of prior hospital stay**

as the primary predictor.

### The Contextual Problem

From a strict statistical perspective, the correlation may be accurate; however, in this scenario, the organizational context reveals that hospital policy sometimes results in extended stays for low-income or uninsured patients who lack safe home-care infrastructure or reliable transportation. Length of stay may therefore be acting as a proxy for vulnerability and lack of support rather than representing a direct clinical failure.

### The Human Practitioner's Intervention

Blindly trusting the AI output could lead management to penalize units with longer stays or pressure staff to discharge vulnerable patients prematurely, introducing serious ethical, operational, and patient-care risks. It could also conflict with hospital policies designed to protect vulnerable populations.

The mathematical relationship may be real.

**What that relationship means requires organizational and human context.**

{% section "Quick Context Challenge 1: The \"Efficient\" Call Center", "quick-context-challenge-1-the-efficient-call-center" %}

### The Scenario

A telecom company wants to improve customer service. It asks AI to analyze call-center data and identify the behavior most strongly correlated with high daily performance scores.

### The AI Output

AI discovers that representatives who keep their average call time under two minutes handle the highest volume of tickets and receive the best automated efficiency ratings.

It recommends mandating a strict two-minute limit for all customer-support calls.

### The Missing Context

AI does not know why the calls are short or understand the problems being solved. Calls may include complex technical problems, frustrated customers, or people who need additional assistance.

If employees chase only the efficiency metric, they may rush difficult calls to keep average call time down.

### The Business Harm

The spreadsheet can look flawless and "efficient" while actual customer satisfaction declines and genuine customer problems go unresolved.

### Consider

{% q "What important human or customer-service measure is missing from the dataset?" %}
**Possible answer:** The analysis measures how many calls representatives handle and how quickly they complete them, but it does not tell you whether customers actually got the help they needed. Important measures could include whether the customer's problem was resolved, customer satisfaction, the number of repeat calls about the same issue, or the complexity of the customer's problem.

A two-minute call might be efficient if the customer's question is simple. But for a complicated technical problem, a longer call may provide much better service.
{% endq %}

{% q "How would you change the request or analysis to protect the customer experience?" %}
**Possible answer:** Instead of asking AI to identify the behavior associated only with high efficiency scores, you could ask it to consider multiple measures of successful customer service, such as:

- whether the problem was resolved;
- customer satisfaction;
- repeat contacts about the same problem;
- the complexity or type of call; and
- call duration.

You could also compare call times **within similar types of customer problems** rather than assuming that shorter calls are always better.

For example, you might revise the request to ask:

> **Analyze which factors are associated with effective customer service, considering call duration, customer satisfaction, problem resolution, repeat contacts, and differences in call complexity. Identify any trade-offs between efficiency and service quality.**
{% endq %}

{% section "Quick Context Challenge 2: The \"Flawless\" Sales Strategy", "quick-context-challenge-2-the-flawless-sales-strategy" %}

### The Scenario

A national hardware retailer asks AI to analyze regional sales data to determine where it can reduce its marketing budget.

### The AI Output

AI identifies a 300% spike in plywood and generator sales in one coastal region. Because sales appear to be exceptionally strong without additional marketing, AI recommends cutting the region's marketing budget.

### The Missing Context

The analysis does not include an important external event: a Category 4 hurricane is approaching the coast, driving temporary demand.

### The Business Harm

The sales spike is a one-time anomaly, not necessarily evidence of a permanent trend.

### Consider

{% q "How does external world knowledge, such as weather or current events, change the way you interpret a mathematical spike in a database?" %}
**Possible answer:** External knowledge can help you determine why a pattern appears in the data. In this example, the 300% increase in plywood and generator sales looks like a sign of unusually strong demand. But knowing that a major hurricane is approaching changes the interpretation: the spike is likely a **temporary response to an unusual event**, not evidence of a lasting change in customer behavior. Without that context, you could make a poor business decision based on a pattern that is mathematically real but misleading when interpreted on its own.

Before acting on an unusual spike or drop in data, consider whether weather, current events, policy changes, holidays, emergencies, economic conditions, or other outside events could help explain what you are seeing.
{% endq %}

{% section "From an Initial Prompt to a Context-Driven Prompt", "from-an-initial-prompt-to-a-context-driven-prompt" %}

Now look at a case in which organizational knowledge changes not only how you interpret an output but also how the analysis itself must be carried out.

### Phase 1: The Initial Prompt

Imagine you are a junior analyst looking at a raw Electronic Health Record export containing patient IDs, hospital units, and recorded weights.

You ask AI:

> **"Write a script to calculate the average patient weight by hospital unit."**

The AI generates mathematically correct code to group the units and calculate the mean weight.

| Hospital Unit | Average Weight |
| --- | --- |
| Cardiology | 84.0 kg |
| Pediatrics | 29.7 kg |
| General Medicine | 73.2 kg |
| Neurology | 354.3 kg |
| ICU | 539.6 kg |

### What Do You Notice?

**What anomalies do you see in the output table?**

Next, look at part of the raw data:

| Patient | Unit | Age | Weight |
| --- | --- | --- | --- |
| P-1073 | Neurology | 66 | 79.1 |
| P-1074 | Neurology | 79 | 70.3 |
| P-1075 | Neurology | 60 | 84.6 |
| P-1076 | Neurology | 88 | 999 |
| P-1077 | Neurology | 50 | 91.2 |
| P-1078 | Neurology | 76 | 74.8 |
| P-1079 | Neurology | 69 | 82.7 |
| P-1080 | Neurology | 81 | 67.4 |
| P-1081 | ICU | 71 | 999 |
| P-1082 | ICU | 68 | 68.5 |
| P-1083 | ICU | 80 | 999 |
| P-1084 | ICU | 59 | 72.1 |

### The Business Context Problem

**The Missing Context.** AI treated the Weight column as a continuous numeric variable.

However, in this scenario, the hospital's data system requires nursing staff to enter 999 as a placeholder when a patient is bedbound or in critical condition and cannot be physically weighed. From the computer's perspective, 999 is a number. From the organization's perspective, 999 has a completely different meaning.

**The Business and Clinical Harm.** Because the analysis treats the placeholder as an actual patient weight, the averages for Neurology and ICU become physically impossible. If those results were then used to order specialized equipment or inform other operational or clinical decisions, the consequences could be financially wasteful or potentially harmful.

### Phase 2: The Engineered Prompt, Context-Driven

Your job is not simply to fix Python syntax. Your job is to identify the missing organizational context and put that operational reality back into the AI's instructions.

You revise the prompt:

> **"Write a script to calculate the average patient weight by hospital unit. CRITICAL CLINICAL CONTEXT: Our EHR requires nurses to enter 999 as a placeholder for weight if a patient is bedbound. You must filter out any weights of 999 before calculating the true averages."**

### The Corrected AI Output

By supplying the operational rule, you enable AI to generate code that more accurately reflects the clinical reality.

| Hospital Unit | AI's Flawed Output, Naive Average | Human-Audited Output, Corrected Average | Impact |
| --- | --- | --- | --- |
| Cardiology | 84.0 kg | 84.0 kg | No change |
| Pediatrics | 29.7 kg | 29.7 kg | No change |
| General Medicine | 73.2 kg | 73.2 kg | No change |
| Neurology | 354.3 kg | 77.9 kg | Severe skew from placeholder values |
| ICU | 539.6 kg | 80.2 kg | Massive skew from placeholder values |

{% callout "checkpoint", "Human Judgment Checkpoint" %}
Before accepting an AI-generated analysis, ask:

1. What do these data actually represent?
2. Are there organizational conventions or coding rules that AI does not know?
3. What important context might exist outside the dataset?
4. Who or what could help me verify that context?
5. How could my analysis change if my assumption is wrong?
{% endcallout %}

{% section "Key Takeaway", "key-takeaway" %}

{% callout "takeaways", "Key Takeaway" %}
Generative AI can be extremely useful for automating grouping, summing, aggregation, and other mathematical functions; however, recognizing domain context, such as understanding that a legacy system uses a special placeholder value, remains your responsibility.

**You need organizational context to use AI effectively.**
{% endcallout %}

{% section "Before You Continue", "before-you-continue" %}

So far, you have seen two important shifts.

First, when AI accelerates code generation, more of your attention needs to move toward evaluation and validation. Second, even mathematically correct output can lead you in the wrong direction when important context is missing. But AI-supported data work can fail in another way:

**The output itself can be wrong even when it looks convincing.**

That is the focus of Part 3.
