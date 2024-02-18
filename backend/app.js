"use strict";

const express = require("express");

const cors = require("cors");

const morgan = require("morgan");
const ExpressError = require("./expressError");
const { authenticateJWT } = require("./middleware/auth");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT)

const authRoutes = require("./routes/auth");
const intolerancesRoutes = require("./routes/intolerances")
const recipesRoutes = require("./routes/recipes");
const ingredientsRoutes = require("./routes/ingredients")
const jokesRoutes = require("./routes/jokes");
const usersRoutes = require("./routes/users");
const groceryListsRoutes = require("./routes/groceryLists")

app.use("/auth", authRoutes);
app.use("/intolerances", intolerancesRoutes);
app.use("/recipes", recipesRoutes);
app.use("/ingredients", ingredientsRoutes);
app.use("/jokes", jokesRoutes);
app.use("/users", usersRoutes);
app.use("/grocery-lists", groceryListsRoutes);

// 404 Error Handling
app.use((req, res, next) => {

    const notFoundError = new ExpressError("Not Found!!!", 404);

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