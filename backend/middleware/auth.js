"use strict";

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const ExpressError = require("../expressError");

/**Authenticate user by token
 * 
 * If a token was provided, verify it.
 * If valid, store token payload on res.locals
 * 
 * If not valid, store nothing on res.locals
 * If not provided, stor nothing on res.locals
 * 
*/

function authenticateJWT(req, res, next) {
    try{
        const authHeader = req.headers && req.headers.authorization;

        if(authHeader) {

            const token = authHeader.replace(/^[Bb]earer /, "").trim();
            res.locals.user = jwt.verify(token, SECRET_KEY);

        };

        return next();

    } catch(e) {

        return next();

    }
}

/**Confirm a user is logged in
 * 
 * If user logged in, return next();
 * 
 * If user not logged in, throw ExpressError("Unauthorized - User must be logged in.", 401)
 * 
*/

function ensureUserLoggedIn(req, res, next){

    try {

        if(!res.locals.user) throw new ExpressError("Unauthorized - User must be logged in", 401);
        return next();

    } catch (e) {

        return next(e);

    }

};

/**Confirm a user is logged in and is an Admin
 * 
 * If user logged in and an admin, return next();
 * 
 * If user not logged in and an admin, throw ExpressError("Unauthorized - Admin must be logged in.", 401)
 * 
*/
function ensureAdminLoggedIn(req, res, next){

    try {

        if(!res.locals.user || !res.locals.user.isAdmin) throw new ExpressError("Unauthorized - Admin must be logged in", 401);

        return next();

    } catch (e) {

        return next(e);

    }

};

/**Confirm a user is logged in and the user identified in the route, or is logged in and an Admin
 * 
 * If user logged in and user identified in route, or logged in and an admin, return next();
 * 
 * If user not logged in and user identified in route, or logged in and an admin, throw ExpressError("Unauthorized - User must be logged in.", 401)
 * 
*/
function ensureAdminOrEffectedUser(req, res, next){};


module.exports = {
    authenticateJWT,
    ensureUserLoggedIn,
    ensureAdminLoggedIn,
    ensureAdminOrEffectedUser
}