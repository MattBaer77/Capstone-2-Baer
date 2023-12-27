"use strict";

require("dotenv").config();

const express = require("express");

const morgan = require("morgan")

const SpoonacularKey = process.env.spoonacularKey

const app = express();

app.use(express.json())
app.use(morgan("tiny"))

// SPOONACULAR TO TEST

var SpoonacularApi = require('../spoonacularSDK/dist/com.spoonacular.client/index.js');
var defaultClient = SpoonacularApi.ApiClient.instance;

// Configure API key authorization: apiKeyScheme
var apiKeyScheme = defaultClient.authentications['apiKeyScheme'];
apiKeyScheme.apiKey = SpoonacularKey
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//apiKeyScheme.apiKeyPrefix['x-api-key'] = "Token"

let apiInstance = new SpoonacularApi.MiscApi();

// SPOONACULAR TO TEST

app.get('/', (req, res) => {

    console.log("ROOT");
    // console.log(req);

    apiInstance.getARandomFoodJoke((error, data, response) => {
      if (error) {
        console.error(error);
      } else {
        console.log('API called successfully. Returned data: ' + data);
        console.log(response.body.text)
        return res.json(response.body)
      }
    });

});

module.exports = app;