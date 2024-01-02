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

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 13;

console.log("Config:".green)
console.log("SECRET_KEY".yellow, SECRET_KEY)
console.log("spoonacularKey:".yellow, spoonacularKey)
console.log("---");
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, getDatabaseUri());
console.log("---");


module.exports = {

    SECRET_KEY,
    spoonacularKey,
    PORT,
    BCRYPT_WORK_FACTOR,
    getDatabaseUri,
    
}