---
order: 1
title: "Before You Begin: How Numbers Go Wrong"
navLabel: Before You Begin
---

{% section "Three Ways a Number Goes Wrong", "three-ways-a-number-goes-wrong" %}

Before you open the clinic file, it helps to know what can go wrong with data in general. This part has three short activities, and each one shows a different way a number can be wrong even when nobody made an obvious mistake:

- **The record's journey.** Every dataset you will ever be handed took a trip through systems and choices you never saw, and those choices changed the numbers.
- **The missing records.** Sometimes every value in the data is correct, and the answer is still wrong because of what never made it into the data.
- **The almost-right answer.** AI answers that read smoothly and sound confident can still be wrong in ways that are easy to miss.

Keep all three in mind. You will run into each of them again in the clinic data.

{% section "Try It: Follow the Record", "follow-the-record" %}

Somewhere in Berlin, a customer taps *Buy*. Weeks later, a manager looks at a revenue chart and makes a decision. Between those two moments, that one tap traveled through half a dozen systems. Along the way it got reshaped by choices someone coded months ago. Follow it, one stop at a time.

{% activity "follow-the-record.html", "Follow the record", "600px" %}

{% check "Think it through before you open the answers." %}

{% q "Cleaning changed your record in four ways, and none of them were wrong. So why do data teams insist that every one of those choices be written down and reviewable?" %}
Because a different reasonable choice produces a different number. Count the euro order at yesterday's exchange rate instead of today's, or match IDs slightly differently, and revenue shifts. No bug anywhere. When two teams' numbers disagree, and they constantly do, the explanation almost always lives in these invisible decisions rather than in anyone's arithmetic. Writing the choices down, in code and in definitions everyone shares, turns "my spreadsheet says something different" from a week-long argument into a five-minute diff. A number you can trust is a number whose journey you can inspect.
{% endq %}

{% q "The manager's chart reads only the final summary table. It never touches the raw data. Give one reason that separation is deliberate, and one risk it creates." %}
**Why it's deliberate.** Raw data is messy, huge, and constantly changing shape. If every chart read it directly, every chart would need its own cleaning logic, and they would all disagree. Cleaning once gives everyone the same answer.

**The risk.** Distance. Everyone downstream silently inherits whatever choices the cleaning steps made. If that logic is wrong, every chart built on it is wrong in the same convincing way, and the person reading the dashboard has no way to see it.
{% endq %}

{% endcheck %}

{% section "Try It: The Planes That Didn't Come Back", "the-planes-that-didnt-come-back" %}

Every decision you just followed becomes visible once you go looking for it. Here is a way a number goes wrong that stays invisible however carefully you check, because every value in the data is correct.

World War II. Bombers return from missions over Europe full of holes, and the military maps every hit, hoping to armor the planes better. Armor is heavy, so you can't protect everything. A statistician named Abraham Wald was handed this data, and what he saw in it saved lives. Now you get handed the same data. You have armor for two zones. Study the hit map and choose.

{% activity "armor-allocation.html", "Armor allocation", "440px" %}

{% check "Think it through before you open the answers." %}

{% q "Every dot on the hit map was real. Nobody made a measurement mistake. So where did the error live?" %}
In the population, not the measurements. The dataset was "hits on bombers *that returned*," and it got quietly treated as "hits on bombers." The planes hit in the engines and cockpit mostly never made it home to be measured. The most important evidence was structurally missing from the table, and no amount of careful analysis *of the table* could reveal that. This is why professionals interrogate a dataset with a question that sounds almost paranoid. *What would have to happen for a record to end up in this data, and what kinds of records can never get in?*
{% endq %}

{% q "Your company surveys its current customers and scores 9 out of 10 on satisfaction. Explain why this might be the bomber problem wearing a business suit." %}
The survey only reaches customers who are still around to answer it. The angriest customers already canceled. They're the shot-down planes, invisible in the data precisely *because* of the thing you're trying to measure. A 9/10 from survivors is perfectly consistent with a company hemorrhaging unhappy customers. The fix mirrors Wald's. Go looking for the missing population instead of squeezing more analysis out of the survivors. That means exit interviews, outreach to churned customers, and comparing the surveyed group against the full customer list. Once you know this pattern you'll see it everywhere. The successful founders telling you to drop out are the ones it worked for. A bootcamp's job placement rate counts the students who finished. The employee engagement survey went to people who haven't quit.
{% endq %}

{% endcheck %}

{% tip %}
This pattern is called **survivorship bias**: drawing conclusions from the records that made it into the data while ignoring the ones that did not.
{% endtip %}

{% section "Try It: Almost Right", "almost-right" %}

Many people now do data work with AI assistance. In survey after survey, the same professionals who use AI daily name the same frustration above all the others. Answers that are *almost* right. Not wrong in ways that jump out. Wrong in ways that read smoothly, sound confident, and cause problems when they slip through.

Getting answers out of AI is the easy part. The skill that matters is **review**, deciding with evidence whether an answer is true. Below is a tiny orders table, small enough to check by eye. An AI assistant has answered five questions about it. Some answers are solid. Some aren't. You're the reviewer, and shipping a wrong number counts against you. Read carefully!

{% activity "review-queue.html", "Review queue", "1060px" %}

{% check "Think it through before you open the answers." %}

{% q "The refund-rate mistake took you ten seconds to catch, because the table has 8 rows. At a real company it has 40 million rows and you can't eyeball anything. What does checking the AI's answer look like then?" %}
You stop checking the *answer* and start checking the *method*. Ask for the query and read it. Does it filter to refunded orders, or count something else? Compute the number a second, independent way and see if the two agree. Sanity-check against what you already know. If last month's refund rate was 24% and the AI says 12.5%, something changed, either the business or the math. Spot-check a sample by hand. Professionals also build these checks into the pipeline as automated tests, so the checking happens every day instead of only when someone gets suspicious. The reflex is the same one you practiced here. Only the tools scale up.
{% endq %}

{% q "Case 5 got the number right but invented a detail that wasn't in the data. Why is that arguably more dangerous than an answer that's plainly wrong?" %}
Because the true part buys trust for the false part. You verify the $70, feel done, and the invented detail rides along into your report where someone might act on it. Plainly wrong answers get caught by the first person who looks. A fabrication attached to a verified fact can survive several rounds of review, because each reviewer assumes that checking *part* of the answer was checking the answer. The lesson is that verification doesn't transfer. Every claim needs its own receipt, especially the ones sitting next to a claim that checked out.
{% endq %}

{% endcheck %}

{% section "Key Takeaways", "key-takeaways" %}

{% callout "takeaways", "Key Takeaways" %}
- Every number you are handed carries decisions someone made along the way. A number you can trust is one whose journey you can inspect.
- Before analyzing a dataset, ask what would have to happen for a record to end up in it, and who can never get in.
- When you cannot check an answer by eye, check the method: read the code, compute the number a second way, and compare it with what you already know.
- Verification does not transfer. Every claim needs its own evidence, especially the ones sitting next to a claim that checked out.
{% endcallout %}

### Before You Continue

Now you have the habits in mind. In Part 2, a clinic director sends you a request about two years of visit data, and the work begins with working out what she actually needs.

{% section "Feedback", "feedback" %}

This module is a draft, and what you write here shapes the next revision. A sentence about what confused you, or what worked, is enough.

{% feedback %}
