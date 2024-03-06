
# Easyspoon

**This project is deployed here:**

 - https://easyspoon.surge.sh/

<br>

## Purpose

Easyspoon - a ***Express + React*** application that makes good nutrition enjoyable by empowering end users to easily plan and meal prep.

Built with the [Spoonacular API](https://spoonacular.com/food-api) using the [Spoonacular SDK](https://github.com/ddsky/spoonacular-api-clients/tree/master/javascript).

<br>

## Functionality

_Easyspoon_ allows a user to:

- Sign up/login
- Add "intolerances" to their user profile to filter recipe results
- Browse and search recipes and ingredients
- Create grocery lists of recipes and ingredients that can be referenced while shopping
- Add an ingredient to a grocery list
- Allow a user to view / edit amounts and units of the item to be purchased
- Add or delete a recipe on a grocery list 
    - Adding will auto-populate the necessary ingredients
    - Deleting a recipe will remove the auto-populated ingredients

<br>

## Technology

_Easyspoon_ consists of:

- An ***Express*** backend API which:
    - Handles all communication between the frontend application and the [Spoonacular API](https://spoonacular.com/food-api) to retrieve detailed ingredient and recipe information
    - Manages user data
    - Manages a user's grocery lists and their respective recipes and ingredients

- A ***React*** frontend application which:
    - Provides a simple UI that a user can access via web or mobile browser to manage their account and grocery lists
    - Provides a user-friendly reference while shopping and meal-planning

Additional dependencies used:

- Backend:
    - express
    - jsonschema
    - jsonwebtoken
    - pg
    - jest
    - supertest
    
- Frontend:
    - react
    - react-dom
    - react-router-dom
    - jwt-decode

<br>

## Testing

Both backend and frontend applications contain separate sets of tests.

<br>

In order to run all **backend** tests -

- Navigate to **backend/** directory
- run "jest -i"

_Note: all backend tests are located in the same directory as the files they test._

_These include:_
 - /backend
 - /backed/helpers
 - /backend/middleware
 - /backend/models
 - /backend/routes

<br>

In order to run all **frontend** tests -

- Navigate to easyspoon/ directory
- run "npm run test"

Note: all frontend tests are located in easyspoon/src/tests, but can be run from the easyspoon/ directory.