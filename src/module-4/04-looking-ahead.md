---
order: 4
title: "Looking Ahead: What Data Practitioners See Coming"
navLabel: Looking Ahead
---

{% section "Learning Objectives", "learning-objectives" %}

In this part, you will:

- Explain how developments such as agentic AI, context engineering, production-ready AI systems, and increased automation may change data work.
- Describe why organizational context, data architecture, documentation, evaluation, and human oversight become more important as AI automates more of the analytical process.
- Identify knowledge and skills you will need to continue developing as AI changes data roles and workplace expectations.

{% section "What Practitioners See Coming", "what-practitioners-see-coming" %}

In June 2026, nine experienced data practitioners from fields including city government, public safety, banking, consulting, manufacturing, e-commerce, healthcare, and enterprise technology met for a two-day workshop to describe how they use AI in their work. Their discussion helped shape the AI-Enhanced Data Practitioner profile that informs this course. At the end of the workshop, the group looked ahead and discussed the changes they believe are likely to shape data science and AI. Their ideas did not center on one particular tool. Instead, they pointed to broader shifts in how work is organized, what practitioners need to understand, and where human judgment becomes even more important.

| Trend | What It Means for Your Work |
|---|---|
| **AI becomes part of larger, more agentic systems** | Data science models are increasingly likely to operate inside larger systems that combine data, domain knowledge, tools, decision support, and process automation. Practitioners expect more work around customizing, evaluating, maintaining, and connecting these systems as business needs change. |
| **Business and domain knowledge become essential** | The boundaries among data analyst, data scientist, engineer, and business practitioner may continue to blur. As AI handles more technical tasks, practitioners will need to understand users, workflows, organizational goals, and the real-world consequences of the work, not simply write code or produce reports. |
| **Routine work becomes easier, while higher-level work grows** | Automation may reduce time spent on routine coding, queries, and historical reporting. Practitioners may spend more time defining problems, preparing and architecting data, evaluating AI outputs, documenting systems, working across the solution lifecycle, and making forward-looking decisions. |
| **Foundational data knowledge and critical thinking matter more, not less** | AI can produce persuasive code, explanations, and analyses that are wrong. Practitioners emphasized understanding the underlying data, questioning outputs, preserving independent reasoning, and knowing when not to use AI or when to work without it. |
| **Accountability, trust, and responsible use become more important** | More capable systems increase the importance of governance, documentation, authenticity, privacy, intellectual property, regulation, data rights, environmental impacts, and clear responsibility when an AI-supported decision or workflow causes harm. |

{% section "Three Terms You Will Hear More Often", "three-terms" %}

| Term | Plain-Language Meaning |
|---|---|
| **Agentic AI** | AI systems designed to carry out a sequence of steps toward a goal, often by using tools, data sources, and software rather than producing only a single response. |
| **Context engineering** | Designing the instructions, data, examples, tools, and organizational information available to an AI system so it can work more reliably in a particular setting. |
| **Production-ready solution** | A tool or system reliable enough for real users and workflows, with testing, documentation, security, monitoring, support, and clear accountability. |

{% section "What Changes and What Remains Central", "what-changes-and-what-remains-central" %}

These trends are practitioner perspectives, not fixed predictions. What matters is the direction of change: more automation and more capable AI increase the need for strong data foundations, organizational understanding, evaluation, communication, and accountable human judgment. The workflow you have used throughout this course, Understand → Explore → Prepare → Analyze → Share, remains useful precisely because it keeps those responsibilities visible.

| AI May Do More Of... | You Still Need To... |
|---|---|
| Generate code, queries, charts, summaries, and prototypes | Understand the data and organizational problem well enough to verify the work. |
| Connect models to tools and multistep workflows | Decide which decisions should be automated, which require approval, and where human review belongs. |
| Produce polished explanations and recommendations quickly | Test whether claims are supported, communicate uncertainty, and reject persuasive but incorrect output. |
| Automate repeated analytical tasks | Maintain documentation, evaluation, monitoring, and accountability over time. |
| Make advanced analytical capabilities available to more roles | Keep learning, understand your domain, communicate across audiences, and use professional judgment. |

{% section "Try It: What Trend Matters Most to You?", "try-it-what-trend-matters-most" %}

{% tryit %}
Choose one practitioner trend from the table in What Practitioners See Coming and answer the following:

1. How could this trend change a task, role, or responsibility in your future work?
2. What human knowledge, judgment, or responsibility becomes more important, not less?
3. What is one knowledge or skill area you would want to continue developing?
{% endtryit %}

{% section "Key Takeaways", "key-takeaways" %}

{% callout "takeaways", "Key Takeaways" %}
- The practitioners who informed this course expect AI to become more embedded in data workflows, roles, and decisions.
- They also emphasized that stronger automation does not remove the need for foundational data knowledge, organizational context, critical thinking, verification, responsible judgment, and continuous learning.
- The tools will keep changing. Your responsibility is to understand the problem and data, evaluate what AI produces, communicate evidence clearly, recognize risks, and know when human judgment must remain in control.
{% endcallout %}

{% section "Hands-On Lab: Prompt, Polish, Present, and Audit", "hands-on-lab" %}

This hands-on lab brings together the work of all four parts of the module. You will use the provided [college_data.csv]({{ '/data/college_data.csv' | url }}) file, a raw summary table of fictional course completion data for five community college campuses, including a district completion target of 75%. Your goal is to create a clear communication for a college dean without making claims that the dataset cannot support.

{% notebook "Module 4 Lab", "m4-lab.ipynb" %}
Opens in Colab and loads college_data.csv for you.
{% endnotebook %}

{% accordion %}
{% fold "Start with the evidence" %}
Without AI, identify the campus with the lowest completion rate, two facts the dataset supports, and one question the dataset cannot answer.
{% endfold %}
{% fold "Prompt the AI" %}
Craft a structured, communicative prompt that asks AI to generate a bar chart in Python showing campus completion rates. Emphasize the single lowest-performing campus using contrast: one accessible accent color for that campus and neutral colors for the others. Include a 75% target reference line and direct labels. Run the code, compare the result with your prompt, and refine the prompt at least once.
{% endfold %}
{% fold "Polish the narrative" %}
Ask AI for a three-sentence summary for a college dean. Edit the text to remove generic filler, reflect a realistic academic advising context, and remove any causes or interventions the data cannot support.
{% endfold %}
{% fold "Audit the scaffolding" %}
Check the code, values, labels, axis, target line, accessibility, and every claim in the narrative. Document any styling errors, missing labels, unclear phrasing, or unsupported claims that required manual human intervention before presentation, including at least two changes you made to AI output.
{% endfold %}
{% fold "Apply responsible judgment" %}
Identify one responsible AI concern that could matter if this analysis were used for real students or campuses, and name one control that would reduce the risk.
{% endfold %}
{% fold "Look ahead" %}
Choose one trend identified by the practitioner panel and name one knowledge or skill area you would need to keep developing if that trend becomes more important in your work.
{% endfold %}
{% endaccordion %}

{% callout "checkpoint", "Data Practitioner Audit Reminder" %}
The dataset includes variables such as primary modality and percentage of first-generation students. Do not treat those variables as explanations for completion differences unless you have evidence that supports the relationship. Description is not causation.
{% endcallout %}

{% section "Module Deliverable", "module-deliverable" %}

{% assignment "Prompt, Polish, Present, and Audit" %}
Your deliverable should include:

- One visualization and the Python code that produced it.
- Your initial prompt and at least one refined prompt.
- A three-sentence audience-appropriate summary.
- A short audit note documenting the issues that required human intervention, including at least two changes you made to AI output.
- One responsible AI concern and control.
- One future-ready skill you want to continue developing.
{% endassignment %}

{% section "Before You Move On", "before-you-move-on" %}

Across this course, you have moved through a professional workflow of Understand → Explore → Prepare → Analyze → Share. AI can support work at every stage, but it does not replace the knowledge, context, verification, communication, and judgment you bring to the process.

As an AI-Enhanced Data Practitioner, your goal is not to use AI everywhere. Your goal is to know when it adds value, how to evaluate what it produces, and when a decision, explanation, or responsibility must remain with people.

{% section "Feedback on This Module", "module-feedback" %}

This module is a draft, and what you write here shapes the next revision. Looking back over the whole module, what worked, what confused you, and what would you change? For a thought about one particular page, use the Feedback button at the top of that page.

{% feedback "module" %}
