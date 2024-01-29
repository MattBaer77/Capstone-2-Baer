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

// GET RECIPE BY ID

// GET RECIPE BY ID - INCLUDE NUTRITION