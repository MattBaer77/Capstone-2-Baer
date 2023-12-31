"use strict";

require("dotenv").config();
require("colors");

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";
const PORT = +process.env.PORT || 3001;

// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
    return (process.env.NODE_ENV === "test")
        ? "easyspoon_test"
        : process.env.DATABASE_URL || "easyspoon";
}

const spoonacularKey = process.env.spoonacularKey

console.log("Config:".green)
console.log("SECRET_KEY".yellow, SECRET_KEY)
console.log("spoonacularKey:".yellow, spoonacularKey)
console.log("PORT:".yellow, PORT.toString());
console.log("---");


module.exports = {

    SECRET_KEY,
    PORT,
    getDatabaseUri,
    spoonacularKey
    
}