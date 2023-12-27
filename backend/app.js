"use strict";

require("dotenv").config();

const express = require("express");

const morgan = require("morgan")

const SpoonacularKey = ""

const app = express();

app.use(express.json())
app.use(morgan("tiny"))

// SPOONACULAR TO TEST

var SpoonacularApi = require('../spoonacularSDK/dist/com.spoonacular.client/index.js');

var defaultClient = SpoonacularApi.ApiClient.instance;
// Configure API key authorization: apiKeyScheme
var apiKeyScheme = defaultClient.authentications['apiKeyScheme'];
apiKeyScheme.apiKey = "YOUR API KEY"
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//apiKeyScheme.apiKeyPrefix['x-api-key'] = "Token"

var api = new SpoonacularApi.DefaultApi()
var analyzeRecipeRequest = new SpoonacularApi.AnalyzeRecipeRequest(); // {AnalyzeRecipeRequest} Example request body.
var opts = {
  'language': 'en', // {String} The input language, either \"en\" or \"de\".
  'includeNutrition': false, // {Boolean} Whether nutrition data should be added to correctly parsed ingredients.
  'includeTaste': false // {Boolean} Whether taste data should be added to correctly parsed ingredients.
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};

// api.analyzeRecipe(analyzeRecipeRequest, opts, callback);

// SPOONACULAR TO TEST

app.get('/', (req, res) => {

    console.log("ROOT");
    // console.log(req);

    return res.json({message:"Root"})


});

module.exports = app;