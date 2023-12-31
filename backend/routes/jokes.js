"use strict";

/** Routes for jokes (test route) */

const express = require("express")

const { SpoonApi } = require("../models/spoonModel")

const router = express.Router({ mergeParams: true });


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