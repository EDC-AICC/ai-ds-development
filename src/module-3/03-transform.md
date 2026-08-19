---
order: 3
title: Transform
---

{% section "The setup" %}

{% todo "To write" %}
TODO: The opening.
{% endtodo %}

{% section "Get a feel for it" %}

{% slot "activity", "An activity and two check questions, the shape Parts 1 and 2 use. The idea for this part is cleaning one column start to finish, so a fix that quietly drops rows is something the student feels before the notebook asks for one.", "200px" %}

{% section "The Concept" %}

### Transform: Cleaning and Shaping Your Data

Raw data is almost never ready to analyse. It contains the problems found during exploration: duplicate records, inconsistent category labels, invalid values, improperly formatted dates, and missing data. The Transform step is where you address every one of those problems and produce a clean, reliable dataset that analysis can be trusted to run on.

Cleaning involves several distinct operations. Removing duplicates ensures each event is counted only once. Standardising categories means mapping all the variant spellings of a value to one agreed-upon form, so that "Female", "female", "F", and "f" all become a single "Female" category in the analysis. Fixing invalid values means replacing impossible entries like a negative age or a negative payment amount with a missing value marker so they are not included in calculations. Parsing dates means converting text representations of dates into a proper date format so that the system understands them as time values rather than strings.

After cleaning, a data scientist often creates new columns derived from the ones already in the dataset. This is called feature engineering. A date column can be split into a month column, a year column, and a month name column, turning one variable into three useful analytical dimensions. A visit count per patient can be used to classify patients as high utilizers if they exceed a threshold, creating a binary variable that enables a whole new set of comparisons. A date difference calculation can produce a column showing how many days elapsed between each patient's visits, revealing patterns in care continuity. These derived variables unlock analysis questions that the original columns alone could not answer.

{% concept %}Cleaning produces a trustworthy dataset by removing duplicates, standardising categories, fixing invalid values, and parsing dates. Feature engineering creates new analytical variables derived from existing columns, expanding what questions can be answered.{% endconcept %}

{% section "How AI Can Help" %}

Cleaning is one of the most repetitive parts of data science work. Writing mapping dictionaries for category standardisation, date parsing logic, conditional replacement rules, and duplicate removal code is conceptually straightforward but slow to produce from scratch. AI can generate a complete, structured cleaning script from a detailed description of the problems found during exploration.

For a clinical visit dataset with multiple columns containing inconsistent categories, an AI-generated cleaning script can cover all standardisation rules simultaneously, handling gender variants, insurance type variants, visit type variants, and follow-up field variants in a single script. This reduces hours of incremental coding to minutes of prompting and verification.

AI is equally useful for feature engineering. Creating a column that classifies patients as high utilizers requires counting visits per patient, comparing each count to a threshold, and mapping the result back to every row for that patient. Creating a column for days since the last visit requires sorting records by patient and date before computing a running difference. These multi-step operations are easy to describe to AI and produce code that is ready to test immediately.

{% aihelps %}AI can generate complete cleaning and feature engineering scripts from a detailed description of the problems to fix and the variables to create. This shifts your effort from writing code to verifying that the code did exactly what was intended.{% endaihelps %}

{% section "How to Use AI" %}

A cleaning prompt must be exhaustive. Every problem identified during exploration needs to appear in the prompt, with specific rules for how to resolve it. Vague instructions like "clean the gender column" produce incomplete code. Specific instructions like "map f, F, female, Female, FEMALE to Female; m, M, male, Male, MALE to Male; Non-binary, NB, other, Other to Other; leave anything else as missing" produce usable code.

A strong cleaning prompt for a clinical visit dataset lists every standardisation rule explicitly, names the output variable where the clean data should be stored, and asks for a before-and-after comparison of row counts and unique values so the results are immediately verifiable:

{% aiprompt %}Write Python code to clean a DataFrame called df and store the result in df_clean. Apply these changes: 1. Remove exact duplicate rows. 2. Standardize the gender column: map f, F, female, Female, FEMALE to Female; m, M, male, Male, MALE to Male; Non-binary, NB, other, Other to Other; anything else becomes missing. 3. Standardize the insurance_type column: map mcd, medicaid, MEDICAID to Medicaid; MCR, medicare, Medicare to Medicare; Commercial, commercial, private, Private, PRIVATE to Private; self-pay, Self-Pay, uninsured, Uninsured to Uninsured; anything else becomes missing. 4. Standardize visit_type to four values: Office Visit, Telehealth, Follow-Up, Urgent Care — list the variants that map to each. 5. Standardize follow_up_required: map Y, Yes, YES, yes, 1 to 1 and N, No, NO, no, 0 to 0. 6. Replace any age below 0 or above 120 with missing. 7. Replace any negative copay_amount with missing. 8. Parse visit_date to a proper date format, treating any unparseable values as missing. Print: row count before and after, and the unique values in gender, insurance_type, and visit_type after cleaning.{% endaiprompt %}

The same specificity applies to feature engineering prompts. When asking AI to create a high utilizer flag, you must state the threshold (four or more visits per patient), how the flag should be encoded (True or False, or 1 and 0), and which column contains the patient identifier. When asking for a days-since-last-visit column, you must specify that records should be sorted by patient and date before the calculation, and that a patient's first visit should receive a missing value rather than a number.

{% section "Evaluating AI Output" %}

Cleaning code must be verified against the actual data, not just reviewed visually. Code that looks correct can still fail to do what you intended. The only reliable check is running the code and examining the results.

For category standardisation, run a unique value count on every column that was cleaned and confirm the result contains exactly the expected categories and nothing else. If a gender column that should contain three values contains four, a variant was missed in the mapping. If it contains fewer, some values may have been accidentally converted to missing. Either way, something needs to be corrected.

For row counts, confirm the cleaned dataset is smaller than the original by the number of duplicate rows identified during exploration. If the count did not change, the duplicate removal did not execute correctly.

For invalid value replacement, run a filter on the cleaned dataset for the conditions that should now be absent, such as age below zero or negative copay amounts. The result should be empty. If rows are returned, the replacement code ran incorrectly or on the wrong column.

For derived columns, verify at least one value manually. Choose a patient who appears multiple times in the dataset, calculate the number of days between their visits by hand, and compare your answer to what the column contains. A discrepancy means the sorting or calculation logic has an error.

One of the most common errors in AI-generated cleaning code is a missing variant in a mapping dictionary. If one spelling of a category is absent from the mapping, every record with that spelling will silently become a missing value instead of the intended standard value. This error does not produce an error message. It just removes data. The only way to catch it is to verify the unique value counts before and after.

{% aieval %}Verify cleaning by: (1) checking unique values in every standardised column against the expected set, (2) confirming row count decreased by the expected number of duplicates, (3) confirming no invalid values remain by filtering for them, (4) spot-checking at least one derived column value manually. Code that looks right can still produce wrong results.{% endaieval %}

{% section "Resources" %}

#### Best Practices

{% todo %}{% endtodo %}

#### Learn More

<ul class="learnmore">
<li><a href="https://www.youtube.com/watch?v=1VGmNECFNxc" target="_blank" rel="noopener"><strong>YouTube: Data Cleaning with AI (Thu Vu Data Analytics)</strong></a><br><span class="lm-desc">How to prompt AI for pandas cleaning tasks</span></li>
<li><a href="https://towardsdatascience.com/the-ultimate-guide-to-data-cleaning-3969843991d4" target="_blank" rel="noopener"><strong>Towards Data Science: The Ultimate Guide to Data Cleaning</strong></a><br><span class="lm-desc">Conceptual foundation for understanding cleaning tasks</span></li>
<li><a href="https://cookbook.openai.com/" target="_blank" rel="noopener"><strong>OpenAI Cookbook: AI for Data Tasks</strong></a><br><span class="lm-desc">Practical examples of AI-assisted data workflows</span></li>
<li><a href="https://openrefine.org/" target="_blank" rel="noopener"><strong>OpenRefine (free visual cleaning tool)</strong></a><br><span class="lm-desc">Useful for verifying category standardisation visually</span></li>
</ul>

{% section "Do it for real" %}

{% todo "To write" %}
The job statement for this part, the way Parts 1 and 2 state theirs.
{% endtodo %}

{% slot "notebook", "The notebook for this part, opening in Colab the way Part 2's does. It starts from the raw file, so this part works whatever happened in your Part 2 notebook.", "180px" %}

{% section "How a practitioner did it" %}

{% slot "video", "The practitioner. A messy column and a derived column from real work. What they did, and who they had to ask.", "180px" %}

{% todo "To write" %}
The two comparisons the student makes against the recording, chosen for this part.
{% endtodo %}

{% section "Feedback" %}

This module is a draft, and what you say here directly shapes the next revision. A sentence about what confused you or what worked is genuinely useful.

{% feedback "3", "3" %}
