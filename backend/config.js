"use strict";

require("dotenv").config();
require("colors");

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";
const PORT = +process.env.PORT || 3001;

const spoonacularKey = process.env.spoonacularKey

console.log("Config:".green)
console.log("SECRET_KEY".yellow, SECRET_KEY)
console.log("spoonacularKey:".yellow, spoonacularKey)
console.log("PORT:".yellow, PORT.toString());
console.log("---");


module.exports = {

    SECRET_KEY,
    PORT,
    
}