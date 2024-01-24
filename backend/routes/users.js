"user strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const ExpressError = require("../expressError");
const User = require('../models/user');

// add Schemas Here

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

// GET USER WITH CACHE AND INTOLERANCES *
/** GET USER - /users/[username]/details
 * 
 * Accepts ?username
 * 
 * Returns {username, firstName, lastName, isAdmin, cache, intolerances}
 * 
*/

// PATCH USER *
/** PATCH USER - /users/[username]
 * 
 * Accepts any {firstName, lastName, password, email}
 * 
 * Returns (updated) {firstName, lastName, password, email}
 * 
*/

// DELETE USER *

/** DELETE USER - /user
 * 
 * Accepts ?username
 * 
 * Returns true or error
 * 
*/

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