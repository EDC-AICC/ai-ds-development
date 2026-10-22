---
order: 2
title: Communicating Insights for Different Audiences
navLabel: Different Audiences
---

{% section "Learning Objectives", "learning-objectives" %}

In this part, you will:

- Adapt data communication for audiences with different roles, needs, and levels of technical knowledge.
- Use AI to draft and refine stakeholder-facing summaries and narratives.
- Evaluate AI-generated narratives for unsupported claims, invented context, and inappropriate recommendations.
- Use AI to generate starter dashboard code in Streamlit, a Python framework, and evaluate whether the dashboard supports the needs of its intended users.

{% section "The Same Evidence Can Require Different Communication", "the-same-evidence" %}

Once charts and summary tables are produced, AI can help you convert the visual findings into written deliverables tailored to different roles within the organization.

A technical colleague may need information about methods, data quality, and limitations. A manager may need a concise explanation of what the finding means for day-to-day operations. An executive may need to understand the organizational significance and what decision requires attention.

AI can help adapt the same evidence for different audiences, but this creates an important risk: polished language can make unsupported claims sound convincing. Your job is not simply to make the communication sound professional. You need to make sure it remains faithful to the evidence.

{% callout "checkpoint", "Communicating Uncertainty and Limitations" %}
Strong data communication makes clear where the evidence ends and interpretation begins. In the clinic example, the data support a specific statement: Clinic C had a median wait time of 42 minutes, above the 30-minute target. The data do not explain why that happened. They do not tell you whether staffing, patient volume, record systems, or another factor caused the delay, and they do not establish which intervention would improve it.

Before communicating a cause or recommendation, identify what is missing and say so. For example: "Clinic C exceeded the 30-minute target in Q3. Additional analysis is needed to determine which operational factors contributed to the higher wait time."

Communicating a limitation does not weaken your message. It helps your audience understand what the evidence supports and what still needs to be investigated.
{% endcallout %}

{% section "Audience-Centered Prompting", "audience-centered-prompting" %}

Using the clinic findings, you can ask AI to create different communications for different audiences.

> **Suggested AI Prompt**
>
> Using the clinic wait-time findings (Clinics A=14m, B=28m, C=42m, D=19m; target=30m), generate two distinct communication summaries: (1) an executive memo for the Chief Medical Officer, maximum 75 words, action-oriented and focused on the operational significance of the finding; and (2) a clinical operations update for the Head Nurse of Clinic C, written for an operational audience. Use only the information provided. Do not invent causes, staffing details, compliance consequences, or recommended interventions.

{% section "AI Output Critique: When a Polished Narrative Goes Beyond the Evidence", "ai-output-critique" %}

The prompt above was written carefully for a reason. An earlier version, shown below, asked AI to focus on compliance risks, resource allocation, bottlenecks, and staffing coverage, none of which appear in the data. Asking for content the data cannot provide invites AI to fill the gap.

> **Earlier Prompt (Before Revision)**
>
> Using the clinic wait-time findings (Clinics A=14m, B=28m, C=42m, D=19m; target=30m), generate two distinct communication summaries:
>
> 1. An Executive Memo for the Chief Medical Officer (maximum 75 words, action-oriented, focused on resource allocation and compliance risks).
> 2. A Clinical Ops Update for the Head Nurse of Clinic C (empathetic, operational, diagnosing bottlenecks and staffing coverage).

That earlier prompt produced the following two outputs. Both sound professional. Read them as a data practitioner and look for places where the AI moves beyond the evidence it was given.

> **Executive Memo Output (CMO Focus)**
>
> **Urgent Action Required: Q3 Patient Service-Level Compliance**
>
> Clinic C breached network service-level agreements this quarter with a median wait time of 42 minutes (+40% above the 30-minute ceiling). All other sites remained compliant (14-28 mins). Continued delays at Clinic C threaten patient retention and accreditation standards. We recommend immediate temporary nurse-triage reallocations from Clinic A to Clinic C during peak afternoon intake hours.

> **Operational Team Note Output (Clinic C Nursing Leadership Focus)**
>
> **Q3 Workflow Debrief: Intake & Patient Flow Analysis**
>
> Team, thank you for your ongoing commitment during a heavy summer intake period. Last quarter, our median wait times averaged 42 minutes, exceeding our 30-minute goal. Preliminary reviews suggest the primary bottleneck occurs between 1:00 PM and 3:30 PM due to overlapping check-ins and delayed digital record syncing. Over the next two weeks, we will test an intake-assist workflow during peak windows to streamline patient rooming.

As you audit the outputs, ask:

- Which statements are directly supported by the provided data?
- Which statements introduce information that was never provided?
- Where does AI move from describing evidence to explaining a cause?
- Where does AI recommend an action without enough information?
- What would you revise or remove before sharing either message?
- Which numbers did AI calculate or restate? Are they correct, and are they described with the right statistical language?
- How did the wording of the earlier prompt encourage these problems?

{% q "Reveal a Possible Answer" %}
The data support the wait-time values, the 30-minute target, and the fact that Clinic C is above that target while the other clinics are not. The "+40%" figure is a correct calculation (42 is 40% above 30), so it is supported, but derived numbers should always be checked. The phrase "median wait times averaged 42 minutes" mixes two different statistics: the value is a median, not an average.

The data do not support claims about patient retention, accreditation, a heavy summer intake period, afternoon bottlenecks, record-syncing problems, nurse availability, or the effectiveness of an intake-assist workflow. Those details would need additional evidence or stakeholder input. The earlier prompt asked for "compliance risks," "diagnosing bottlenecks," and "staffing coverage," so the AI supplied plausible-sounding answers. A strong revision would communicate the observed finding, note that the cause has not yet been established, and identify the next question to investigate.
{% endq %}

{% section "Using AI to Prototype a Dashboard", "using-ai-to-prototype-a-dashboard" %}

Sometimes an audience needs more than a static visualization or written summary. Data practitioners increasingly prototype interactive web dashboards that allow stakeholders to explore selected aspects of the data and find answers for themselves. You still need to decide what users should be able to explore, what information they need, and what controls or displays could confuse or mislead them.

AI can help you prototype dashboards using Python frameworks such as Streamlit. Streamlit turns an ordinary Python script into an interactive web app. It can connect your data and visualizations to interactive controls such as filters, dropdown menus, sliders, and tables. Instead of writing every component from scratch, you can describe the interaction you want, ask AI to generate starter code, and then run, test, and revise it.

> **Dashboard Prompt Example**
>
> Create a single-page interactive Streamlit dashboard that allows users to filter clinic wait-time data using a dropdown for clinic selection and a slider to adjust the SLA (service-level) target. Clearly label units and the selected target. Use neutral gray for clinics at or below the target and one accessible accent color for clinics above it. Include direct data labels and a table showing each clinic's status.

A Streamlit app is built from a small set of building blocks. One idea makes it different from an ordinary script: Streamlit reruns the whole script from top to bottom every time a user changes a control, so every calculation and chart automatically reflects the current filter and slider values. Use the table below to locate each building block in the example code.

| Dashboard Building Block | Streamlit (Python) |
|---|---|
| Page title and layout | `st.set_page_config()`, `st.title()` |
| Dropdown filter | `st.multiselect()` |
| Threshold slider | `st.slider()` |
| Update results when a control changes | Script reruns automatically |
| Status flag for each clinic | `filtered['Status'] = filtered['Wait_Time'].apply(lambda ...)` |
| Chart output | `st.pyplot(fig)` |
| Table output | `st.dataframe()` |
| Run the app | `streamlit run app.py` (in a terminal) |

{% figure "module4-dashboard.png", "The Regional Clinic Wait-Time Tracker dashboard running in a browser. A dropdown has Clinics A, B, C, and D selected and a slider sets the SLA target to 30 minutes. A table lists each clinic's wait time and status: A 14, B 28, and D 19 are Compliant, and C 42 is Exceeded. Below it, a bar chart shows the four clinics, with Clinic C in red above a dashed 30-minute target line and the others in gray.", "The dashboard built from the example code below, with every clinic selected and the target at 30 minutes." %}

{% callout "checkpoint", "Audit in Action: What Testing the Starter Code Revealed" %}
AI-generated dashboard code often runs, looks reasonable, and still contains problems. Reviewing the first draft of this dashboard turned up two issues:

1. The draft colored compliant clinics green and exceeded clinics red, the red/green pairing that many viewers cannot distinguish. It now uses neutral gray with one accent color.
2. The prompt asked for a clinic dropdown, but the draft included only the slider. A dropdown was added. This is the kind of prompt-to-output mismatch you are looking for in an audit.

Neither issue is visible by reading the prompt. You find them by running the code, trying the controls, and comparing the result against what you asked for.
{% endcallout %}

{% examplecode "module-4/app.py", "Python (Streamlit) · save as app.py, run with: streamlit run app.py" %}

{% section "Dashboard Audit", "dashboard-audit" %}

| Check | Questions |
|---|---|
| **Prompt alignment** | Does the dashboard include every control, label, and display the prompt asked for? Does anything appear that you did not request? |
| **Data and calculations** | Do filters, calculations, and status labels update correctly? |
| **Meaning and context** | Are definitions, units, thresholds, and time periods clear? |
| **Interactivity** | Can a control produce a misleading interpretation or hide important information? |
| **Privacy and access** | Does the dashboard expose information that this audience should not see? |
| **Accessibility and usability** | Can a user understand the core finding without knowing the code? Are color, labels, and controls accessible? |
| **Decision usefulness** | Does the interactivity help the user answer a real question or take an appropriate action? |

{% section "Key Takeaways", "key-takeaways" %}

{% callout "takeaways", "Key Takeaways" %}
- Different audiences need different levels of detail, but the evidence should not change with the audience.
- AI can help draft and adapt communications quickly, but you must remove invented context, unsupported causes, and recommendations that the data do not justify.
- AI can also generate working dashboard code in Streamlit in minutes, but you are responsible for running it, testing every control, and confirming that what users see is accurate and accessible.
{% endcallout %}

### Before You Continue

Clear communication is necessary, but it is not sufficient. Even an accurate chart or summary can create harm if the data, model, workflow, or use of AI is irresponsible. Part 3 focuses on the responsibilities that remain with people and organizations.
