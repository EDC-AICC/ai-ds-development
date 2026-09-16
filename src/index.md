---
layout: base.njk
isHome: true
title: AI in Data Science
kicker: Community college course · six modules
standfirst: >
  Preparing AI-enhanced data practitioners. Students learn to direct AI tools on real data
  work, and to tell whether the result is any good.
description: A six-module course introducing community college students to the role of the AI-enhanced data practitioner.
---

## Modules

<div class="cards">
{% for u in collections.all | units %}
<a class="lcard" href="{{ u.url | url }}">
  <p class="num">{{ u.data.module.kicker }}</p>
  <h3>{{ u.data.module.title }}</h3>
  <p>{{ u.data.module.blurb }}</p>
  <div class="meta"><span><b>{{ u.data.module.status }}</b></span></div>
</a>
{% endfor %}
</div>

