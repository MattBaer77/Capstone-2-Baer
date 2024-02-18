"use strict";

/** Routes for intolerances. */

const express = require("express");
const ExpressError = require("../expressError")
const Intolerance = require('../models/intolerance');

const router = express.Router();

// GET INTOLERANCES *
/** GET INTOLERANCES - /intolerances
 * 
 * returns {intolerances}
 * 
*/

router.get("/", async(req, res, next) => {

    try {
        const intolerances = await Intolerance.findAll()
        return res.json({intolerances});
    } catch (e) {
        return next(e);
    }

})

module.exports = router;