---
order: 3
title: Transform
kicker: Module 3 · Part 3
standfirst: >
  Now fix what you found, and build the columns your question needs. Both look like chores and are really a run of decisions.
prev:
  url: /module-3/02-explore/
  label: Part 2 · Explore
next:
  url: /module-3/04-analyze/
  label: Part 4 · Analyze
---

Part 2 gave you a list of problems. This part is where you fix them. But cleaning is not just correcting mistakes — every fix is a decision. When you map "F" and "female" and "FEMALE" to "Female", you are deciding those all mean the same thing and that the standardised label is the right one. When you replace an age of 999 with a missing value, you are deciding the original entry cannot be trusted and should not influence any calculation. None of these decisions have a single obviously correct answer, and all of them affect every result downstream.

The second half of this part is building new columns from what you have. A date column becomes a month column and a year column. A visit count per patient becomes a flag for high utilizers — patients seen four or more times. These derived variables are not in the raw file. You create them because the question you settled on in Part 1 cannot be answered without them.

{% section "Get a feel for it" %}

{% slot "activity", "An activity and two check questions, the shape Parts 1 and 2 use. The idea for this part is cleaning one column start to finish, so a fix that quietly drops rows is something the student feels before the notebook asks for one.", "200px" %}

{% section "Lessons" %}

### The concept

Raw data is almost never ready to analyse. It contains the problems found during exploration: duplicate records, inconsistent category labels, invalid values, improperly formatted dates, and missing entries. Cleaning means addressing every one of those problems and producing a dataset that analysis can be trusted to run on.

Cleaning involves several distinct operations. **Removing duplicates** ensures each event is counted only once — 15 duplicate rows in a visit file inflate every count by those 15 visits. **Standardising categories** maps all the variant spellings of a value to one agreed-upon form, so that "Female", "female", "F", and "f" all become a single category in analysis. **Fixing invalid values** means replacing impossible entries — a negative age, a negative copay — with a missing value marker so they are excluded from calculations. **Parsing dates** converts text representations into a proper date format so the system understands them as time values rather than strings.

After cleaning, a data scientist often creates new columns derived from existing ones. This is called feature engineering. A visit date can be split into a month, a year, and a named month column — one variable becomes three useful analytical dimensions. A visit count per patient can classify each row as belonging to a high utilizer. A date-difference calculation can produce the number of days since a patient's previous visit. These derived variables unlock analysis questions the original columns alone could not answer.

### How AI can help

Cleaning is one of the most repetitive parts of data work. Writing mapping dictionaries for category standardisation, date parsing logic, conditional replacement rules, and duplicate removal code is straightforward to describe but slow to produce from scratch. AI can generate a complete, structured cleaning script from a detailed description of what the exploration step found.

For a dataset with multiple columns containing inconsistent categories — gender with 14 variants, insurance type with 18, visit type with 16 — an AI-generated script can handle all standardisation rules in one pass. This turns hours of incremental coding into minutes of prompting and verification.

AI is equally useful for feature engineering. Creating a high-utilizer flag requires counting visits per patient and mapping those counts back to every row. Creating a days-since-last-visit column requires sorting records by patient and date before computing a running difference. These multi-step operations are easy to describe to AI and produce code that is ready to test immediately.

### How to use AI

A cleaning prompt must be exhaustive. Every problem found during exploration needs to appear in it, with specific rules for how to resolve each one. "Clean the gender column" produces incomplete code. Listing every variant and its target value produces usable code.

<pre class="prompt">Write Python code to clean a DataFrame called df and store the result in
df_clean. Apply these changes:

1. Remove exact duplicate rows.
2. Standardize the gender column: map f, F, female, Female, FEMALE to
   Female; m, M, male, Male, MALE to Male; Non-binary, NB, other, Other
   to Other. Anything else becomes missing.
3. Standardize insurance_type: map mcd, medicaid, MEDICAID to Medicaid;
   MCR, medicare, Medicare to Medicare; Commercial, commercial, private,
   Private, PRIVATE to Private; self-pay, Self-Pay, uninsured, Uninsured
   to Uninsured. Anything else becomes missing.
4. Standardize visit_type to four values: Office Visit, Telehealth,
   Follow-Up, Urgent Care — list the variants that map to each.
5. Standardize follow_up_required: Y, Yes, YES, yes, 1 to 1; N, No, NO,
   no, 0 to 0.
6. Replace any age below 0 or above 120 with missing.
7. Replace any negative copay_amount with missing.
8. Parse visit_date to a proper date format, treating any unparseable
   values as missing.

Print row count before and after, and the unique values in gender,
insurance_type, and visit_type after cleaning.</pre>

The same specificity applies to feature engineering prompts. When asking AI to create a high-utilizer flag, state the threshold (four or more visits per patient), how it should be encoded (True or False), and which column holds the patient identifier. When asking for days since last visit, specify that records must be sorted by patient and then by date before the calculation runs, and that a patient's first visit should receive a missing value.

### Evaluating AI output

Cleaning code must be verified against the actual data, not just reviewed visually. Code that looks correct can still fail to do what you intended. The only reliable check is running the code and examining the results.

**Check unique values after standardisation.** Run a unique value count on every column that was cleaned and confirm it contains exactly the expected categories — nothing more, nothing fewer. If a gender column that should contain three values contains four, a variant was missed in the mapping. If it contains fewer, some values may have been accidentally converted to missing.

**Check row counts.** Confirm the cleaned dataset is smaller than the original by the number of duplicate rows found in Part 2. If the count did not change, the duplicate removal did not execute correctly.

**Check that invalid values are gone.** Filter the cleaned dataset for the conditions that should now be absent — age below zero, negative copay. The result should be empty. If rows are returned, the replacement code ran incorrectly.

**Spot-check derived columns manually.** For at least one patient who appears multiple times in the dataset, calculate the number of days between visits by hand and compare your answer to what the column contains. A discrepancy means the sorting or calculation logic has an error.

The most common silent error in AI-generated cleaning code is a missing variant in a mapping dictionary. If one spelling is absent, every record with that spelling becomes a missing value instead of the intended standard value. No error message appears — data just disappears. Checking unique value counts before and after is the only way to catch it.

### Best practices

**List every variant in your prompt.** If a variant is not in the prompt, AI will not include it in the mapping and that value will silently become missing after cleaning.

**Never overwrite the original dataset.** Always store the cleaned version in a new variable. Keep the original so you can compare before and after and recover from mistakes.

**Print before-and-after counts.** Ask AI to print row counts and unique value counts before and after every operation. These numbers are your first verification layer.

**Treat the first draft as a starting point.** AI-generated cleaning code almost always requires at least one correction after you run it and check the output. That is the normal workflow, not a failure.

{% section "Do it for real" %}

The job. Take the problems you found in Part 2 and fix every one of them, in a notebook, with an AI writing the code from your prompts. Then build at least two derived columns your question actually needs. By the end, you should be able to run a count on your cleaned dataset and trust the number.

{% slot "notebook", "The notebook for this part, opening in Colab the way Part 2's does. It starts from the raw file, so this part works whatever happened in your Part 2 notebook.", "180px" %}

{% section "How a practitioner did it" %}

{% slot "video", "The practitioner. A messy column and a derived column from real work. What they did, and who they had to ask.", "180px" %}

**Compare their cleaning decisions against yours.** Where they standardised a value differently, which choice is more defensible and why? Where they left something unfixed that you fixed, was that a deliberate call or something they missed?

**Compare their derived columns against yours.** Did they build the same ones, or did their question push them toward different variables? What does that difference tell you about how the question shapes the preparation work?

{% feedback "3", "3" %}
