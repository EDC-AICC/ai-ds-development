---
order: 4
title: The Human-in-the-Loop Decision Lab
navLabel: Decision Lab
---

{% section "The Route 42 report", "the-route-42-report" %}

You are a data analyst at a city transit authority. Leadership wants to cut weekend operating costs and asks which Sunday bus service the city could do without. They estimate that ending one route's Sunday service would save about $120,000 per quarter.

You give an AI assistant the last 12 weeks of tap-in logs, which record each rider who taps a fare card when boarding, with this request.

> Here are 12 weeks of Sunday tap-in logs for our four weekend routes. Which route's Sunday service could we end with the least effect on riders? Ending one route's Sunday service saves about $120,000 per quarter.

This is the AI's report.

{% smalltable "Average Sunday riders by route, from the AI's report" %}
| route | average Sunday riders |
| --- | --- |
| Route 17 | 410 |
| Route 8 | 365 |
| Route 31 | 190 |
| Route 42 | 140 |
{% endsmalltable %}

> Route 42 has the lowest average Sunday ridership in the network over the last 12 weeks. Recommendation: permanently eliminate Route 42 Sunday service to save $120,000 per quarter.
>
> Note: Route 42 recorded 0 tap-ins on three Sundays and about 100 on each of the six Sundays after that. All 12 Sundays are included in the average.

The script ran without errors, and the chart that came with the report looks professional.

{% reflect "The report ends with a note about Route 42's tap-ins. What would you ask about that note, and who would you ask?" %}
I'd ask why a route that has riders recorded 0 tap-ins on three Sundays, and why the count then stayed near 100.

The people who run the buses would know whether Route 42 was running on those Sundays and whether its card readers were working.
{% endreflect %}

{% section "Checking the count", "checking-the-count" %}

An AI's report ranks a city's four weekend bus routes by average Sunday riders, counted from 12 weeks of fare card tap-ins. It puts Route 42 lowest and recommends ending the route's Sunday service.

{% smalltable "Average Sunday riders by route, from the AI's report" %}
| route | average Sunday riders |
| --- | --- |
| Route 17 | 410 |
| Route 8 | 365 |
| Route 31 | 190 |
| Route 42 | 140 |
{% endsmalltable %}

These are Route 42's tap-ins week by week.

{% smalltable "Route 42 Sunday tap-ins" %}
| weeks | tap-ins each Sunday |
| --- | --- |
| 1 to 3 | 360 |
| 4 to 6 | 0 |
| 7 to 12 | 100 |
{% endsmalltable %}

You take the table to the operations team, and they explain two things.

In weeks 4 to 6, a winter storm closed the roads in that part of the city. Route 42 didn't run on those three Sundays. The other routes ran as usual.

In weeks 7 to 12, the card readers on two of Route 42's three buses were broken. Drivers let riders board without tapping, so only one bus was counting.

{% answer "In weeks 7 to 12, one of Route 42's three buses counted 100 riders each Sunday. If the three buses carry about the same number of riders, about how many people rode each Sunday?", "300" %}
Hint: One bus in three was counting. Multiply its count by the number of buses.
If 100: 100 is what one bus counted. Two more buses carried riders who weren't counted.
If 200: 200 would be two buses' worth of riders. Three buses were running.
About 300. One bus in three was counting, so the real number is about three times the count.
{% endanswer %}

{% answer "Leave out the three storm Sundays, and use 300 for each Sunday in weeks 7 to 12. What is Route 42's average Sunday ridership over the nine Sundays that are left?", "320" %}
Hint: Add three Sundays at 360 and six Sundays at 300, then divide by nine.
If 140: 140 is the AI's number. It counts the storm Sundays as 0 riders and weeks 7 to 12 as 100 riders.
If 240: 240 comes from dividing by 12. The three storm Sundays are left out, so divide by nine.
If 330: 330 is halfway between 360 and 300. There are three Sundays at 360 and six at 300.
If 2880: 2,880 is the total for the nine Sundays. Divide it by nine.
An average of 320 riders. Three Sundays at 360 and six at 300 add up to 2,880, and 2,880 divided by nine Sundays is 320. That puts Route 42 third of the four routes, ahead of Route 31 at 190.

The 300 is an estimate. On the three Sundays when every reader was working, the route averaged 360, so Route 42 is third either way.
{% endanswer %}

{% section "Who rides Route 42", "who-rides-route-42" %}

A city transit authority is deciding whether to end Sunday service on bus Route 42. An AI's report called it the least-used of four Sunday routes, at 140 riders. That average counted three storm Sundays with no service as 0, and six Sundays when two of the route's three card readers were broken. A corrected count puts Route 42 at about 320 riders each Sunday, third of the four routes. Route 31 is now lowest, at 190.

{% reflect "Suppose the corrected count had shown that Route 42 really was the least-used route. What else would you want to know before recommending that its Sunday service end?" %}
Who the riders are and what the route connects. A route with few riders can still be the only way some people get to work, school, or medical care.

I'd want to know what is on the route, and whether another line reaches the same places on a Sunday.
{% endreflect %}

Route 42 is the only transit line that reaches the regional medical center in time for its Sunday morning shift change. It also serves a nursing school that holds weekend classes. Nothing in the tap-in logs says where riders are going.

{% choice "What do you do with the AI's recommendation to end Route 42's Sunday service?" %}
[ ] Send it to leadership with a note that some riders went uncounted.
    The note is true. The recommendation still rests on a count that is less than half of what the route carries on a normal Sunday, and leadership could act on the headline.
[x] Hold it, redo it with corrected counts, and add who relies on the route.
    The ranking changes once the count is corrected. Leadership also needs to know who would lose service before deciding anything.
[ ] Recommend ending Route 31's Sunday service, since it is now the lowest.
    Nobody has checked Route 31's tap-ins or who rides it. That would repeat the same mistake on a different route.
[ ] Tell leadership Route 42 has to stay, since it serves the medical center.
    Leadership makes that decision. They need the corrected counts and who relies on each route in order to make it.
{% endchoice %}

The AI's averaging was correct, and it noted the odd weeks. It had no way to learn why they were odd.

{% section "Three decisions", "three-decisions" %}

An audit of an AI-generated result ends in one of three decisions.

- **Accept** it when you have checked it against something independent and it holds.
- **Verify or revise** it when it could be right and something specific has to be checked or corrected first.
- **Reject** it when checking can't repair it, because it is built on the wrong data or it answers the wrong question.

{% sort "Each of these is an AI-generated result and what you know about it. Sort it by the decision it calls for.", "Accept", "Verify or revise", "Reject" %}
[2] An AI's summary says complaints fell 30% this year, and the complaint form was offline for two months
    The drop could be real, or it could come from the two months with no form. The count has to be redone for the months the form was working.
[1] An AI totals last month's invoices, and its total matches the accounting system's own report to the cent
    The result was checked against an independent source, and the two agree.
[3] An AI recommends which branches to close, using a column that turns out to hold test data
    The recommendation is built on data that isn't real. Checking its arithmetic wouldn't change that, so the analysis has to start again with real data.
[2] An AI drafts a sales forecast from two years of data, and the store was closed for three months of one year
    The forecast can be corrected once the closure is accounted for.
[3] An AI's report ranks stores by profit, and the request was which stores should stay open late
    The report answers a different question from the one that was asked. Verifying its numbers wouldn't make it the right analysis.
[1] An AI reformats 500 dates for an internal draft, and you compare 30 of them with the originals and all 30 match
    A sample checked against the source showed no errors, and a formatting step in an internal draft is low risk.
{% endsort %}

{% section "Making a check specific", "making-a-check-specific" %}

To audit an AI-generated report, use this three-question framework. These are the answers for a transit report in which an AI ranked bus Route 42 lowest for Sunday ridership and recommended ending its Sunday service.

1. **What did the AI generate?** A ranking of Sunday ridership by route, with Route 42 lowest, and a recommendation to end its Sunday service.
2. **What organizational or user context is missing?** The tap-in logs don't show that card readers were broken on two of the route's three buses, that a storm stopped service for three Sundays, or that the route is the only line to the regional medical center.
3. **What specific human verification step or prompt adjustment is required?** Compare the tap-ins with the maintenance records, ask operations which Sundays the route ran, and find out who relies on the route. Then give the AI the corrected counts and ask for the ranking again.

The third answer has to be specific. "Check the data" doesn't say what to look at, where to find it, or who to ask.

{% sort "Each of these is a verification step someone proposed for the Route 42 report. Sort it.", "Specific enough to act on", "Too vague" %}
[2] Have the data team do a thorough review of Route 42's numbers before the report goes out
    It doesn't say what the review should look for or what to compare the numbers with.
[1] Ask Route 42's drivers how full the buses were in weeks 7 to 12
    It names who to ask, which weeks, and what you need to learn.
[2] Validate Route 42's tap-ins against other sources
    It doesn't say which sources.
[1] Ask the nursing school how many students have Sunday classes
    It names who to ask and the number you need from them.
[2] Make sure the 12 weeks were representative
    It doesn't say how anyone would find that out, or who to ask.
[1] Ask the medical center when its Sunday shifts start and how staff get there
    It names who to ask and what you need to learn from them.
{% endsort %}

{% section "Practice: smart meters", "practice-smart-meters" %}

A city utility uses an AI model to review smart meter data from homes across the city. The goal is to find households with unusual energy use, so the city can send them notices about saving energy or charge penalties for excessive use.

The AI lists the 200 addresses with the highest steady power use during weekday daytime hours. It labels them "high-waste" and prepares a batch of penalty notices. The script processed thousands of hourly readings in seconds, with no errors.

{% reflect "Give two reasons a home could use a lot of power all day on weekdays that have nothing to do with waste." %}
Someone in the home may depend on medical equipment that runs all day, like an oxygen machine or home dialysis.

Someone may work from home, run a home daycare, or care for a family member there.

The home may be heated with electricity and badly insulated.
{% endreflect %}

{% reflect "Audit the smart meter report with the three questions. What did the AI generate? What organizational or user context is missing? What specific verification step is required?" %}
**What did the AI generate?** A list of the 200 addresses with the highest steady weekday daytime power use, a "high-waste" label for each, and a batch of penalty notices.

**What context is missing?** The meter data says how much power a home uses. It doesn't say who lives there or what the power is for.

**What verification step is required?** Before any notice goes out, check the 200 addresses against the utility's records of customers who depend on medical equipment, if it keeps them. Then have staff contact a sample of the remaining homes to ask what runs during the day.
{% endreflect %}

{% section "Your audit", "your-audit" %}

This audit is yours to complete and turn in.

### The background

An enterprise human resources department wants to reduce sudden employee turnover. It asks an AI analytics tool to analyze internal workplace metrics, including badge swipes, email volume, and internal chat frequency, across its offices to identify employees at high risk of leaving.

### The AI-generated report

The AI flags employees who show a sharp decline in internal chat-message volume and low daily building badge-swipe counts as "critical flight risks." It recommends placing those employees on mandatory management review plans.

The database queries run smoothly, the machine-learning classification model achieves 91% accuracy on historical logs, and the dashboard looks ready for executive review.

{% assignment "Your Audit" %}
Complete the framework on your own before discussing your response with others.

| What did the AI generate? | What organizational, operational, or human context is missing? | What specific human verification step or prompt adjustment is required? |
| --- | --- | --- |
| | | |
{% endassignment %}

{% discussion "Discussion Question" %}
**What common workplace situations could cause an employee to have low internal chat activity or low office badge use that have nothing to do with wanting to quit?**
{% enddiscussion %}
