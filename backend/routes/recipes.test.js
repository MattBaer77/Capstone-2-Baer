"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");

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
const { route } = require("./recipes.js");
  
beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

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

    const fauxQueryOnly = '?query=chicken%20noodle'

    // ANON

    test("unauthorized for anon", async () => {

        const resp = await request(app).get(`/recipes/search${fauxQueryOnly}`)
        expect(resp.statusCode).toEqual(401)
        expect(resp.body.error.message).toEqual("Unauthorized - User must be logged in")

    })

    // USER

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

})

// GET RECIPE BY ID

// GET RECIPE BY ID - INCLUDE NUTRITION