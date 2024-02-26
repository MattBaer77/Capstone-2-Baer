"use strict";

// // WORKING BLOCK
// const SpoonApi = require("../models/spoonModel")
// jest.mock("../models/spoonModel")
// SpoonApi.getARandomFoodJoke.mockResolvedValue({ text: "Mocked food joke data" });
// // WORKING BLOCK

jest.mock('../models/spoonModel', () => {

    const originalSpoonModel = jest.requireActual('../models/spoonModel');

    return {...originalSpoonModel,
        startCacheTimer:jest.fn(),
        getARandomFoodJoke:jest.fn().mockResolvedValue({ text: "Mocked food joke data" })
    };

});

const request = require("supertest")
const app = require("../app")

const {

    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll

} = require ("../models/_testCommon.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// ROUTE TESTS

test("OK - returns Joke", async () => {

    const resp = await request(app).get("/jokes");  
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({ text: "Mocked food joke data" });
    
});
  

