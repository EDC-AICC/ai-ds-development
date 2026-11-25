---
order: 1
title: The Evolving Role of the Data Practitioner
navLabel: The Evolving Role
---

{% section "The lifetime value list", "the-lifetime-value-list" %}

You work on the analytics team at an online outdoor gear shop. Marketing is planning an early-access sale for the shop's best customers. They ask you for a list of customers grouped by **lifetime value**, which is the total each customer has spent at the shop.

You give an AI assistant the shop's orders table with this request.

> Here is our orders table. Write a script that totals what each customer has spent and groups the customers into three tiers by that total.

Thirty seconds later it's done. The script runs without an error, and this is what it returns.

{% smalltable "Lifetime value list from the AI's script" %}
| Customer | Lifetime value | Tier |
| --- | --- | --- |
| Dana Whitfield | $1,840 | Top |
| Marcus Oyelaran | $1,310 | Middle |
| Priya Raman | $620 | Low |
{% endsmalltable %}

Before the list goes to marketing, you check one customer by hand. Dana Whitfield has four orders in the orders table. They add up to $1,840, the same as the script's number.

{% smalltable "Dana Whitfield's orders" %}
| order_id | order_date | amount |
| --- | --- | --- |
| 5012 | 2025-01-14 | $220 |
| 5177 | 2025-02-02 | $1,150 |
| 5301 | 2025-03-19 | $180 |
| 5466 | 2025-04-07 | $290 |
{% endsmalltable %}

The shop keeps refunds in a separate table. When a customer sends something back, the returns desk adds a row to it. The `order_id` column says which order the refund is for, and `amount` is how much money went back to the customer. The table holds refunds for every customer's orders.

{% smalltable "The shop's refunds table" %}
| refund_id | order_id | amount |
| --- | --- | --- |
| 801 | 5177 | $1,150 |
| 802 | 5239 | $75 |
| 803 | 5466 | $90 |
{% endsmalltable %}

{% answer "How much has Dana Whitfield spent at the shop once her refunds are taken out, in dollars?", "600" %}
Hint: Look for each refund's order_id in Dana's orders. Subtract only the refunds that are for her orders.
If 1840: $1,840 is the script's number. It counts every order in full. Two of the three refunds are for Dana's orders.
If 690: Order 5466 has a refund too. It is refund 803, for $90.
If 1750: Order 5177 has a refund too. It is refund 801, for the full $1,150.
If 525: Refund 802 is for order 5239, which isn't one of Dana's orders.
$600. Refund 801 returned all $1,150 of order 5177, and refund 803 returned $90 of order 5466. $1,840 minus $1,150 minus $90 is $600. The script counted every order in full, which put Dana in the top tier. At $600 she is below the $620 the script gave Priya Raman, who is in the low tier.
{% endanswer %}

{% section "What went wrong", "what-went-wrong" %}

At an online outdoor gear shop, you gave an AI assistant the orders table and asked for a script that totals what each customer has spent. It gave Dana Whitfield a lifetime value of $1,840 and put her in the top tier. Her four orders and the shop's refunds table are below.

{% smalltable "Dana Whitfield's orders" %}
| order_id | order_date | amount |
| --- | --- | --- |
| 5012 | 2025-01-14 | $220 |
| 5177 | 2025-02-02 | $1,150 |
| 5301 | 2025-03-19 | $180 |
| 5466 | 2025-04-07 | $290 |
{% endsmalltable %}

{% smalltable "The shop's refunds table" %}
| refund_id | order_id | amount |
| --- | --- | --- |
| 801 | 5177 | $1,150 |
| 802 | 5239 | $75 |
| 803 | 5466 | $90 |
{% endsmalltable %}

{% reflect "The script ran without an error, and $1,840 is the correct sum of Dana's four orders. Why is it the wrong lifetime value?" %}
The shop gave $1,240 of it back. Order 5177 was refunded in full and order 5466 in part, so Dana has spent $600. The refunds are in a separate table. The AI was given only the orders table, so its script had nothing to subtract.
{% endreflect %}

The script does what the request asked with the table it was given. Nothing in the orders table says that a refunds table exists. A careful assistant might have asked whether refunds are recorded somewhere. This one didn't ask, and it didn't say that its totals leave refunds out.

Where a shop records its refunds is a fact about that shop. Some shops keep a status on each order. This one keeps a separate table, filled in by the returns desk. People who work there know that, and it isn't written anywhere in the orders table.

Nothing on the screen pointed to the problem. The script finished, the list looked complete, and Dana's total matched her orders. The problem showed up when someone who knew about the refunds table checked one customer against it.

{% choice "Which next step fixes the lifetime value list?" %}
[ ] Ask the AI to review its script for mistakes, then rerun it.
    The script has no mistake for the AI to find. It adds up the orders table correctly, and that is the only table it has.
[ ] Subtract Dana Whitfield's refunds by hand, then send the list.
    That fixes one customer. Every other customer with a refund still has a total that is too high.
[x] Give the AI the refunds table too, and have it subtract refunds.
    The script can now take refunds out of every customer's total. It's worth asking the returns desk whether anything else that changes a total is recorded somewhere else.
[ ] Give the same request to a different AI tool and compare the lists.
    A second tool given only the orders table has the same gap. It can't subtract refunds it has never seen.
{% endchoice %}

{% callout "checkpoint", "Human Judgment Checkpoint" %}
The code runs. Is the analysis ready to use?

Ask yourself:

- What did AI accelerate?
- What assumptions did AI make?
- What organizational definitions or rules were missing?
- How could those missing rules change the result?
- What do I need to verify before someone acts on this analysis?
{% endcallout %}

{% section "What needs you", "what-needs-you" %}

An online gear shop's marketing team has asked for a list of customers grouped by lifetime value, which is the total each customer has spent. An AI assistant can write the script for that list in under a minute.

Writing it by hand takes much longer. Most of that time goes to getting code to run: joining tables, looking up how a function works, and fixing errors.

Here are six things that have to happen before the list goes to marketing.

{% sort "For each one, decide who can do it.", "AI can do it", "Needs you" %}
[1] Write the code that joins the orders table to the refunds table
    Joins like this are standard code. AI assistants write them quickly and usually correctly.
[2] Know that the shop keeps its refunds in a separate table
    Nothing in the orders table says so. Someone who knows how the shop records things has to bring it up.
[2] Find out what marketing will do with the list
    What counts as a "best customer" depends on what the list is for. Only the people who asked can say.
[1] Fix the error when the script stops on a misspelled column name
    The error message says what broke, and an AI assistant can usually fix it from the message alone.
[2] Decide to check one customer's total by hand before the list goes out
    The script finished without an error, so nothing prompts a check. Someone has to decide the list needs one.
[1] Write the code that splits customers into three tiers at the cutoffs you give it
    With the cutoffs decided, sorting customers into tiers is a mechanical step.
{% endsort %}

The three jobs on the "Needs you" side were part of data work before AI. They used to share the day with hours of writing and debugging code. With the code written in seconds, they take up a larger share of the work.

{% section "A cleaning script", "a-cleaning-script" %}

You do data work for a subscription service that is moving to a new billing system. You show an AI the first three rows of the customer export, with this request.

> Tidy the signup_date column so that every value is a real date.

It writes one line of Python.

{% activity "cleaning-script.html", "The cleaning script", "560px" %}

The manager of the subscription service wants one number from the customer export: the average monthly fee across all eight customers.

{% choice "The cleaning script left three customers with no signup date. What should happen to their rows?" %}
[ ] Drop the three rows, so every row that is left has a signup date.
    All three of those customers pay $49, the highest fee. Without their rows the average monthly fee falls from $34 to $25.
[ ] Fill the three empty dates with the earliest date in the column.
    The average monthly fee stays at $34. The table now says three customers signed up on 2025-01-09, and those dates are made up.
[x] Keep the three rows, mark the dates unknown, and ask about them.
    The average monthly fee doesn't use the signup date, so all eight customers belong in it. All three rows came from the old billing system, which may still hold the real dates.
{% endchoice %}

The AI saw three rows. Two held dates written year first, and one said N/A. pandas, the Python library this line uses, can read dates written in different ways when the code asks it to, with `format="mixed"`. Nothing in those three rows told the AI that this column needed it.

{% section "Pause and answer", "pause-and-answer" %}

These are just for you. They aren't saved or turned in.

{% reflect 'A coworker says, "The AI wrote the churn script and it ran clean, so the list of customers who stopped buying is ready to send." What would you ask before agreeing?' %}
A few good ones. What counts as a customer who stopped buying: no order in 30 days, 90 days, or a year? Is that the definition the people who asked for the list have in mind? Which tables was the AI given, and is anything that matters recorded somewhere else? Has anyone checked two or three customers on the list against their orders?
{% endreflect %}

{% reflect "Think of a place where you've worked, studied, or volunteered. What is one thing about how it runs that a new analyst, or an AI, could not learn from its data alone?" %}
Any real example works. A restaurant's sales data shows a slow week in July, and only the staff know the kitchen was closed for repairs. A school's gradebook has blank grades, and only the instructor knows whether a blank means the work is missing or the student was excused.
{% endreflect %}
