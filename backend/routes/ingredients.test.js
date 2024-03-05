"use strict";

const request = require ("supertest")

const db = require ("../db.js");

const {
    mockResponseGetRandomRecipes,
    mockResponseGetSearchRecipesOptsNullNum10,
    mockResponseGetSearchIngredientsOptsNullNum10,
    mockResponseGetRecipeInformation,
    mockResponseGetIngredientInformation
} = require("../models/spoonModelTestSetup.js")

const SpoonApi = require('../models/spoonModel.js');

beforeAll(() => SpoonApi.randomCache = null)

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

const app = require("../app")

// GET - SEARCH FOR INGREDIENT - USER MUST BE LOGGED IN - ANY

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

describe('GET /ingredients/:id', () => {

    const fauxIdQueryAll = '?amount=5&unit=cup'
    const fauxIdQueryAmount = '?amount=5'
    const fauxIdQueryAmountMulti = '?amount=5,6'
    const fauxIdQueryAmountMultiArr = '?amount=5&amount=6'
    const fauxIdQueryUnit = '?unit=cup'
    const fauxIdQueryUnitMulti = '?unit=cup,bowl'
    const fauxIdQueryUnitMultiArr = '?unit=cup&unit=bowl'

    describe('NO QUERY', () => {

        // ANON

        test("unauthorized for anon", async () => {

            const resp = await request(app).get(`/ingredients/12`)
            expect(resp.statusCode).toEqual(401)
            expect(resp.body.error.message).toEqual("Unauthorized - User must be logged in")

        })

        // ANY USER

        test("authorized for user", async () => {

            const resp = await request(app)
                .get(`/ingredients/12`)
                .set("authorization", `Bearer ${u1Token}`)

            expect(resp.statusCode).toEqual(200);
            expect(resp.body).toEqual(mockNormalizedIngredientInformation)
            expect(SpoonApi.getIngredientInformation).toHaveBeenCalledTimes(1)
            expect(SpoonApi.getIngredientInformation).toHaveBeenCalledWith(12, {amount: null, unit: null})

        })

        test("authorized for user - fail ID not valid", async () => {

            const resp = await request(app)
                .get(`/ingredients/nope`)
                .set("authorization", `Bearer ${u1Token}`)

            expect(resp.statusCode).toEqual(400);
            expect(resp.body.error.message).toEqual("Bad Request - id must be a number")

        })

        // ADMIN

        test("authorized for ADMIN", async () => {

            const resp = await request(app)
                .get(`/ingredients/12`)
                .set("authorization", `Bearer ${adminToken}`)

            expect(resp.statusCode).toEqual(200);
            expect(resp.body).toEqual(mockNormalizedIngredientInformation)
            expect(SpoonApi.getIngredientInformation).toHaveBeenCalledTimes(2)
            expect(SpoonApi.getIngredientInformation).toHaveBeenCalledWith(12, {amount: null, unit: null})

        })

        test("authorized for ADMIN - fail ID not valid", async () => {

            const resp = await request(app)
                .get(`/ingredients/nope`)
                .set("authorization", `Bearer ${adminToken}`)

            expect(resp.statusCode).toEqual(400);
            expect(resp.body.error.message).toEqual("Bad Request - id must be a number")

        })

    });

    describe('All QUERY', () => {

        // ANON

        test("unauthorized for anon", async () => {

            const resp = await request(app).get(`/ingredients/12${fauxIdQueryAll}`)
            expect(resp.statusCode).toEqual(401)
            expect(resp.body.error.message).toEqual("Unauthorized - User must be logged in")

        })

        // ANY USER

        test("authorized for user", async () => {

            const resp = await request(app)
                .get(`/ingredients/12${fauxIdQueryAll}`)
                .set("authorization", `Bearer ${u1Token}`)

            expect(resp.statusCode).toEqual(200);
            expect(resp.body).toEqual(mockNormalizedIngredientInformation)
            expect(SpoonApi.getIngredientInformation).toHaveBeenCalledTimes(3)
            // expect(SpoonApi.getIngredientInformation).toHaveBeenCalledWith(12, {amount: 5, unit: 'cup'})

        })

        test("authorized for user - fail ID not valid", async () => {

            const resp = await request(app)
                .get(`/ingredients/nope`)
                .set("authorization", `Bearer ${u1Token}`)

            expect(resp.statusCode).toEqual(400);
            expect(resp.body.error.message).toEqual("Bad Request - id must be a number")

        })

        // ADMIN

        test("authorized for ADMIN", async () => {

            const resp = await request(app)
                .get(`/ingredients/12${fauxIdQueryAll}`)
                .set("authorization", `Bearer ${adminToken}`)

            expect(resp.statusCode).toEqual(200);
            expect(resp.body).toEqual(mockNormalizedIngredientInformation)
            expect(SpoonApi.getIngredientInformation).toHaveBeenCalledTimes(4)
            // expect(SpoonApi.getIngredientInformation).toHaveBeenCalledWith(12, {amount: 5, unit: 'cup'})

        })

        test("authorized for ADMIN - fail ID not valid", async () => {

            const resp = await request(app)
                .get(`/ingredients/nope`)
                .set("authorization", `Bearer ${adminToken}`)

            expect(resp.statusCode).toEqual(400);
            expect(resp.body.error.message).toEqual("Bad Request - id must be a number")

        })

    });

    describe('UNIT QUERY', () => {

        // ANON

        test("unauthorized for anon", async () => {

            const resp = await request(app).get(`/ingredients/12${fauxIdQueryUnit}`)
            expect(resp.statusCode).toEqual(401)
            expect(resp.body.error.message).toEqual("Unauthorized - User must be logged in")

        })

        // ANY USER

        test("authorized for user", async () => {

            const resp = await request(app)
                .get(`/ingredients/12${fauxIdQueryUnit}`)
                .set("authorization", `Bearer ${u1Token}`)

            expect(resp.statusCode).toEqual(200);
            expect(resp.body).toEqual(mockNormalizedIngredientInformation)
            expect(SpoonApi.getIngredientInformation).toHaveBeenCalledTimes(5)
            // expect(SpoonApi.getIngredientInformation).toHaveBeenCalledWith(12, {amount: null, unit: 'cup'})

        })

        test("authorized for user - fail ID not valid", async () => {

            const resp = await request(app)
                .get(`/ingredients/nope`)
                .set("authorization", `Bearer ${u1Token}`)

            expect(resp.statusCode).toEqual(400);
            expect(resp.body.error.message).toEqual("Bad Request - id must be a number")

        })

        // ADMIN

        test("authorized for ADMIN", async () => {

            const resp = await request(app)
                .get(`/ingredients/12${fauxIdQueryUnit}`)
                .set("authorization", `Bearer ${adminToken}`)

            expect(resp.statusCode).toEqual(200);
            expect(resp.body).toEqual(mockNormalizedIngredientInformation)
            expect(SpoonApi.getIngredientInformation).toHaveBeenCalledTimes(6)
            // expect(SpoonApi.getIngredientInformation).toHaveBeenCalledWith(12, {amount: null, unit: 'cup'})

        })

        test("authorized for ADMIN - fail ID not valid", async () => {

            const resp = await request(app)
                .get(`/ingredients/nope`)
                .set("authorization", `Bearer ${adminToken}`)

            expect(resp.statusCode).toEqual(400);
            expect(resp.body.error.message).toEqual("Bad Request - id must be a number")

        })

    });

    describe('AMOUNT QUERY', () => {

        // ANON

        test("unauthorized for anon", async () => {

            const resp = await request(app).get(`/ingredients/12${fauxIdQueryAmount}`)
            expect(resp.statusCode).toEqual(401)
            expect(resp.body.error.message).toEqual("Unauthorized - User must be logged in")

        })

        // ANY USER

        test("authorized for user", async () => {

            const resp = await request(app)
                .get(`/ingredients/12${fauxIdQueryAmount}`)
                .set("authorization", `Bearer ${u1Token}`)

            expect(resp.statusCode).toEqual(200);
            expect(resp.body).toEqual(mockNormalizedIngredientInformation)
            expect(SpoonApi.getIngredientInformation).toHaveBeenCalledTimes(7)
            // expect(SpoonApi.getIngredientInformation).toHaveBeenCalledWith(12, {amount: 5, unit: null})

        })

        test("authorized for user - fail ID not valid", async () => {

            const resp = await request(app)
                .get(`/ingredients/nope`)
                .set("authorization", `Bearer ${u1Token}`)

            expect(resp.statusCode).toEqual(400);
            expect(resp.body.error.message).toEqual("Bad Request - id must be a number")

        })

        // ADMIN

        test("authorized for ADMIN", async () => {

            const resp = await request(app)
                .get(`/ingredients/12${fauxIdQueryAmount}`)
                .set("authorization", `Bearer ${adminToken}`)

            expect(resp.statusCode).toEqual(200);
            expect(resp.body).toEqual(mockNormalizedIngredientInformation)
            expect(SpoonApi.getIngredientInformation).toHaveBeenCalledTimes(8)
            // expect(SpoonApi.getIngredientInformation).toHaveBeenCalledWith(12, {amount: 5, unit: null})

        })

        test("authorized for ADMIN - fail ID not valid", async () => {

            const resp = await request(app)
                .get(`/ingredients/nope`)
                .set("authorization", `Bearer ${adminToken}`)

            expect(resp.statusCode).toEqual(400);
            expect(resp.body.error.message).toEqual("Bad Request - id must be a number")

        })

    });

    describe('AMOUNT QUERY - MULTI - LIST', () => {

        // ANON

        test("unauthorized for anon", async () => {

            const resp = await request(app).get(`/ingredients/12${fauxIdQueryAmountMulti}`)
            expect(resp.statusCode).toEqual(401)
            expect(resp.body.error.message).toEqual("Unauthorized - User must be logged in")

        })

        // ANY USER

        test("authorized for user - fail - too many amount queries", async () => {

            const resp = await request(app)
                .get(`/ingredients/12${fauxIdQueryAmountMulti}`)
                .set("authorization", `Bearer ${u1Token}`)

            expect(resp.statusCode).toEqual(400)
            expect(resp.body.error.message).toEqual('Bad Request - Amount must be single integer like: "5", "75", "100"')

        })

        test("authorized for user - fail ID not valid", async () => {

            const resp = await request(app)
                .get(`/ingredients/nope`)
                .set("authorization", `Bearer ${u1Token}`)

            expect(resp.statusCode).toEqual(400);
            expect(resp.body.error.message).toEqual("Bad Request - id must be a number")

        })

        // ADMIN

        test("authorized for ADMIN - fail - too many amount queries", async () => {

            const resp = await request(app)
                .get(`/ingredients/12${fauxIdQueryAmountMulti}`)
                .set("authorization", `Bearer ${adminToken}`)

            expect(resp.statusCode).toEqual(400)
            expect(resp.body.error.message).toEqual('Bad Request - Amount must be single integer like: "5", "75", "100"')

        })

        test("authorized for ADMIN - fail ID not valid", async () => {

            const resp = await request(app)
                .get(`/ingredients/nope`)
                .set("authorization", `Bearer ${adminToken}`)

            expect(resp.statusCode).toEqual(400);
            expect(resp.body.error.message).toEqual("Bad Request - id must be a number")

        })

    });

    describe('AMOUNT QUERY - MULTI - ARR', () => {

        // ANON

        test("unauthorized for anon", async () => {

            const resp = await request(app).get(`/ingredients/12${fauxIdQueryAmountMultiArr}`)
            expect(resp.statusCode).toEqual(401)
            expect(resp.body.error.message).toEqual("Unauthorized - User must be logged in")

        })

        // ANY USER

        test("authorized for user - fail - too many amount queries", async () => {

            const resp = await request(app)
                .get(`/ingredients/12${fauxIdQueryAmountMultiArr}`)
                .set("authorization", `Bearer ${u1Token}`)

            expect(resp.statusCode).toEqual(400)
            expect(resp.body.error.message).toEqual('Bad Request - Amount must be single integer like: "5", "75", "100"')

        })

        test("authorized for user - fail ID not valid", async () => {

            const resp = await request(app)
                .get(`/ingredients/nope`)
                .set("authorization", `Bearer ${u1Token}`)

            expect(resp.statusCode).toEqual(400);
            expect(resp.body.error.message).toEqual("Bad Request - id must be a number")

        })

        // ADMIN

        test("authorized for ADMIN - fail - too many amount queries", async () => {

            const resp = await request(app)
                .get(`/ingredients/12${fauxIdQueryAmountMultiArr}`)
                .set("authorization", `Bearer ${adminToken}`)

            expect(resp.statusCode).toEqual(400)
            expect(resp.body.error.message).toEqual('Bad Request - Amount must be single integer like: "5", "75", "100"')

        })

        test("authorized for ADMIN - fail ID not valid", async () => {

            const resp = await request(app)
                .get(`/ingredients/nope`)
                .set("authorization", `Bearer ${adminToken}`)

            expect(resp.statusCode).toEqual(400);
            expect(resp.body.error.message).toEqual("Bad Request - id must be a number")

        })

    });

    describe('UNIT QUERY - MULTI - LIST', () => {

        // ANON

        test("unauthorized for anon", async () => {

            const resp = await request(app).get(`/ingredients/12${fauxIdQueryUnitMulti}`)
            expect(resp.statusCode).toEqual(401)
            expect(resp.body.error.message).toEqual("Unauthorized - User must be logged in")

        })

        // ANY USER

        test("authorized for user - fail - too many amount queries", async () => {

            const resp = await request(app)
                .get(`/ingredients/12${fauxIdQueryUnitMulti}`)
                .set("authorization", `Bearer ${u1Token}`)

            expect(resp.statusCode).toEqual(400)
            expect(resp.body.error.message).toEqual('Bad Request - Amount must be string like "cup"')

        })

        test("authorized for user - fail ID not valid", async () => {

            const resp = await request(app)
                .get(`/ingredients/nope`)
                .set("authorization", `Bearer ${u1Token}`)

            expect(resp.statusCode).toEqual(400);
            expect(resp.body.error.message).toEqual("Bad Request - id must be a number")

        })

        // ADMIN

        test("authorized for ADMIN - fail - too many amount queries", async () => {

            const resp = await request(app)
                .get(`/ingredients/12${fauxIdQueryUnitMulti}`)
                .set("authorization", `Bearer ${adminToken}`)

            expect(resp.statusCode).toEqual(400)
            expect(resp.body.error.message).toEqual('Bad Request - Amount must be string like "cup"')

        })

        test("authorized for ADMIN - fail ID not valid", async () => {

            const resp = await request(app)
                .get(`/ingredients/nope`)
                .set("authorization", `Bearer ${adminToken}`)

            expect(resp.statusCode).toEqual(400);
            expect(resp.body.error.message).toEqual("Bad Request - id must be a number")

        })

    });

    describe('UNIT QUERY - MULTI - ARR', () => {

        // ANON

        test("unauthorized for anon", async () => {

            const resp = await request(app).get(`/ingredients/12${fauxIdQueryUnitMultiArr}`)
            expect(resp.statusCode).toEqual(401)
            expect(resp.body.error.message).toEqual("Unauthorized - User must be logged in")

        })

        // ANY USER

        test("authorized for user - fail - too many amount queries", async () => {

            const resp = await request(app)
                .get(`/ingredients/12${fauxIdQueryUnitMultiArr}`)
                .set("authorization", `Bearer ${u1Token}`)

            expect(resp.statusCode).toEqual(400)
            expect(resp.body.error.message).toEqual('Bad Request - Amount must be string like "cup"')

        })

        test("authorized for user - fail ID not valid", async () => {

            const resp = await request(app)
                .get(`/ingredients/nope`)
                .set("authorization", `Bearer ${u1Token}`)

            expect(resp.statusCode).toEqual(400);
            expect(resp.body.error.message).toEqual("Bad Request - id must be a number")

        })

        // ADMIN

        test("authorized for ADMIN - fail - too many amount queries", async () => {

            const resp = await request(app)
                .get(`/ingredients/12${fauxIdQueryUnitMultiArr}`)
                .set("authorization", `Bearer ${adminToken}`)

            expect(resp.statusCode).toEqual(400)
            expect(resp.body.error.message).toEqual('Bad Request - Amount must be string like "cup"')

        })

        test("authorized for ADMIN - fail ID not valid", async () => {

            const resp = await request(app)
                .get(`/ingredients/nope`)
                .set("authorization", `Bearer ${adminToken}`)

            expect(resp.statusCode).toEqual(400);
            expect(resp.body.error.message).toEqual("Bad Request - id must be a number")

        })

    });

})