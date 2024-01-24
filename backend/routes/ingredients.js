"user strict";

/** Routes for ingredients */

const jsonschema = require("jsonschema");

const express = require("express");
const ExpressError = require("../expressError");
const SpoonApi = require("../models/spoonModel")

// add Schemas Here

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

// GET - BY ID
/** GET INGREDIENT - /ingredients/[id]
 * 
 * Accepts ?id
 * 
 * Returns {ingredient}
 * 
*/

module.exports = router;