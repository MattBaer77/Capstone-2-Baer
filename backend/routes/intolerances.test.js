"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app")

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

// GET ALL POSSIBLE INTOLERANCES

describe('GET /intolerances', () => {

    // ANON

    test("works for anon", async () => {

        const resp = await request(app).get(`/intolerances`);
        expect(resp.statusCode).toEqual(200)
        expect(resp.body).toEqual({intolerances:[

            {id: 1, intoleranceName : "dairy"},
            {id: 2, intoleranceName : "egg"},
            {id: 3, intoleranceName : "gluten"},
            {id: 4, intoleranceName : "grain"},
            {id: 5, intoleranceName : "peanut"},
            {id: 6, intoleranceName : "seafood"},
            {id: 7, intoleranceName : "sesame"},
            {id: 8, intoleranceName : "shellfish"},
            {id: 9, intoleranceName : "soy"},
            {id: 10, intoleranceName : "sulfite"},
            {id: 11, intoleranceName : "tree nut"},
            {id: 12, intoleranceName : "wheat"}

        ]})

    })

    test("works for anon", async () => {

        const resp = await request(app).get(`/intolerances/`);
        expect(resp.statusCode).toEqual(200)
        expect(resp.body).toEqual({intolerances:[

            {id: 1, intoleranceName : "dairy"},
            {id: 2, intoleranceName : "egg"},
            {id: 3, intoleranceName : "gluten"},
            {id: 4, intoleranceName : "grain"},
            {id: 5, intoleranceName : "peanut"},
            {id: 6, intoleranceName : "seafood"},
            {id: 7, intoleranceName : "sesame"},
            {id: 8, intoleranceName : "shellfish"},
            {id: 9, intoleranceName : "soy"},
            {id: 10, intoleranceName : "sulfite"},
            {id: 11, intoleranceName : "tree nut"},
            {id: 12, intoleranceName : "wheat"}

        ]})

    })

})