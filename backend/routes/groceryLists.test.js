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

describe('GET /grocery-lists/:username', () => {

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

describe('GET /grocery-lists/:id', () => {

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

  test("not found if grocery list not found - ADMIN", async () => {

    const resp = await request(app)
        .get(`/grocery-lists/9000/details`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
    expect(resp.body.error.message).toEqual("Not Found - No grocery list: 9000")

  });

  test("bad request if grocery list id not integer - ADMIN", async () => {

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

  test("bad request found if grocery list id not integer - NOT ADMIN", async () => {

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

  test("unauthorized for users - NOT ADMIN NOT USER - grocery list does not exist", async () => {

    const resp = await request(app)
        .get(`/grocery-lists/6/details`)
        .set("authorization", `Bearer ${u1Token}`);
    
    expect(resp.statusCode).toEqual(401);

  });

})

describe('POST /grocery-lists/:username', () => {

  const newList = {listName:'new list'};
  const badListVal = {listName: 9000};
  const badListKey = {notValid:'new list'};

  // ANON

  test("unauthorized for anon", async () => {

    const resp = await request(app)
        .post(`/grocery-lists/u1`)
        .send(newList)
    expect(resp.statusCode).toEqual(401)
    expect(resp.body.error.message).toEqual("Unauthorized - Must be Admin or Effected User")

  })

  test("unauthorized for anon - BAD DATA - bad list key", async () => {

    const resp = await request(app)
        .post(`/grocery-lists/u1`)
        .send(badListKey)
    expect(resp.statusCode).toEqual(401)
    expect(resp.body.error.message).toEqual("Unauthorized - Must be Admin or Effected User")

  })

  test("unauthorized for anon - BAD DATA - bad list value", async () => {

    const resp = await request(app)
        .post(`/grocery-lists/u1`)
        .send(badListVal)
    expect(resp.statusCode).toEqual(401)
    expect(resp.body.error.message).toEqual("Unauthorized - Must be Admin or Effected User")

  })

  // ADMIN

  test("works for users - ADMIN - IS USER", async () => {

    const resp = await request(app)
        .post(`/grocery-lists/uA`)
        .send(newList)
        .set("authorization", `Bearer ${adminToken}`);
    expect(Number.isInteger(resp.body)).toBe(true);

  });

  test("works for users - ADMIN - NOT USER", async () => {

    const resp = await request(app)
        .post(`/grocery-lists/u1`)
        .send(newList)
        .set("authorization", `Bearer ${adminToken}`);
    expect(Number.isInteger(resp.body)).toBe(true);

  });

  test("not found if user not found - ADMIN", async () => {

    const resp = await request(app)
        .post(`/grocery-lists/nope`)
        .send(newList)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
    expect(resp.body.error.message).toEqual("No User: nope")

  });

  // "" BAD DATA

  test("bad request for users - ADMIN - IS USER - BAD DATA - bad list key", async () => {

    const resp = await request(app)
        .post(`/grocery-lists/uA`)
        .send(badListKey)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);

  });

  test("bad request for users - ADMIN - NOT USER - BAD DATA - bad list key", async () => {

    const resp = await request(app)
        .post(`/grocery-lists/u1`)
        .send(badListKey)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);

  });

  test("bad request if user not found - ADMIN - BAD DATA - bad list key", async () => {

    const resp = await request(app)
        .post(`/grocery-lists/nope`)
        .send(badListKey)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);

  });

  test("bad request for users - ADMIN - IS USER - BAD DATA - bad list val", async () => {

    const resp = await request(app)
        .post(`/grocery-lists/uA`)
        .send(badListVal)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);

  });

  test("bad request for users - ADMIN - NOT USER - BAD DATA - bad list val", async () => {

    const resp = await request(app)
        .post(`/grocery-lists/u1`)
        .send(badListVal)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);

  });

  test("bad request if user not found - ADMIN - BAD DATA - bad list val", async () => {

    const resp = await request(app)
        .post(`/grocery-lists/nope`)
        .send(badListVal)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);

  });

  // NOT ADMIN IS USER

  test("works for users - NOT ADMIN - IS USER", async () => {

    const resp = await request(app)
        .post(`/grocery-lists/u1`)
        .send(newList)
        .set("authorization", `Bearer ${u1Token}`);
      expect(Number.isInteger(resp.body)).toBe(true);

  });

  test("bad request for users - NOT ADMIN - IS USER - BAD DATA - bad list key", async () => {

    const resp = await request(app)
        .post(`/grocery-lists/u1`)
        .send(badListKey)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);

  });

  test("bad request for users - NOT ADMIN - IS USER - BAD DATA - bad list val", async () => {

    const resp = await request(app)
        .post(`/grocery-lists/u1`)
        .send(badListVal)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);

  });

  // NOT ADMIN NOT USER

  test("unauthorized for users - NOT ADMIN NOT USER", async () => {

    const resp = await request(app)
        .post(`/grocery-lists/u2`)
        .send(newList)
        .set("authorization", `Bearer ${u1Token}`);
    
    expect(resp.statusCode).toEqual(401);

  });

  test("unauthorized for users - NOT ADMIN NOT USER - User doesn't exist", async () => {

    const resp = await request(app)
        .post(`/grocery-lists/nope`)
        .send(newList)
        .set("authorization", `Bearer ${u1Token}`);
    
    expect(resp.statusCode).toEqual(401);

  });

  test("unauthorized for users - NOT ADMIN NOT USER - BAD DATA - bad list key", async () => {

    const resp = await request(app)
        .post(`/grocery-lists/u2`)
        .send(badListKey)
        .set("authorization", `Bearer ${u1Token}`);
    
    expect(resp.statusCode).toEqual(401);

  });

  test("unauthorized for users - NOT ADMIN NOT USER - User doesn't exist - BAD DATA - bad list key", async () => {

    const resp = await request(app)
        .post(`/grocery-lists/nope`)
        .send(badListKey)
        .set("authorization", `Bearer ${u1Token}`);
    
    expect(resp.statusCode).toEqual(401);

  });

  test("unauthorized for users - NOT ADMIN NOT USER - BAD DATA - bad list val", async () => {

    const resp = await request(app)
        .post(`/grocery-lists/u2`)
        .send(badListVal)
        .set("authorization", `Bearer ${u1Token}`);
    
    expect(resp.statusCode).toEqual(401);

  });

  test("unauthorized for users - NOT ADMIN NOT USER - User doesn't exist - BAD DATA - bad list val", async () => {

    const resp = await request(app)
        .post(`/grocery-lists/nope`)
        .send(badListVal)
        .set("authorization", `Bearer ${u1Token}`);
    
    expect(resp.statusCode).toEqual(401);

  });

  // ADD CASES - DUPLICATE BUT SEND BAD DATA

})