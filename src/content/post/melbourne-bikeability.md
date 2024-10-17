---
title: "Visualising Melbourne's bikeability @ Geonext Hackathon"
description: "Geonext Hackathon's mapping melbourne bikeability data visualisation & analysis"
publishDate: "02 December 2015"
tags: ["musings"]
# coverImage:
#   src: ""
#   alt: ""
draft: false
---

How much are you willing to pay to cycle to work? Given that the bike and the helmet is free. This is not a trick question. As we live in a world with limited resources, everything we do and not do, has a cost. Therefore decision making boils down to how much you are willing to pay.

This is a recording of my winning entry to the Geonext Hackathon held in November 2016

---

## How far do people cycle to work?

![a map of a city with a blue line on the middle of the map showing a 20 km catchment](https://res.cloudinary.com/ddgt1wiwm/image/upload/f_auto,q_auto/v1/twenty-four-assets/melbourne-20km)

To make this explanation easier, let's say the cost of driving is $10 per km. Riding a bike is much cheaper but there are still costs associated with maintaining the bike, purchasing safety gear etc and let's say it costs someone $1 to cycle 1 km. And if we assume an average person is willing to pay up to $20 to cycle to work. This is the spatial catchment for those who could afford to cycle to work in Melbourne CBD.

However, varying road conditions across the catchment may make it more difficult for some to cycle to the CBD. For example, route difficulty, bike path safety etc could inherently increase the cost of cycling. A cycling budget of $20 may only get someone the distance of 10kms or less, if we take into account these costs.

---

## What does 20kms actually look like?

![a map of the city of new york with a red line in the middle of the map and a blue line in the middle of the map](https://res.cloudinary.com/ddgt1wiwm/image/upload/f_auto,q_auto/v1/twenty-four-assets/melbourne-20kmCost)
Here, I came up with solution to estimate the cycling catchment based on a cycle budget of $20 using open source datasets from VicRoads portal. First, let's take a look at current road conditions within this 20km catchment. Blue roads indicate cycle paths that are "easier" for the rider therefore cheaper. Red lines indicate cycle paths that are more "difficult" to cycle on therefore may be more expensive to cycle on.

Distance costs include:

1. Traffic flow – the heavier the traffic, the more expensive
2. Heavy vehicles – The more heavy vehicles, the more expensive
3. Bus lanes – Do cyclists have to share the road with buses?
4. Traffic light stops – Are the roads appropriately signaled for cyclists?
5. Crash history – Perceived road safety. The model assigns a higher cost to the road if crash volumes are higher.
6. Slope – How flat is the road. The flatter the road, the cheaper.

---

## Real Bikeable Distance

![a blue and white map of a city with lines in the middle of the map showing a smaller catchment](https://res.cloudinary.com/ddgt1wiwm/image/upload/f_auto,q_auto/v1/twenty-four-assets/melbourne-20kmReal)
As a result, an average persons's bikeable distance may be cut short significantly for a budget of $20. The map below shows the "bikeable" distance after apply costs to travel origins of over 1700 locations in Melbourne Metropolitan area.

---

## Potential bike paths to optimise

![a map of a city with a blue line in the middle of the map and a blue line in the middle of the map](https://res.cloudinary.com/ddgt1wiwm/image/upload/f_auto,q_auto/v1/twenty-four-assets/melbourne-optimise)
Another insight drawn from this is showing existing areas that are ideal for cycling. Knowing where the bottlenecks are, whether the whole path from A to B is diffult or if there are only small sections of the road that needs fixing, helps authorities make decisions about where or how they should invest in improving the overall city's wellbeing.
