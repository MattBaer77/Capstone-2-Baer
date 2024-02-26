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

// const maxRecipes = 10
// const maxIngredients = 10
// consolidate to above variables or export from config
const cacheExpiration = 59 * 60 * 1000

class SpoonApi {

    // PUBLIC CACHE MANAGEMENT
    static randomCache = null;
    static recipesCache = null;
    static ingredientsCache = null;
    static cacheTimestamp = null;
    static CACHE_EXPIRATION_THRESHOLD = cacheExpiration;

    // API
    static recipesApi = new spoonacularApi.RecipesApi();
    static ingredientsApi = new spoonacularApi.IngredientsApi();
    static miscApi = new spoonacularApi.MiscApi();

    // RECIPE(S) DIRECT ENDPOINTS METHODS - RANDOM
    static getARandomFoodJoke = promisify(SpoonApi.miscApi.getARandomFoodJoke.bind(this.miscApi));
    static getRandomRecipes = promisify(SpoonApi.recipesApi.getRandomRecipes.bind(this.recipesApi));

    // RECIPE(S) DIRECT ENDPOINTS METHODS - SEARCH & DETAIL
    static getSearchRecipes = promisify(SpoonApi.recipesApi.searchRecipes.bind(this.recipesApi));
    static getRecipeInformation = promisify(SpoonApi.recipesApi.getRecipeInformation.bind(this.recipesApi));

    // INGREDIENT(S) DIRECT ENDPOINTS METHODS - SEARCH & DETAIL
    static getSearchIngredients = promisify(SpoonApi.ingredientsApi.ingredientSearch.bind(this.ingredientsApi));
    static getIngredientInformation = promisify(SpoonApi.ingredientsApi.getIngredientInformation.bind(this.ingredientsApi));

    // METHODS FOR USE IN ROUTES -

    // CACHE -
    static isCacheValid = () => {
        return this.randomCache && this.cacheTimestamp && Date.now() - this.cacheTimestamp < this.CACHE_EXPIRATION_THRESHOLD;
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
            this.randomCache = data;
            this.cacheTimestamp = Date.now();
            return data;

        } catch (e) {
            throw e;
        }

    };
    
    static clearCacheIfExpired = () => {
        if (this.cacheTimestamp && Date.now() - this.cacheTimestamp > this.CACHE_EXPIRATION_THRESHOLD) {
            console.log("Clearing PUBLIC cache due to expiration");
            this.randomCache = null;
            this.cacheTimestamp = null;
        }
    };

    static startCacheTimer = () => {
        setInterval(this.clearCacheIfExpired, this.CACHE_EXPIRATION_THRESHOLD);
    }
    
    static serveRandomCache = async () => {
        try {
            if (this.isCacheValid()) {

                console.log(`Serving randomCache - Cached at ${this.cacheTimestamp} still valid as of ${Date.now()}`);
                return this.randomCache

            } else {

                console.log(`Filling randomCache`)
                const data = await this.fetchFreshRandomData();
                this.startCacheTimer();
                this.randomCache = data;

            }
    
            this.clearCacheIfExpired();
            return this.randomCache;
        } catch (e) {
            throw e;
        }
    };

    // MAIN -

    static searchRecipes = async (query=null, intolerances=null, diet=null, number=10) => {

        // DO NOT ALLOW "" TO BE PASSED AS opts.intolerances
        if (intolerances === "") intolerances = null

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

    static searchIngredients = async (query=null, intolerances=null, number=10) => {

        // DO NOT ALLOW "" TO BE PASSED AS opts.intolerances
        if (intolerances === "") intolerances = null

        // LIMIT API USE
        if (number === null || number <=0 || number > 10 || typeof number !== "number") number = 10;

        const opts = {

            query: query,
            intolerances: intolerances,
            number: number,
    
        };

        try {

            const results = await SpoonApi.getSearchIngredients(opts);
            return results;

        } catch (e) {
            throw (e)
        };

    }

    static recipeInformation = async (id, includeNutrition=false) => {

        if(typeof id !== "number" || isNaN(id)) throw new ExpressError(`Bad Request - id must be a number`, 400)

        const opts = {includeNutrition: includeNutrition};

        try {

            const results = await SpoonApi.getRecipeInformation(id, opts);
            return results;

        } catch (e) {
            throw (e)
        };

    };

    static ingredientInformation = async (id, amount=null, unit=null) => {

        if(typeof id !== "number" || isNaN(id)) throw new ExpressError(`Bad Request - id must be a number`, 400)

        const opts = {
            amount: amount,
            unit: unit
        };

        try {

            const results = await SpoonApi.getIngredientInformation(id, opts);
            return results;

        } catch (e) {
            throw (e)
        };

    };

    // SDK NOT USED DUE TO LIMITATIONS - NO "exclude-tags" FUNCTIONALITY AT SDK getRandomRecipes
    static randomRecipesExcludeIntolerances = async (intolerances=[], number=10) => {

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


