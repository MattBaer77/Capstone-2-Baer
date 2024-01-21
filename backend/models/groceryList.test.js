"use strict";

const ExpressError = require("../expressError");

const db = require("../db");
const GroceryList = require("./groceryList");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// findAll

describe("findAll", () => {

    test("works", async() => {

        const groceryLists = await GroceryList.findAll('u1');

        console.log(groceryLists)

        expect(groceryLists).toEqual(
            [
                {
                    id: 1,
                    ingredients: [
                        {
                            amount: 2,
                            id: 1,
                            ingredient_id: 100,
                            minimum_amount: 1,
                            unit: "Some Unit"
                        },
                        {
                            amount: 2,
                            id: 2,
                            ingredient_id: 100,
                            minimum_amount: 1,
                            unit: "Some Unit"
                        }
                    ],
                list_name: "testlistU1-1",
                owner: "u1",
                recipes: [
                    {
                        id: 1,
                        recipe_id: 11
                    },
                    {
                        id: 2,
                        recipe_id: 12
                    },
                    {
                        id: 3,
                        recipe_id: 32
                    }
                ]
            }, {
                id: 2,
                ingredients: [
                    {
                        amount: 4,
                        id: 3,
                        ingredient_id: 100,
                        minimum_amount: 1,
                        unit: "Some Unit"
                    },
                    {
                        amount: 4,
                        id: 4,
                        ingredient_id: 100,
                        minimum_amount: 1,
                        unit: "Some Unit"
                    }
                ],
            list_name: "testlistU1-2",
            owner: "u1",
            recipes: [
                    {
                        id: 4,
                        recipe_id: 22
                    }
                ]
            }, {
                id: 3,
                ingredients: [],
                list_name: "testlistU1-3",
                owner: "u1",
                recipes: [
                    {
                        id: 5,
                        recipe_id: 33
                    }
                ]
            }
        ])
    });

    test("not found if no such user", async function () {

        try {
            const res = await GroceryList.findAll("nope");
            console.log(res)
            fail();
        } catch (err) {
            expect(err instanceof ExpressError).toBeTruthy();
        }

    });

});

// get

// create

// delete

// addIngredient

// deleteIngredient

// addRecipe

// deleteRecipe