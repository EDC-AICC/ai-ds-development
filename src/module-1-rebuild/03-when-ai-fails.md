---
order: 3
title: "When AI Fails: Risks, Hallucinations, and Silent Logic Bugs"
navLabel: When AI Fails
---

{% section "Missing revenue", "missing-revenue" %}

You work in finance at a company that sells to other businesses. Your manager wants the average revenue per account for last quarter. You give an AI assistant the revenue export with this request.

> Clean our revenue export, handle any missing values in the revenue column, and give me the average revenue per account.

{% smalltable "Last quarter's revenue export" %}
| account | revenue |
| --- | --- |
| Alder Clinics | $120,000 |
| Birch Logistics | $80,000 |
| Harbor Supply | (blank) |
| Cedar Foods | $100,000 |
{% endsmalltable %}

The AI's script runs without an error. To deal with the blank, it uses this line, which replaces every blank in the revenue column with 0.

```python
df["revenue"] = df["revenue"].fillna(0)
```

{% answer "What average revenue per account does the script report, in dollars?", "75000 | 75k | 75 thousand" %}
Hint: Add the four revenues, counting the blank as 0, then divide by four accounts.
If 100000: $100,000 is the average of the three accounts that have a number. The script counts Harbor Supply too, as $0.
If 300000: $300,000 is the total. Divide it by the four accounts.
$75,000. The script adds $120,000, $80,000, $0 and $100,000, then divides by four accounts.
{% endanswer %}

You ask the accounting team about Harbor Supply. The company bought Harbor Supply last quarter, and its sales figures haven't been loaded into the system yet. Its revenue for the quarter was $200,000.

{% answer "With Harbor Supply's real revenue, what is the average revenue per account, in dollars?", "125000 | 125k | 125 thousand" %}
Hint: Use $200,000 for Harbor Supply, add the four revenues, and divide by four accounts.
If 75000: $75,000 is the script's number, with Harbor Supply counted as $0.
If 100000: $100,000 leaves Harbor Supply out. It has revenue, so it belongs in the average.
If 500000: $500,000 is the total. Divide it by the four accounts.
$125,000. The four revenues add up to $500,000, and $500,000 divided by four accounts is $125,000. The script reported $75,000.
{% endanswer %}

{% section "What went wrong", "what-went-wrong" %}

You work in finance and asked an AI assistant for the average revenue per account. One account, Harbor Supply, had a blank revenue. The AI's script replaced the blank with 0 and reported an average of $75,000.

{% smalltable "Last quarter's revenue export" %}
| account | revenue |
| --- | --- |
| Alder Clinics | $120,000 |
| Birch Logistics | $80,000 |
| Harbor Supply | (blank) |
| Cedar Foods | $100,000 |
{% endsmalltable %}

{% reflect "What are two different things a blank revenue could mean?" %}
It could mean the account brought in nothing that quarter, which really is $0. Or it could mean the revenue exists and hasn't been recorded. The export looks the same either way.
{% endreflect %}

Harbor Supply's blank was the second kind. The company had just bought it, and its $200,000 in revenue hadn't been loaded yet. With that number, the average is $125,000.

An AI that left the blank out would have reported $100,000, which is also wrong. No script could report $125,000, because Harbor Supply's $200,000 isn't in the export.

The script ran, and its output had a number in every row. A problem like this is called a **silent logic bug**. The code runs, and it treats a value as meaning something it doesn't. Here it treated a blank as $0.

Filling blanks with 0 is a convenient default, because it lets every later calculation run. A careful assistant will often say that it did this. One line that fills blanks is easy to miss in a long script.

{% choice "Next quarter's export has 400 accounts. Which check would catch a blank that the script filled with 0?" %}
[ ] Count the rows before and after the script runs.
    The script fills blanks and removes nothing, so the count is 400 both times.
[x] Count the blank revenues before the script runs.
    A count above zero says the script will have to do something with blanks. You can then look at which accounts they are.
[ ] Check that the script finishes without an error.
    It finished without an error this quarter too.
[ ] Check that every account has a revenue afterward.
    Every account does. A filled-in 0 looks like any other number.
{% endchoice %}

{% section "Missing test scores", "missing-test-scores" %}

A school district analyst gives an AI assistant the district's test results with this request.

> Handle the missing test scores so the file can be analyzed.

The AI's script replaces every missing score with the district's median score, which is the middle score when all the scores are put in order. The median is 72. The AI explains that this is a common approach that avoids dropping students. The script runs without an error.

{% reflect "Before accepting the script, what would you want to know about the students with missing scores?" %}
Why their scores are missing. A student who was absent on test day, a student whose score was lost in data entry, and a student who was exempt from testing are three different cases.

I'd also want to know whether the missing scores are spread across the district or concentrated in a few schools or programs.
{% endreflect %}

In this district, most of the missing scores belong to students in the medical leave program and the alternative program. Those students were exempt from testing. These are the district's results after the script ran.

{% smalltable "District results after the script filled in missing scores" %}
| program | students | tested | average score |
| --- | --- | --- | --- |
| Regular classes | 900 | 880 | 71 |
| Medical leave | 40 | 2 | 72 |
| Alternative | 60 | 5 | 72 |
{% endsmalltable %}

{% answer "How many of the medical leave program's 40 students were given a score by the script?", "38" %}
Hint: Subtract the students who were tested from the students in the program.
If 2: 2 students were tested. The script gave a score to the others.
If 40: 2 of the 40 students were tested and have their own scores.
38 students. Two of the 40 were tested. The script gave each of the other 38 the district's median score of 72.
{% endanswer %}

{% choice "What does filling in the median do to the district's results?" %}
[ ] It lowers the district's average, because exempt students score low.
    Nobody knows how the exempt students would have scored. Each one was given the district's middle score, which moves the average very little.
[x] It makes exempt programs look average, because blanks become the median.
    Nearly every student in those two programs now has a score of 72. The programs look typical in the table, and the average score column gives no sign that most of those students weren't tested.
[ ] It changes nothing, because the median is already the middle score.
    The district's median stays the same. Each program's results change, because they now include scores that nobody earned.
[ ] It raises the district's average, because blanks no longer count as zero.
    The missing scores weren't counted as zero before. They weren't counted at all.
{% endchoice %}

Replacing missing values with the median is a reasonable method in many datasets. It became a silent logic bug here, meaning code that runs and does the wrong thing for this data, because those students were exempt and the scores don't record exemptions.

{% section "Names the AI guessed", "names-the-ai-guessed" %}

A product analyst wants a list of the customers who opted into a new beta dashboard. She doesn't show the AI assistant the customer table. She gives it this request.

> Write code that lists the customers who opted into the beta dashboard.

The AI writes this line, which keeps the rows where the `beta_user` column holds the value `True`.

```python
beta = df[df["beta_user"] == True]
```

{% smalltable "Columns in the customer table" %}
| column | example value |
| --- | --- |
| customer_id | C-2041 |
| plan | Premium |
| beta_opt_in | yes |
| signup_date | 2025-03-12 |
{% endsmalltable %}

The table has no `beta_user` column, so the line stops with this error.

```
KeyError: 'beta_user'
```

The error names the column that pandas, the Python library the code uses, couldn't find. The analyst finds the column she needs, `beta_opt_in`, and fixes the name. The line now runs without an error.

```python
beta = df[df["beta_opt_in"] == True]
```

{% answer "The table has 500 customers, and 120 of them have yes in beta_opt_in. How many rows does the fixed line keep?", "0 | zero | none" %}
Hint: Compare the value the line looks for with the example value in the table.
If 120: 120 customers opted in. The line looks for the value True, and the column holds the word yes.
If 500: The line keeps only the rows that match. Compare the value it looks for with the example value in the table.
If 380: 380 customers have something other than yes. The line looks for the value True, and no row has it.
It keeps 0 rows. The line looks for rows where the value is `True`. In this table the value is the word `yes`, so no row matches. There is no error. The analyst gets an empty list and could conclude that nobody opted in.
{% endanswer %}

This kind of failure is called a **hallucination**. The AI states something that sounds right and isn't there.

The wrong column name failed with an error, so the analyst found out right away. The wrong value ran without an error and returned nothing, which is harder to notice.

An AI can also invent a function, most often in a tool it knows less well, such as a small library or your company's own code. That fails with an error the first time it runs.

An AI that hasn't seen your table can only guess at its column names and values. Look at the table's columns and a few of its rows, and look up any function you don't recognize in the library's documentation.

{% section "Removing outliers", "removing-outliers" %}

An online store's analyst is building a sales forecast. She gives an AI assistant last week's transactions with this request.

> Clean last week's transactions before I build a forecast. Remove any noise.

The AI's script runs without an error, and the AI replies.

> Done. I removed 2 of the 200 transactions as outliers, using the 1.5 × IQR rule.

The rule it names is a common one for finding outliers. It measures the spread of the middle half of the amounts and removes anything far outside that range. The week's 200 transactions add up to $20,000.

{% smalltable "The two transactions the script removed" %}
| transaction | amount | customer |
| --- | --- | --- |
| T-0931 | $4,800 | Ridgeline Construction |
| T-0977 | $5,200 | Ridgeline Construction |
{% endsmalltable %}

{% answer "How many dollars of the week's $20,000 in sales did the script remove?", "10000 | 10k | 10 thousand" %}
Hint: Add the amounts of the two transactions the script removed.
If 2: 2 is the number of transactions. Add their amounts.
$10,000, which is half of the week's sales. Both transactions are real orders from one business customer, Ridgeline Construction, which places orders like these most weeks. The other 198 transactions average about $50 each.
{% endanswer %}

{% reflect "The two orders are far larger than the rest, so the outlier rule did what it was designed to do. Why is removing them a problem for a sales forecast?" %}
They are real sales, and they are half of the week's revenue. A forecast built without them would predict about half of what the store takes in.

The rule finds amounts that are unusual. It has no way to tell a mistake from the store's biggest customer.
{% endreflect %}

This kind of failure is called a **statistical blind spot**. A standard rule or statistic gets used on data it doesn't suit. Here the rule assumed that unusually large amounts were noise, and at this store they are the biggest customer.

Before accepting a cleaning step, look at the rows it removed.

{% section "Three kinds of failure", "three-kinds-of-failure" %}

AI-generated data work fails in three ways, and most of them give no error message.

- **Silent logic bug.** The code runs and treats a value as meaning something it doesn't. A blank revenue treated as $0 is one.
- **Hallucination.** The AI uses a name or value that sounds right and doesn't exist in your data or your tools. A column called `beta_user` in a table that calls it `beta_opt_in` is one.
- **Statistical blind spot.** A standard rule or statistic gets used on data it doesn't suit, such as data with a few huge values. Real bulk orders removed as outliers is one.

{% sort "Each of these is something an AI-written script did. Sort it by the kind of failure.", "Silent logic bug", "Hallucination", "Statistical blind spot" %}
[3] It reports an average rating of 3 stars when nearly every rating is 1 or 5
    Almost nobody gave 3 stars. The average describes a rating that hardly anyone chose.
[1] It drops every row with a missing signup date, then counts customers
    The code treats a customer with no signup date as if they weren't a customer. The count looks fine and is too low.
[2] It filters on a column named `region_code` in a table that calls it `area`
    The name sounded right, and the table doesn't have it.
[1] It removes rows with negative amounts as invalid, then totals sales
    Refunds are often recorded as negative amounts. With those rows removed, the total is too high.
[3] It reports the average income of a group where a few incomes are in the millions
    A few very large values pull an average far above what most of the group earns. The median would describe the group better.
[2] It calls a function from the company's own code that doesn't exist
    The AI had never seen the company's code, and the name sounded like something it would have.
{% endsort %}

Two more statistical blind spots have names you will meet in later work.

- **Class imbalance** is when one group is far larger than the other. If 2% of transactions are fraud, a model that calls every transaction honest is 98% accurate and catches no fraud.
- **Data leakage** is when a model is built with information it wouldn't have at the moment it has to predict. A model that predicts who will cancel, using a column that is only filled in after a customer cancels, is one example.

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

{% section "Pause and answer", "pause-and-answer" %}

These are just for you. They aren't saved or turned in.

{% reflect "Two AI-written scripts feed a report for your manager. One stops with an error. The other runs and gives a wrong number. Which one worries you more, and why?" %}
The one that runs. A script that stops gets fixed before anyone sees a number from it. A script that runs puts its wrong number in the report, and nothing prompts anyone to look at it again.
{% endreflect %}

{% reflect 'You ask an AI to clean a spreadsheet of survey answers, and it replies, "Done. Removed 37 invalid rows." What do you ask next?' %}
A few good ones. What made a row invalid? Can I see some of the 37? Did the removed rows come from all kinds of people who answered, or mostly from one group? How many rows are left, and is that enough for what I need?
{% endreflect %}
