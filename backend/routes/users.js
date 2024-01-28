"user strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const ExpressError = require("../expressError");
const User = require('../models/user');
const { ensureAdminOrEffectedUser } = require("../middleware/auth");

// add Schemas Here
const userUpdateSchema = require("../schemas/userUpdate.json")

const router = express.Router();

// * => PRIORITY TO IMPLEMENT

// ADMIN ROUTES -

// POST USER
// GET USERS

// **********

// USER ROUTES -
// (MUST BE SAME USER - OR ADMIN)

// GET USER *
/** GET USER - /users/[username]
 * 
 * Accepts ?username
 * 
 * Returns {username, firstName, lastName, isAdmin}
 * 
*/

router.get("/:username", ensureAdminOrEffectedUser, async (req, res, next) => {

    try {
        const user = await User.get(req.params.username);
        return res.json({user});
    } catch (e) {
        return next(e);
    }

})

// GET USER WITH CACHE AND INTOLERANCES *
/** GET USER - /users/[username]/details
 * 
 * Accepts ?username
 * 
 * Returns {username, firstName, lastName, isAdmin, cache, intolerances}
 * 
*/

router.get("/:username/details", ensureAdminOrEffectedUser, async (req, res, next) => {

    try {
        const user = await User.getWithCacheAndIntolerances(req.params.username);
        return res.json({user});
    } catch (e) {
        return next(e);
    }

})

// PATCH USER *
/** PATCH USER - /users/[username]
 * 
 * Accepts any {firstName, lastName, password, email}
 * 
 * Returns (updated) {firstName, lastName, password, email}
 * 
*/

router.patch("/:username", ensureAdminOrEffectedUser, async (req, res, next) => {

    try {
        const validator = jsonschema.validate(req.body, userUpdateSchema);
        if(!validator.valid) {
            const e = validator.errors.map(e => e.stack);
            throw new ExpressError(e, 400)
        }
        const user = await User.update(req.params.username, req.body);
        return res.json({user});
    } catch (e) {
        return next(e)
    }

})

// DELETE USER *

/** DELETE USER - /user
 * 
 * Accepts ?username
 * 
 * Returns true or error
 * 
*/

router.delete("/:username", ensureAdminOrEffectedUser, async (req, res, next) => {

    try{
        const user = await User.remove(req.params.username, req.body);
        return res.json(user)
    } catch (e) {
        return next(e)
    }

})

// **********

// CACHE ROUTES -
// (MUST BE SAME USER)

// GET USER WITH CACHE *
/** GET USER CACHE - /users/[username]/cache
 * 
 * Accepts ?username
 * 
 * Returns {username, firstName, lastName, isAdmin, cache} or error
 * 
*/

// GET CACHE *
/** GET USER CACHE - /users/[username]/cache-only
 * 
 * Accepts ?username
 * 
 * Returns {cache} or error
 * 
*/

// SET CACHE *
/** PUT USER CACHE - /users/[username]/cache
 * 
 * Accepts ?username and {data}
 * 
 * Returns true or error
 * 
*/

// CLEAR CACHE *
/** DELETE USER CACHE - /users/[username]/cache
 * 
 * Accepts ?username
 * 
 * Returns true or error
 * 
*/

// **********

// INTOLERANCES ROUTES -
// (MUST BE SAME USER)

// GET USER WITH INTOLERANCES
/** GET USER WITH INTOLERANCES - /users/[username]/intolerances
 * 
 * Accepts ?username
 * 
 * Returns {username, firstName, lastName, isAdmin, intolerances} or error
 * 
*/

// ADD INTOLERANCE *
/** POST USER INTOLERANCE - /users/[username]/intolerances
 * 
 * Accepts {intoleranceId}
 * 
 * returns {username, intolerances} (or SAME AS GET USER WITH INTOLERANCES)
 * 
*/

// REMOVE INTOLERANCE *
/** DELETE USER INTOLERANCE - /users/[username]/intolerances
 * 
 * Accepts {intoleranceId}
 * 
 * returns {username, intolerances} (or SAME AS GET USER WITH INTOLERANCES)
 * 
*/

module.exports = router;