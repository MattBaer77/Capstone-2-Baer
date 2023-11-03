# Matthew Baer - Capstone 2 project proposal

<br>

## Goal: Making good nutrition enjoyable by empowering end users to easily plan and meal prep.

### The goal of this React app is to help users:

- Browse and select recipes to form a collection of recipes
    - Should be able to search and/or filter and/or sort collection of recipes
 - Generate a usable shopping list of ingredients from that collection of recipes
 - Allow users to add ingredients to the grocery list a la carte
 - Allow users to track which ingredients they have purchased while they are shopping
 - Save “Shopping Trips” - Combinations of meals that constitute a single trip to the grocery store that they can repeat at a later date, and check off  - items that they may already have.
 - Ensure that application is desktop and mobile compatible / usable

### Secondary/Stretch goals of this site/app (priority order):

 - Allow users to set up a profile which includes ingredient restrictions
    - Allow users to filter suggested meals based on ingredient data.
 - Allow users to easily share recipes/grocery lists via email or text

### Tertiary/Stretch goals of this site/app (priority order):

 - Provide the user with current pricing information
    - Contingent if API is available with pricing info
    - Allow for shopping for delivery if API is available - (possibly Kroeger API)
 - Chart and schedule meals to a calendar
    - Easily edit meal plans on calendar

<br>

## Demographic:

 - This web app should provide an approachable way for novice cooks to explore while still providing valuable organization and planning functionality to intermediate cooks.

<br>

## Tech Stack:
 - Database: SQL
    - Data also retrieved from above mentioned APIs
 - Backend: Express - Node.js web application framework
 - Other backend libraries may include:
    - Jsonschema
    - Jsonwebtoken
    - Jest (for testing)
 - Frontend: React - JS library for web and native user interfaces
 - Other frontend libraries may include
    - Axios
    - Jwt-decode
    - React-router
    - Jest (for testing)

<br>

### This will be an evenly focused full-stack web application capstone accessible and usable via desktop or mobile website site.

<br>

## Data to be used:

### APIs that may be used to get recipe data:
 - https://rapidapi.com/collection/food-apis
 - https://spoonacular.com/food-api/pricing
 - https://developer.edamam.com/edamam-recipe-api

### APIs that may be used to get ingredient pricing:
 - Possible - https://developer.kroger.com/

### User supplied:
 - User identification info:
    - Username
    - Password
    - Personal info for filters:
    - Allergies

<br>

## Outline of approach:

### Database schema:
 - *Diagram:*

<img src="../diagrams/Capstone 2 - Database Schema - REV A.png" alt="database schema diagram" style="height:800px">

<br>

### API potential issues:
 - API downtime
 - API becoming no longer available
 - API not organizing information in way anticipated
 - API data not normalized
 - API data is sparse / lacking detail

### Sensitive information:
 - username
 - encrypted password
 - allergy information

### Functionality:
 - Collect basic user information on signup:
    - Email
    - Username
    - Password
    - First Name
    - Last Name
    - Possible - allergies
 - Represent a list of recipes that the user can search and/or filter and/or sort by a variety of parameters.
    - Difficulty
    - Region/Cuisine
    - Possible - filter by ingredients
 - Adding a meal should populate a grocery list with lists of:
    - Meals
    - Combined list of all groceries
 - Users should be able to allow a la carte ingredients to their grocery list through a searchable / filterable / sortable ingredients list
 - Users should be able to manage list items for grocery and meal lists
 - User Flow:
    - *Diagram: (Rough Draft)*

<img src="../diagrams/Capstone 2 User Flow.png" alt="user flow diagram" style="width:1000px">

<br>

 ### Features beyond CRUD:
 - Automatically aggregates ingredients into concise grocery list
 - Dynamically updating search for recipes and ingredients
 - Customizable filtering options based on ingredients and allergies
 - Email / text sharing on mobile
 - Stretch Goals listed above in section: __“Secondary/Stretch goals of this site/app (priority order)”__ and __“Tertiary/Stretch goals of this site/app (priority order)”__
