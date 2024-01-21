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
    static async findAll(username) {

        const groceryListsRes = await db.query(
            `SELECT gl.id,
                    gl.list_name,
                    gl.owner
                FROM grocery_list gl
                WHERE gl.owner = $1
                ORDER BY gl.id`,
                [username],
        );

        const groceryLists = groceryListsRes.rows

        if (!groceryLists.length) throw new ExpressError(`No user: ${username}`, 404);

        for (let list of groceryLists){

            let ingredients = await db.query(

                `SELECT i.id,
                        i.ingredient_id,
                        i.amount,
                        i.unit,
                        i.minimum_amount
                    FROM grocery_list gl
                    JOIN grocery_lists_ingredients i ON gl.id = i.grocery_list_id
                    WHERE gl.id = $1
                    ORDER BY i.id`,
                    [list.id]

            );

            list.ingredients = ingredients.rows;

            let recipes = await db.query(

                `SELECT r.id,
                        r.recipe_id
                    FROM grocery_list gl
                    JOIN grocery_lists_recipes r ON gl.id = r.grocery_list_id
                    WHERE gl.id = $1
                    ORDER BY r.id`,
                    [list.id]

            );

            list.recipes = recipes.rows;

        }

        return groceryLists

    };

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

    static async get(id){

        const groceryListRes = await db.query(

            `SELECT gl.id,
                    gl.list_name,
                    gl.owner
            FROM grocery_list gl
            WHERE gl.id = $1`,
            [id],

        );

        const groceryList = groceryListRes.rows[0];

        if(!groceryList) throw new ExpressError(`No grocery list: ${id}`, 404);

        let ingredients = await db.query(

            `SELECT i.id,
                    i.ingredient_id,
                    i.amount,
                    i.unit,
                    i.minimum_amount
                FROM grocery_list gl
                JOIN grocery_lists_ingredients i ON gl.id = i.grocery_list_id
                WHERE gl.id = $1
                ORDER BY i.id`,
                [id]

        )

        groceryList.ingredients = ingredients.rows;

        let recipes = await db.query(

            `SELECT r.id,
                    r.recipe_id
                FROM grocery_list gl
                JOIN grocery_lists_recipes r ON gl.id = r.grocery_list_id
                WHERE gl.id = $1
                ORDER BY r.id`,
                [id]

        );

        groceryList.recipes = recipes.rows;

        return groceryList

    };

    // Create a grocery list
    /** create(list_name, username)
     * 
     * 
     * RETURNS an ID
     * 
     * 
     * 
    **/

    static async create(list_name, username){

        const result = await db.query(
            `INSERT INTO grocery_list
            (list_name,
            owner)
            VALUES ($1, $2)
            RETURNING id`,
            [list_name, username],
        );

        const groceryList = result.rows[0]

        return groceryList

    };

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