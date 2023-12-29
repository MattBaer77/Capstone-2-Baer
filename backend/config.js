"use strict";

require("dotenv").config();
const SpoonacularKey = process.env.spoonacularKey



// SPOONACULAR TO TEST - COPIED AND MODIFIED FROM spoonacularSDK/README

var SpoonacularApi = require('../spoonacularSDK/dist/com.spoonacular.client/index.js');
var defaultClient = SpoonacularApi.ApiClient.instance;

// Configure API key authorization: apiKeyScheme
var apiKeyScheme = defaultClient.authentications['apiKeyScheme'];
apiKeyScheme.apiKey = SpoonacularKey

// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//apiKeyScheme.apiKeyPrefix['x-api-key'] = "Token"

// CREATE API 
let MiscApi = new SpoonacularApi.MiscApi();

// SPOONACULAR TO TEST - COPIED AND MODIFIED FROM spoonacularSDK/README




module.exports = {

    MiscApi

}