"use strict";

const express = require("express");

const morgan = require("morgan")

const app = express();

app.use(express.json())
app.use(morgan("tiny"))

app.get('/', (req, res) => {

    console.log("ROOT");
    // console.log(req);

    return res.json({message:"Root"})


});

module.exports = app;