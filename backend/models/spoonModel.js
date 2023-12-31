"use strict"

const { promisify } = require('util')

// 
// SPOONACULAR TO TEST - COPIED AND MODIFIED FROM spoonacularSDK/README

const spoonacularKey = process.env.spoonacularKey

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

}

module.exports = {

    SpoonApi

}
