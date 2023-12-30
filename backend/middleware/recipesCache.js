"use strict";

/** Middleware to fill recipes cache */

const { RecipesApi, getRandomRecipesAsync } = require("../config");

let recipesCache = null;
let cacheTimestamp = null;
const CACHE_EXPIRATION_THRESHOLD = 59 * 60 * 1000;

const serveRecipesCache = async (req, res, next) => {

    // Check if recipesCache data that has not expired.

    if (recipesCache && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_EXPIRATION_THRESHOLD) {

        console.log(`Serving recipesCache - Cached at ${cacheTimestamp} still valid as of ${Date.now()}`)

        req.recipesCache = recipesCache

        return next();

    }

    // Fetch fresh date from API if expired.
    
    try {

        let opts = {
            limitLicense: true,
            number: 1
        }

        const data = await getRandomRecipesAsync(opts)
        recipesCache = data
        cacheTimestamp = Date.now();

        req.recipesCache = data
        next();


    } catch (e) {

        return next(e)

    }


}

// Schedule a periodic task to clear the cache
setInterval(() => {

    if (cacheTimestamp && Date.now() - cacheTimestamp > CACHE_EXPIRATION_THRESHOLD) {
        console.log("Clearing cached data due to expiration");
        recipesCache = null;
        cacheTimestamp = null;
    }

}, CACHE_EXPIRATION_THRESHOLD);

module.exports = {

    serveRecipesCache

}

