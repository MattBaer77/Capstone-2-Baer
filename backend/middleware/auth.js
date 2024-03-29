"use strict";

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const ExpressError = require("../expressError");

// TO CHECK GROCERYLIST OWNER
const db = require("../db");

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
function ensureAdminOrEffectedUser(req, res, next){

    try {

        if (!res.locals.user || !res.locals.user.isAdmin && res.locals.user.username != req.params.username) throw new ExpressError("Unauthorized - Must be Admin or Effected User", 401);
        return next();

    } catch (e) {

        return next(e);

    }


};

/**Confirm a user is logged in and the owner of the list, or is logged in and an Admin
 * 
 * If user logged in and user identified in route, or logged in and an admin, return next();
 * 
 * If user not logged in and user identified in route, or logged in and an admin, throw ExpressError("Unauthorized - User must be logged in.", 401)
 * 
*/
async function ensureAdminOrListOwner(req, res, next){

    try{

        if(!res.locals.user) throw new ExpressError("Unauthorized - User must be logged in", 401);
        if(!req.params.id) throw new ExpressError('Bad Request - Must include id like "1" or "100"', 400);
        if(/\D/.test(req.params.id)) throw new ExpressError('Bad Request - Must include id like "1" or "100"', 400);

        const ownerCheck = await db.query(

            `SELECT gl.id,
                    gl.owner
            FROM grocery_list gl
            WHERE gl.id = $1`,
            [req.params.id],

        );

        if(!ownerCheck.rows[0] && res.locals.user.isAdmin) throw new ExpressError(`Not Found - No grocery list: ${req.params.id}`, 404);
        if(!ownerCheck.rows[0]) throw new ExpressError("Unauthorized - Must be Admin or List Owner", 401);
        if(ownerCheck.rows[0].owner !== res.locals.user.username && !res.locals.user.isAdmin) throw new ExpressError("Unauthorized - Must be Admin or List Owner", 401);

        return next();

    } catch (e) {

        return next(e);

    }

};


module.exports = {
    authenticateJWT,
    ensureUserLoggedIn,
    ensureAdminLoggedIn,
    ensureAdminOrEffectedUser,
    ensureAdminOrListOwner
}