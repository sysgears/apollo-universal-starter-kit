# UX Best Practices
This section is divided into two sections

* [General Prcatices](#general-practices)
* [Advanced Practices](#advanced-practices)

## General Practices
1. Do Not Put Everything in a Single Screen:
   Putting all of the application’s menus, features, and buttons in a single screen is a bad UX practice, but one that is commonly seen. In this scenario, UX Designers and Developers start with a tight interface, but over time they add features that result in a screen full of buttons.
   To a UX Designer, this kind of app looks like a Swiss Army knife with all the tools unfolded, but the only one being used is the bottle opener.
2. Let the User Know Where They Are in the App
   When your app has a consistent design system and brand style, all the pages may start to feel the same to the end-user. Soon enough, the end-user may feel like they are walking through a forest of pages, unable to recall if they have seen a particular page before, or if they are actually on a different page with a similar state.
   Create every screen for this user by following these guidelines:
   Give pages clear headers and page names
   Implement breadcrumbs if you design more than one level deep
   If the page flow has multiple steps, show those steps
3. Do Not Double Up the Pop-Ups
   The best practice here is to implement one of the following solutions:
   Turn the first pop-up window into a page itself, or
   Convert the second pop-up window into an inline message in the first pop-up window
4. Plan Your Forms Carefully
   A UX Designer has to make a lot of decisions about forms. For example, should there be a long list of form inputs? Should the form be broken up in to multiple steps? Or maybe there should be three columns of form inputs, so that they all fit into a single screen?
   The best practice for designing forms is to put input fields in a single column. This will make it easier for the end-user to continue their flow down the page and check off each section.
   If there are only 2–5 form field items to choose from, do not put them in a drop-down menu. This might seem like an elegant solution, but it will not be worth the user’s effort and clicks. Placing radio buttons is a friendlier approach.

## Advance Practices
1. Use sticky headers to entice users to explore the site
   Sticky headers, or the fixed navigation menu that stays on the screen when the user scrolls down, is now a web design standard. Allowing better navigation, sticky UI elements “ensure that users have access to key actions or information wherever they are on the page,” according to Adobe experts.
2. Do usability testing during the website design process.
   The goal of usability testing is to ensure that people you design for can use your product. Testing during the website design process can help you identify issues early on and minimize costs.

# Steps for changing UI Components from Bootstrap to Semantic UI
1. First and foremost step is to install all the dependencies required by Semantic UI
2. Import Semantic UI css file to each modules index.js
3. Start replacing UI Components from bootstrap to Semantic UI in each components in modules. Some UI components have to be changed completetly depending on the design and ussage defined by the Semantic Docs. Some design might needed to accomodate Semantic UI Components.

The time needed in completing this task is based on the issues faced while converting and the number components needed to be replaced.