---
order: 0
title: Preparing, Exploring & Analyzing Data with AI
---

{% section "Start here" %}

In this module you will use AI to write the Python that cleans, explores and analyzes a real dataset. The datasets you'll get will be messy, real-world ones. They might have missing values, dates written more than one way, the same field spelled several ways, and some records entered twice. You will learn how to think about what can go wrong in data, describe the data work you want done, work with the AI to write the code you need, and verify what you get back.

Each part in this module starts with a short activity, moves into the real work, and ends with a recording of a working data scientist doing the same task, so you can see where your approach was different from theirs.

Before jumping into the real work, we'll cover the overall data lifecycle, concerns and bias in data, and verifying AI answers, so you have them in mind when working through the rest of the module.

{% slot "video", "Module overview. What this module covers, how the six parts fit together, and how you'll be working with AI throughout.", "180px" %}

{% section "Follow the Record" %}

Every dataset you will ever be handed was shaped by systems and decisions you didn't see, and knowing that changes how much you trust a number. This first warm-up shows you that hidden journey once, end to end, so you recognize it in every file you open afterward.

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

{% section "The planes that didn't come back" %}

The most dangerous errors in data work come not from wrong values but from missing ones — the records that never made it into the file at all. No amount of careful checking will surface them unless you have learned to ask about them, which is what this warm-up is for.

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

{% section "Almost right" %}

For the rest of this module an AI will be writing your code and drafting your answers, which means the skill you will use more than any other is deciding whether what it gave you is true. This last warm-up has you practice that skill in miniature before anything depends on it.

Many are now doing data work with AI assistance. In survey after survey, the same professionals who use AI daily name the same frustration above all the others. Answers that are *almost* right. Not wrong in ways that jump out. Wrong in ways that read smoothly, sound confident, and cause problems when they slip though.

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

{% section "The six parts" %}

The rest of this module is one continuous piece of work. A clinic director asks a vague question about visit data, and you carry that request all the way to an answer she can act on — with an AI writing the code from your prompts at every step. The six parts follow the arc of that job. Do them in order; each one hands its result to the next.

You start with **Ask**, where somebody asks you a question and the work is figuring out what they actually need and what would count as an answer, before anything gets typed. In **Explore** you find out what you have been handed before you change any of it — shape, types, ranges, what is missing, what the categories contain. **Transform** is where you fix what you found and build the columns your question needs; both look like chores and are really a run of decisions. In **Analyze** you answer the question, then work out who is missing from the answer before anyone acts on it. **Share** is four sentences for someone who will only ever read the summary, where every number can be correct and the meaning still wrong.

Finally, in **Apply**, the guardrails come off: a dataset that is new to you, a real question, and your own judgment about how to approach it.

When you're ready, continue to Part 1.

{% section "Feedback" %}

This module is a draft, and what you say here directly shapes the next revision. A sentence about what confused you or what worked is genuinely useful.

{% feedback "3", "overview" %}
