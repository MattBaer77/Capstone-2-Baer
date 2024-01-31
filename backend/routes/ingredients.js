"user strict";

/** Routes for ingredients */

const jsonschema = require("jsonschema");

const express = require("express");
const ExpressError = require("../expressError");
const User = require("../models/user")
const SpoonApi = require("../models/spoonModel")
const { ensureUserLoggedIn } = require("../middleware/auth");

const router = express.Router();

// INGREDIENTS ROUTES -
// (MUST BE LOGGED IN USER - ANY)

// GET - SEARCH FOR AN INGREDIENT
/** GET INGREDIENT - /ingredients/search
 * 
 * Search by:
 *  * query
 *  * intolerances
 * 
 * Accepts ?query & intolerances
 * 
 * Returns [ingredients]
 * 
*/

router.get('/search', ensureUserLoggedIn, async (req, res, next) => {

    console.log("/ingredients/search hit with:")
    console.log(`query(s):`, req.query.query)
    console.log(`intolerance(s)`, req.query.intolerances)

    const { intolerances } = await User.getIntolerances(res.locals.user.username)

    let intoleranceString = '';

    if(intolerances.length) {

        intoleranceString = intolerances.reduce((a, i) => a +i.intoleranceName + ',', '')

    }

    if(req.query.intolerances && typeof req.query.intolerances === 'object'){

        intoleranceString = intoleranceString + req.query.intolerances.join(',') + ','

    }

    if(req.query.intolerances && typeof req.query.intolerances === 'string') {

        intoleranceString = intoleranceString + req.query.intolerances + ','

    }

    intoleranceString = intoleranceString.slice(0, -1);

    console.log(intoleranceString)

    try {

        const data = await SpoonApi.searchIngredients(req.query.query, intoleranceString)
        return res.json(data)

    } catch (e) {
        return next(e)
    }

});

// GET - BY ID
/** GET INGREDIENT - /ingredients/[id]
 * 
 * Accepts ?id
 * 
 * Returns {ingredient}
 * 
*/

module.exports = router;