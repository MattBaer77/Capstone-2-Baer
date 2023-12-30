"use strict";

/** Middleware to fill recipes cache */

const { RecipesApi } = require("../config");

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

    try{

        console.log("Fetching New Recipes")

        let opts = {
            limitLicense: true,
            number: 1
        }

        RecipesApi.getRandomRecipes(opts, (error, data, response) => {

            if(error) {
                console.error(error)
            } else {
                // console.log(response)
                console.log('API CALLED SUCCESSFULLY');
                // console.log(data)
                // console.log(response.body)
                recipesCache = data
                cacheTimestamp = Date.now();
                req.recipesCache = data;
                next();
            }
        })

    } catch(error) {

        return error

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

