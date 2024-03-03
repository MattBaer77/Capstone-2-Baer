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

    // console.log("/ingredients/search hit with:")
    // console.log(`query(s):`, req.query.query)
    // console.log(`intolerance(s)`, req.query.intolerances)

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

    // console.log(intoleranceString)

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

router.get('/:id', ensureUserLoggedIn, async (req, res, next) => {

    try {

        const id = parseInt(req.params.id)
        if(req.query.amount !== undefined && req.query.amount.includes(',')) throw new ExpressError('Bad Request - Amount must be single integer like: "5", "75", "100"',400);
        if(typeof req.query.amount === 'object') throw new ExpressError('Bad Request - Amount must be single integer like: "5", "75", "100"',400);
        if(req.query.unit !== undefined && req.query.unit.includes(',')) throw new ExpressError('Bad Request - Amount must be string like "cup"',400);
        if(req.query.unit !== undefined && typeof req.query.unit !== 'string') throw new ExpressError('Bad Request - Amount must be string like "cup"',400);
    
        const amount = req.query.amount ? parseInt(req.query.amount) : null
        const unit = req.query.unit ? req.query.unit : null

        const data = await SpoonApi.ingredientInformation(id, amount, unit)
        return res.json(data)

    } catch (e) {
        return next(e)
    }

});

module.exports = router;