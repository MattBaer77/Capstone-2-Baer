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
const groceryListsAddIngredientSchema = require("../schemas/groceryListsAddIngredient.json")
const groceryListsSetAmountSchema = require("../schemas/groceryListsSetAmount.json")

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

router.get("/:username/all", ensureAdminOrEffectedUser, async (req, res, next) => {

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

router.get("/:id", ensureAdminOrListOwner, async (req, res, next) => {

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

        const newGroceryList = await GroceryList.create(req.body.listName, req.params.username);

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

router.post("/:id/ingredients", ensureAdminOrListOwner, async (req, res, next) => {

    try {

        const validator = jsonschema.validate(req.body, groceryListsAddIngredientSchema)

        if(!validator.valid) {
            const e = validator.errors.map(e => e.stack);
            throw new ExpressError(e, 400)
        }

        const ingredientAdded = await GroceryList.addIngredient(req.params.id, req.body.ingredientId, req.body.amount, req.body.unit, req.body.minimumAmount)

        return res.json(ingredientAdded)

    } catch (e) {
        return next(e)
    }

})

// SET INGREDIENT AMOUNT - BY ID + INGREDIENT ID + AMOUNT
/** PATCH GROCERYLIST-INGREDIENT-AMOUNT - /grocery-lists/[id]/ingredients/[ingredientId]
 * 
 * Accepts {amount}
 * 
 * Returns true
 * 
 * 
*/

router.patch("/:id/ingredients/:ingredientId", ensureAdminOrListOwner, async (req, res, next) => {

    try {

        const validator = jsonschema.validate(req.body, groceryListsSetAmountSchema);

        if(!validator.valid) {
            const e = validator.errors.map(e => e.stack);
            throw new ExpressError(e, 400);
        }

        const groceryListIngredientAmountToSet = await GroceryList.setAmount(req.params.id, req.params.ingredientId, req.body.amount)

        return res.json(groceryListIngredientAmountToSet)

    } catch (e) {
        return next(e)
    }

})

// DELETE INGREDIENT - BY ID + INGREDIENT ID
/** DELETE GROCERYLIST-INGREDIENT - /grocery-lists/[id]/ingredients/[ingredientId]
 * 
 * Returns true
 * 
*/

router.delete("/:id/ingredients/:ingredientId", ensureAdminOrListOwner, async (req, res, next) => {

    try {

        // ADD LOGIC TO CHECK IF ON RECIPE AND SET TO 0 INSTEAD? - FOR NOW NOT OPINIONATED / PRESCRIPTIVE AND USERS CAN DELETE AN INGREDIENT EVEN IF NEEDED FOR RECIPE

        const groceryListIngredientToDelete = await GroceryList.deleteIngredient(req.params.id, req.params.ingredientId);

        return res.json(groceryListIngredientToDelete);

    } catch (e) {
        return next(e)
    }

});

// **********

// GROCERYLIST RECIPES ROUTES -

// POST RECIPE - BY ID + RECIPE ID
/** POST GROCERYLIST-RECIPE - /grocery-list/[id]/recipes/[recipeId]
 * 
 * Returns true
 * 
*/

router.post("/:id/recipes/:recipeId", ensureAdminOrListOwner, async (req, res, next) => {

    try {

        const groceryListId = parseInt(req.params.id)
        const recipeId = parseInt(req.params.recipeId)

        const groceryList = await GroceryList.get(groceryListId)
        const recipe = await SpoonApi.recipeInformation(recipeId)

        for(let ingredient of recipe.extendedIngredients){

            if (groceryList.ingredients.some(i => i.ingredientId === ingredient.id)){

                const groceryListIngredient = groceryList.ingredients.find(i => i.ingredientId === ingredient.id);
                await GroceryList.setAmount(groceryList.id, ingredient.id, (groceryListIngredient.amount + ingredient.amount));
                await GroceryList.setMinimumAmount(groceryList.id, ingredient.id, (groceryListIngredient.minimumAmount + ingredient.amount));

            } else {
                await GroceryList.addIngredient(groceryList.id, ingredient.id, ingredient.amount, ingredient.unit, ingredient.amount)
            }

        }

        await GroceryList.addRecipe(groceryListId, recipeId)

        return res.json(true)

    } catch (e) {
        return next(e)
    }

});

// DELETE RECIPE - BY ID + RECIPE ID
/** DELETE GROCERYLIST-RECIPE - /grocery-list/[id]/recipes/[id]
 *
 * Returns true
 * 
*/

router.delete("/:id/recipes/:recipeId", ensureAdminOrListOwner, async (req, res, next) => {

    try {

        const groceryListId = parseInt(req.params.id)
        const recipeId = parseInt(req.params.recipeId)
        const groceryList = await GroceryList.get(groceryListId)
        const recipe = await SpoonApi.recipeInformation(recipeId)

        for(let ingredient of recipe.extendedIngredients) {

            console.log("looking")

            const groceryListIngredient = groceryList.ingredients.find(i => i.ingredientId === ingredient.id);

            if(groceryListIngredient){

                if(ingredient.amount === groceryListIngredient.minimumAmount){

                    console.log("DELETING")
                    console.log(ingredient.id)
                    console.log(ingredient.amount)
                    console.log(groceryListIngredient.minimumAmount)

                    await GroceryList.deleteIngredient(groceryList.id, ingredient.id)

                } else {

                    console.log("REDUCING AMOUNT")

                    const newAmount = (groceryListIngredient.amount - ingredient.amount)
                    const newMinimumAmount = (groceryListIngredient.minimumAmount - ingredient.amount)

                    await GroceryList.setAmount(groceryList.id, ingredient.id, newAmount);
                    await GroceryList.setMinimumAmount(groceryList.id, ingredient.id, newMinimumAmount);

                }
            }

        }

        const deleteId = groceryList.recipes.find(r => r.recipeId === recipeId)

        await GroceryList.deleteRecipe(deleteId.id)

        return res.json(true)

    } catch (e) {
        return next(e)
    }

});

module.exports = router;