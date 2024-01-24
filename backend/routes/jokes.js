"use strict";

/** Routes for jokes (test route) */

const express = require("express")

const { SpoonApi } = require("../models/spoonModel")

const router = express.Router({ mergeParams: true });

// (MUST BE LOGGED IN USER - ANY)
// GET - RETURN A RANDOM JOKE
/** GET JOKE - /jokes
 * 
 * Accepts no arguments
 * 
 * Returns {joke}
 * 
 * 
*/
router.get('/', async (req, res, next) => {

  console.log("Joke Test Route");

  try {

    const data = await SpoonApi.getARandomFoodJoke()
    return res.json(data)

  } catch (e) {
    return next(e)
  }

});

module.exports = router;