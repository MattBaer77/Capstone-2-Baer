"use strict";

const ExpressError = require("../expressError");

// MOCK RESPONSES -
const mockResponseGetRandomRecipes = {
            
    recipes: [
    
        {
            id : 1,
            title: "Faux RANDOM Recipe 1"
        },
        
        {
            id : 2,
            title: "Faux RANDOM Recipe 2"
        },

        {
            id : 3,
            title: "Faux RANDOM Recipe 3"
        }

    ]
};

const mockResponseGetSearchRecipesOptsNullNum10 = {

    results: [
    
        {
            id : 1,
            title: "Faux Recipe 1"
        },
        
        {
            id : 2,
            title: "Faux Recipe 2"
        },

        {
            id : 3,
            title: "Faux Recipe 3"
        },

        {
            id : 4,
            title: "Faux Recipe 3"
        },

        {
            id : 5,
            title: "Faux Recipe 3"
        },

        {
            id : 6,
            title: "Faux Recipe 3"
        },

        {
            id : 7,
            title: "Faux Recipe 3"
        },

        {
            id : 8,
            title: "Faux Recipe 3"
        },

        {
            id : 9,
            title: "Faux Recipe 3"
        },

        {
            id : 10,
            title: "Faux Recipe 3"
        },

    ]

};

const mockResponseGetRecipeInformation = {

    id:3,
    title: "Faux Recipe 3",
    details: "Additional Details"

};

jest.mock('./spoonModel', () => {

    const originalSpoonModel = jest.requireActual('./spoonModel');

    originalSpoonModel.getRandomRecipes = jest.fn().mockResolvedValue(mockResponseGetRandomRecipes);
    originalSpoonModel.getSearchRecipes = jest.fn().mockResolvedValue(mockResponseGetSearchRecipesOptsNullNum10);
    originalSpoonModel.getRecipeInformation = jest.fn().mockResolvedValue(mockResponseGetRecipeInformation);
    originalSpoonModel.startCacheTimer = jest.fn();

    return originalSpoonModel;

});

const SpoonApi = require('./spoonModel');

beforeAll(() => SpoonApi.recipesCache = null)

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
    
    describe("test serveRecipesCache", () => {

        test("serveRecipesCache - No Cache Currently Saved", async () => {

            SpoonApi.recipesCache = null
            expect(SpoonApi.getRandomRecipes).toHaveBeenCalledTimes(8);
            const fauxResponse = await SpoonApi.serveRecipesCache()    
            expect(fauxResponse).toEqual(mockResponseGetRandomRecipes)
            expect(SpoonApi.getRandomRecipes).toHaveBeenCalledTimes(9);
    
        })
    
        test("serveRecipesCache - Cache Currently Saved", async () => {

            expect(SpoonApi.getRandomRecipes).toHaveBeenCalledTimes(9);
            const fauxResponse = await SpoonApi.serveRecipesCache()    
            expect(fauxResponse).toEqual(mockResponseGetRandomRecipes)
            expect(SpoonApi.getRandomRecipes).toHaveBeenCalledTimes(9);

        })
    
    });

});

describe("test main methods", () => {

    describe("test searchRecipes", () => {

        test("works - opts: null", async () => {

            const results = await SpoonApi.searchRecipes(null, null, null, null);
            expect(results).toEqual(mockResponseGetSearchRecipesOptsNullNum10.results);
            expect(SpoonApi.getSearchRecipes).not.toHaveBeenCalledWith({
                query:null,
                intolerances:null,
                diet:null,
                number:null,
            })

        });

        test("works - opts: null, limit: 10", async () => {

            const results = await SpoonApi.searchRecipes(null, null, null, 10);
            expect(results).toEqual(mockResponseGetSearchRecipesOptsNullNum10.results);
            expect(SpoonApi.getSearchRecipes).toHaveBeenCalledWith({
                query:null,
                intolerances:null,
                diet:null,
                number:10
            })

        });

        test("works - opts: null, limited to 10", async () => {

            const results = await SpoonApi.searchRecipes(null, null, null, 50);
            expect(results).toEqual(mockResponseGetSearchRecipesOptsNullNum10.results);
            expect(SpoonApi.getSearchRecipes).not.toHaveBeenCalledWith({
                query:null,
                intolerances:null,
                diet:null,
                number:50,
            })

        });

        test("works - opts: null, limited to > 0", async () => {

            const results = await SpoonApi.searchRecipes(null, null, null, 0);
            expect(results).toEqual(mockResponseGetSearchRecipesOptsNullNum10.results);
            expect(SpoonApi.getSearchRecipes).not.toHaveBeenCalledWith({
                query:null,
                intolerances:null,
                diet:null,
                number: 0,
            })

        });

        test("works - opts: null, limited to > 0", async () => {

            const results = await SpoonApi.searchRecipes(null, null, null, -50);
            expect(results).toEqual(mockResponseGetSearchRecipesOptsNullNum10.results);
            expect(SpoonApi.getSearchRecipes).not.toHaveBeenCalledWith({
                query:null,
                intolerances:null,
                diet:null,
                number: -50,
            })

        });

        test("works - all opts, limited to 10", async () => {

            const results = await SpoonApi.searchRecipes("Asparagus", "gluten", "vegetarian", 5);
            expect(results).toEqual(mockResponseGetSearchRecipesOptsNullNum10.results);
            expect(SpoonApi.getSearchRecipes).toHaveBeenCalledWith({
                query:"Asparagus",
                intolerances:"gluten",
                diet:"vegetarian",
                number:5,
            })

        });

        test("works - bad data entered into 'number'", async () => {

            const results = await SpoonApi.searchRecipes("Asparagus", "gluten", "vegetarian", 'not a number');
            expect(results).toEqual(mockResponseGetSearchRecipesOptsNullNum10.results);
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

            const results = await SpoonApi.recipeInformation(3)
            expect(results).toEqual(mockResponseGetRecipeInformation);
            expect(SpoonApi.getRecipeInformation).toHaveBeenCalledWith(3, {includeNutrition: false})


        })

        test("works - id: valid, includeNutrition: true", async () => {

            const results = await SpoonApi.recipeInformation(3, true)
            expect(results).toEqual(mockResponseGetRecipeInformation);
            expect(SpoonApi.getRecipeInformation).toHaveBeenCalledWith(3, {includeNutrition: true})


        })

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

});