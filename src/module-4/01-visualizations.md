---
order: 1
title: Creating and Auditing AI-Assisted Visualizations
navLabel: AI-Assisted Visualizations
---

{% section "Learning Objectives", "learning-objectives" %}

In this part, you will:

- Use AI to generate and refine Python code for a data visualization, and trace how each requirement in a prompt appears in that code.
- Develop prompts that communicate the purpose and important features of a visualization.
- Evaluate AI-generated visualizations for data accuracy, visual integrity, accessibility, and alignment with the evidence.
- Identify where AI can support visualization work and where your own data knowledge and judgment are required.

{% section "Why Visualization Is More Than Making a Chart", "why-visualization-is-more-than-making-a-chart" %}

A visualization does more than make data easier to look at. The choices you make about what to display, what to emphasize, how to label information, and what context to provide can shape what an audience notices and how they interpret the evidence.

Working with AI to communicate insights is a back-and-forth dialogue, not a one-shot query. AI can help you write visualization code and refine the way information is presented, but you will rarely get a finished product from the first prompt. You write a prompt, examine what AI produces, audit the functionality and accuracy of the code and the resulting graphic, and then refine the prompt to fix problems or add insight to the visual.

{% callout "highlight" %}
**A useful working cycle:** Prompt → Create → Examine → Verify → Refine
{% endcallout %}

{% section "Choose the Visualization Before You Prompt AI", "choose-the-visualization" %}

Before you ask AI to create a chart, decide what you want the audience to see. AI can suggest a chart type, but you still need to decide whether that choice fits the data and the communication goal. The options below are useful starting points, not fixed rules.

{% figure "module4-chart-types.jpg", "Common chart types and what they show. Bar chart: compare values across categories; shows how values differ across categories. Line chart: show change over time; shows how a value changes over time. Scatter plot: show a relationship between two numeric variables; shows whether two variables move together and the overall pattern, including outliers. Histogram with box plot: show the distribution or spread of values; shows how values are spread out, including the typical range and any outliers." %}

| Communication Purpose | Useful Starting Point | What to Check |
|---|---|---|
| **Compare values across categories** | Bar chart | Use a common baseline, clear labels, and an order that helps the audience compare values accurately. |
| **Show change over time** | Line chart | Use consistent time intervals and make sure gaps or missing periods are not shown as if the data were continuous. |
| **Show a relationship between two numeric variables** | Scatter plot | Look for patterns and outliers, but remember that a relationship does not prove that one variable caused the other. |
| **Show the distribution or spread of values** | Histogram or box plot | Check the scale, bin choices, and outliers so the display does not hide important variation in the data. |

Once you have chosen a reasonable visual form, AI can help you generate and refine the code. You still need to verify that the visual represents the data accurately and makes the intended finding clear.

{% optional "Exploring Chart Types" %}
Want to see more options? These two free resources are useful references as you choose and build visualizations.

- **Financial Times Visual Vocabulary** ([ft.com/vocabulary](https://ft.com/vocabulary)): organizes dozens of chart types by communication purpose, such as comparison, distribution, correlation, change over time, and part-to-whole, just like the table above.
- **The Python Graph Gallery** ([python-graph-gallery.com](https://python-graph-gallery.com/)): shows hundreds of charts built in Python, each with an explanation of when to use it and example code you can adapt. Many sections also show common mistakes to avoid.
{% endoptional %}

{% section "Three Ways AI Can Support Data Communication", "three-ways-ai-can-support-data-communication" %}

Data practitioners use AI across three distinct communication layers. At each layer, your job is to interact with AI to make sure the output is correct and aligned with organizational needs. You will practice the first layer, AI-assisted code generation, here in Part 1. You will practice the second and third layers, narrative creation and dashboard creation, in Part 2: Communicating Insights for Different Audiences. The last column of the table shows where each layer is covered.

| Communication Layer | How AI Can Help | What You Still Need to Do | Where You Will Practice It |
|---|---|---|---|
| **AI-Assisted Code Generation** | Generate code and syntax such as Python plotting commands (matplotlib), formatting, labels, dashboard widgets, and memo templates. | Direct the tone, highlight critical thresholds, apply organizational branding, follow accessibility guidelines, and frame the business takeaway. Verify the data and transformations, and decide whether the visual tells the truth. | Part 1 (this part): Visualizing Customer Wait Times |
| **AI-Assisted Narrative Creation** | Frame the same finding for different audiences. A chief executive and a mid-level manager may need very different framing and emphasis. | Decide what evidence matters and remove invented explanations, recommendations, or certainty. | Part 2: Audience-Centered Prompting and AI Output Critique |
| **AI-Assisted Dashboard Creation** | Write starter code for interactive dashboards in a Python framework such as Streamlit, so stakeholders can explore the data themselves. | Decide what users need to explore, then run and test the dashboard to confirm the controls, labels, and outputs are accurate, useful, and responsible. | Part 2: Using AI to Prototype a Dashboard |

{% section "See It in Practice: Visualizing Customer Wait Times", "see-it-in-practice" %}

Consider a clinic network that tracks median wait time from patient arrival to consultation across four facilities. The organization has a target maximum wait time of 30 minutes.

| Clinic | Median Wait Time |
|---|---|
| Clinic A | 14 minutes |
| Clinic B | 28 minutes |
| Clinic C | 42 minutes |
| Clinic D | 19 minutes |

Suppose you ask AI to help create the visualization. The quality of the result will depend partly on what you tell the AI about the communication goal.

### Step 1: Start With a Naive Prompt

When you write AI prompts for visualization, avoid generalities. Describe the specific elements you intend the visual to include. Compare the naive prompt below with the communicative prompt in Step 2.

> **Naive Prompt**
>
> Write code to make a bar plot of patient wait times for Clinics A, B, C, and D.

A prompt like this typically produces default-colored bars with raw numbers. The chart may be technically correct, but nothing in it emphasizes that Clinic C exceeded the operational target, because the prompt never mentioned the 30-minute target. It also does not ask for presentation-ready titles, data labels, or an accessible palette.

Now suppose the 30-minute target is part of company policy. How could you refine the prompt so the chart communicates that standard and shows which clinic missed it?

### Step 2: Refine Into a Communicative Prompt

> **Communicative (Refined) Prompt**
>
> Write a data visualization script using a clean, presentation-ready theme to plot median patient wait times for Clinics A-D. Include a horizontal dashed reference line at 30 minutes labeled Target Threshold. Color the bar for any clinic exceeding 30 minutes in a single accent color, soft red (#D9534F), and color clinics at or below the target in neutral gray (#6C757D). Start the y-axis at zero. Add direct data labels above each bar and a subtitle that states only the finding supported by the data: "Clinic C exceeded the network service-level target of 30 minutes in Q3." Write the code in Python using pandas and matplotlib.

Notice that the communicative prompt names the critical threshold, the colors, the labels, the axis, and the main takeaway. Depending on the workplace, you may also need to specify organizational formatting or branding, important performance thresholds, accessibility requirements, and the main message the audience needs to see. Even so, a detailed prompt does not guarantee a correct or responsible visualization. You still need to read the code and inspect the resulting graphic.

{% figure "module4-clinic-wait-times.png", "Bar chart titled Median Patient Wait Times by Facility, with the subtitle Clinic C exceeded the network service-level target of 30 minutes in Q3. Clinic A 14 minutes, Clinic B 28 minutes, and Clinic D 19 minutes are gray bars. Clinic C, 42 minutes, is a red bar. A dashed red line at 30 minutes is labeled Target Threshold (30m). The y-axis, Minutes to Consult, runs from 0 to 50.", "The chart produced by the communicative prompt." %}

{% section "Step 3: Read the Code AI Generates", "read-the-code" %}

Below is the Python code (pandas and matplotlib) generated from the communicative prompt. You do not need to memorize it. You do need to be able to read it well enough to find where each requirement from your prompt was implemented, because that is what makes a real audit possible. The table maps each prompt requirement to the code that carries it out.

| Prompt Requirement | Where It Appears in the Python Code |
|---|---|
| Store the clinic data | `df = pd.DataFrame(data)` |
| Define the 30-minute target once | `threshold = 30` |
| Accent color only for clinics above the target | `colors = ['#D9534F' if w > threshold else '#6C757D' for w in df['wait_time']]` |
| Dashed reference line | `ax.axhline(threshold, linestyle='--', label='Target Threshold ...')` |
| Direct data labels | `ax.text(...)` inside a loop over the bars |
| Title and evidence-based subtitle | `fig.suptitle(...)` and `ax.set_title(...)` |
| Y-axis that starts at zero | `ax.set_ylim(0, 50)` |
| Clean, uncluttered theme | `ax.spines[['top', 'right']].set_visible(False)` |

{% examplecode "module-4/clinic_chart.py", "Python (pandas + matplotlib)" %}

{% tip %}
**Why store the threshold in a variable?** The code defines the target once (`threshold = 30`) and reuses it for the reference line and the color rule. If the organization changes its target, you change one line and the chart stays internally consistent. The same idea makes the interactive dashboards in Part 2 work: a slider simply replaces the fixed value.
{% endtip %}

{% section "Step 4: Audit the Code and the Visualization", "audit-the-code-and-the-visualization" %}

Once AI creates the code and you run it, audit both the code and the graphic before you use or share the result. Click each audit area to see the questions to ask.

{% accordion %}
{% fold "Code-Level Data Integrity" %}
Inspect the data transformations AI wrote immediately before the plotting call. Did intermediate aggregations, filtering, and slicing logic work as intended? How were missing values handled? Does the code use the intended variables and values, and does it produce the intended output?
{% endfold %}
{% fold "Graphic Integrity and Visual Truth" %}
Was an axis truncated in a way that exaggerates a difference? Are the correct variables mapped to the axes and colors? Are the scales and reference lines accurate? Is the visualization both logically and ethically sound? Is there a disconnect between what you asked for in the prompt and what the code actually produced?
{% endfold %}
{% fold "Semantic Alignment and Annotations" %}
The greatest risk in AI-generated graphics is text framing that contradicts or overstates the visual evidence. Do the title, subtitle, and annotations match the data? For example, would the data justify a phrase such as "massive increase in wait times," or is more measured language needed? Are labels aligned with the correct bars or points?
{% endfold %}
{% fold "Perceptual Accessibility and Usability" %}
AI defaults often use saturated primary colors or red/green pairings that many people with color-vision differences cannot distinguish. Are the palette, contrast, labels, and units clear? Can the chart communicate its core finding without the viewer deciphering code or guessing units?
{% endfold %}
{% endaccordion %}

{% callout %}
**Choosing accessible colors.** Avoid relying only on red/green distinctions. Accessible palettes such as Viridis or ColorBrewer, or a neutral gray for typical categories with a single contrasting accent color for the outlier, make differences easier for more viewers to interpret. Pair color with a second cue, such as a direct label or a reference line, so the finding does not depend on color alone. The clinic chart follows this approach: gray bars, one accent bar, a labeled target line, and a value printed on every bar.
{% endcallout %}

### Where AI Can Help, and Where You Need to Decide

**AI can help you** generate Python plotting code, suggest labels and annotations, propose accessible palette options such as Viridis or ColorBrewer, and help revise a chart after you identify a problem.

**You still need to** verify the data and transformations, decide what the audience needs to see, evaluate whether the visual is truthful and accessible, and take responsibility for what the chart communicates.

{% section "Key Takeaways", "key-takeaways" %}

{% callout "takeaways", "Key Takeaways" %}
A useful visualization begins with a communication goal, not a plotting command. AI can accelerate chart creation, but you remain responsible for data integrity, visual truth, accessibility, and the claims attached to the graphic.
{% endcallout %}

### Before You Continue

A chart is only one layer of communication. Next, you will use the same evidence to communicate with people who have different roles, needs, and levels of technical knowledge.
