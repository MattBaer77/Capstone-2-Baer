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
                            ingredient_id: 100,
                            minimum_amount: 1,
                            unit: "Some Unit"
                        },
                        {
                            amount: 2,
                            ingredient_id: 101,
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
                            ingredient_id: 100,
                            minimum_amount: 1,
                            unit: "Some Unit"
                        },
                        {
                            amount: 4,
                            ingredient_id: 101,
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
                        ingredient_id: 100,
                        minimum_amount: 1,
                        unit: "Some Unit"
                    },
                    {
                        amount: 2,
                        ingredient_id: 101,
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
            fail();
        } catch (err) {
            expect(err instanceof ExpressError).toBeTruthy();
        }

    });

});

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

    });

});

// delete

describe("remove", () => {

    test("works", async() => {

        const res = await GroceryList.remove(1)
        expect(res).toEqual(true)
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

    });

    test("not found if no such user", async function () {
        try {
          await GroceryList.remove(0);
          fail();
        } catch (err) {
          expect(err instanceof ExpressError).toBeTruthy();
        }
      });

});

// addIngredient

describe("add ingredient", () => {

    const fauxIngredient = {id: 1,
                            ingredientId: 102,
                            amount: 3,
                            unit: "Some Other Unit",
                            minimumAmount: 0
                        };

    const fauxIngredientNoMin = {id: 1,
                            ingredientId: 104,
                            amount: 3,
                            unit: "Some Other Unit"
                        };

    const fauxConflictingIngredient = {id: 1,
                                       ingredientId: 101,
                                       amount: 3,
                                       unit: "Some Other Unit",
                                       minimumAmount: 0
                                    };

    const fauxNoListIngredient = {id: 100,
                                  ingredientId: 101,
                                  amount: 3,
                                  unit: "Some Other Unit",
                                  minimumAmount: 0
                                };

    test("works", async () => {

        let res = await GroceryList.addIngredient(fauxIngredient.id, fauxIngredient.ingredientId, fauxIngredient.amount, fauxIngredient.unit, fauxIngredient.minimumAmount);
        expect(res).toEqual(true)

        const ingredientCheck = await db.query(

            `SELECT
            grocery_list_id AS "id",
            ingredient_id AS "ingredientId",
            amount,
            unit,
            minimum_amount AS "minimumAmount"
            FROM grocery_lists_ingredients
            WHERE grocery_list_id = 1 AND ingredient_id = 102`

        )

        expect(ingredientCheck.rows.length).toEqual(1)
        expect(ingredientCheck.rows[0].ingredientId).toEqual(102)
        expect(ingredientCheck.rows[0].amount).toEqual(3)
        expect(ingredientCheck.rows[0].minimumAmount).toEqual(0)

    });

    test("works - no minimum included", async () => {

        let res = await GroceryList.addIngredient(fauxIngredientNoMin.id, fauxIngredientNoMin.ingredientId, fauxIngredientNoMin.amount, fauxIngredientNoMin.unit);
        expect(res).toEqual(true)

        const ingredientCheck = await db.query(

            `SELECT
            grocery_list_id AS "id",
            ingredient_id AS "ingredientId",
            amount,
            unit,
            minimum_amount AS "minimumAmount"
            FROM grocery_lists_ingredients
            WHERE grocery_list_id = 1 AND ingredient_id = 104`

        )

        expect(ingredientCheck.rows.length).toEqual(1)
        expect(ingredientCheck.rows[0].ingredientId).toEqual(104)
        expect(ingredientCheck.rows[0].amount).toEqual(3)
        expect(ingredientCheck.rows[0].minimumAmount).toEqual(0)

    });

    test("throws error if no such grocery_list", async () => {

        try{
            await GroceryList.addIngredient(fauxNoListIngredient.id, fauxNoListIngredient.ingredientId, fauxNoListIngredient.amount, fauxNoListIngredient.unit, fauxNoListIngredient.minimumAmount);
            fail();
        } catch (err) {
            expect(err instanceof ExpressError).toBeTruthy();
        }

    });

    test("throws error if ingredient exists on grocery_list", async () => {

        try{
            await GroceryList.addIngredient(fauxConflictingIngredient.id, fauxConflictingIngredient.ingredientId, fauxConflictingIngredient.amount, fauxConflictingIngredient.unit, fauxConflictingIngredient.minimumAmount);
            fail();
        } catch (err) {
            expect(err instanceof ExpressError).toBeTruthy();
        }

    });

});

// setAmount

describe("set amount", () => {

    test("works", async() => {

        let res = await GroceryList.setAmount(1,100,3)
        expect(res).toEqual(true)

        const ingredientCheck = await db.query(

            `SELECT
            amount
            FROM grocery_lists_ingredients
            WHERE grocery_list_id = 1 AND ingredient_id = 100`

        )

        expect(ingredientCheck.rows[0].amount).toEqual(3)

    });

    test("throws error if no such grocery_list", async () => {

        try{
            await GroceryList.setAmount(100,100,3);
            fail();
        } catch(err) {
            expect(err instanceof ExpressError).toBeTruthy();
        }

    });

    test("throws error if no such ingredient_id on grocery_list", async () => {

        try{
            await GroceryList.setAmount(1,102,3);
            fail();
        } catch(err) {
            expect(err instanceof ExpressError).toBeTruthy();
        }

    });

});

// setMinimumAmount

describe("set minimum amount", () => {

    test("works", async() => {

        let res = await GroceryList.setMinimumAmount(1,100,3)
        expect(res).toEqual(true)

        const ingredientCheck = await db.query(

            `SELECT
            minimum_amount AS "minimumAmount"
            FROM grocery_lists_ingredients
            WHERE grocery_list_id = 1 AND ingredient_id = 100`

        )

        expect(ingredientCheck.rows[0].minimumAmount).toEqual(3)

    });

    test("throws error if no such grocery_list", async () => {

        try{
            await GroceryList.setMinimumAmount(100,100,3);
            fail();
        } catch(err) {
            expect(err instanceof ExpressError).toBeTruthy();
        }

    });

    test("throws error if no such ingredient_id on grocery_list", async () => {

        try{
            await GroceryList.setMinimumAmount(1,102,3);
            fail();
        } catch(err) {
            expect(err instanceof ExpressError).toBeTruthy();
        }

    });

});

// deleteIngredient

describe("delete ingredient from grocery list", () => {

    test("works", async() => {

        let res = await GroceryList.deleteIngredient(1,100);
        expect(res).toEqual(true)

        const ingredientCheck = await db.query(
            `SELECT
            grocery_list_id AS "id",
            ingredient_id AS "ingredientId"
            FROM grocery_lists_ingredients
            WHERE grocery_list_id = 1 AND ingredient_id = 100`
        )

        expect(ingredientCheck.rows.length).toEqual(0)

    });

    test("throws error if no such grocery list", async() => {

        try{
            await GroceryList.deleteIngredient(100,100);
            fail();
        } catch(err) {
            expect(err instanceof ExpressError).toBeTruthy();
        }

    });

    test("throws error if no such ingredient on grocery list", async() => {

        try{
            await GroceryList.deleteIngredient(1,102);
            fail();
        } catch(err) {
            expect(err instanceof ExpressError).toBeTruthy();
        }

    });

});

// addRecipe

describe("add recipe to grocery list", () => {

    const fauxRecipe = {
        id:1,
        recipeId:13
    };

    const fauxRecipeExisting = {
        id:1,
        recipeId:11
    };

    const fauxRecipeNoValidGroceryList = {
        id:100,
        recipeId:11
    };

    test("works", async() => {

        let res = await GroceryList.addRecipe(fauxRecipe.id, fauxRecipe.recipeId)
        expect(res).toEqual(true)

        const recipeCheck = await db.query(
            `SELECT
            id,
            grocery_list_id AS "groceryListId",
            recipe_id AS "recipeId"
            FROM grocery_lists_recipes
            WHERE grocery_list_id = 1 AND recipe_id = 13`
        )

        expect(recipeCheck.rows.length).toEqual(1)
        expect(recipeCheck.rows[0].id).toEqual(6)
        expect(recipeCheck.rows[0].groceryListId).toEqual(1)
        expect(recipeCheck.rows[0].recipeId).toEqual(13)

    });

    test("works if duplicate recipe exists", async() => {

        let res = await GroceryList.addRecipe(fauxRecipeExisting.id, fauxRecipeExisting.recipeId)
        expect(res).toEqual(true)

        const recipeCheck = await db.query(
            `SELECT
            id,
            grocery_list_id AS "groceryListId",
            recipe_id AS "recipeId"
            FROM grocery_lists_recipes
            WHERE grocery_list_id = 1 AND recipe_id = 11`
        )

        expect(recipeCheck.rows.length).toEqual(2)
        expect(recipeCheck.rows[0].id).toEqual(1)
        expect(recipeCheck.rows[0].groceryListId).toEqual(1)
        expect(recipeCheck.rows[0].recipeId).toEqual(11)
        expect(recipeCheck.rows[1].id).toEqual(7)
        expect(recipeCheck.rows[1].groceryListId).toEqual(1)
        expect(recipeCheck.rows[1].recipeId).toEqual(11)

    });

    test("throws error if grocery list id does not exist", async() => {

        try{
            await GroceryList.addRecipe(fauxRecipeNoValidGroceryList.id, fauxRecipeNoValidGroceryList.recipeId);
            fail();
        } catch (err) {
            expect(err instanceof ExpressError).toBeTruthy();
        }

    });

});

// deleteRecipe

describe("delete recipe from grocery list", () => {

    test("works", async() => {

        let res = await GroceryList.deleteRecipe(1)
        expect(res).toEqual(true)

    })

    test("throws error if no recipe on grocery list with specified id", async () => {

        try{
            await GroceryList.deleteRecipe(100);
            fail();
        } catch (err) {
            expect(err instanceof ExpressError).toBeTruthy();
        }

    });

})