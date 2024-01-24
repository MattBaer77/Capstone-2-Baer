"use strict";

/** Routes for authentication. */

const jsonschema = require("jsonschema");

const User = require("../models/user");
const express = require("express");
const router = new express.Router();

// create token
// schemas...
const userAuthSchema = require("../schemas/userAuth.json")
const userRegisterSchema = require("../schemas/userRegister.json")

const ExpressError = require("../expressError")

/** POST TOKEN - /auth/token
 * 
 * Accepts {username, password}
 * 
 * Returns {token}
 * 
*/

// POST REGISTER - accepts {username, password, firstName, lastName, email} - returns token

/** POST REGISTER - /auth/register
 * 
 * Accepts {username, password}
 * 
 * Returns {token}
 * 
*/

module.exports = router;