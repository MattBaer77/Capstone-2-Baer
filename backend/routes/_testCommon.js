"use strict";

const db = require("../db.js");
const User = require("../models/user.js");
const Intolerance = require("../models/intolerance.js")
const GroceryList = require("../models/groceryList.js")
const createToken = require("../helpers/token.js");

async function commonBeforeAll() {

    // CLEAR OUT ALL TABLES BEFORE TESTS
    // SET SERIAL IDs TO 1 (WHERE APPLICABLE)

    await db.query("DELETE FROM grocery_lists_ingredients")
    // await db.query("SELECT setval('grocery_lists_ingredients_id_seq', 1, false)")

    await db.query("DELETE FROM grocery_lists_recipes")
    await db.query("SELECT setval('grocery_lists_recipes_id_seq', 1, false)")

    await db.query("DELETE FROM grocery_list")
    await db.query("SELECT setval('grocery_list_id_seq', 1, false)")

    await db.query("DELETE FROM users_intolerances")

    await db.query("DELETE FROM intolerances")
    await db.query("SELECT setval('intolerances_id_seq', 1, false)")

    await db.query("DELETE FROM users")

    //

    await User.register(
        {
            username: "u1",
            password: "password1",
            firstName: "U1F",
            lastName: "U1L",
            email: "u1@email.com",
            isAdmin: false,
        }
    );

    await User.register(
        {
            username: "u2",
            password: "password2",
            firstName: "U2F",
            lastName: "U2L",
            email: "u2@email.com",
            isAdmin: false,
        }
    );

    await User.register(
        {
            username: "u3",
            password: "password3",
            firstName: "U3F",
            lastName: "U3L",
            email: "u3@email.com",
            isAdmin: false,
        }
    );

    await User.register(
        {
            username: "uA",
            password: "passwordA",
            firstName: "UAF",
            lastName: "UAL",
            email: "uA@email.com",
            isAdmin: true,
        }
    );

    await User.register(
        {
            username: "uAB",
            password: "passwordAB",
            firstName: "UABF",
            lastName: "UABL",
            email: "uAB@email.com",
            isAdmin: true,
        }
    );

    await User.setCache("u1", {data:[{faux: "json", some: "more"}]});
    await User.setCache("u2", {data:[{faux:"json2", some:"more2"}, {another:"obj"}]});

    //

    // REPLACE IF REQUIRED -
    await db.query(`

    INSERT INTO intolerances (intolerance_name)
    VALUES ('dairy'),
            ('egg'),
            ('gluten'),
            ('grain'),
            ('peanut'),
            ('seafood'),
            ('sesame'),
            ('shellfish'),
            ('soy'),
            ('sulfite'),
            ('tree nut'),
            ('wheat');

    `);
    //

    // 

    await User.addUserIntolerance('u1', 2);
    await User.addUserIntolerance('u1', 3);
    await User.addUserIntolerance('u2', 1);
    await User.addUserIntolerance('uA', 6);

    //

    await GroceryList.create('testlistU1-1', 'u1');
    await GroceryList.create('testlistU1-2', 'u1');
    await GroceryList.create('testlistU1-3', 'u1');
    await GroceryList.create('testlistU2-1', 'u2');
    await GroceryList.create('testlistU2-2', 'u2');
    await GroceryList.create('testlistU2-3', 'u2');
    await GroceryList.create('testlistA-1', 'uA');
    await GroceryList.create('testlistA-2', 'uA');

    // 

    await GroceryList.addRecipe(1,11);
    await GroceryList.addRecipe(1,12);
    await GroceryList.addRecipe(1,32);
    await GroceryList.addRecipe(2,22);
    await GroceryList.addRecipe(3,33);

    //

    await GroceryList.addIngredient(1, 100, 2, 'Some Unit');
    await GroceryList.addIngredient(1, 101, 2, 'Some Unit');
    await GroceryList.addIngredient(2, 100, 4, 'Some Unit',1);
    await GroceryList.addIngredient(2, 101, 4, 'Some Unit',1);

    // 

}

async function commonBeforeEach() {
    await db.query("BEGIN");
}
  
async function commonAfterEach() {
await db.query("ROLLBACK");
}
  
async function commonAfterAll() {
await db.end();
}

// const u1Token = createToken({ username: "u1", isAdmin: false });
// const adminToken = createToken({ username: "uA", isAdmin: true });

module.exports = {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    // u1Token,
    // adminToken,
  };