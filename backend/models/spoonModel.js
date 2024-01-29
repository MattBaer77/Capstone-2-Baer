"use strict"

const { promisify } = require('util')

const { spoonacularKey } = require('../config.js')

const intolerancesToQueryString = require('../helpers/intolerancesToQueryString.js')

var spoonacularApi = require('../../spoonacularSDK/dist/com.spoonacular.client/index.js');
const ExpressError = require('../expressError.js');
var defaultClient = spoonacularApi.ApiClient.instance;

// Configure API key authorization: apiKeyScheme
var apiKeyScheme = defaultClient.authentications['apiKeyScheme'];
apiKeyScheme.apiKey = spoonacularKey

// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//apiKeyScheme.apiKeyPrefix['x-api-key'] = "Token"

class SpoonApi {

    // PUBLIC CACHE MANAGEMENT
    static recipesCache = null;
    static cacheTimestamp = null;
    static CACHE_EXPIRATION_THRESHOLD = 10 * 1000;

    // API
    static recipesApi = new spoonacularApi.RecipesApi();
    static miscApi = new spoonacularApi.MiscApi();

    // RECIPE(S) DIRECT ENDPOINTS METHODS - RANDOM
    static getARandomFoodJoke = promisify(SpoonApi.miscApi.getARandomFoodJoke.bind(this.miscApi));
    static getRandomRecipes = promisify(SpoonApi.recipesApi.getRandomRecipes.bind(this.recipesApi));

    // RECIPE(S) DIRECT ENDPOINTS METHODS - SEARCH & DETAIL
    static getSearchRecipes = promisify(SpoonApi.recipesApi.searchRecipes.bind(this.recipesApi));
    static getRecipeInformation = promisify(SpoonApi.recipesApi.getRecipeInformation.bind(this.recipesApi));

    // METHODS FOR USE IN ROUTES -

    // CACHE -
    static isCacheValid = () => {
        return this.recipesCache && this.cacheTimestamp && Date.now() - this.cacheTimestamp < this.CACHE_EXPIRATION_THRESHOLD;
    };
    
    static fetchFreshRandomData = async (number=10) => {

        // LIMIT API USE
        if (number === null || number <=0 || number > 10 || typeof number !== "number") number = 10;

        try {

            const opts = {
                limitLicense: true,
                number: number
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
            console.log("Clearing PUBLIC cache due to expiration");
            this.recipesCache = null;
            this.cacheTimestamp = null;
        }
    };

    static startCacheTimer = () => {
        setInterval(this.clearCacheIfExpired, this.CACHE_EXPIRATION_THRESHOLD);
    }
    
    static serveRecipesCache = async () => {
        try {
            if (this.isCacheValid()) {

                console.log(`Serving recipesCache - Cached at ${this.cacheTimestamp} still valid as of ${Date.now()}`);
                return this.recipesCache

            } else {

                console.log(`Filling recipesCache`)
                const data = await this.fetchFreshRandomData();
                this.startCacheTimer();
                this.recipesCache = data;

            }
    
            this.clearCacheIfExpired();
            return this.recipesCache;
        } catch (e) {
            throw e;
        }
    };

    // MAIN -

    static searchRecipes = async (query=null, intolerances=null, diet=null, number=10) => {

        // LIMIT API USE
        if (number === null || number <=0 || number > 10 || typeof number !== "number") number = 10;

        const opts = {

            query: query,
            intolerances: intolerances,
            diet: diet,
            number: number,
    
        };

        try {

            const results = await SpoonApi.getSearchRecipes(opts);
            return results;

        } catch (e) {
            throw (e)
        };

    }

    static recipeInformation = async (id, includeNutrition=false) => {

        if(typeof id !== "number") throw new ExpressError(`Bad Request - id:${id} must be a number`, 400)

        const opts = {includeNutrition: includeNutrition};

        try {

            const results = await SpoonApi.getRecipeInformation(id, opts);
            return results

        } catch (e) {
            throw (e)
        };

    };

    // SDK NOT USED DUE TO LIMITATIONS - NO "exclude-tags" FUNCTIONALITY AT SDK getRandomRecipes
    static randomRecipesExcludeIntolerances = async (number=10, intolerances=[]) => {

        intolerances = intolerancesToQueryString(intolerances)

        const url = `https://api.spoonacular.com/recipes/random?apiKey=${spoonacularKey}&number=${number}&exclude-tags=${intolerances}`

        console.log(url)

        try {

            const response = await fetch(url, {
                method: 'GET'
            })

            if (!response.ok) {
                throw new ExpressError("Error", response)
            }

            const data = response.json();

            return data

        } catch (e) {

            throw(e)

        }

    }

    // IN PROGRESS
    // static randomRecipesTagsIntolerances = async (number=10, intolerances=[]) => {

    //     // LIMIT API USE
    //     if (number === null || number <=0 || number > 10 || typeof number !== "number") number = 10;

    //     // intolerances = 'dairy free, gluten free'
    //     intolerances = 'dairy free, egg free, gluten free, grain free, seafood free'
    //     // intolerances = '';

    //     try {

    //         const opts = {
    //             limitLicense: true,
    //             tags: intolerances,
    //             number: number
    //         };

    //         console.log(opts)
    
    //         const data = await this.getRandomRecipes(opts);
    //         this.recipesCache = data;
    //         this.cacheTimestamp = Date.now();
    //         return data;

    //     } catch (e) {
    //         throw e;
    //     }

    // };

}

module.exports = SpoonApi


