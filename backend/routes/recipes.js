"use strict";

/** Routes for Recipes */

const express = require("express");

const router = express.Router({ mergeParams: true })

const { SpoonApi } = require("../models/spoonModel")

// ALL ROUTES MUST BE PROTECTED BY MIDDLEWARE BEFORE COMPLETION TO NEGATE API KEY ABUSE

// GET Recipes from Cache - or - fill cache
router.get('/cache', async (req, res, next) => {

    console.log("/recipes/cache hit")

    try {
        const data = await SpoonApi.serveRecipesCache()
        return res.json(data)
    } catch (e) {
        return next(e)
    }

});

// GET Recipes from user's Cache - or - fill user's cache
// router.get('/cache/:id')
/**
 * Cache ID = User's ID
 * Check user recipe cache on database
 * If no data, load and save to database cache
 * If data, 
*/

// GET Search For A Recipe

/**
 Search by:
 * query(s)
 * intolerance(s)
 * diet(s)
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

// GET Specific Recipe based on ID
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