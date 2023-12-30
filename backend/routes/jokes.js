"use strict";

/** Routes for jokes (test route) */

const express = require("express")

const { MiscApi } = require("../config")

const router = express.Router({ mergeParams: true });


router.get('/', (req, res, next) => {

  console.log("Joke Test Route");

  MiscApi.getARandomFoodJoke((error, data, response) => {
    if (error) {
      console.error(error);
    } else {
      console.log('API called successfully. Returned data: ' + data);
      // console.log(response.body.text)
      console.log(response.body)
      return res.json(response.body)
    }
  });

});

module.exports = router;