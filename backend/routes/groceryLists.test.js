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
  
beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// GET GROCERY LISTS BY USERNAME

describe('GET /grocerylists/:username', () => {

    // ANON

    test("unauthorized for anon", async () => {

        const resp = await request(app).get(`/grocerylists/u1`);
        expect(resp.statusCode).toEqual(401)
        expect(resp.body.error.message).toEqual("Unauthorized - Must be Admin or Effected User")

    })

    // ADMIN

    test("works for users - ADMIN", async () => {

        const resp = await request(app)
            .get(`/grocerylists/u1`)
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.body).toEqual([
            {
                // SLEEPY... Zzz
            }
        ]);
    });

    test("not found if user not found - ADMIN", async () => {

        const resp = await request(app)
            .get(`/grocerylists/nope`)
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(404);
        expect(resp.body.error.message).toEqual("No user: nope")

    });

    // NOT ADMIN IS USER

    test("works for users - NOT ADMIN IS USER", async () => {

        const resp = await request(app)
            .get(`/grocerylists/u1`)
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.body).toEqual({
            user: {

                email: "u1@email.com",
                firstName: "U1F",
                isAdmin: false,
                lastName: "U1L",
                username: "u1",

            },
        });
    });

    // NOT ADMIN NOT USER

    test("unauthorized for users - NOT ADMIN NOT USER", async () => {

        const resp = await request(app)
            .get(`/grocerylists/u2`)
            .set("authorization", `Bearer ${u1Token}`);
        
        expect(resp.statusCode).toEqual(401);

    });

    test("unauthorized for users - NOT ADMIN NOT USER", async () => {

        const resp = await request(app)
            .get(`/grocerylists/nope`)
            .set("authorization", `Bearer ${u1Token}`);
        
        expect(resp.statusCode).toEqual(401);

    });

})