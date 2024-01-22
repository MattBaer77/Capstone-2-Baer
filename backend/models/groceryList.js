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

                `SELECT i.ingredient_id,
                        i.amount,
                        i.unit,
                        i.minimum_amount
                    FROM grocery_list gl
                    JOIN grocery_lists_ingredients i ON gl.id = i.grocery_list_id
                    WHERE gl.id = $1
                    ORDER BY i.ingredient_id`,
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

            `SELECT i.ingredient_id,
                    i.amount,
                    i.unit,
                    i.minimum_amount
                FROM grocery_list gl
                JOIN grocery_lists_ingredients i ON gl.id = i.grocery_list_id
                WHERE gl.id = $1
                ORDER BY i.ingredient_id`,
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

        return groceryList.id

    };

    // Delete a grocery list
    /** delete(id)
     * 
     * returns true or false - if deleted or not
     * 
    **/

    static async remove(id){

        let result = await db.query(
            `DELETE
            FROM grocery_list
            WHERE id = $1
            RETURNING list_name`,
            [id]
        )

        const listId = result.rows[0]

        if(!listId) throw new ExpressError(`No grocery list: ${id}`, 404);

        return true

    };

    // Add an ingredient to a grocery list
    /** addIngredient(id, ingredientId, amount, unit, minimumAmount)
     * 
     * 
     * return true or false
     * 
     *
    **/

    static async addIngredient(id, ingredientId, amount, unit, minimumAmount) {

        const listCheck = await db.query(

            `SELECT id FROM grocery_list WHERE id = $1`, [id]

        )

        if(!listCheck.rows[0]) throw new ExpressError(`Grocery list ${id} does not exist.`, 404)

        const duplicateCheck = await db.query(

            `SELECT grocery_list_id,
                    ingredient_id 
                FROM grocery_lists_ingredients
                WHERE grocery_list_id = $1
                AND ingredient_id = $2`,
                [id, ingredientId]

        );

        if(duplicateCheck.rows[0]) throw new ExpressError(`Grocery list ${id} already contains ingredient ${ingredientId}. Increment instead.`, 400);

        const result = await db.query(

            `INSERT INTO grocery_lists_ingredients
                   (grocery_list_id, ingredient_id, amount, unit, minimum_amount)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING grocery_list_id, ingredient_id`,
            [id, ingredientId, amount, unit, minimumAmount]

        );

        return true

    };

    // Set amount on an ingredient on a grocery list
    /** setAmount(id, ingredientId, amount)
     * 
     * return true;
     * 
    **/

    static async setAmount(id, ingredientId, amount) {

        const validUpdateCheck = await db.query(
            `SELECT grocery_list_id AS "id",
                    ingredient_id AS "ingredientId",
                    amount
                FROM grocery_lists_ingredients
                WHERE grocery_list_id = $1 AND ingredient_id = $2`,
                [id, ingredientId]
        )

        if(!validUpdateCheck.rows[0]) throw new ExpressError(`No grocery list with id ${id}`, 404)
        if(!validUpdateCheck.rows[0].ingredientId) throw new ExpressError(`No ingredient with id ${ingredientId} on grocery list with id ${id}`, 404)

        const res = await db.query(
            `UPDATE grocery_lists_ingredients
                SET amount = $3
                WHERE grocery_list_id = $1 AND ingredient_id = $2
                RETURNING grocery_list_id, ingredient_id, amount`,
                [id, ingredientId, amount]
        )

        return true

    };

    // Set minimum amount on an ingredient on a grocery list
    /** setAmount(id, ingredientId, minimumAmount)
     * 
     * return true;
     * 
    **/

    static async setMinimumAmount(id, ingredientId, minimumAmount) {

        const validUpdateCheck = await db.query(
            `SELECT grocery_list_id AS "id",
                    ingredient_id AS "ingredientId",
                    minimum_amount AS "minimumAmount"
                FROM grocery_lists_ingredients
                WHERE grocery_list_id = $1 AND ingredient_id = $2`,
                [id, ingredientId]
        )

        if(!validUpdateCheck.rows[0]) throw new ExpressError(`No grocery list with id ${id}`, 404)
        if(!validUpdateCheck.rows[0].ingredientId) throw new ExpressError(`No ingredient with id ${ingredientId} on grocery list with id ${id}`, 404)

        const res = await db.query(
            `UPDATE grocery_lists_ingredients
                SET minimum_amount = $3
                WHERE grocery_list_id = $1 AND ingredient_id = $2
                RETURNING grocery_list_id, ingredient_id, minimum_amount`,
                [id, ingredientId, minimumAmount]
        )

        return true

    };

    // delete an ingredient from a grocery list
    /** deleteIngredient(id, ingredientId)
     * 
     * 
     * return true or false
     * 
     * 
    **/

    static async ingredientDelete(id, ingredientId){

        const res = await db.query(
            `DELETE
            FROM grocery_lists_ingredients
            WHERE grocery_list_id = $1 AND ingredient_id = $2
            RETURNING grocery_list_id, ingredient_id`,
            [id, ingredientId]
        );

        console.log(res.rows)

        if(!res.rows.length) throw new ExpressError(`No ingredient with id ${ingredientId} on grocery list with id ${id}`, 404);

        return true;

    }

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