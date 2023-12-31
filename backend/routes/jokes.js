"use strict";

/** Routes for jokes (test route) */

const express = require("express")

const { SpoonApi } = require("../models/spoonModel")

const router = express.Router({ mergeParams: true });


router.get('/', async (req, res, next) => {

  console.log("Joke Test Route");

  // MiscApi.getARandomFoodJoke((error, data, response) => {
  //   if (error) {
  //     console.error(error);
  //   } else {
  //     console.log('API called successfully. Returned data: ' + data);
  //     // console.log(response.body.text)
  //     console.log(response.body)
  //     return res.json(response.body)
  //   }
  // });

  try {

    const data = await SpoonApi.getARandomFoodJoke()
    return res.json(data)

  } catch (e) {
    return next(e)
  }

});

module.exports = router;