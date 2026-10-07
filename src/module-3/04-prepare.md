---
order: 4
title: "Prepare: Cleaning and Shaping Your Data"
navLabel: Prepare
---

{% section "Every Fix Is a Decision", "every-fix-is-a-decision" %}

Part 3 gave you a list of problems. This part is where you fix them. But cleaning is not just correcting mistakes. Every fix is a decision. When you map "F" and "female" and "FEMALE" to "Female", you are deciding those all mean the same thing and that the standardized label is the right one. When you replace an age of 999 with a missing value, you are deciding the original entry cannot be trusted and should not influence any calculation. None of these decisions has a single obviously correct answer, and all of them affect every result downstream.

The second half of this part is building new columns from what you have. A date column becomes a month column and a year column. A visit count per patient becomes a flag for patients who return often. These derived columns are not in the raw file. You create them because the question you settled on in Part 2 cannot be answered without them.

{% section "Try It: Clean One Column", "try-it-clean-one-column" %}

{% slot "activity", "An activity and two check questions, the shape Parts 2 and 3 use. The idea for this part is cleaning one column start to finish, so a fix that quietly drops rows is something the student feels before the notebook asks for one.", "200px" %}

{% section "Learn: Cleaning and Feature Engineering", "learn-cleaning-and-feature-engineering" %}

Raw data is almost never ready to analyze. It contains the problems found during exploration: duplicate records, inconsistent category labels, invalid values, improperly formatted dates, and missing data. The Prepare step is where you address every one of those problems and produce a clean, reliable dataset that analysis can be trusted to run on.

Cleaning involves several distinct operations. Click each one to read more.

{% accordion %}
{% fold "Removing duplicates" %}
Removing duplicates ensures each event is counted only once.
{% endfold %}
{% fold "Standardizing categories" %}
Standardizing categories means mapping all the variant spellings of a value to one agreed-upon form, so that "Female", "female", "F", and "f" all become a single "Female" category in the analysis.
{% endfold %}
{% fold "Fixing invalid values" %}
Fixing invalid values means replacing impossible entries like a negative age or a negative payment amount with a missing value marker so they are not included in calculations.
{% endfold %}
{% fold "Parsing dates" %}
Parsing dates means converting text representations of dates into a proper date format so that the system understands them as time values rather than strings.
{% endfold %}
{% endaccordion %}

After cleaning, a data scientist often creates new columns derived from the ones already in the dataset. This is called **feature engineering**. A date column can be split into a month, a year, and a named month column, turning one variable into three useful analytical dimensions. A visit count per patient can classify each record as belonging to a high utilizer, creating a binary variable that enables a whole new set of comparisons. A date difference calculation can show how many days elapsed between each patient's visits, revealing patterns in care continuity. These derived variables unlock analysis questions that the original columns alone could not answer.

{% callout "highlight" %}
Cleaning improves the trustworthiness of a dataset by removing duplicates, standardizing categories, fixing invalid values, and parsing dates. Feature engineering creates new analytical variables derived from existing columns, expanding what questions can be answered.
{% endcallout %}

{% optional "Looking Ahead: Preparing Data for Machine Learning" %}
When data will be used to train a machine learning model, additional transformations are often required. Most algorithms work with numbers, not text, so categorical variables need to be encoded into numeric form. A gender column standardized to "Female" and "Male" might be encoded as 1 and 0. An insurance type column with four categories might be expanded into four separate binary columns, one for each category, a technique called **one-hot encoding**. Other common pre-modeling transformations include scaling numeric columns so that variables measured in very different ranges do not distort the model, and resolving any remaining missing values since most algorithms cannot process them directly.

These steps go beyond basic cleaning and will be covered in more depth when the course reaches machine learning. For now, it is worth knowing they exist so that the standardization and labeling decisions you make here are made with the full pipeline in mind.
{% endoptional %}

{% section "Where AI Can Help", "where-ai-can-help" %}

Cleaning is one of the most repetitive parts of data science work. Writing mapping dictionaries for category standardization, date parsing logic, conditional replacement rules, and duplicate removal code is conceptually straightforward but slow to produce from scratch. AI can generate a complete, structured cleaning script from a detailed description of the problems found during exploration.

For a clinical visit dataset with multiple columns containing inconsistent categories, an AI-generated cleaning script can cover all standardization rules simultaneously, handling gender variants, insurance type variants, visit type variants, and follow-up field variants in a single script. This reduces hours of incremental coding to minutes of prompting and verification.

AI is equally useful for feature engineering. Creating a column that classifies patients as high utilizers requires counting visits per patient, comparing each count to a threshold, and mapping the result back to every row for that patient. Creating a column for days since the last visit requires sorting records by patient and date before computing a running difference. These multi-step operations are easy to describe to AI and produce code that is ready to test immediately.

{% callout %}
**In short:** AI can generate complete cleaning and feature engineering scripts from a detailed description of the problems to fix and the variables to create. This shifts your effort from writing code to verifying that the code did exactly what was intended.
{% endcallout %}

{% section "How to Use AI", "how-to-use-ai" %}

A cleaning prompt must be exhaustive. Every problem identified during exploration needs to appear in the prompt, with specific rules for how to resolve it. Vague instructions like "clean the gender column" produce incomplete code. Specific instructions like "map f, F, female, Female, FEMALE to Female; m, M, male, Male, MALE to Male; Non-binary, NB, other, Other to Other; leave anything else as missing" produce usable code.

A strong cleaning prompt for a clinical visit dataset lists every standardization rule explicitly, names the output variable where the clean data should be stored, and asks for a before-and-after comparison of row counts and unique values so the results are immediately verifiable:

> Write Python code to clean a DataFrame called df and store the result in df_clean. Apply these changes:
>
> 1. Remove exact duplicate rows.
> 2. Standardize the gender column: map f, F, female, Female, FEMALE to Female; m, M, male, Male, MALE to Male; Non-binary, NB, other, Other to Other; anything else becomes missing.
> 3. Standardize the insurance_type column: map mcd, medicaid, MEDICAID to Medicaid; MCR, medicare, Medicare to Medicare; Commercial, commercial, private, Private, PRIVATE to Private; self-pay, Self-Pay, uninsured, Uninsured to Uninsured; anything else becomes missing.
> 4. Standardize visit_type to four values: Office Visit, Telehealth, Follow-Up, Urgent Care. List the variants that map to each.
> 5. Standardize follow_up_required: map Y, Yes, YES, yes, 1 to 1 and N, No, NO, no, 0 to 0.
> 6. Replace any age below 0 or above 120 with missing.
> 7. Replace any negative copay_amount with missing.
> 8. Parse visit_date to a proper date format, treating any unparseable values as missing.
>
> Print: row count before and after, and the unique values in gender, insurance_type, and visit_type after cleaning.

The same specificity applies to feature engineering prompts. When asking AI to create a high-utilizer flag, you must state the threshold (four or more visits per patient), how the flag should be encoded (True or False, or 1 and 0), and which column contains the patient identifier. When asking for a days-since-last-visit column, you must specify that records should be sorted by patient and date before the calculation, and that a patient's first visit should receive a missing value rather than a number.

{% section "Evaluating AI Output", "evaluating-ai-output" %}

Cleaning code must be verified against the actual data, not just reviewed visually. Code that looks correct can still fail to do what you intended. The only reliable check is running the code and examining the results. Click each check below to read more.

{% accordion %}
{% fold "Category standardization" %}
Run a unique value count on every column that was cleaned and confirm the result contains exactly the expected categories and nothing else. If a gender column that should contain three values contains four, a variant was missed in the mapping. If it contains fewer, some values may have been accidentally converted to missing. Either way, something needs to be corrected.
{% endfold %}
{% fold "Row counts" %}
Confirm the cleaned dataset is smaller than the original by the number of duplicate rows identified during exploration. If the count did not change, the duplicate removal did not execute correctly.
{% endfold %}
{% fold "Invalid value replacement" %}
Run a filter on the cleaned dataset for the conditions that should now be absent, such as age below zero or negative copay amounts. The result should be empty. If rows are returned, the replacement code ran incorrectly or on the wrong column.
{% endfold %}
{% fold "Derived columns" %}
Verify at least one value manually. Choose a patient who appears multiple times in the dataset, calculate the number of days between their visits by hand, and compare your answer to what the column contains. A discrepancy means the sorting or calculation logic has an error.
{% endfold %}
{% endaccordion %}

{% callout "warn" %}
One of the most common errors in AI-generated cleaning code is a **missing variant in a mapping dictionary**. If one spelling of a category is absent from the mapping, every record with that spelling will silently become a missing value instead of the intended standard value. This error does not produce an error message. It just removes data. The only way to catch it is to verify the unique value counts before and after.
{% endcallout %}

{% callout "checkpoint", "Human Judgment Checkpoint" %}
Verify cleaning by:

1. checking unique values in every standardized column against the expected set;
2. confirming the row count decreased by the expected number of duplicates;
3. confirming no invalid values remain by filtering for them; and
4. spot-checking at least one derived column value manually.

Code that looks right can still produce wrong results.
{% endcallout %}

{% section "Best Practices", "best-practices" %}

**List every variant in your prompt.** If a variant is not explicitly in the prompt, AI will not include it in the mapping, and that value will silently become missing after cleaning.

**Never overwrite the original dataset.** Always store the cleaned version in a new variable. Keep the original so you can compare before and after and recover from mistakes.

**Print before-and-after counts.** Ask AI to print row counts and unique value counts before and after every cleaning operation. These numbers are your first verification layer.

**Treat the first draft as a starting point.** AI-generated cleaning code almost always requires at least one correction after you run it and check the output. That is the normal workflow, not a failure.

{% optional "Learn More" %}
<ul class="learnmore">
<li><a href="https://www.youtube.com/watch?v=1VGmNECFNxc" target="_blank" rel="noopener"><strong>YouTube: Data Cleaning with AI (Thu Vu Data Analytics)</strong></a><br><span class="lm-desc">How to prompt AI for pandas cleaning tasks</span></li>
<li><a href="https://towardsdatascience.com/the-ultimate-guide-to-data-cleaning-3969843991d4" target="_blank" rel="noopener"><strong>Towards Data Science: The Ultimate Guide to Data Cleaning</strong></a><br><span class="lm-desc">Conceptual foundation for understanding cleaning tasks</span></li>
<li><a href="https://cookbook.openai.com/" target="_blank" rel="noopener"><strong>OpenAI Cookbook: AI for Data Tasks</strong></a><br><span class="lm-desc">Practical examples of AI-assisted data workflows</span></li>
<li><a href="https://openrefine.org/" target="_blank" rel="noopener"><strong>OpenRefine (free visual cleaning tool)</strong></a><br><span class="lm-desc">Useful for verifying category standardization visually</span></li>
</ul>
{% endoptional %}

{% section "Try It: Clean the Clinic Data", "try-it-clean-the-clinic-data" %}

{% tryit %}
Fix the problems from your Part 3 quality report that matter for the brief, in a notebook, with an AI writing the code from your prompts. By the end, you should be able to run a count on your cleaned dataset and trust the number.

From here on, the notebooks use the clinic's agreed brief, shown at the top of each one, so everyone works toward the same question: who uses the clinic and how often, centered on repeat visitors and uninsured patients. Compare it with your own brief from Part 2.

{% notebook "Notebook 2 · Prepare", "m3-prepare.ipynb" %}
Opens in Colab and loads the raw clinic file, so this part works whatever happened in your Part 3 notebook. One section per problem: you answer the questions and record your decision before writing any code, then run the code, verify it, and fill in the log entry.
{% endnotebook %}

### Keep a Decision Log

For every change you make, the notebook asks you to record:

- what you changed, and how many rows it affected;
- why you made that choice; and
- what you checked afterward to confirm it worked.

Someone reading your log should be able to see exactly how the cleaned file differs from the raw one, and why.
{% endtryit %}

{% section "See It in Practice: Cleaning What the Brief Needs", "see-it-in-practice" %}

In this video, Habeeba cleans the clinic file using the decisions from her brief and the problems from her exploration. She calls this the Transform step. Watch for the moments where she looks at the data before writing a prompt, and where she checks the result after the code runs.

{% video "1230108824", "Prepare: cleaning what the brief needs (Habeeba Siddiqui, 8:04)", "m3-prepare.txt" %}

{% notebook "Habeeba's Notebook · Prepare", "m3-prepare-practitioner.ipynb" %}
Her decision for each section, the prompt that produced the code, the output, and her cleaning log. Open it after you have finished your own.
{% endnotebook %}

**Compare her cleaning decisions with yours.** Habeeba's cleaned file keeps every row except true duplicates. Impossible ages and copays became missing values, and missing counties got a `county_known` flag instead of being dropped. Did you drop any rows she kept? For each choice, what does it cost, and which is easier to defend to the director?

**Compare how you each checked the dates.** Habeeba parsed the dates in two passes and looked at the values that failed the first time, which recovered hundreds of dates that would otherwise have been counted as missing. If you checked your date column only by counting the missing values, what might you have lost?

**Compare your logs.** Read her cleaning log next to yours. Could someone rebuild your cleaned file from your log alone? Where her log records something yours does not, what would that missing line cost someone who questions a number later?

{% section "Key Takeaways", "key-takeaways" %}

{% callout "takeaways", "Key Takeaways" %}
- Every cleaning step is a decision with consequences downstream. Document what you changed, why, and how many rows it affected.
- Your brief is the scope. Prioritize cleaning the columns your question depends on.
- Look at the data before you prompt, and compare the result with the original after the code runs.
- Never overwrite the original dataset, and prefer flagging or marking values as missing over dropping rows.
- The most dangerous cleaning errors produce no error message. Before-and-after counts are how you catch them.
{% endcallout %}

### Before You Continue

You now have a cleaned dataset and a record of every decision that shaped it. In Part 5, you will use it to answer the question from your brief, and then check who might be missing from the answer.

{% section "Feedback", "feedback" %}

This module is a draft, and what you write here shapes the next revision. A sentence about what confused you, or what worked, is enough.

{% feedback %}
