"use strict";

/** Routes for grocery lists */

const jsonschema = require("jsonschema");

const express = require("express");
const ExpressError = require("../expressError");
const GroceryList = require("../models/groceryList")
const SpoonApi = require("../models/spoonModel")
const { ensureAdminOrEffectedUser, ensureAdminOrListOwner } = require("../middleware/auth");

// add Schemas Here
const groceryListsCreateSchema = require("../schemas/groceryListsCreate.json")

const router = express.Router();


// GROCERYLIST ROUTES -
// (MUST BE OWNER OF LIST)

// GET GROCERY LISTS - BY USERNAME
/** GET GROCERYLIST - /grocery-lists/[username]
 * 
 * Accepts ?username
 * 
 * Returns [grocery lists] like - [{id, listName, username, ingredients, recipes},]
 * 
 * 
*/

router.get("/:username", ensureAdminOrEffectedUser, async (req, res, next) => {

    try{

        const groceryLists = await GroceryList.findAll(req.params.username);

        return res.json(groceryLists)

    } catch (e) {
        return next(e)
    }

});

// GET GROCERY LIST - BY ID
/** GET GROCERYLIST - /grocery-lists/[id]
 * 
 * Accepts ?id
 * 
 * Returns {grocery list}
 * 
 * Returns grocery list like - {id, listName, username, ingredients, recipes}
 * 
 * Where ingredients - [{id, ingredientId, amount, unit, minimumAmount}]
 * Where recipes - [{id, recipeId}]
 * 
*/

router.get("/:id/details", ensureAdminOrListOwner, async (req, res, next) => {

    try {

        const groceryList = await GroceryList.get(req.params.id);

        return res.json(groceryList)
        
    } catch (e) {
        return next(e)
    }

});

// POST NEW GROCERYLIST - LIST NAME + USERNAME
/** POST GROCERYLIST - /grocery-lists/[username]
 * 
 * Accepts {listName}
 * 
 * Returns id
 * 
*/

router.post("/:username", ensureAdminOrEffectedUser, async (req, res, next) => {

    try{

        const validator = jsonschema.validate(req.body, groceryListsCreateSchema);

        if(!validator.valid) {
            const e = validator.errors.map(e => e.stack);
            throw new ExpressError(e, 400);
        }

        const newGroceryList = await GroceryList.create(req.body, req.params.username);

        return res.json(newGroceryList)

    } catch (e) {
        return next(e)
    }

})

// DELETE GROCERYLIST - BY ID
/** DELETE GROCERYLIST - /grocery-lists/[id]
 * 
 * Accepts ?id
 * 
 * returns true
 * 
*/

router.delete("/:id", ensureAdminOrListOwner, async (req, res, next) => {

    try {

        const groceryListToDelete = await GroceryList.remove(req.params.id)

        return res.json(groceryListToDelete)

    } catch (e) {
        return next(e)
    }

});

// **********

// GROCERYLIST INGREDIENTS ROUTES -

// POST ADD INGREDIENT - BY ID, INGREDIENT ID, AMOUNT, UNIT, MINIMUM AMOUNT
/** POST GROCERYLIST-INGREDIENT - /grocery-lists/[id]/ingredients
 * 
 * Accepts {ingredientId, amount, unit, minimumAmount}
 * 
 * Returns true
 * 
*/

// SET INGREDIENT AMOUNT - BY ID + INGREDIENT ID + AMOUNT
/** POST GROCERYLIST-INGREDIENT-AMOUNT - /grocery-lists/[id]/amount
 * 
 * Accepts {id, ingredientId, amount}
 * 
 * Returns true
 * 
 * 
*/

// DELETE INGREDIENT - BY ID + INGREDIENT ID
/** DELETE GROCERYLIST-INGREDIENT - /grocery-lists/[id]/ingredients
 * 
 * Accepts {ingredientId}
 * 
 * Returns true
 * 
*/

// **********

// GROCERYLIST RECIPES ROUTES -

// POST RECIPE - BY ID + RECIPE ID
/** POST GROCERYLIST-RECIPE - /grocery-list/[id]/recipes
 * 
 * Accepts {recipeId}
 * 
 * Returns true
 * 
*/

// DELETE RECIPE - BY ID + RECIPE ID
/** DELETE GROCERYLIST-RECIPE - /grocery-list/[id]/recipes
 * 
 * Accepts {recipeId}
 * 
 * Returns true
 * 
*/

module.exports = router;