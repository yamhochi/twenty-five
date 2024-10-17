---
title: "Commonwealth Bank Australia Analytics"
description: " Designing tools to better understand, communicate and distribute data"
publishDate: "11 Nov 2018"
tags: ["archive"]
# coverImage:
#   src: "./homtrust-landing"
#   alt: "Landing page of homtrust web and mobile view"
draft: false
---

## About the project

![a screenshot of a dashboard with a line graph and a line graph on the bottom of the screen](https://res.cloudinary.com/ddgt1wiwm/image/upload/f_auto,q_auto/v1/twenty-four-assets/cbaAnalytics-landing)
I worked with the data team at Commonwealth Bank to better articulate data in a complex environment.

The Data and Decision Science division was a group of marketers, analysts and scientists behind the bank's 'next best conversations' initiative — using customer insights to automatically generate campaigns to better engage customers. Since its inception, executives were keen to explore more robust way of reporting these campaigns' performances and getting more insights out of the data we were collecting. Given that the system was new, the department is yet to find a consistent way to produce a single source of truth for performance reporting. I worked closely with the data visualisation and data science teams to come up with ideas/initiatives to improve the way we expose data, making sure it is adopted by analysts across the board in order to achieve the goal of 1 source of truth.

---

## Current state audits, interviews and findings summary

![a black and white graphic with the words, stream of work, tactical, strategic and goals](https://res.cloudinary.com/ddgt1wiwm/image/upload/f_auto,q_auto/v1/twenty-four-assets/cbaAnalytics-priority)
The first few weeks was all about trying to understand different workflows and reporting needs across the department. I learned that reporting needs are not only associated with the usual business goals (eg. engagement, activation, conversion, retention etc.), but much has to do with how the organisation operates and shares knowledge across the board.

Based on my initial findings, I drew up some recommendations and initiatives that I can help my team with. As indicated below, some of the work would be come as requests from other teams (most of them are short-term tactical efforts to work around current challenges), some would be longer term strategic efforts and would take more time to fruition. However, giving each 'initiative' a clear goal helps the team understand the different nature of the work, the effort we should spend, and how it should be reported up and help management understand the impact we're making for them.

---

## Fostering Trust

![a screenshot of a web page with a number of items on the page with a side drawer showing help](https://res.cloudinary.com/ddgt1wiwm/image/upload/f_auto,q_auto/v1/twenty-four-assets/cbaAnalytics-webHelp)
**To understand deeply is being able to ask the right questions, find answers, and have the ability interrogate our own doubts and confirm our biases about data.**

One of the main challenges when it comes to adopting a single source of truth is that people find it hard to trust the results because they couldn't see the raw data that aligns to the real world. Especially for data agents, they would rather get access to the database and create their own results because they could have more control over the explanation of the results.However, some calculations and normalising are performed in the self service tools (Tableau), which is why governance team is trying to encourage a single source of truth through Tableau rather than the database. On the other hand, Tableau has its constraints user interaction and performance due to the way it was designed initially order to help data agents better understand what they were seeing in Tableau, I found a better way to work around those constraints and designed a table using ReactTables that would still be reading the correct information using Tableau's data API instead of the interface. This allowed data agents to more freely interact with and interrogate the data behind the self service tool, resulting in better understanding and trust with the results.

## Digestible Granular Data

<video width="100%" autoplay loop muted >
    <source  src="https://res.cloudinary.com/ddgt1wiwm/video/upload/f_auto:video,q_auto/v1/twenty-four-assets/cbaAnalytics-powerFilters" type="video/mp4" > 
</video>

Other than that, there were a number of nuances behind the calculations that weren't necessarily clear to the novice user. One being the technicalities around Lagging indicators in relation to real time reporting. The other being the Simpson effect that would happen when results are filtered. Not only did this made it extremely difficult to report week-to-week or month-to-month results in real time. The results would also easily be misinterpreted if the audience were not educated or thoroughly briefed beforehand that were all addressed through the transition towards more powerful table filters

---

## Audience led IA Reconfiguration

![a screenshot of the before and after screenshot of the site's main menu](https://res.cloudinary.com/ddgt1wiwm/image/upload/f_auto,q_auto/v1/twenty-four-assets/cbaAnalytics-menu)
The navigational model of the initial design had good intentions to be more attentive to individual preferences. But this didn't help in discoverability of the metrics available. This resulted in poorly adopted dashboards that would have otherwise saved data agents time in producing custom reports.I proposed a menu structure that better aligns with the organisational structure and intent of using the self-service platform. Since the improvement, some of the dashboard views have increased significantly, resulting in better understanding and usage of the metrics our team provided.

---

## Data visualisation and Narrative

![Some image](https://res.cloudinary.com/ddgt1wiwm/image/upload/f_auto,q_auto/v1/twenty-four-assets/cbaAnalytics-dataviz)
**Data prototyping is about identifying the possibilities that the data offers in terms of a meaningful visual experience and narrative.**

Majority of the time, a simple bar chart and table is enough to get an idea across quickly. But sometimes, through experimentation, trial and error, with different ways of representing data, we were able to discover patterns and insights that a bar chart couldn't provide. On the other spectrum, sometimes, the right juxtaposition of text and symbols communicates results much quicker than a chart. Throughout my time here, I've tried out different ways to represent the same family of metrics. This includes investigating the feasibility of technology / platform (eg. Tableau vs D3.js vs Excel), choosing the right chart, researching novel ways to represent specific results. I've created a repository to document their pros and cons, constraints and context of use.This works as an ideation tool / tips and tricks document to help analysts better communicate their insights and reports.

---

## Interactive Executive Reports

<video width="100%" autoplay loop muted >
    <source  src="https://res.cloudinary.com/ddgt1wiwm/video/upload/f_auto:video,q_auto/v1/twenty-four-assets/cbaAnalytics-slide" type="video/mp4" > 
</video>

**The dissemination of knowledge is to make information highly relevant, easily digestible readily available.**

Apart from making sure metrics are adopted within the department, leadership team needed a way to communicate and share these results with stakeholders outside the Data and Decision Science division. The current solution was to produce a department wide slide deck that each team had to include some of their key findings during each quarter.The result was a slide deck of over 40 pages that people found hard to navigate and follow as a narrative. It also took analysts a lot of effort to pull together the results, summarise them and attend to the layout and details to make it presentable. I proposed a presentation platform that would reduce the need to manually style the slides, allow people to interact with the results, and worked with governance team to produce a coherent narrative collectively.
