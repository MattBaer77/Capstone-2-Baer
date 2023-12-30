"use strict";

/** Middleware to fill recipes cache */

const { getRandomRecipesAsync } = require("../config");

let recipesCache = null;
let cacheTimestamp = null;
const CACHE_EXPIRATION_THRESHOLD = 59 * 60 * 1000;

const isCacheValid = () => {
    return recipesCache && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_EXPIRATION_THRESHOLD;
};

const fetchFreshData = async () => {
    try {
        const opts = {
            limitLicense: true,
            number: 1
        };

        const data = await getRandomRecipesAsync(opts);
        recipesCache = data;
        cacheTimestamp = Date.now();
        return data;
    } catch (e) {
        throw e;
    }
};

const clearCacheIfExpired = () => {
    if (cacheTimestamp && Date.now() - cacheTimestamp > CACHE_EXPIRATION_THRESHOLD) {
        console.log("Clearing cached data due to expiration");
        recipesCache = null;
        cacheTimestamp = null;
    }
};

const serveRecipesCache = async (req, res, next) => {
    try {
        if (isCacheValid()) {
            console.log(`Serving recipesCache - Cached at ${cacheTimestamp} still valid as of ${Date.now()}`);
            req.recipesCache = recipesCache;
        } else {
            const data = await fetchFreshData();
            req.recipesCache = data;
        }

        clearCacheIfExpired();
        return next();
    } catch (e) {
        return next(e);
    }
};

// Schedule a periodic task to clear the cache
setInterval(clearCacheIfExpired, CACHE_EXPIRATION_THRESHOLD);

module.exports = {
    serveRecipesCache
};