"use strict";

/** Routes for Recipes */

const express = require("express");

const router = express.Router({ mergeParams: true })

const { SpoonApi } = require("../models/spoonModel")

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