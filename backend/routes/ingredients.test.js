"use strict";

const request = require ("supertest")

const db = require ("../db.js");
const app = require("../app")

const {
    mockResponseGetRandomRecipes,
    mockResponseGetSearchRecipesOptsNullNum10,
    mockResponseGetSearchIngredientsOptsNullNum10,
    mockResponseGetRecipeInformation,
    mockResponseGetIngredientInformation
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

// GET - SEARCH FOR INGREDIENT - USER MUST BE LOGGED IN - ANY

describe('GET /ingredients/search', () => {

    const fauxQueryAll = '?query=chicken%20broth&intolerances=dairy&diet=vegetarian'

    const fauxQueryMultipleIntolerances = '?query=chicken%20broth&intolerances=dairy,wheat'
    const fauxQueryMultipleIntolerancesArr = '?query=chicken%20broth&intolerances=dairy&intolerances=wheat'

    const fauxQueryOnly = '?query=chicken%20broth'

    // ANON

    test("unauthorized for anon", async () => {

        const resp = await request(app).get(`/ingredients/search${fauxQueryOnly}`);
        expect(resp.statusCode).toEqual(401);
        expect(resp.body.error.message).toEqual("Unauthorized - User must be logged in");

    })

    // ANY USER

    test("authorized for user - no user intolerances", async () => {

        const resp = await request(app)
            .get(`/ingredients/search${fauxQueryOnly}`)
            .set("authorization", `Bearer ${u3Token}`);
        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual(mockResponseGetSearchIngredientsOptsNullNum10)
        expect(SpoonApi.getSearchIngredients).toHaveBeenCalledTimes(1)
        expect(SpoonApi.getSearchIngredients).toHaveBeenCalledWith({

            query: 'chicken broth',
            intolerances: null,
            number: 10
    
        })

    })

    test("authorized for user - all options - no user intolerances", async () => {

        const resp = await request(app)
            .get(`/ingredients/search${fauxQueryAll}`)
            .set("authorization", `Bearer ${u3Token}`)
        expect(resp.statusCode).toEqual(200)
        expect(resp.body).toEqual(mockResponseGetSearchIngredientsOptsNullNum10)
        expect(SpoonApi.getSearchIngredients).toHaveBeenCalledTimes(2)
        expect(SpoonApi.getSearchIngredients).toHaveBeenCalledWith({

            query: 'chicken broth',
            intolerances: 'dairy',
            number: 10,
    
        })


    })

    test("authorized for user - all options - no user intolerances - multiple query intolerances passed as string", async () => {

        const resp = await request(app)
            .get(`/ingredients/search${fauxQueryMultipleIntolerances}`)
            .set("authorization", `Bearer ${u3Token}`)
        expect(resp.statusCode).toEqual(200)
        expect(resp.body).toEqual(mockResponseGetSearchIngredientsOptsNullNum10)
        expect(SpoonApi.getSearchIngredients).toHaveBeenCalledTimes(3)
        expect(SpoonApi.getSearchIngredients).toHaveBeenCalledWith({

            query: 'chicken broth',
            intolerances: 'dairy',
            number: 10,
    
        })


    })

    test("authorized for user - all options - no user intolerances - multiple query intolerances passed as array", async () => {

        const resp = await request(app)
            .get(`/ingredients/search${fauxQueryMultipleIntolerancesArr}`)
            .set("authorization", `Bearer ${u3Token}`)
        expect(resp.statusCode).toEqual(200)
        expect(resp.body).toEqual(mockResponseGetSearchIngredientsOptsNullNum10)
        expect(SpoonApi.getSearchIngredients).toHaveBeenCalledTimes(4)
        expect(SpoonApi.getSearchIngredients).toHaveBeenCalledWith({

            query: 'chicken broth',
            intolerances: 'dairy,wheat',
            number: 10,
    
        })


    })

    test("authorized for user - with user intolerances", async () => {

        const resp = await request(app)
            .get(`/ingredients/search${fauxQueryOnly}`)
            .set("authorization", `Bearer ${u1Token}`)
        expect(resp.statusCode).toEqual(200)
        expect(resp.body).toEqual(mockResponseGetSearchIngredientsOptsNullNum10)
        expect(SpoonApi.getSearchIngredients).toHaveBeenCalledTimes(5)
        expect(SpoonApi.getSearchIngredients).toHaveBeenCalledWith({

            query: 'chicken broth',
            intolerances: 'dairy,wheat',
            number: 10,
    
        })


    })

    test("authorized for user - all options - with user intolerances", async () => {

        const resp = await request(app)
            .get(`/ingredients/search${fauxQueryAll}`)
            .set("authorization", `Bearer ${u1Token}`)
        expect(resp.statusCode).toEqual(200)
        expect(resp.body).toEqual(mockResponseGetSearchIngredientsOptsNullNum10)
        expect(SpoonApi.getSearchIngredients).toHaveBeenCalledTimes(6)
        expect(SpoonApi.getSearchIngredients).toHaveBeenCalledWith({

            query: 'chicken broth',
            intolerances: 'egg,gluten,dairy',
            number: 10,
    
        })


    })

    test("authorized for user - all options - with user intolerances - multiple query intolerances passed as string", async () => {

        const resp = await request(app)
            .get(`/ingredients/search${fauxQueryMultipleIntolerances}`)
            .set("authorization", `Bearer ${u1Token}`)
        expect(resp.statusCode).toEqual(200)
        expect(resp.body).toEqual(mockResponseGetSearchIngredientsOptsNullNum10)
        expect(SpoonApi.getSearchIngredients).toHaveBeenCalledTimes(7)
        expect(SpoonApi.getSearchIngredients).toHaveBeenCalledWith({

            query: 'chicken broth',
            intolerances: 'egg,gluten,dairy,wheat',
            number: 10,
    
        })


    })

    test("authorized for user - all options - with user intolerances - multiple query intolerances passed as array", async () => {

        const resp = await request(app)
            .get(`/ingredients/search${fauxQueryMultipleIntolerancesArr}`)
            .set("authorization", `Bearer ${u1Token}`)
        expect(resp.statusCode).toEqual(200)
        expect(resp.body).toEqual(mockResponseGetSearchIngredientsOptsNullNum10)
        expect(SpoonApi.getSearchIngredients).toHaveBeenCalledTimes(8)
        expect(SpoonApi.getSearchIngredients).toHaveBeenCalledWith({

            query: 'chicken broth',
            intolerances: 'egg,gluten,dairy,wheat',
            number: 10,
    
        })


    })

    // ADMIN

    test("authorized for admin - no user intolerances", async () => {

        const resp = await request(app)
            .get(`/ingredients/search${fauxQueryOnly}`)
            .set("authorization", `Bearer ${adminToken}`)
        expect(resp.statusCode).toEqual(200)
        expect(resp.body).toEqual(mockResponseGetSearchIngredientsOptsNullNum10)
        expect(SpoonApi.getSearchIngredients).toHaveBeenCalledTimes(9)
        expect(SpoonApi.getSearchIngredients).toHaveBeenCalledWith({

            query: 'chicken broth',
            intolerances: null,
            number: 10,
    
        })


    })

    test("authorized for admin - all options - no user intolerances", async () => {

        const resp = await request(app)
            .get(`/ingredients/search${fauxQueryAll}`)
            .set("authorization", `Bearer ${adminToken}`)
        expect(resp.statusCode).toEqual(200)
        expect(resp.body).toEqual(mockResponseGetSearchIngredientsOptsNullNum10)
        expect(SpoonApi.getSearchIngredients).toHaveBeenCalledTimes(10)
        expect(SpoonApi.getSearchIngredients).toHaveBeenCalledWith({

            query: 'chicken broth',
            intolerances: 'dairy',
            number: 10,
    
        })


    })

    test("authorized for admin - all options - no user intolerances - multiple query intolerances passed as string", async () => {

        const resp = await request(app)
            .get(`/ingredients/search${fauxQueryMultipleIntolerances}`)
            .set("authorization", `Bearer ${adminToken}`)
        expect(resp.statusCode).toEqual(200)
        expect(resp.body).toEqual(mockResponseGetSearchIngredientsOptsNullNum10)
        expect(SpoonApi.getSearchIngredients).toHaveBeenCalledTimes(11)
        expect(SpoonApi.getSearchIngredients).toHaveBeenCalledWith({

            query: 'chicken broth',
            intolerances: 'dairy',
            number: 10,
    
        })


    })

    test("authorized for admin - all options - no user intolerances - multiple query intolerances passed as array", async () => {

        const resp = await request(app)
            .get(`/ingredients/search${fauxQueryMultipleIntolerancesArr}`)
            .set("authorization", `Bearer ${adminToken}`)
        expect(resp.statusCode).toEqual(200)
        expect(resp.body).toEqual(mockResponseGetSearchIngredientsOptsNullNum10)
        expect(SpoonApi.getSearchIngredients).toHaveBeenCalledTimes(12)
        expect(SpoonApi.getSearchIngredients).toHaveBeenCalledWith({

            query: 'chicken broth',
            intolerances: 'dairy,wheat',
            number: 10,
    
        })


    })

    test("authorized for admin - with user intolerances", async () => {

        const resp = await request(app)
            .get(`/ingredients/search${fauxQueryOnly}`)
            .set("authorization", `Bearer ${adminToken}`)
        expect(resp.statusCode).toEqual(200)
        expect(resp.body).toEqual(mockResponseGetSearchIngredientsOptsNullNum10)
        expect(SpoonApi.getSearchIngredients).toHaveBeenCalledTimes(13)
        expect(SpoonApi.getSearchIngredients).toHaveBeenCalledWith({

            query: 'chicken broth',
            intolerances: 'dairy,wheat',
            number: 10,
    
        })


    })

    test("authorized for admin - all options - with user intolerances", async () => {

        const resp = await request(app)
            .get(`/ingredients/search${fauxQueryAll}`)
            .set("authorization", `Bearer ${adminToken}`)
        expect(resp.statusCode).toEqual(200)
        expect(resp.body).toEqual(mockResponseGetSearchIngredientsOptsNullNum10)
        expect(SpoonApi.getSearchIngredients).toHaveBeenCalledTimes(14)
        expect(SpoonApi.getSearchIngredients).toHaveBeenCalledWith({

            query: 'chicken broth',
            intolerances: 'egg,gluten,dairy',
            number: 10,
    
        })


    })

    test("authorized for admin - all options - with user intolerances - multiple query intolerances passed as string", async () => {

        const resp = await request(app)
            .get(`/ingredients/search${fauxQueryMultipleIntolerances}`)
            .set("authorization", `Bearer ${adminToken}`)
        expect(resp.statusCode).toEqual(200)
        expect(resp.body).toEqual(mockResponseGetSearchIngredientsOptsNullNum10)
        expect(SpoonApi.getSearchIngredients).toHaveBeenCalledTimes(15)
        expect(SpoonApi.getSearchIngredients).toHaveBeenCalledWith({

            query: 'chicken broth',
            intolerances: 'egg,gluten,dairy,wheat',
            number: 10,
    
        })


    })

    test("authorized for admin - all options - with user intolerances - multiple query intolerances passed as array", async () => {

        const resp = await request(app)
            .get(`/ingredients/search${fauxQueryMultipleIntolerancesArr}`)
            .set("authorization", `Bearer ${adminToken}`)
        expect(resp.statusCode).toEqual(200)
        expect(resp.body).toEqual(mockResponseGetSearchIngredientsOptsNullNum10)
        expect(SpoonApi.getSearchIngredients).toHaveBeenCalledTimes(16)
        expect(SpoonApi.getSearchIngredients).toHaveBeenCalledWith({

            query: 'chicken broth',
            intolerances: 'egg,gluten,dairy,wheat',
            number: 10,
    
        })


    })

})

// GET - INGREDIENT BY ID