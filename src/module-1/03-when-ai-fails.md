---
order: 3
title: "When AI Fails: Risks, Hallucinations, and Silent Logic Bugs"
navLabel: When AI Fails
---

{% section "Overview and Learning Goal" %}

In this section, you will examine how generative AI tools can fail in data work. Some failures are obvious. Code crashes or generates an error. Other failures are harder to detect because AI can produce output that *appears* professional and technically sophisticated. You will learn to spot failure modes that can include hallucinated column names or methods, overlooked edge cases, and silent data manipulations that affect downstream analyses.

{% section "Conceptual Breakdown: The Anatomy of an AI Failure" %}

When you ask an AI system to clean, transform, or model data, it can produce output that looks technically correct without understanding your organization's business context, downstream impact, where that data came from and how it's been changed, or local rules about how the data are recorded. This creates three important types of failure to watch for:

{% accordion %}
{% fold "Silent Logic Bugs" %}
The code runs with no obvious error and produces a neat output, but the logic introduces a potentially serious problem.

Example: automatically filling missing financial data with zeros.
{% endfold %}
{% fold "Hallucinated Schema or Code Elements" %}
AI invents column names, methods, functions, or other elements that sound plausible but do not exist in your actual database or software library.
{% endfold %}
{% fold "Statistical Blind Spots" %}
AI applies a statistical approach without recognizing important distribution anomalies, data leakage, class imbalances, or other features that should change how the data are handled.
{% endfold %}
{% endaccordion %}

{% section "Thought Exercise 1: Silent Logic Bug" %}

### The Scenario

A junior data analyst asks an AI tool to write a script to handle missing test scores in a public school district's academic-performance dataset.

### The AI Output

AI generates a clean, error-free script that automatically replaces all missing values in the test-score column with the dataset's median score. It explains that this is a common statistical approach that avoids dropping rows.

### The Missing Context

The analyst accepts the code without investigating why the scores are missing. In reality, the missing scores belong largely to students in specialized long-term medical leave programs or alternative behavioral units who were exempt from district testing.

### The Business and Ethical Harm

By imputing a median score for exempt or absent students, the analysis alters district-wide averages and may mask important equity patterns affecting vulnerable student populations.

### Consider

{% q "Why can a statistically reasonable default become a silent logic bug when it is applied without human domain knowledge?" %}
**Possible answer:** A statistical default can seem reasonable because it is a common way to handle data, but it may still be wrong for the specific situation. In this example, replacing missing test scores with the median hides the fact that some students did not take the test for important reasons, such as medical leave or participation in alternative programs. Without understanding why the data are missing, you could change the results in a way that gives a misleading picture of student performance. This is why you need human knowledge of the real-world context, not just a statistical rule.
{% endq %}

{% q "What should you investigate before deciding how to handle those missing values?" %}
**Possible answer:** Before deciding what to do, you should investigate why the values are missing and whether the missing data are connected to particular groups of students or circumstances. You might ask:

- Were the students absent, exempt, or unable to take the test?
- Are the missing scores concentrated in certain programs or student groups?
- Is the missing data caused by a reporting or data-entry problem?
- Would replacing the missing values change the results in a misleading way?

The key is to understand what the missing values mean before choosing how to handle them.
{% endq %}

{% section "Thought Exercise 2: Hallucinated Code" %}

### The Scenario

A product data analyst at a software company asks an LLM to write a script that filters user logs for customers who opted into an experimental "Beta Dashboard" feature.

### The AI Output

AI writes a script containing a professional-looking pandas method:

```python
df.filter_beta_users()
```

The code looks like it could be correct.

### The Problem

`filter_beta_users()` is not a built-in pandas DataFrame method. AI has generated a name that sounds reasonable based on the task. When the code runs, Python raises an AttributeError.

### Why This Matters

An obvious error can be corrected, but hallucinated methods, column names, or other elements become especially problematic when they are buried inside a larger workflow or when you assume unfamiliar code is valid because it looks professional.

### Consider

{% q "Why can hallucinated methods or column names be dangerous?" %}
**Possible answer:** They can look real and professional even when they do not actually exist. If you trust them without checking, your code may fail, use the wrong data, or produce incorrect results. The risk is greater when the incorrect method or field is buried inside a larger script and is harder to notice.
{% endq %}

{% q "What steps should you take to verify that an AI-generated method actually exists and matches your data or library documentation?" %}
**Possible answer:** You should check the official documentation for the software library, review the columns and fields in your actual dataset, and test the code before relying on it. If you do not recognize a method, function, or field name, treat that as a signal to verify it rather than assume the AI is correct.
{% endq %}

{% section "Optional Quick Challenge: The Automated Outlier Exterminator" %}

{% optional "The Automated Outlier Exterminator" %}
### The Scenario

An e-commerce fraud analytics team asks AI to clean a transaction dataset and "remove noise" so its machine-learning model can train more efficiently.

### The AI Output

AI generates a data-cleaning script that automatically drops transactions falling outside 1.5 times the interquartile range, or IQR, a commonly used approach for identifying potential numerical outliers.

### The Missing Context

The company's highest-spending corporate customers regularly make unusually large bulk purchases during the holiday season.

### The Business Harm

The script successfully "cleans" the dataset by deleting some of the company's most valuable customer transactions. The model can then miss important fraud-detection and revenue patterns.

### Consider

{% q "How can treating an organizationally meaningful anomaly as a statistical outlier distort real-world behavior?" %}
**Possible answer:** An unusual value is not always an error. It may represent something important that really happened. In this example, very large purchases by corporate customers are unusual compared with typical transactions, but they are also real and valuable. If those purchases are automatically removed as "outliers," the data no longer show the full range of actual customer behavior. That can lead to a model that misses important patterns.
{% endq %}

{% q "Where do you need to step in to determine whether an extreme value is a true error or a meaningful event?" %}
**Possible answer:** You need to step in before the unusual value is automatically removed or changed. You should investigate where the value came from, whether it makes sense in the real-world situation, and whether similar values have occurred before. You may also need to check with people who understand the business or the data. The key question is: Is this value wrong, or is it telling us something important?
{% endq %}
{% endoptional %}

{% section "Concrete Code Breakdown: When Missing Data Becomes a Problem" %}

Now look closely at an AI failure that does not necessarily announce itself with an obvious coding error.

### Scenario

You ask AI to write a script to clean missing values in a company's quarterly financial dataset.

### The Prompt

> **"Write a Python snippet to clean our financial transaction export and handle missing values in the revenue column."**

### The AI-Generated Output

AI chooses a quick programmatic default and fills all missing values with 0.

```python
import pandas as pd

# AI-generated script: handles missing values automatically
def clean_financial_data(df):
    # AI treats missing revenue as a simple null-value problem
    df["revenue"] = df["revenue"].fillna(0)
    df["net_profit"] = df["revenue"] - df["operating_costs"]
    return df
```

### The Hidden Risk and Business Harm

**What the Code Does.** The script runs successfully. Every missing value in the revenue column is converted to 0, allowing the later calculations to proceed.

**The Silent Failure.** From a programming perspective, the code works. From a financial perspective, it could be seriously wrong.

**The Reason.** Suppose a high-value account or newly acquired subsidiary has a missing revenue entry because some of its financial data did not transfer correctly into the system.

Filling that missing value with 0 treats an unknown revenue amount as **zero dollars**.

If the cleaned dataset is later fed into a forecasting model or presented to organizational leaders, the error could artificially lower quarterly averages and distort trends.

### Your Audit

You need to intercept the code and ask:

**Why is the revenue missing?**

Is it a true zero, such as a dormant account?

Or is it a missing record that needs investigation, exclusion, or another treatment?

*You need to use your judgment and domain knowledge to decide how the missing data should be handled.*

{% section "Interactive Exercise: Spot the Hallucination" %}

Look at this AI-generated customer-segmentation script:

```python
# AI-Generated Customer Segment Script
import pandas as pd

def segment_high_value_users(df):
    # AI hallucinates a non-existent pandas method
    active_df = df.filter_super_users(threshold=5000)
    return active_df["customer_id"]
```

### Consider

1. Does this code run successfully? Why or why not?
2. How might AI have generated a method name that sounds convincing but does not exist?
3. What is your role as the practitioner?

{% q "Reveal answers" %}
1. `filter_super_users()` is not a built-in pandas DataFrame method.
2. The method name sounds plausible, but it needs to be replaced with valid pandas filtering logic.
3. Your responsibility is to recognize the hallucination, consult appropriate documentation when necessary, and make sure the code actually matches the dataset and the task.
{% endq %}

{% callout "checkpoint", "Human Judgment Checkpoint" %}
**Zero errors does not equal correct logic.**

Before accepting AI-generated code or analysis, ask yourself:

- Does the code perform the task I intended?
- Does it use the correct fields and definitions?
- What assumptions are built into it?
- How does it handle missing or unusual values?
- Did AI choose a convenient default without considering its consequences?
- Are unfamiliar methods, functions, or fields actually real?
- What should I check against the dataset?
- What should I check against documentation or organizational knowledge?
{% endcallout %}

{% section "Key Takeaways" %}

{% callout "takeaways", "Key Takeaways" %}
**Zero errors does not equal correct organizational logic.** An AI-generated script can run without producing an error and still introduce damaging problems into your data workflow.

**Beware of convenient defaults.** AI may suggest automated approaches, such as filling missing data with zeros or dropping records, that solve a coding problem without addressing what the data mean.

**Trust, but verify.** Your responsibility in an AI-enhanced workflow includes rigorous code auditing, checking documentation, and questioning assumptions before AI-generated work is used.
{% endcallout %}

{% section "Before You Continue" %}

You have now seen several ways AI-supported data work can go wrong:

- important context can be missing;
- assumptions can be inappropriate;
- code can contain silent logic errors;
- AI can hallucinate;
- statistical rules can be applied without understanding what unusual data mean.

In the final part of the module, you will bring these ideas together.

Instead of simply examining examples, **you will take responsibility for auditing an AI-generated recommendation yourself.**
