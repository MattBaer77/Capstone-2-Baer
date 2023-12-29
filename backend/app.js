"use strict";

const express = require("express");

const morgan = require("morgan")

const app = express();
app.use(express.json())
app.use(morgan("tiny"))

const jokesRoutes = require("./routes/jokes")

app.use("/jokes", jokesRoutes)

module.exports = app;