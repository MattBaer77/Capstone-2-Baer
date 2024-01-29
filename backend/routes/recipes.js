"use strict";

/** Routes for recipes */

const express = require("express");

const router = express.Router({ mergeParams: true })

const User = require("../models/user")
const SpoonApi = require("../models/spoonModel")
const { ensureUserLoggedIn } = require("../middleware/auth");


// RECIPES ROUTES -
// (MIXED AUTH - SPECIFIED PER ROUTE)


// (PUBLIC - FOR HOMEPAGE - LIMITED BY CACHE TIMER - 59 MIN - MAX 25 CALLS / DAY)
// GET Recipes from Cache - or - fill cache (generic cache on server memory)
/** GET RECIPE - /recipes/cache
 * 
 * Accepts no arguments
 * 
 * Returns [cache]
 * 
*/

router.get('/cache', async (req, res, next) => {

    try {
        const {recipes} = await SpoonApi.serveRecipesCache()
        return res.json(recipes)
    } catch (e) {
        return next(e)
    }

});

// (MUST BE LOGGED IN USER - ANY)
// GET Search For A Recipe
/** GET RECIPE - /recipes/search
 * 
 * Search by:
 *  * query(s)
 *  * intolerance(s)
 *  * diet(s)
 * 
 * Accepts ?query & intolerances & diet
 * 
 * Returns [recipes]
 * 
*/

router.get('/search', ensureUserLoggedIn, async (req, res, next) => {

    console.log("/recipes/search hit with:")
    console.log(`query(s):`, req.query.query)
    console.log(`intolerance(s)`, req.query.intolerances)
    console.log(`diet(s)`, req.query.diet )

    console.log(res.locals.user.username)

    const { intolerances } = await User.getIntolerances(res.locals.user.username)

    console.log(intolerances)
    console.log(req.query.intolerances)

    let intoleranceString = '';

    if(intolerances.length) {

        intoleranceString = intolerances.reduce((a, i) => a +i.intoleranceName + ',', '')

    }

    if(req.query.intolerances && typeof req.query.intolerances === 'object'){

        intoleranceString = intoleranceString + req.query.intolerances.join(',') + ','

    }

    if(req.query.intolerances && typeof req.query.intolerances === 'string') {

        intoleranceString = intoleranceString + req.query.intolerances + ','

    }

    intoleranceString = intoleranceString.slice(0, -1);

    console.log(intoleranceString)

    try {

        const data = await SpoonApi.searchRecipes(req.query.query, intoleranceString, req.query.diet )
        return res.json(data)

    } catch (e) {
        return next(e)
    }

});

// (MUST BE LOGGED IN USER - ANY)
// GET RECIPE - BY ID
/** GET RECIPE - recipes/[id]
 * 
 * Accepts ?id
 * 
 * returns {recipe}
 * 
*/

router.get('/:id', async (req, res, next) => {

    // REFACTOR TO USE SpoonApi.recipeInformation

    console.log("/recipes/ID hit with id of:")
    console.log(req.params.id)

    const id = req.params.id
    const opts = {
        'includeNutrition':false
    };

    try {

        const data = await SpoonApi.getRecipeInformation(id, opts)
        return res.json(data)

    } catch (e) {
        return next(e)
    }

});

// (MUST BE LOGGED IN USER - ANY)
// GET RECIPE - BY ID
/** GET RECIPE - recipes/[id]
 * 
 * Accepts ?id
 * 
 * returns {recipe}
 * 
 * INCLUDES NUTRITION
 * 
*/

router.get('/:id', async (req, res, next) => {

    // REFACTOR TO USE SpoonApi.recipeInformation

    console.log("/recipes/ID hit with id of:")
    console.log(req.params.id)

    const id = req.params.id
    const opts = {
        'includeNutrition':true
    };

    try {

        const data = await SpoonApi.getRecipeInformation(id, opts)
        return res.json(data)

    } catch (e) {
        return next(e)
    }

});

module.exports = router;