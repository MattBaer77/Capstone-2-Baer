"use strict";

/** Routes for recipes */

const express = require("express");

const router = express.Router({ mergeParams: true })

const SpoonApi = require("../models/spoonModel")
const User = require("../models/user")


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

    console.log("/recipes/cache hit")

    try {
        const data = await SpoonApi.serveRecipesCache()
        return res.json(data)
    } catch (e) {
        return next(e)
    }

});

// *
// (MUST BE SAME USER - OR ADMIN)
// GET Recipes from user's Cache - or - fill user's cache
/** GET RECIPE - /recipes/cache/[username]
 * 
 * Accepts ?username
 * 
 * Cache ID = User's ID
 * Check user recipe cache on database
 * If no data, load and save to database cache
 * If data, load data
 * 
*/

// 

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

router.get('/search', async (req, res, next) => {

    const q = req.query;

    console.log("/recipes/search hit with:")
    console.log(`query(s):`, q.query)
    console.log(`intolerance(s)`, q.intolerances)
    console.log(`diet(s)`, q.diet)

    // NOTE - SOURCE OF "INTOLERANCES" AND "DIET" MAY NEED TO CHANGE FROM QUERY STRING TO USER INFO CONTAINED IN TOKEN
    const opts = {

        'query':q.query,
        'intolerances':q.intolerances,
        'diet':q.diet,

    };

    try {

        const data = await SpoonApi.getRecipeBySearch(opts)
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

module.exports = router;