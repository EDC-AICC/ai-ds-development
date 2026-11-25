---
order: 2
title: "Context Is King: Business, Organization, and Users"
navLabel: Context Is King
---

{% section "Average weight by unit", "average-weight-by-unit" %}

You are a junior analyst at a hospital. A manager who orders equipment asks for the average patient weight in each unit. You give an AI assistant this request.

> Our patient table has the columns patient_id, unit, age, and weight_kg. Write a script that gives the average patient weight for each unit.

You run the script on the full table, and this is what it returns.

{% smalltable "Average weight by unit, from the AI's script" %}
| Unit | Average weight |
| --- | --- |
| Cardiology | 84 kg |
| Pediatrics | 30 kg |
| ICU | 537 kg |
{% endsmalltable %}

{% answer "Which unit's average can't be right?", "ICU | the ICU | intensive care" %}
Hint: Compare each average with what a person can weigh.
ICU. An average of 537 kg is more than half a ton, and no group of patients weighs that much.
{% endanswer %}

To find out why, you look at the ICU's rows in the patient table.

{% smalltable "ICU patients" %}
| patient_id | age | weight_kg |
| --- | --- | --- |
| P-1081 | 71 | 999 |
| P-1082 | 68 | 70 |
| P-1083 | 80 | 999 |
| P-1084 | 59 | 80 |
{% endsmalltable %}

{% choice "Two ICU patients have a weight of 999. What do you do about those two rows?" %}
[ ] Delete them as typing mistakes, then rerun the script.
    The same value twice in four rows is an odd pattern for typing mistakes. Deleting the rows without knowing what 999 is could hide something about those two patients.
[ ] Replace each 999 with the unit's average weight, then rerun.
    That gives two patients weights nobody measured. You still don't know what 999 stands for.
[x] Ask the ICU's nursing staff what 999 means on their unit.
    The same value twice looks like a code. The people who enter the weights know what it stands for.
[ ] Ask the AI assistant what 999 means in this patient table.
    The AI can say that 999 is often used as a placeholder. It can't say what this hospital uses it for, and the reason matters for what you do next.
{% endchoice %}

You ask a nurse on the unit. The hospital's record system won't accept a blank weight. When a patient is bedbound and can't be put on a scale, staff enter 999.

{% answer "What is the average weight of the ICU patients who were weighed, in kg?", "75 | 75 kg | 75kg" %}
Hint: Leave out the two rows with 999, then average the weights that are left.
If 537: 537 kg is the script's number. It treats both 999s as real weights.
If 150: 150 is the two real weights added together. Divide by the number of patients who were weighed.
If 37.5: Divide by the two patients who were weighed. The other two have no weight to count.
75 kg. Patients P-1082 and P-1084 were weighed, at 70 kg and 80 kg, and the average of those two weights is 75 kg.
{% endanswer %}

{% reflect "You are about to send the manager 75 kg as the ICU average. What else should the manager be told?" %}
That half the ICU's patients have no recorded weight and aren't in the average. They are the patients who were bedbound, so they may differ from the patients who could be weighed.

The manager orders equipment, and the bedbound patients may be the ones that beds and patient lifts are for.
{% endreflect %}

{% section "What went wrong", "what-went-wrong" %}

At a hospital, you asked an AI assistant for a script that averages patient weight by unit. The script reported 537 kg for the ICU. These are the ICU's rows in the patient table.

{% smalltable "ICU patients" %}
| patient_id | age | weight_kg |
| --- | --- | --- |
| P-1081 | 71 | 999 |
| P-1082 | 68 | 70 |
| P-1083 | 80 | 999 |
| P-1084 | 59 | 80 |
{% endsmalltable %}

{% reflect "The script averaged the weight_kg column correctly. Why is 537 kg still wrong?" %}
At this hospital, 999 is a code. Staff enter it when a patient is bedbound and can't be weighed. The script treated it as a weight like any other, because nothing in the patient table says what it stands for.
{% endreflect %}

Only the staff who enter the weights know what 999 means. An AI assistant that saw the rows would probably point out the 999s and guess that they are a placeholder. It couldn't know why this hospital uses 999, and the reason changes what you do.

If 999 meant a weight was skipped by mistake, the patients who were weighed could stand in for the rest. Here the missing patients are the bedbound ones, who may weigh more or less than patients who can stand on a scale.

The ICU's average was easy to catch because half its rows were 999. In a unit of 40 patients, a single 999 turns a 75 kg average into about 98 kg, and nobody would question that number.

{% choice "Which request to the AI handles the 999s best?" %}
[ ] Average the weights by unit, and remove outliers before you do.
    The AI now picks its own rule for what counts as an outlier. It could also remove a real patient who is unusually heavy or light, and you wouldn't know.
[ ] Average the weights by unit, and ignore weights above 300 kg.
    This gives the same averages for these four rows. It would also drop a real patient over 300 kg, and nothing in the script says the dropped rows are patients who couldn't be weighed.
[x] Average the weights by unit, leaving out 999 (not weighed).
    The request states the hospital's rule, so the script leaves those rows out for the right reason. It's also worth asking for a count of how many patients each average leaves out.
[ ] Average the weights by unit, then check the results for anything odd.
    The AI may notice 537 kg. It still has to guess what to do about it, and its guess becomes part of your result.
{% endchoice %}

{% section "Readmissions", "readmissions" %}

A hospital administrator wants fewer patients coming back to the hospital within 30 days of going home. She gives an AI assistant the patient records with this request.

> What best predicts whether a patient comes back to the hospital within 30 days of going home?

The AI analyzes the patient records and reports that the strongest predictor is the length of the patient's earlier hospital stay. Patients who stayed longer are more likely to come back.

{% reflect "Give two different reasons a patient who had a long hospital stay might be more likely to come back within 30 days." %}
One reason is that they were sicker to begin with, so they are more likely to need care again. Another is something about their life outside the hospital, like having no one at home to help them recover.

Both would look the same in the records: a long stay followed by a return visit.
{% endreflect %}

This hospital has a policy that the patient records don't mention. A patient with no safe place to recover, no one at home to help, or no way to get to follow-up visits is kept longer before going home. Many of the long stays in the records are these patients.

An AI could list both reasons a long stay might go with a return visit. It can't tell which one applies at this hospital, because the policy isn't in the records.

{% sort "The administrator is considering six responses to the AI's finding. With the hospital's policy in mind, sort each one.", "Risky", "Reasonable next step" %}
[1] Set a maximum length of stay for every unit
    The patients kept longest are often the ones with nowhere safe to recover. A maximum sends them home sooner.
[2] Ask the staff who send patients home why some are kept longer
    They apply the policy every day, and they can say how many of the long stays it explains.
[1] Rate each unit's manager on how short its average stay is
    A unit that cares for more patients without help at home would rate worst for following the policy.
[2] Have staff record who lacks help at home, then compare return visits
    This checks whether help at home explains the return visits better than the length of the stay does.
[1] Tell the hospital's board that long stays cause return visits
    The records show that the two go together. Nothing shows that the stay causes the return, and the board may act as if it does.
[2] Report the finding together with a note about the policy
    Anyone who reads the finding needs to know about the policy to read it correctly.
{% endsort %}

The link between long stays and return visits is real in the records. At this hospital, the length of a stay partly stands in for something the records don't hold, which is whether the patient has support at home.

{% section "Call times and a sales jump", "call-times-and-a-sales-jump" %}

In each of these cases, a real pattern in a company's data leads to a recommendation.

### The call center

A phone company asks an AI which behavior goes with the highest daily performance scores in its call center. The AI finds that representatives who keep their calls under two minutes handle the most calls and get the best automated efficiency ratings. A manager reads the finding and proposes a two-minute limit on every support call.

{% choice "Which column would you most want added to the call data before agreeing to the two-minute limit?" %}
[ ] How many years each representative has worked there
    Experience might explain who is fast. It wouldn't show whether a fast call helped the customer.
[x] Whether the customer's problem was solved on the call
    A two-minute call is efficient when the question is simple. On a hard problem, a short call can mean the customer was rushed off the phone and has to call again. A fair comparison looks at short and long calls about the same kind of problem.
[ ] How long each customer waited on hold before the call
    Hold time shows how long customers waited. It doesn't show whether the call solved their problem.
[ ] How many calls each representative took that day
    The call data already shows that fast representatives take more calls. It doesn't show whether those calls helped.
{% endchoice %}

### The hardware chain

A national hardware retailer asks an AI where it can cut its marketing budget. The AI is given weekly sales totals for each region, with no product names. It reports that one coastal region's sales rose to four times their usual level in a single week with no extra marketing, and it recommends cutting that region's marketing budget.

You look up what sold in that region that week. Most of it was plywood and generators.

{% reflect "Give one explanation for a week of plywood and generator sales at four times the usual level that has nothing to do with marketing." %}
A big storm on the way. People buy plywood to cover their windows and generators in case the power goes out. In this case, a Category 4 hurricane was approaching that coast.

The totals the AI was given didn't say what was sold, and nothing in the sales data says a hurricane was coming. One week of sales before a hurricane says little about how the region buys in a normal month.
{% endreflect %}

{% callout "checkpoint", "Human Judgment Checkpoint" %}
Before accepting an AI-generated analysis, ask:

1. What do these data actually represent?
2. Are there organizational conventions or coding rules that the AI does not know?
3. What important context might exist outside the dataset?
4. Who or what could help me verify that context?
5. How could my analysis change if my assumption is wrong?
{% endcallout %}

{% section "Pause and answer", "pause-and-answer" %}

These are just for you. They aren't saved or turned in.

{% reflect 'A coworker asks an AI, "Which of our five stores is performing worst?" and gets back a ranking by total sales. Name two things about the stores you would want to know before trusting the ranking.' %}
A few good ones. Was every store open for the whole period, or did one open late or close for repairs? Are the stores about the same size? Does "performing" mean total sales, profit, or sales for the size of the store? Did anything unusual happen near one store, like road work or a competitor opening?
{% endreflect %}

{% reflect "Some systems use a value like 999 to mean that something wasn't recorded. Think of a form, spreadsheet, or system you have used. What is one value in it that means something different from what it looks like?" %}
Any real example works. A birth date of 01/01/1900 in a customer list often means the date was never entered. A grade of 0 can mean a failed test or a test that was never taken. A ZIP code of 00000 is often a placeholder for an address nobody filled in.
{% endreflect %}
