"use strict";

const request = require("supertest");

const db = require("../db.js");

const {
    mockResponseGetRandomRecipes,
    mockResponseGetSearchRecipesOptsNullNum10,
    mockResponseGetRecipeInformation
} = require("../models/spoonModelTestSetup.js")

const SpoonApi = require('../models/spoonModel.js');

beforeAll(() => SpoonApi.recipesCache = null)

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1Token,
    u3Token,
    adminToken,
} = require("./_testCommon");
  
beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

const app = require("../app");

// GET CACHE

describe('GET /recipes/cache', () => {

    // ANON

    test("works for anon", async () => {

        const resp = await request(app).get(`/recipes/cache`)
        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual(mockResponseGetRandomRecipes.recipes)
        expect(SpoonApi.getRandomRecipes).toHaveBeenCalledTimes(1)

    });

    test("works for anon - serves saved cache", async () => {

        const resp = await request(app).get(`/recipes/cache`)
        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual(mockResponseGetRandomRecipes.recipes)
        expect(SpoonApi.getRandomRecipes).toHaveBeenCalledTimes(1)

    });


})

// SEARCH

describe('GET /recipes/search', () => {

    const fauxQueryAll = '?query=chicken%20noodle&intolerances=dairy&diet=vegetarian'

    const fauxQueryMultipleIntolerances = '?query=chicken%20noodle&intolerances=dairy,wheat'
    const fauxQueryMultipleIntolerancesArr = '?query=chicken%20noodle&intolerances=dairy&intolerances=wheat&diet=vegan'

    const fauxQueryOnly = '?query=chicken%20noodle'

    // ANON

    test("unauthorized for anon", async () => {

        const resp = await request(app).get(`/recipes/search${fauxQueryOnly}`);
        expect(resp.statusCode).toEqual(401);
        expect(resp.body.error.message).toEqual("Unauthorized - User must be logged in");

    })

    // ANY USER

    test("authorized for user - no user intolerances", async () => {

        const resp = await request(app)
            .get(`/recipes/search${fauxQueryOnly}`)
            .set("authorization", `Bearer ${u3Token}`)
        expect(resp.statusCode).toEqual(200)
        expect(resp.body).toEqual(mockResponseGetSearchRecipesOptsNullNum10)
        expect(SpoonApi.getSearchRecipes).toHaveBeenCalledTimes(1)
        expect(SpoonApi.getSearchRecipes).toHaveBeenCalledWith({

            query: 'chicken noodle',
            intolerances: null,
            diet: null,
            number: 10,
    
        })

    })

    test("authorized for user - all options - no user intolerances", async () => {

        const resp = await request(app)
            .get(`/recipes/search${fauxQueryAll}`)
            .set("authorization", `Bearer ${u3Token}`)
        expect(resp.statusCode).toEqual(200)
        expect(resp.body).toEqual(mockResponseGetSearchRecipesOptsNullNum10)
        expect(SpoonApi.getSearchRecipes).toHaveBeenCalledTimes(2)
        expect(SpoonApi.getSearchRecipes).toHaveBeenCalledWith({

            query: 'chicken noodle',
            intolerances: 'dairy',
            diet: 'vegetarian',
            number: 10,
    
        })


    })

    test("authorized for user - all options - no user intolerances - multiple query intolerances passed as string", async () => {

        const resp = await request(app)
            .get(`/recipes/search${fauxQueryMultipleIntolerances}`)
            .set("authorization", `Bearer ${u3Token}`)
        expect(resp.statusCode).toEqual(200)
        expect(resp.body).toEqual(mockResponseGetSearchRecipesOptsNullNum10)
        expect(SpoonApi.getSearchRecipes).toHaveBeenCalledTimes(3)
        expect(SpoonApi.getSearchRecipes).toHaveBeenCalledWith({

            query: 'chicken noodle',
            intolerances: 'dairy',
            diet: 'vegetarian',
            number: 10,
    
        })


    })

    test("authorized for user - all options - no user intolerances - multiple query intolerances passed as array", async () => {

        const resp = await request(app)
            .get(`/recipes/search${fauxQueryMultipleIntolerancesArr}`)
            .set("authorization", `Bearer ${u3Token}`)
        expect(resp.statusCode).toEqual(200)
        expect(resp.body).toEqual(mockResponseGetSearchRecipesOptsNullNum10)
        expect(SpoonApi.getSearchRecipes).toHaveBeenCalledTimes(4)
        expect(SpoonApi.getSearchRecipes).toHaveBeenCalledWith({

            query: 'chicken noodle',
            intolerances: 'dairy,wheat',
            diet: null,
            number: 10,
    
        })


    })

    test("authorized for user - with user intolerances", async () => {

        const resp = await request(app)
            .get(`/recipes/search${fauxQueryOnly}`)
            .set("authorization", `Bearer ${u1Token}`)
        expect(resp.statusCode).toEqual(200)
        expect(resp.body).toEqual(mockResponseGetSearchRecipesOptsNullNum10)
        expect(SpoonApi.getSearchRecipes).toHaveBeenCalledTimes(5)
        expect(SpoonApi.getSearchRecipes).toHaveBeenCalledWith({

            query: 'chicken noodle',
            intolerances: 'dairy,wheat',
            diet: 'vegan',
            number: 10,
    
        })


    })

    test("authorized for user - all options - with user intolerances", async () => {

        const resp = await request(app)
            .get(`/recipes/search${fauxQueryAll}`)
            .set("authorization", `Bearer ${u1Token}`)
        expect(resp.statusCode).toEqual(200)
        expect(resp.body).toEqual(mockResponseGetSearchRecipesOptsNullNum10)
        expect(SpoonApi.getSearchRecipes).toHaveBeenCalledTimes(6)
        expect(SpoonApi.getSearchRecipes).toHaveBeenCalledWith({

            query: 'chicken noodle',
            intolerances: 'egg,gluten,dairy',
            diet: 'vegetarian',
            number: 10,
    
        })


    })

    test("authorized for user - all options - with user intolerances - multiple query intolerances passed as string", async () => {

        const resp = await request(app)
            .get(`/recipes/search${fauxQueryMultipleIntolerances}`)
            .set("authorization", `Bearer ${u1Token}`)
        expect(resp.statusCode).toEqual(200)
        expect(resp.body).toEqual(mockResponseGetSearchRecipesOptsNullNum10)
        expect(SpoonApi.getSearchRecipes).toHaveBeenCalledTimes(7)
        expect(SpoonApi.getSearchRecipes).toHaveBeenCalledWith({

            query: 'chicken noodle',
            intolerances: 'egg,gluten,dairy,wheat',
            diet: null,
            number: 10,
    
        })


    })

    test("authorized for user - all options - with user intolerances - multiple query intolerances passed as array", async () => {

        const resp = await request(app)
            .get(`/recipes/search${fauxQueryMultipleIntolerancesArr}`)
            .set("authorization", `Bearer ${u1Token}`)
        expect(resp.statusCode).toEqual(200)
        expect(resp.body).toEqual(mockResponseGetSearchRecipesOptsNullNum10)
        expect(SpoonApi.getSearchRecipes).toHaveBeenCalledTimes(8)
        expect(SpoonApi.getSearchRecipes).toHaveBeenCalledWith({

            query: 'chicken noodle',
            intolerances: 'egg,gluten,dairy,wheat',
            diet: 'vegan',
            number: 10,
    
        })


    })

    // ADMIN

    test("authorized for admin - no user intolerances", async () => {

        const resp = await request(app)
            .get(`/recipes/search${fauxQueryOnly}`)
            .set("authorization", `Bearer ${adminToken}`)
        expect(resp.statusCode).toEqual(200)
        expect(resp.body).toEqual(mockResponseGetSearchRecipesOptsNullNum10)
        expect(SpoonApi.getSearchRecipes).toHaveBeenCalledTimes(9)
        expect(SpoonApi.getSearchRecipes).toHaveBeenCalledWith({

            query: 'chicken noodle',
            intolerances: null,
            diet: null,
            number: 10,
    
        })


    })

    test("authorized for admin - all options - no user intolerances", async () => {

        const resp = await request(app)
            .get(`/recipes/search${fauxQueryAll}`)
            .set("authorization", `Bearer ${adminToken}`)
        expect(resp.statusCode).toEqual(200)
        expect(resp.body).toEqual(mockResponseGetSearchRecipesOptsNullNum10)
        expect(SpoonApi.getSearchRecipes).toHaveBeenCalledTimes(10)
        expect(SpoonApi.getSearchRecipes).toHaveBeenCalledWith({

            query: 'chicken noodle',
            intolerances: 'dairy',
            diet: 'vegetarian',
            number: 10,
    
        })


    })

    test("authorized for admin - all options - no user intolerances - multiple query intolerances passed as string", async () => {

        const resp = await request(app)
            .get(`/recipes/search${fauxQueryMultipleIntolerances}`)
            .set("authorization", `Bearer ${adminToken}`)
        expect(resp.statusCode).toEqual(200)
        expect(resp.body).toEqual(mockResponseGetSearchRecipesOptsNullNum10)
        expect(SpoonApi.getSearchRecipes).toHaveBeenCalledTimes(11)
        expect(SpoonApi.getSearchRecipes).toHaveBeenCalledWith({

            query: 'chicken noodle',
            intolerances: 'dairy',
            diet: 'vegetarian',
            number: 10,
    
        })


    })

    test("authorized for admin - all options - no user intolerances - multiple query intolerances passed as array", async () => {

        const resp = await request(app)
            .get(`/recipes/search${fauxQueryMultipleIntolerancesArr}`)
            .set("authorization", `Bearer ${adminToken}`)
        expect(resp.statusCode).toEqual(200)
        expect(resp.body).toEqual(mockResponseGetSearchRecipesOptsNullNum10)
        expect(SpoonApi.getSearchRecipes).toHaveBeenCalledTimes(12)
        expect(SpoonApi.getSearchRecipes).toHaveBeenCalledWith({

            query: 'chicken noodle',
            intolerances: 'dairy,wheat',
            diet: null,
            number: 10,
    
        })


    })

    test("authorized for admin - with user intolerances", async () => {

        const resp = await request(app)
            .get(`/recipes/search${fauxQueryOnly}`)
            .set("authorization", `Bearer ${adminToken}`)
        expect(resp.statusCode).toEqual(200)
        expect(resp.body).toEqual(mockResponseGetSearchRecipesOptsNullNum10)
        expect(SpoonApi.getSearchRecipes).toHaveBeenCalledTimes(13)
        expect(SpoonApi.getSearchRecipes).toHaveBeenCalledWith({

            query: 'chicken noodle',
            intolerances: 'dairy,wheat',
            diet: 'vegan',
            number: 10,
    
        })


    })

    test("authorized for admin - all options - with user intolerances", async () => {

        const resp = await request(app)
            .get(`/recipes/search${fauxQueryAll}`)
            .set("authorization", `Bearer ${adminToken}`)
        expect(resp.statusCode).toEqual(200)
        expect(resp.body).toEqual(mockResponseGetSearchRecipesOptsNullNum10)
        expect(SpoonApi.getSearchRecipes).toHaveBeenCalledTimes(14)
        expect(SpoonApi.getSearchRecipes).toHaveBeenCalledWith({

            query: 'chicken noodle',
            intolerances: 'egg,gluten,dairy',
            diet: 'vegetarian',
            number: 10,
    
        })


    })

    test("authorized for admin - all options - with user intolerances - multiple query intolerances passed as string", async () => {

        const resp = await request(app)
            .get(`/recipes/search${fauxQueryMultipleIntolerances}`)
            .set("authorization", `Bearer ${adminToken}`)
        expect(resp.statusCode).toEqual(200)
        expect(resp.body).toEqual(mockResponseGetSearchRecipesOptsNullNum10)
        expect(SpoonApi.getSearchRecipes).toHaveBeenCalledTimes(15)
        expect(SpoonApi.getSearchRecipes).toHaveBeenCalledWith({

            query: 'chicken noodle',
            intolerances: 'egg,gluten,dairy,wheat',
            diet: null,
            number: 10,
    
        })


    })

    test("authorized for admin - all options - with user intolerances - multiple query intolerances passed as array", async () => {

        const resp = await request(app)
            .get(`/recipes/search${fauxQueryMultipleIntolerancesArr}`)
            .set("authorization", `Bearer ${adminToken}`)
        expect(resp.statusCode).toEqual(200)
        expect(resp.body).toEqual(mockResponseGetSearchRecipesOptsNullNum10)
        expect(SpoonApi.getSearchRecipes).toHaveBeenCalledTimes(16)
        expect(SpoonApi.getSearchRecipes).toHaveBeenCalledWith({

            query: 'chicken noodle',
            intolerances: 'egg,gluten,dairy,wheat',
            diet: 'vegan',
            number: 10,
    
        })


    })

})

// GET RECIPE BY ID

describe('GET /recipes/:id', () => {

    // ANON

    test("unauthorized for anon", async () => {

        const resp = await request(app).get(`/recipes/12`)
        expect(resp.statusCode).toEqual(401)
        expect(resp.body.error.message).toEqual("Unauthorized - User must be logged in")

    })

    // ANY USER

    test("authorized for user", async () => {

        const resp = await request(app)
            .get(`/recipes/12`)
            .set("authorization", `Bearer ${u1Token}`)

        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual(mockResponseGetRecipeInformation)
        expect(SpoonApi.getRecipeInformation).toHaveBeenCalledTimes(1)
        expect(SpoonApi.getRecipeInformation).toHaveBeenCalledWith(12, {includeNutrition:false})

    })

    test("authorized for user - fail ID not valid", async () => {

        const resp = await request(app)
            .get(`/recipes/nope`)
            .set("authorization", `Bearer ${u1Token}`)

        expect(resp.statusCode).toEqual(400);
        expect(resp.body.error.message).toEqual("Bad Request - id must be a number")

    })

    // ADMIN

    test("authorized for ADMIN", async () => {

        const resp = await request(app)
            .get(`/recipes/12`)
            .set("authorization", `Bearer ${adminToken}`)

        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual(mockResponseGetRecipeInformation)
        expect(SpoonApi.getRecipeInformation).toHaveBeenCalledTimes(2)
        expect(SpoonApi.getRecipeInformation).toHaveBeenCalledWith(12, {includeNutrition:false})

    })

    test("authorized for ADMIN - fail ID not valid", async () => {

        const resp = await request(app)
            .get(`/recipes/nope`)
            .set("authorization", `Bearer ${adminToken}`)

        expect(resp.statusCode).toEqual(400);
        expect(resp.body.error.message).toEqual("Bad Request - id must be a number")

    })

})

// GET RECIPE BY ID - INCLUDE NUTRITION

describe('GET /recipes/:id/nutrition', () => {

    // ANON

    test("unauthorized for anon", async () => {

        const resp = await request(app).get(`/recipes/12/nutrition`)
        expect(resp.statusCode).toEqual(401)
        expect(resp.body.error.message).toEqual("Unauthorized - User must be logged in")

    })

    // ANY USER

    test("authorized for user", async () => {

        const resp = await request(app)
            .get(`/recipes/12/nutrition`)
            .set("authorization", `Bearer ${u1Token}`)

        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual(mockResponseGetRecipeInformation)
        expect(SpoonApi.getRecipeInformation).toHaveBeenCalledTimes(3)
        expect(SpoonApi.getRecipeInformation).toHaveBeenCalledWith(12, {includeNutrition:true})

    })

    test("authorized for user - fail ID not valid", async () => {

        const resp = await request(app)
            .get(`/recipes/nope/nutrition`)
            .set("authorization", `Bearer ${u1Token}`)

        expect(resp.statusCode).toEqual(400);
        expect(resp.body.error.message).toEqual("Bad Request - id must be a number")

    })

    // ADMIN

    test("authorized for ADMIN", async () => {

        const resp = await request(app)
            .get(`/recipes/12/nutrition`)
            .set("authorization", `Bearer ${adminToken}`)

        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual(mockResponseGetRecipeInformation)
        expect(SpoonApi.getRecipeInformation).toHaveBeenCalledTimes(4)
        expect(SpoonApi.getRecipeInformation).toHaveBeenCalledWith(12, {includeNutrition:true})

    })

    test("authorized for ADMIN - fail ID not valid", async () => {

        const resp = await request(app)
            .get(`/recipes/nope/nutrition`)
            .set("authorization", `Bearer ${adminToken}`)

        expect(resp.statusCode).toEqual(400);
        expect(resp.body.error.message).toEqual("Bad Request - id must be a number")

    })

})