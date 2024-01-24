"use strict";

/** Routes for authentication. */

const jsonschema = require("jsonschema");

const User = require("../models/user");
const express = require("express");
const router = new express.Router();

const createToken = require("../helpers/token")
const userAuthSchema = require("../schemas/userAuth.json")
const userRegisterSchema = require("../schemas/userRegister.json")

const ExpressError = require("../expressError");
const { route } = require("./users");

/** POST TOKEN - /auth/token
 * 
 * Accepts {username, password}
 * 
 * Returns {token}
 * 
*/

router.post("/token", async (req, res, next) => {

    try {

        const validator = jsonschema.validate(req.body, userAuthSchema);
        if(!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new ExpressError(`Bad Request - Reformat Input Data Errors: ${errs}`, 400)
        }

        const {username, password} = req.body;
        const user = await User.authenticate(username, password);
        const token = createToken(user);
        return res.json({token})

    } catch (e) {
        return next(e);
    }

});

// POST REGISTER - accepts {username, password, firstName, lastName, email} - returns token

/** POST REGISTER - /auth/register
 * 
 * Accepts {username, password}
 * 
 * Returns {token}
 * 
*/

router.post("/register", async(req, res, next) => {

    try{

        const validator = jsonschema.validate(req.body, userRegisterSchema);
        if(!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new ExpressError(`Bad Request - Reformat Input Data Errors: ${errs}`, 400)
        }

        const newUser = await User.register({...req.body, isAdmin:false});
        const token = createToken(newUser);
        return res.status(201).json({token});

    } catch (e) {
        return next(e);
    }

})

module.exports = router;