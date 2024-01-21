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
            fail();
        } catch (err) {
            expect(err instanceof ExpressError).toBeTruthy();
        }

    });

});

// get

describe("get", () => {

    test("works", async() => {

        const groceryList = await GroceryList.get(1);

        expect(groceryList).toEqual(

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
            }

        )

    });

    test("not found if no such id", async function () {

        try {
            const res = await GroceryList.get(0);
            console.log(res)
            fail();
        } catch (err) {
            expect(err instanceof ExpressError).toBeTruthy();
        }

    });

})

// create

describe("create", () => {

    const newGroceryListName = "testlistU1-NEW"

    test("works", async() => {

        let list = await GroceryList.create(newGroceryListName, "u1")

        expect(list).toEqual(9)

        const found = await db.query("SELECT * FROM grocery_list WHERE list_name = 'testlistU1-NEW'")

        expect(found.rows.length).toEqual(1);
        expect(found.rows[0].id).toEqual(9)
        expect(found.rows[0].owner).toEqual("u1")

    })

})

// delete

describe("remove", () => {

    test("works", async() => {

        await GroceryList.remove(1)
        const groceryListCheck = await db.query(
            "SELECT * FROM grocery_list WHERE id = 1"
        );
        expect(groceryListCheck.rows.length).toEqual(0)

        const ingredientCheck = await db.query(
            "SELECT * FROM grocery_lists_ingredients WHERE grocery_list_id = 1"
        )
        expect(ingredientCheck.rows.length).toEqual(0)

        const recipeCheck = await db.query(
            "SELECT * FROM grocery_lists_recipes WHERE grocery_list_id = 1"
        )
        expect(recipeCheck.rows.length).toEqual(0)

    })

    test("not found if no such user", async function () {
        try {
          await GroceryList.remove(0);
          fail();
        } catch (err) {
          expect(err instanceof ExpressError).toBeTruthy();
        }
      });

})

// addIngredient

// deleteIngredient

// addRecipe

// deleteRecipe