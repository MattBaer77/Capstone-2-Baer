"user strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express")
const ExpressError = require("../expressError")
const User = require('../models/user')

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

// GET USER WITH CACHE AND INTOLERANCES *

// PATCH USER *

// DELETE USER *

// **********

// CACHE ROUTES -
// (MUST BE SAME USER)

// GET USER WITH CACHE

// GET CACHE *

// SET CACHE *

// CLEAR CACHE *

// **********

// INTOLERANCES ROUTES -
// (MUST BE SAME USER)

// GET USER WITH INTOLERANCES

// ADD INTOLERANCE *

// REMOVE INTOLERANCE *