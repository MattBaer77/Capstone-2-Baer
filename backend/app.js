"use strict";

const express = require("express");
const morgan = require("morgan")
const ExpressError = require("./expressError");

const app = express();
app.use(express.json())
app.use(morgan("tiny"))

const recipeRoutes = require("./routes/recipes");
const jokesRoutes = require("./routes/jokes");

app.use("/recipes", recipeRoutes)
app.use("/jokes", jokesRoutes)

// 404 Error Handling
app.use((req, res, next) => {

    const notFoundError = new ExpressError("Not Found!!!", 404)

    return next(notFoundError);

})

// Generic Error Handler
app.use((err, req, res, next) => {

    if(process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
        error: {message, status},
    });

})


module.exports = app;