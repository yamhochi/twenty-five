---
title: "Search & Spatial Query for NSW Government"
description: "The Central Resource for Sharing and Enabling Environmental Data in NSW"
publishDate: "30 Aug 2016"
tags: ["musings"]
# coverImage:
#   src: ""
#   alt: ""
draft: false
---

![a cell phone and a tablet on a white background with a blue border and the words seed on it](https://res.cloudinary.com/ddgt1wiwm/image/upload/f_auto,q_auto/v1/twenty-four-assets/seed-landing)

SEED (Sharing and Enabling Environmental Data) is a plaform built for storing, sharing and visualising environmental information. It empowers the community to search for and analyse large amounts of data when making critical decisions about the environment.

---

## Spatial query technical background

![a blue circle with red dots on it and a white circle with red dots in the middle of it](https://res.cloudinary.com/ddgt1wiwm/image/upload/f_auto,q_auto/v1/twenty-four-assets/seed-spatialQuery)
Most people would have familar with the concept of searching for a nearby location. (eg. Using Google Maps to search for nearby amenities, points of interest, or using Uber to find the nearest ride etc.) This also means, finding nearest x,y coordinates in relation to the user’s x,y coordnate.

### Geospatial features in real life

![a diagram showing location features in real life](https://res.cloudinary.com/ddgt1wiwm/image/upload/f_auto,q_auto/v1/twenty-four-assets/seed-spatialFeatures)
When it comes to more complex geospatial features, finding the nearest patch of land may not be as simple finding x,y coordinates only. There are several considerations such as the centroid and geometry of the layer or layer itersection rules that may skew query results.

### Technical challenges

![a screen shot of a map of a park with a lot of trees and a lot of dots on it](https://res.cloudinary.com/ddgt1wiwm/image/upload/f_auto,q_auto/v1/twenty-four-assets/seed-searchResults)

![a screen shot of a square with the words results returned in the middle of the screen, and a square with the word results in the middle of the screen](https://res.cloudinary.com/ddgt1wiwm/image/upload/f_auto,q_auto/v1/twenty-four-assets/seed-searchResultsNone)

There are various out of the box solutions that enable spatial search by map extent (left figure) and in principle, fulfills the criteria of spatial search in the brief. However, this requires the spatial layers to be visible on the map. With more than 200 geospatial layers in our repository, this feature becomes very cumbersome to use, let alone helping people make sense of the data they are seeing. It impacts overall usability due to:

1. Visual information overload
2. Incomplete representation of spatial information (documents such as legislative information are not physically present on the map but still pertinent to the search critieria)
3. Poor loading performance on the browser

---

## Building a lighter weight search

![a blue circle with numbers on it and the number of each circle in the middle of the circle, and the number of each circle in the middle of the circle](https://res.cloudinary.com/ddgt1wiwm/image/upload/f_auto,q_auto/v1/twenty-four-assets/seed-lightweight)
While spatial information are highly visual, but in reality we know search can be fast and optimal if it does not need require data to be rendered graphically. Here’s an example solution to match spatial extent to spatial layers without having to render them extensively on the browser.

### Behind the scenes

![a series of four images showing different areas of the same area spatial features](https://res.cloudinary.com/ddgt1wiwm/image/upload/f_auto,q_auto/v1/twenty-four-assets/seed-lightweightBreakdown)

1. Divide New South Wales into 200+ base sections based on Local Government Area (LGA). Other options: this can be done using uniform grids or finer grain boundaries such as SA2 or Suburbs.

![a square with a hole in the middle and a circle in the middle with a hole in the middle](https://res.cloudinary.com/ddgt1wiwm/image/upload/f_auto,q_auto/v1/twenty-four-assets/seed-lightweightBoundary)

2. Iterate through all layers in the database. For each LGA that the layer intersects with, assign that intersecting LGA as an attribute. Return json that shows each spatial layer and their corresponding LGA attributes.

![four squares of different shapes and sizes with different numbers on each side of the squares, each with a different number of dots on each side of the squares](https://res.cloudinary.com/ddgt1wiwm/image/upload/f_auto,q_auto/v1/twenty-four-assets/seed-lightweightIntersect) 3. When user performs a search by spatial extent, the system only needs to know which LGA intersects with the search extent. Return a list of those LGAs.

![a screen shot of a map of a park with a lot of trees and a lot of dots on it](https://res.cloudinary.com/ddgt1wiwm/image/upload/f_auto,q_auto/v1/twenty-four-assets/seed-lightweightResults) 4. Using the returned list in step 3, iterate through the json in step 2 and find spatial layers that have matching LGAs with that list.

### Results preview and visual confirmation

![a screenshot of a map of the state of washington and surrounding the state of washington and surrounding the state of washington](https://res.cloudinary.com/ddgt1wiwm/image/upload/f_auto,q_auto/v1/twenty-four-assets/seed-lightweightPreview)
The returned list could still be extensive. Here, we introduced a preview functionality to help users visually confirm the results before proceeding to load the spatial layer. This reduces the amount of time they have to wait while the browser is rendering layer. This also allows user to quickly interrogate the results and correct their inputs iteratively. This improves discoverabiltiy and has significantly higher impact on data education and enablement.

---

## Map Search Interaction

<video width="100%" autoplay loop muted >
    <source  src="https://res.cloudinary.com/ddgt1wiwm/video/upload/f_auto:video,q_auto/v1/twenty-four-assets/seed-MapSearch" type="video/mp4" > 
</video>

In terms of design and implementation, people were asked to provide feedback on the prototype and draw out what was expected from the map search interface. Having a mid fidelity wireframe helped gathered everyone's thoughts more clearly helped us better align expectations.

---

## Designing the search component

![a screenshot of the search page for a website with the search button highlighted and the search button highlighted](https://res.cloudinary.com/ddgt1wiwm/image/upload/f_auto,q_auto/v1/twenty-four-assets/seed-searchComponent)
Trying out different ways give users more flexibility to search and filter.

![a screenshot of a web page with a number of different items in the web page, including a phone, a keyboard, a mouse, and a cell phone](https://res.cloudinary.com/ddgt1wiwm/image/upload/f_auto,q_auto/v1/twenty-four-assets/seed-interactionStates)
Breaking down different states of interaction.

![a screenshot of a map of spatial features with a search bar highlighted](https://res.cloudinary.com/ddgt1wiwm/image/upload/f_auto,q_auto/v1/twenty-four-assets/seed-searchPreview)
Pitching the team some ideas how we could make search much easier with preview option.
