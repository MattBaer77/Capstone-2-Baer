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

  const u1Response = [
    {
      id: 1,
      list_name: 'testlistU1-1',
      owner: 'u1',
      ingredients: [
        {
            ingredient_id: 100,
            amount: 2,
            unit: 'Some Unit',
            minimum_amount: 0
          },
          {
            ingredient_id: 101,
            amount: 2,
            unit: 'Some Unit',
            minimum_amount: 0
          }
      ],
      recipes: [
        { id: 1, recipe_id: 11 },
        { id: 2, recipe_id: 12 },
        { id: 3, recipe_id: 32 }
      ]
    },
    {
      id: 2,
      list_name: 'testlistU1-2',
      owner: 'u1',
      ingredients: [
        {
            ingredient_id: 100,
            amount: 4,
            unit: 'Some Unit',
            minimum_amount: 1
          },
          {
            ingredient_id: 101,
            amount: 4,
            unit: 'Some Unit',
            minimum_amount: 1
          }
      ],
      recipes: [
        { id: 4, recipe_id: 22 } 
      ]
    },
    {
      id: 3,
      list_name: 'testlistU1-3',
      owner: 'u1',
      ingredients: [],
      recipes: [
        { id: 5, recipe_id: 33 } 
      ]
    }
  ];

  // ANON

  test("unauthorized for anon", async () => {

    const resp = await request(app).get(`/grocery-lists/u1`);
    expect(resp.statusCode).toEqual(401)
    expect(resp.body.error.message).toEqual("Unauthorized - Must be Admin or Effected User")

  })

  // ADMIN

  test("works for users - ADMIN", async () => {

    const resp = await request(app)
        .get(`/grocery-lists/u1`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual(u1Response);

  });

  test("not found if user not found - ADMIN", async () => {

    const resp = await request(app)
        .get(`/grocery-lists/nope`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
    expect(resp.body.error.message).toEqual("No User: nope")

  });

  // NOT ADMIN IS USER

  test("works for users - NOT ADMIN IS USER", async () => {

    const resp = await request(app)
        .get(`/grocery-lists/u1`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual(u1Response);

  });

  // NOT ADMIN NOT USER

  test("unauthorized for users - NOT ADMIN NOT USER", async () => {

    const resp = await request(app)
        .get(`/grocery-lists/u2`)
        .set("authorization", `Bearer ${u1Token}`);
    
    expect(resp.statusCode).toEqual(401);

  });

  test("unauthorized for users - NOT ADMIN NOT USER", async () => {

    const resp = await request(app)
        .get(`/grocery-lists/nope`)
        .set("authorization", `Bearer ${u1Token}`);
    
    expect(resp.statusCode).toEqual(401);

  });

})

// REVISIT AFTER MODEL FIX

describe('GET /grocerylists/:id', () => {

  const u1Response1 = {

    id: 1,
    list_name: 'testlistU1-1',
    owner: 'u1',
    ingredients: [
    {
        ingredient_id: 100,
        amount: 2,
        unit: 'Some Unit',
        minimum_amount: 0
        },
        {
        ingredient_id: 101,
        amount: 2,
        unit: 'Some Unit',
        minimum_amount: 0
        }
    ],
    recipes: [
    { id: 1, recipe_id: 11 },
    { id: 2, recipe_id: 12 },
    { id: 3, recipe_id: 32 }
    ]

  };

  // ANON

  test("unauthorized for anon", async () => {

    const resp = await request(app).get(`/grocery-lists/1/details`);
    expect(resp.statusCode).toEqual(401)
    expect(resp.body.error.message).toEqual("Unauthorized - User must be logged in")

  })

  // ADMIN

  test("works for users - ADMIN", async () => {

    const resp = await request(app)
        .get(`/grocery-lists/1/details`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual(u1Response1);

  });

  test("not found if list not found - ADMIN", async () => {

    const resp = await request(app)
        .get(`/grocery-lists/9000/details`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
    expect(resp.body.error.message).toEqual("Not Found - No grocery list: 9000")

  });

  test("bad request found if list id not integer - ADMIN", async () => {

    const resp = await request(app)
        .get(`/grocery-lists/nope/details`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message).toEqual('Bad Request - Must include id like "1" or "100"')

  });

  // NOT ADMIN IS USER

  test("works for users - NOT ADMIN IS USER", async () => {

    const resp = await request(app)
        .get(`/grocery-lists/1/details`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual(u1Response1);

  });

  test("not found if list not found - NOT ADMIN IS USER", async () => {

    const resp = await request(app)
        .get(`/grocery-lists/9000/details`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
    expect(resp.body.error.message).toEqual("Unauthorized - Must be Admin or List Owner")

  });

  test("bad request found if list id not integer - ADMIN", async () => {

    const resp = await request(app)
        .get(`/grocery-lists/nope/details`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message).toEqual('Bad Request - Must include id like "1" or "100"')

  });

  // NOT ADMIN NOT USER

  test("unauthorized for users - NOT ADMIN NOT USER", async () => {

    const resp = await request(app)
        .get(`/grocery-lists/6/details`)
        .set("authorization", `Bearer ${u1Token}`);
    
    expect(resp.statusCode).toEqual(401);

  });

})