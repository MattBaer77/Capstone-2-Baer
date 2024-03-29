"use strict";

const ExpressError = require("../expressError");

const {
    mockResponseGetRandomRecipes,
    mockResponseGetSearchRecipesOptsNullNum10,
    mockResponseGetSearchIngredientsOptsNullNum10,
    mockResponseGetRecipeInformation,
    mockResponseGetIngredientInformation
} = require("./spoonModelTestSetup")

const SpoonApi = require('./spoonModel');

// beforeAll(() => SpoonApi.randomCache = null)
// beforeAll(() => SpoonApi.recipesCache = new Map)
// beforeAll(() => SpoonApi.ingredientsCache = new Map)
// beforeAll(() => SpoonApi.ingredientsPossibleUnitsCache = new Map)

// CHECKING THAT MOCKS HAVE REPLACED API CALLS
describe("confirms mock replace API calls", () => {

    describe("getRandomRecipes Mock Test", () => {

        test("mock test works", async () => {
    
            const opts = {
                limitLicense: true,
                number: 3
            };
    
            const fauxResponse = await SpoonApi.getRandomRecipes(opts)
            expect(fauxResponse).toEqual(mockResponseGetRandomRecipes)
    
        });
    
    });
    
    describe("getSearchRecipes Mock Test", () => {
    
        test("mock test works", async () => {
    
            const opts = {
    
                query:null,
                intolerances:null,
                diet:null,
                number: 10
    
            };
    
            const fauxResponse = await SpoonApi.getSearchRecipes(opts)
            expect(fauxResponse).toEqual(mockResponseGetSearchRecipesOptsNullNum10)
    
        });
    
    });
    
    describe("getRecipeInformation Mock Test", () => {
    
        test("mock test works", async () => {
    
            const id = 3
    
            const opts = {
    
                includeNutrition:false,
    
            };
    
            const fauxResponse = await SpoonApi.getRecipeInformation(id, opts)
            expect(fauxResponse).toEqual(mockResponseGetRecipeInformation)
    
        });
    
    });

});

describe("test cache management", () => {

    describe("test fetchFreshRandomData", () => {

        test("fetchFreshData - success - no number", async () => {
    
            const fauxResponse = await SpoonApi.fetchFreshRandomData();
            expect(fauxResponse).toEqual(mockResponseGetRandomRecipes)
            expect(SpoonApi.getRandomRecipes).toHaveBeenCalledWith({limitLicense: true, number: 10})
    
        })

        test("fetchFreshData - success - 10", async () => {
    
            const fauxResponse = await SpoonApi.fetchFreshRandomData(10);
            expect(fauxResponse).toEqual(mockResponseGetRandomRecipes)
            expect(SpoonApi.getRandomRecipes).toHaveBeenCalledWith({limitLicense: true, number: 10})

        })

        test("fetchFreshData - success - > 10", async () => {
    
            const fauxResponse = await SpoonApi.fetchFreshRandomData(50);
            expect(fauxResponse).toEqual(mockResponseGetRandomRecipes)
            expect(SpoonApi.getRandomRecipes).not.toHaveBeenCalledWith({limitLicense: true, number: 50})

        })

        test("fetchFreshData - success - 0", async () => {
    
            const fauxResponse = await SpoonApi.fetchFreshRandomData(0);
            expect(fauxResponse).toEqual(mockResponseGetRandomRecipes)
            expect(SpoonApi.getRandomRecipes).not.toHaveBeenCalledWith({limitLicense: true, number: 0})

        })

        test("fetchFreshData - success - -5", async () => {
    
            const fauxResponse = await SpoonApi.fetchFreshRandomData(-5);
            expect(fauxResponse).toEqual(mockResponseGetRandomRecipes)
            expect(SpoonApi.getRandomRecipes).not.toHaveBeenCalledWith({limitLicense: true, number: -5})

        })

        test("fetchFreshData - success - 5", async () => {
    
            const fauxResponse = await SpoonApi.fetchFreshRandomData(5);
            expect(fauxResponse).toEqual(mockResponseGetRandomRecipes)
            expect(SpoonApi.getRandomRecipes).toHaveBeenCalledWith({limitLicense: true, number: 5})

        })

        test("fetchFreshData - success - invalid number", async () => {
    
            const fauxResponse = await SpoonApi.fetchFreshRandomData("not a number");
            expect(fauxResponse).toEqual(mockResponseGetRandomRecipes)
            expect(SpoonApi.getRandomRecipes).not.toHaveBeenCalledWith({limitLicense: true, number: "not a number"})

        })
    
    })
    
    describe("test serveRandomCache", () => {

        test("serveRandomCache - No Cache Currently Saved", async () => {

            SpoonApi.randomCache = null
            expect(SpoonApi.getRandomRecipes).toHaveBeenCalledTimes(8);
            const fauxResponse = await SpoonApi.serveRandomCache()    
            expect(fauxResponse).toEqual(mockResponseGetRandomRecipes)
            expect(SpoonApi.getRandomRecipes).toHaveBeenCalledTimes(9);
    
        })
    
        test("serveRandomCache - Cache Currently Saved", async () => {

            expect(SpoonApi.getRandomRecipes).toHaveBeenCalledTimes(9);
            const fauxResponse = await SpoonApi.serveRandomCache()    
            expect(fauxResponse).toEqual(mockResponseGetRandomRecipes)
            expect(SpoonApi.getRandomRecipes).toHaveBeenCalledTimes(9);

        })
    
    });

});

describe("test main methods", () => {

    describe("test searchRecipes", () => {

        test("works - opts: null", async () => {

            const results = await SpoonApi.searchRecipes(null, null, null, null);
            expect(results).toEqual(mockResponseGetSearchRecipesOptsNullNum10);
            expect(SpoonApi.getSearchRecipes).not.toHaveBeenCalledWith({
                query:null,
                intolerances:null,
                diet:null,
                number:null,
            })

        });

        test("works - opts: null, limit: 10", async () => {

            const results = await SpoonApi.searchRecipes(null, null, null, 10);
            expect(results).toEqual(mockResponseGetSearchRecipesOptsNullNum10);
            expect(SpoonApi.getSearchRecipes).toHaveBeenCalledWith({
                query:null,
                intolerances:null,
                diet:null,
                number:10
            })

        });

        test("works - opts: null, limited to 10", async () => {

            const results = await SpoonApi.searchRecipes(null, null, null, 50);
            expect(results).toEqual(mockResponseGetSearchRecipesOptsNullNum10);
            expect(SpoonApi.getSearchRecipes).not.toHaveBeenCalledWith({
                query:null,
                intolerances:null,
                diet:null,
                number:50,
            })

        });

        test("works - opts: null, limited to > 0", async () => {

            const results = await SpoonApi.searchRecipes(null, null, null, 0);
            expect(results).toEqual(mockResponseGetSearchRecipesOptsNullNum10);
            expect(SpoonApi.getSearchRecipes).not.toHaveBeenCalledWith({
                query:null,
                intolerances:null,
                diet:null,
                number: 0,
            })

        });

        test("works - opts: null, limited to > 0", async () => {

            const results = await SpoonApi.searchRecipes(null, null, null, -50);
            expect(results).toEqual(mockResponseGetSearchRecipesOptsNullNum10);
            expect(SpoonApi.getSearchRecipes).not.toHaveBeenCalledWith({
                query:null,
                intolerances:null,
                diet:null,
                number: -50,
            })

        });

        test("works - all opts, limited to 10", async () => {

            const results = await SpoonApi.searchRecipes("Asparagus", "gluten", "vegetarian", 5);
            expect(results).toEqual(mockResponseGetSearchRecipesOptsNullNum10);
            expect(SpoonApi.getSearchRecipes).toHaveBeenCalledWith({
                query:"Asparagus",
                intolerances:"gluten",
                diet:"vegetarian",
                number:5,
            })

        });

        test("works - bad data entered into 'number'", async () => {

            const results = await SpoonApi.searchRecipes("Asparagus", "gluten", "vegetarian", 'not a number');
            expect(results).toEqual(mockResponseGetSearchRecipesOptsNullNum10);
            expect(SpoonApi.getSearchRecipes).not.toHaveBeenCalledWith({
                query:"Asparagus",
                intolerances:"gluten",
                diet:"vegetarian",
                number:'not a number',
            })

        });

    });

    describe("test recipeInformation", () => {

        test("works - id: valid, includeNutrition: null", async () => {

            const results = await SpoonApi.recipeInformation(3)
            expect(results).toEqual(mockResponseGetRecipeInformation);
            expect(SpoonApi.getRecipeInformation).toHaveBeenCalledWith(3, {includeNutrition: false})


        })

        test("works - id: valid, includeNutrition: false", async () => {

            const results = await SpoonApi.recipeInformation(3, false)
            expect(results).toEqual(mockResponseGetRecipeInformation);
            expect(SpoonApi.getRecipeInformation).toHaveBeenCalledWith(3, {includeNutrition: false})


        })

        // PRE CACHE IMPLEMENTATION - AMOUNT / UNIT NOT FUNCTIONAL FOR API CALL (NEVER USED BY FRONTEND)

        // test("works - id: valid, includeNutrition: true", async () => {

        //     const results = await SpoonApi.recipeInformation(3, true)
        //     expect(results).toEqual(mockResponseGetRecipeInformation);
        //     expect(SpoonApi.getRecipeInformation).toHaveBeenCalledWith(3, {includeNutrition: true})


        // })

        // PRE CACHE IMPLEMENTATION - AMOUNT / UNIT NOT FUNCTIONAL FOR API CALL (NEVER USED BY FRONTEND)

        // POST CACHE IMPLEMENTATION - includeNutrition DEFAULTS TO FALSE (NEVER USED BY FRONTEND)

        test("works - id: valid, includeNutrition: true", async () => {

            const results = await SpoonApi.recipeInformation(3, true)
            expect(results).toEqual(mockResponseGetRecipeInformation);
            expect(SpoonApi.getRecipeInformation).toHaveBeenCalledWith(3, {includeNutrition: false})


        })

        // POST CACHE IMPLEMENTATION - includeNutrition DEFAULTS TO FALSE (NEVER USED BY FRONTEND)

        test("error - id: invalid, includeNutrition null", async () => {

            try {
                await SpoonApi.recipeInformation("not a number")
                fail();
            } catch (e) {
                expect (e instanceof ExpressError).toBeTruthy();
            }
            expect(SpoonApi.getRecipeInformation).not.toHaveBeenCalledWith("not a number", {includeNutrition: false})

        })

        test("error - id: invalid, includeNutrition true", async () => {

            try {
                await SpoonApi.recipeInformation("not a number", true)
                fail();
            } catch (e) {
                expect (e instanceof ExpressError).toBeTruthy();
            }
            expect(SpoonApi.getRecipeInformation).not.toHaveBeenCalledWith("not a number", {includeNutrition: true})

        })

    })

    describe("test searchIngredients", () => {

        test("works - opts: null", async () => {

            const results = await SpoonApi.searchIngredients(null, null, null);
            expect(results).toEqual(mockResponseGetSearchIngredientsOptsNullNum10);
            expect(SpoonApi.getSearchIngredients).not.toHaveBeenCalledWith({
                query:null,
                intolerances:null,
                number:null,
            })

        });

        test("works - opts: null, limit: 10", async () => {

            const results = await SpoonApi.searchIngredients(null, null, 10);
            expect(results).toEqual(mockResponseGetSearchIngredientsOptsNullNum10);
            expect(SpoonApi.getSearchIngredients).toHaveBeenCalledWith({
                query:null,
                intolerances:null,
                number:10
            })

        });

        test("works - opts: null, limited to 10", async () => {

            const results = await SpoonApi.searchIngredients(null, null, null, 50);
            expect(results).toEqual(mockResponseGetSearchIngredientsOptsNullNum10);
            expect(SpoonApi.getSearchIngredients).not.toHaveBeenCalledWith({
                query:null,
                intolerances:null,
                number:50,
            })

        });

        test("works - opts: null, limited to > 0", async () => {

            const results = await SpoonApi.searchIngredients(null, null, null, 0);
            expect(results).toEqual(mockResponseGetSearchIngredientsOptsNullNum10);
            expect(SpoonApi.getSearchIngredients).not.toHaveBeenCalledWith({
                query:null,
                intolerances:null,
                number: 0,
            })

        });

        test("works - opts: null, limited to > 0", async () => {

            const results = await SpoonApi.searchIngredients(null, null, null, -50);
            expect(results).toEqual(mockResponseGetSearchIngredientsOptsNullNum10);
            expect(SpoonApi.getSearchIngredients).not.toHaveBeenCalledWith({
                query:null,
                intolerances:null,
                number: -50,
            })

        });

        test("works - all opts, limited to 10", async () => {

            const results = await SpoonApi.searchIngredients("Asparagus", "gluten", 5);
            expect(results).toEqual(mockResponseGetSearchIngredientsOptsNullNum10);
            expect(SpoonApi.getSearchIngredients).toHaveBeenCalledWith({
                query:"Asparagus",
                intolerances:"gluten",
                number:5,
            })

        });

        test("works - bad data entered into 'number'", async () => {

            const results = await SpoonApi.searchIngredients("Asparagus", "gluten", "vegetarian", 'not a number');
            expect(results).toEqual(mockResponseGetSearchIngredientsOptsNullNum10);
            expect(SpoonApi.getSearchIngredients).not.toHaveBeenCalledWith({
                query:"Asparagus",
                intolerances:"gluten",
                number:'not a number',
            })

        });

    });

    describe("test ingredientInformation", () => {

        const mockNormalizedIngredientInformation = {

            id: 100,
            // original: 'guacamole',
            // originalName: 'guacamole',
            name: 'guacamole',
            // nameClean: undefined,
            // amount: undefined,
            // unit: undefined,
            // unitShort: undefined,
            // unitLong: undefined,
            // possibleUnits: [ 'cup', 'tablespoon' ],
            // estimatedCost: undefined,
            // consistency: 'solid',
            // shoppingListUnits: undefined,
            aisle: 'Refrigerated',
            image: 'guac.jpg',
            // meta: [],
            // nutrition: undefined,
            // categoryPath: [ 'dip' ]
        
        };

        test("works - id: valid, amount: null, unit: null", async () => {

            const results = await SpoonApi.ingredientInformation(3)
            expect(results).toEqual(mockNormalizedIngredientInformation);
            expect(SpoonApi.getIngredientInformation).toHaveBeenCalledWith(3, {amount: null, unit: null})

        })

        // PRE CACHE IMPLEMENTATION - AMOUNT / UNIT NOT FUNCTIONAL FOR API CALL (NEVER USED BY FRONTEND)

        // test("works - id: valid, amount: 1, unit: null", async () => {

        //     const results = await SpoonApi.ingredientInformation(3, 1)
        //     expect(results).toEqual(mockResponseGetIngredientInformation);
        //     expect(SpoonApi.getIngredientInformation).toHaveBeenCalledWith(3, {amount: 1, unit: null})


        // })

        // test("works - id: valid, amount: 1, unit: cup", async () => {

        //     const results = await SpoonApi.ingredientInformation(3, 1, 'cup')
        //     expect(results).toEqual(mockResponseGetIngredientInformation);
        //     expect(SpoonApi.getIngredientInformation).toHaveBeenCalledWith(3, {amount: 1, unit: 'cup'})


        // })

        // test("works - id: valid, amount: null, unit: cup", async () => {

        //     const results = await SpoonApi.ingredientInformation(3, null, 'cup')
        //     expect(results).toEqual(mockResponseGetIngredientInformation);
        //     expect(SpoonApi.getIngredientInformation).toHaveBeenCalledWith(3, {amount: null, unit: 'cup'})


        // })

        // PRE CACHE IMPLEMENTATION - AMOUNT / UNIT NOT FUNCTIONAL FOR API CALL (NEVER USED BY FRONTEND)

        // POST CACHE IMPLEMENTATION - AMOUNT / UNIT - DEFAULTS TO NULL

        test("works - id: valid, amount: 1, unit: null", async () => {

            const results = await SpoonApi.ingredientInformation(3, 1)
            expect(results).toEqual(mockNormalizedIngredientInformation);
            expect(SpoonApi.getIngredientInformation).toHaveBeenCalledWith(3, {amount: null, unit: null})


        })

        test("works - id: valid, amount: 1, unit: cup", async () => {

            const results = await SpoonApi.ingredientInformation(3, 1, 'cup')
            expect(results).toEqual(mockNormalizedIngredientInformation);
            expect(SpoonApi.getIngredientInformation).toHaveBeenCalledWith(3, {amount: null, unit: null})


        })

        test("works - id: valid, amount: null, unit: cup", async () => {

            const results = await SpoonApi.ingredientInformation(3, null, 'cup')
            expect(results).toEqual(mockNormalizedIngredientInformation);
            expect(SpoonApi.getIngredientInformation).toHaveBeenCalledWith(3, {amount: null, unit: null})


        })

        // POST CACHE IMPLEMENTATION - AMOUNT / UNIT - DEFAULTS TO NULL

        test("error - id: invalid, amount: null, unit: null", async () => {

            try {
                await SpoonApi.ingredientInformation("not a number")
                fail();
            } catch (e) {
                expect (e instanceof ExpressError).toBeTruthy();
            }
            expect(SpoonApi.getIngredientInformation).not.toHaveBeenCalledWith("not a number", {amount: null, unit: null})

        })

        test("error - id: invalid, amount: 1", async () => {

            try {
                await SpoonApi.ingredientInformation("not a number", 1)
                fail();
            } catch (e) {
                expect (e instanceof ExpressError).toBeTruthy();
            }
            expect(SpoonApi.getIngredientInformation).not.toHaveBeenCalledWith("not a number", {amount: 1, unit: null})

        })

        test("error - id: invalid, amount: 1, unit: cup", async () => {

            try {
                await SpoonApi.ingredientInformation("not a number", 1, 'cup')
                fail();
            } catch (e) {
                expect (e instanceof ExpressError).toBeTruthy();
            }
            expect(SpoonApi.getIngredientInformation).not.toHaveBeenCalledWith("not a number", {amount: 1, unit: "cup"})

        })

        test("error - id: invalid, amount: null, unit: cup", async () => {

            try {
                await SpoonApi.ingredientInformation("not a number", null, 'cup')
                fail();
            } catch (e) {
                expect (e instanceof ExpressError).toBeTruthy();
            }
            expect(SpoonApi.getIngredientInformation).not.toHaveBeenCalledWith("not a number", {amount: null, unit: "cup"})

        })

    })

    describe("test ingredientInformation", () => {

        const mockOnlyPossibleUnits = [ 'cup', 'tablespoon' ]

        test("works - id: valid, amount: null, unit: null", async () => {

            const results = await SpoonApi.ingredientInformationPossibleUnits(3)
            expect(results).toEqual(mockOnlyPossibleUnits);
            expect(SpoonApi.getIngredientInformation).toHaveBeenCalledWith(3, {amount: null, unit: null})

        })

        test("works - id: valid, amount: 1, unit: null", async () => {

            const results = await SpoonApi.ingredientInformationPossibleUnits(3, 1)
            expect(results).toEqual(mockOnlyPossibleUnits);
            expect(SpoonApi.getIngredientInformation).toHaveBeenCalledWith(3, {amount: null, unit: null})


        })

        test("works - id: valid, amount: 1, unit: cup", async () => {

            const results = await SpoonApi.ingredientInformationPossibleUnits(3, 1, 'cup')
            expect(results).toEqual(mockOnlyPossibleUnits);
            expect(SpoonApi.getIngredientInformation).toHaveBeenCalledWith(3, {amount: null, unit: null})


        })

        test("works - id: valid, amount: null, unit: cup", async () => {

            const results = await SpoonApi.ingredientInformationPossibleUnits(3, null, 'cup')
            expect(results).toEqual(mockOnlyPossibleUnits);
            expect(SpoonApi.getIngredientInformation).toHaveBeenCalledWith(3, {amount: null, unit: null})


        })

        // POST CACHE IMPLEMENTATION - AMOUNT / UNIT - DEFAULTS TO NULL

        test("error - id: invalid, amount: null, unit: null", async () => {

            try {
                await SpoonApi.ingredientInformationPossibleUnits("not a number")
                fail();
            } catch (e) {
                expect (e instanceof ExpressError).toBeTruthy();
            }
            expect(SpoonApi.getIngredientInformation).not.toHaveBeenCalledWith("not a number", {amount: null, unit: null})

        })

        test("error - id: invalid, amount: 1", async () => {

            try {
                await SpoonApi.ingredientInformationPossibleUnits("not a number", 1)
                fail();
            } catch (e) {
                expect (e instanceof ExpressError).toBeTruthy();
            }
            expect(SpoonApi.getIngredientInformation).not.toHaveBeenCalledWith("not a number", {amount: 1, unit: null})

        })

        test("error - id: invalid, amount: 1, unit: cup", async () => {

            try {
                await SpoonApi.ingredientInformationPossibleUnits("not a number", 1, 'cup')
                fail();
            } catch (e) {
                expect (e instanceof ExpressError).toBeTruthy();
            }
            expect(SpoonApi.getIngredientInformation).not.toHaveBeenCalledWith("not a number", {amount: 1, unit: "cup"})

        })

        test("error - id: invalid, amount: null, unit: cup", async () => {

            try {
                await SpoonApi.ingredientInformationPossibleUnits("not a number", null, 'cup')
                fail();
            } catch (e) {
                expect (e instanceof ExpressError).toBeTruthy();
            }
            expect(SpoonApi.getIngredientInformation).not.toHaveBeenCalledWith("not a number", {amount: null, unit: "cup"})

        })

    })

    

});