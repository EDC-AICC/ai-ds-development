---
order: 3
title: Responsible AI in Data Practice
navLabel: Responsible AI
---

{% section "Learning Objectives", "learning-objectives" %}

In this part, you will:

- Identify major responsible AI concerns that can arise across the data lifecycle.
- Explain why people and organizations remain accountable for AI-supported work.
- Identify practical controls that can reduce risks related to privacy, bias, authenticity, intellectual property, regulation, and environmental impact.
- Use responsible AI frameworks as guides without treating them as substitutes for judgment.

{% section "Who Is Responsible When AI Gets It Wrong?", "who-is-responsible" %}

In 2022, an Air Canada customer relied on the airline's chatbot for information about a bereavement fare. The chatbot gave instructions that conflicted with the airline's actual policy. When the customer sought reimbursement, Air Canada argued that the chatbot was responsible for its own actions. A British Columbia tribunal rejected that argument and held the airline responsible for information provided through its website.

The principle matters for data work: AI can help you prepare data, write code, build workflows, and communicate findings, but responsibility does not transfer to the tool. If you put an AI-supported result into a report, dashboard, recommendation, or operational workflow, someone still needs to verify it and be answerable for what happens next.

{% section "Seven Responsible AI Concerns to Recognize", "seven-responsible-ai-concerns" %}

| Concern | Real-World Reminder | Your Role as a Data Practitioner |
|---|---|---|
| **Accountability** | Air Canada was held responsible for incorrect information provided by its chatbot. | Verify AI-supported results, document what you checked, and make sure a person or team owns review before work is released. |
| **Privacy** | Italy's data protection authority fined OpenAI after investigating how ChatGPT handled personal data. | Do not paste personal or restricted data into an unapproved AI tool. Remove identifiers or use synthetic data when appropriate. |
| **Bias** | A federal case involving Workday's applicant-screening tools raised claims about race, age, and disability discrimination. New York City also requires bias audits for certain automated employment tools. | Break outcomes down by relevant groups, investigate disparities, and do not assume past decisions represent fair or appropriate ground truth. |
| **Authenticity** | In the Arup deepfake fraud, a finance worker joined a video call that appeared to include senior colleagues, but the other participants were AI-generated. | Treat voice, video, and generated documents as potentially spoofable. Verify high-risk requests through an independent channel. |
| **Intellectual Property** | Litigation over AI training data has shown that how data were obtained can matter as much as how they are used. | Know where data, code, and content came from. Check licenses and terms before scraping, reusing, or distributing AI-generated material. |
| **Regulation** | AI obligations increasingly come from laws and rules that vary by place and use case, including employment and other high-impact decisions. | Recognize when a project may carry legal obligations and raise the issue early. Check current official sources rather than relying on old summaries. |
| **Environmental Impact** | AI depends on data centers that consume substantial electricity and water. | Use the smallest appropriate tool, avoid unnecessary model calls, test on small samples, and reuse results when you can. |

{% section "Responsible AI Across the Lifecycle", "responsible-ai-across-the-lifecycle" %}

Responsible AI is easier to manage when you ask where a risk enters the work. The same concern can appear at more than one stage.

| Stage | Questions to Ask | Examples of Concerns |
|---|---|---|
| **Data** | Where did the data come from? Who is represented? Am I permitted to use it this way? | Privacy, intellectual property, bias |
| **Model** | What is the model optimizing for? What does it get wrong? What does it cost to run? | Bias, environmental impact |
| **Deployment** | Who reviews the output? Who is answerable? What policies or laws apply? | Accountability, regulation |
| **Use** | Can people tell what is real? Do they know AI was involved? Could the output be misused? | Authenticity, transparency, accountability |

### Where AI Can Help, and Where You Need to Decide

**AI can help you** generate preliminary risk checklists, suggest validation steps, help compare outputs across groups, organize documentation, and summarize policies or framework requirements for human review.

**You still need to** verify local facts, protect restricted data, interpret organizational policies, consult appropriate legal or compliance experts when needed, decide which tradeoffs are acceptable, and stop or change work that is not feasible or responsible.

{% section "Frameworks Can Help You Ask Better Questions", "frameworks" %}

Organizations have published responsible AI frameworks so teams do not have to start from scratch. Frameworks are useful checklists, but they do not replace judgment or local policy.

| Framework | What to Remember |
|---|---|
| **NIST AI Risk Management Framework** | Four functions: Govern, Map, Measure, Manage. Set accountability, understand context and risks, test for problems, then act and monitor. |
| **Singapore Model AI Governance Framework for Generative AI** | Nine dimensions include accountability, data, trusted development and deployment, incident reporting, testing and assurance, security, content provenance, safety and alignment, and AI for public good. |

Other names you may encounter include ISO/IEC 42001, UNESCO's Recommendation on the Ethics of Artificial Intelligence, the OECD AI Principles, NIST guidance for generative AI, and the OWASP Top 10 for LLM Applications.

{% section "Try It: Responsible AI Case Analysis", "try-it-responsible-ai-case-analysis" %}

{% tryit %}
**Purpose:** Practice identifying responsible AI concerns and translating them into concrete controls.

Choose **one** of the scenarios below. More than one responsible AI concern may apply.

{% accordion %}
{% fold "The Helpful Summary" %}
You paste a client-services spreadsheet into a public AI chatbot to summarize usage trends. You place two figures from the response into a funder report. A week later, you cannot reproduce one of the numbers.
{% endfold %}
{% fold "The Automated Screen" %}
A workforce organization asks you to automate the first pass of job-training applications using an AI model trained on five years of past admissions decisions. Applications below a threshold are automatically rejected.
{% endfold %}
{% fold "The Urgent Request" %}
You receive an urgent Teams message and short video from your director asking you to send a full enrollment dataset, including names and dates of birth, to an external consultant by the end of the day.
{% endfold %}
{% endaccordion %}

### For the Scenario You Chose, Answer Three Questions

1. Which responsible AI concerns apply?
2. Who should be accountable for reviewing or approving the action?
3. What is one practical control that could prevent or reduce the problem?
{% endtryit %}

{% section "Key Takeaways", "key-takeaways" %}

{% callout "takeaways", "Key Takeaways" %}
AI does not absorb professional responsibility. Responsible data practice requires you to know where data came from, protect personal information, examine outcomes for bias, verify authenticity, respect intellectual property, recognize when rules apply, and use computational resources thoughtfully.
{% endcallout %}

### Before You Continue

The rules and technologies will continue to change. That is why the final part of this module focuses on what is changing in data work and which responsibilities remain central even as AI becomes more capable.
