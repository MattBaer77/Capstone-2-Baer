"use strict";

const express = require("express");

const morgan = require("morgan")

const app = express();
app.use(express.json())
app.use(morgan("tiny"))

const { MiscApi } = require("./config")

app.get('/joke', (req, res) => {

    console.log("Joke Test Route");

    MiscApi.getARandomFoodJoke((error, data, response) => {
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