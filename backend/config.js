"use strict";

require("dotenv").config();
require("colors");

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";



// SPOONACULAR TO TEST - COPIED AND MODIFIED FROM spoonacularSDK/README
const spoonacularKey = process.env.spoonacularKey

// 

var spoonacularApi = require('../spoonacularSDK/dist/com.spoonacular.client/index.js');
var defaultClient = spoonacularApi.ApiClient.instance;

// Configure API key authorization: apiKeyScheme
var apiKeyScheme = defaultClient.authentications['apiKeyScheme'];
apiKeyScheme.apiKey = spoonacularKey

// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//apiKeyScheme.apiKeyPrefix['x-api-key'] = "Token"

// CREATE API 
let MiscApi = new spoonacularApi.MiscApi();

// SPOONACULAR TO TEST - COPIED AND MODIFIED FROM spoonacularSDK/README

console.log("Config:".green)
console.log("SECRET_KEY".yellow, SECRET_KEY)
console.log("spoonacularKey:".yellow, spoonacularKey)
console.log("---");


module.exports = {

    SECRET_KEY,
    MiscApi

}