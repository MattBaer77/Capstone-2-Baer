"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const ExpressError = require("../expressError");
const User = require('../models/user');
const SpoonApi = require('../models/spoonModel')
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

        if(user.cache) user.cache = user.cache.data;

        if(!user.cache){

            const { intolerances } = await User.getIntolerances(req.params.username)
            console.log(intolerances)

            let recipes;

            if(intolerances.length) {
                const cache = await SpoonApi.randomRecipesExcludeIntolerances(intolerances)
                recipes = cache.recipes
            } else {
                const cache = await SpoonApi.serveRandomCache()
                recipes= cache.recipes
            }
                        
            user.cache = recipes
        }

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

router.get("/:username/cache", ensureAdminOrEffectedUser, async (req, res, next) => {

    try {
        const user = await User.getWithCache(req.params.username);

        if(user.cache) user.cache = user.cache.data;

        if(!user.cache){

            const { intolerances } = await User.getIntolerances(req.params.username)
            // console.log(intolerances)
            const { recipes } = await SpoonApi.randomRecipesExcludeIntolerances(intolerances)
            user.cache = recipes

        }

        return res.json({user});
    } catch (e) {
        return next(e);
    }

})

// GET CACHE *
/** GET USER CACHE - /users/[username]/cache-only
 * 
 * Accepts ?username
 * 
 * Returns {cache} or error
 * 
*/


router.get("/:username/cache-only", ensureAdminOrEffectedUser, async (req, res, next) => {

    try {
        
        let cache = await User.getCache(req.params.username);

        let data;

        if(cache) data = cache.data

        if(!data){

            const { intolerances } = await User.getIntolerances(req.params.username)
            // console.log(intolerances)
            const { recipes } = await SpoonApi.randomRecipesExcludeIntolerances(intolerances)
            data = recipes

        }

        return res.json(data);
    } catch (e) {
        return next(e);
    }

})

// SET CACHE
/** PUT USER CACHE - /users/[username]/cache
 * 
 * Accepts ?username and {data}
 * 
 * Returns true or error
 * 
*/

// CLEAR CACHE
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
/** POST USER INTOLERANCE - /users/[username]/intoleranceId
 * 
 * returns {username, intolerances} (or SAME AS GET USER WITH INTOLERANCES)
 * 
*/

router.post("/:username/intolerances/:intoleranceId", ensureAdminOrEffectedUser, async (req, res, next) => {

    try {

        const username = req.params.username
        const intoleranceId = parseInt(req.params.intoleranceId)

        await User.addUserIntolerance(username, intoleranceId)

        return res.json(true)

    } catch (e) {
        return next(e)
    }

})

// REMOVE INTOLERANCE *
/** DELETE USER INTOLERANCE - /users/[username]/intoleranceId
 * 
 * returns {username, intolerances} (or SAME AS GET USER WITH INTOLERANCES)
 * 
*/

router.delete("/:username/intolerances/:intoleranceId", ensureAdminOrEffectedUser, async (req, res, next) => {

    try {

        const username = req.params.username
        const intoleranceId = parseInt(req.params.intoleranceId)

        await User.removeUserIntolerance(username, intoleranceId)

        return res.json(true)

    } catch (e) {
        return next(e)
    }

})

module.exports = router;