"use strict";

/** Routes for Recipes */

const express = require("express");

const router = express.Router({ mergeParams: true })

const { RecipesApi, getRecipeInformationAsync } = require("../config");

const { serveRecipesCache } = require('../middleware/recipesCache')

// GET Recipes from Cache - or - fill cache
router.get('/cache', serveRecipesCache, (req, res, next) => {

    console.log("Recipes Root")
    // console.log(recipesCache)
    console.log("after rCache")

    return res.json(req.recipesCache)

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

        const data = await getRecipeInformationAsync(id, opts)
        return res.json(data);
        
    } catch (e) {

        return next(e)

    }


});

module.exports = router;