"use strict"

const { promisify } = require('util')

// 
// SPOONACULAR TO TEST - COPIED AND MODIFIED FROM spoonacularSDK/README

// const spoonacularKey = process.env.spoonacularKey

const { spoonacularKey } = require('../config.js')

var spoonacularApi = require('../../spoonacularSDK/dist/com.spoonacular.client/index.js');
var defaultClient = spoonacularApi.ApiClient.instance;

// Configure API key authorization: apiKeyScheme
var apiKeyScheme = defaultClient.authentications['apiKeyScheme'];
apiKeyScheme.apiKey = spoonacularKey

// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//apiKeyScheme.apiKeyPrefix['x-api-key'] = "Token"

// // CREATE API 
// let RecipesApi = new spoonacularApi.RecipesApi();
// let MiscApi = new spoonacularApi.MiscApi();

// // PROMISIFIED API FUNCTIONS USED IN APP -
// const getARandomFoodJokeAsync = promisify(MiscApi.getARandomFoodJoke.bind(MiscApi));
// const getRandomRecipesAsync = promisify(RecipesApi.getRandomRecipes.bind(RecipesApi));
// const getRecipeInformationAsync = promisify(RecipesApi.getRecipeInformation.bind(RecipesApi));

// // SPOONACULAR TO TEST - COPIED AND MODIFIED FROM spoonacularSDK/README
// //

class SpoonApi {

    static recipesCache = null;
    static cacheTimestamp = null;
    static CACHE_EXPIRATION_THRESHOLD = 59 * 60 * 1000;

    static recipesApi = new spoonacularApi.RecipesApi();
    static miscApi = new spoonacularApi.MiscApi();
  
    static getARandomFoodJoke = promisify(SpoonApi.miscApi.getARandomFoodJoke.bind(this.miscApi));

    static getRandomRecipes = promisify(SpoonApi.recipesApi.getRandomRecipes.bind(this.recipesApi))
    static getRecipeInformation = promisify(SpoonApi.recipesApi.getRecipeInformation.bind(this.recipesApi))

    // 

    static isCacheValid = () => {
        return this.recipesCache && this.cacheTimestamp && Date.now() - this.cacheTimestamp < this.CACHE_EXPIRATION_THRESHOLD;
    };
    
    static fetchFreshData = async () => {
        try {
            const opts = {
                limitLicense: true,
                number: 1
            };
    
            const data = await this.getRandomRecipes(opts);
            this.recipesCache = data;
            this.cacheTimestamp = Date.now();
            return data;
        } catch (e) {
            throw e;
        }
    };
    
    static clearCacheIfExpired = () => {
        if (this.cacheTimestamp && Date.now() - this.cacheTimestamp > this.CACHE_EXPIRATION_THRESHOLD) {
            console.log("Clearing cached data due to expiration");
            this.recipesCache = null;
            this.cacheTimestamp = null;
        }
    };
    
    static serveRecipesCache = async () => {
        try {
            if (this.isCacheValid()) {
                console.log(`Serving recipesCache - Cached at ${this.cacheTimestamp} still valid as of ${Date.now()}`);
                return this.recipesCache

            } else {
                const data = await this.fetchFreshData();
                this.recipesCache = data;
            }
    
            this.clearCacheIfExpired();
            return this.recipesCache;
        } catch (e) {
            throw e;
        }
    };

}

// Schedule a periodic task to clear the cache
// setInterval(SpoonApi.clearCacheIfExpired, SpoonApi.CACHE_EXPIRATION_THRESHOLD);

// 

module.exports = {

    SpoonApi

}
