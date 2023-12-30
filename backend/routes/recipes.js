"use strict";

/** Routes for Recipes */

const express = require("express");

const router = express.Router({ mergeParams: true })

const { serveRecipesCache } = require('../middleware/recipesCache')

router.get('/', serveRecipesCache, (req, res, next) => {

    console.log("Recipes Root")

    return res.json(req.recipesCache)

})

module.exports = router;