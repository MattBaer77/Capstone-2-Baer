"use strict";

const db = require("../db");

const {sqlForPartialUpdate} = require("../helpers/sql")

const ExpressError = require("../expressError");

class GroceryList {

    // Find all of a user's grocery lists.
    /** findAll(username)
     * 
     * returns array of:
     * 
     * returns grocery lists like - [{id, listName, username, ingredients, recipes},]
     * 
     * Where ingredients - [{id, ingredientId, amount, unit, minimumAmount}]
     * Where recipes - [{id, recipeId}]
     * 
    **/

    // Search? - would it even be useful???

    // Find a grocery list by id.
    /** get(groceryListId)
     * 
     * returns grocery list like - {id, listName, username, ingredients, recipes}
     * 
     * Where ingredients - [{id, ingredientId, amount, unit, minimumAmount}]
     * Where recipes - [{id, recipeId}]
     * 
    **/

    // Create a grocery list
    /** create(list_name, username)
     * 
     * 
     * RETURNS an ID
     * 
     * 
     * 
    **/

    // Delete a grocery list
    /** delete(id)
     * 
     * returns true or false - if deleted or not
     * 
    **/

    // Add an ingredient to a grocery list
    /** addIngredient(id, ingredientId)
     * 
     * 
     * return true or false
     * 
     *
    **/

    // delete an ingredient from a grocery list
    /** deleteIngredient(id, ingredientId)
     * 
     * 
     * return true or false
     * 
     * 
    **/

    // Add a recipe to a grocery list
    /** addRecipe(id, recipeId)
     * 
     * Returns nothing or undefined - THIS MAY RETURN TRUE OR FALSE
     * May need to add ingredients and increment minimum amounts
     *
     *
    **/

    // delete a recipe from a grocery list
    /** deleteRecipe(id, recipeId)
     * 
     * Returns nothing or undefined. - THIS MAY RETURN TRUE OR FALSE
     * May need to remove ingredients and decrement minimum amounts
     * 
    **/

}

module.exports = GroceryList;