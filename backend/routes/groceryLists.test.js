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

const GroceryList = require("../models/groceryList.js");
  
beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// GROCERYLIST ROUTES -

describe('GET /grocery-lists/:username/all', () => {

  const u1Response = [
    {
      id: 1,
      listName: 'testlistU1-1',
      owner: 'u1',
      ingredients: [
        {
            ingredientId: 100,
            amount: 2,
            unit: 'Some Unit',
            minimumAmount: 0
          },
          {
            ingredientId: 101,
            amount: 2,
            unit: 'Some Unit',
            minimumAmount: 0
          }
      ],
      recipes: [
        { id: 1, recipeId: 11 },
        { id: 2, recipeId: 12 },
        { id: 3, recipeId: 32 }
      ]
    },
    {
      id: 2,
      listName: 'testlistU1-2',
      owner: 'u1',
      ingredients: [
        {
            ingredientId: 100,
            amount: 4,
            unit: 'Some Unit',
            minimumAmount: 1
          },
          {
            ingredientId: 101,
            amount: 4,
            unit: 'Some Unit',
            minimumAmount: 1
          }
      ],
      recipes: [
        { id: 4, recipeId: 22 } 
      ]
    },
    {
      id: 3,
      listName: 'testlistU1-3',
      owner: 'u1',
      ingredients: [],
      recipes: [
        { id: 5, recipeId: 33 } 
      ]
    }
  ];

  // ANON

  test("unauthorized for anon", async () => {

    const resp = await request(app).get(`/grocery-lists/u1/all`);
    expect(resp.statusCode).toEqual(401)
    expect(resp.body.error.message).toEqual("Unauthorized - Must be Admin or Effected User")

  })

  // ADMIN

  test("works for users - ADMIN", async () => {

    const resp = await request(app)
        .get(`/grocery-lists/u1/all`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual(u1Response);

  });

  test("not found if user not found - ADMIN", async () => {

    const resp = await request(app)
        .get(`/grocery-lists/nope/all`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
    expect(resp.body.error.message).toEqual("No User: nope")

  });

  // NOT ADMIN IS USER

  test("works for users - NOT ADMIN IS USER", async () => {

    const resp = await request(app)
        .get(`/grocery-lists/u1/all`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual(u1Response);

  });

  // NOT ADMIN NOT USER

  test("unauthorized for users - NOT ADMIN NOT USER", async () => {

    const resp = await request(app)
        .get(`/grocery-lists/u2/all`)
        .set("authorization", `Bearer ${u1Token}`);
    
    expect(resp.statusCode).toEqual(401);

  });

  test("unauthorized for users - NOT ADMIN NOT USER", async () => {

    const resp = await request(app)
        .get(`/grocery-lists/nope/all`)
        .set("authorization", `Bearer ${u1Token}`);
    
    expect(resp.statusCode).toEqual(401);

  });

})

describe('GET /grocery-lists/:id', () => {

  const u1Response1 = {

    id: 1,
    listName: 'testlistU1-1',
    owner: 'u1',
    ingredients: [
    {
        ingredientId: 100,
        amount: 2,
        unit: 'Some Unit',
        minimumAmount: 0
        },
        {
        ingredientId: 101,
        amount: 2,
        unit: 'Some Unit',
        minimumAmount: 0
        }
    ],
    recipes: [
    { id: 1, recipeId: 11 },
    { id: 2, recipeId: 12 },
    { id: 3, recipeId: 32 }
    ]

  };

  // ANON

  test("unauthorized for anon", async () => {

    const resp = await request(app).get(`/grocery-lists/1`);
    expect(resp.statusCode).toEqual(401)
    expect(resp.body.error.message).toEqual("Unauthorized - User must be logged in")

  })

  // ADMIN

  test("works for users - ADMIN", async () => {

    const resp = await request(app)
        .get(`/grocery-lists/1`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual(u1Response1);

  });

  test("not found if grocery list not found - ADMIN", async () => {

    const resp = await request(app)
        .get(`/grocery-lists/9000`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
    expect(resp.body.error.message).toEqual("Not Found - No grocery list: 9000")

  });

  test("bad request if grocery list id not integer - ADMIN", async () => {

    const resp = await request(app)
        .get(`/grocery-lists/nope`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message).toEqual('Bad Request - Must include id like "1" or "100"')

  });

  // NOT ADMIN IS USER

  test("works for users - NOT ADMIN IS USER", async () => {

    const resp = await request(app)
        .get(`/grocery-lists/1`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual(u1Response1);

  });

  test("bad request found if grocery list id not integer - NOT ADMIN", async () => {

    const resp = await request(app)
        .get(`/grocery-lists/nope`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message).toEqual('Bad Request - Must include id like "1" or "100"')

  });

  // NOT ADMIN NOT USER

  test("unauthorized for users - NOT ADMIN NOT USER", async () => {

    const resp = await request(app)
        .get(`/grocery-lists/6`)
        .set("authorization", `Bearer ${u1Token}`);
    
    expect(resp.statusCode).toEqual(401);

  });

  test("unauthorized for users - NOT ADMIN NOT USER - grocery list does not exist", async () => {

    const resp = await request(app)
        .get(`/grocery-lists/6`)
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
    expect(resp.body).toBe(true);

  });

  test("works for users - ADMIN - NOT USER", async () => {

    const resp = await request(app)
        .post(`/grocery-lists/u1`)
        .send(newList)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toBe(true);

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
      expect(resp.body).toBe(true);

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

describe('DELETE /grocery-lists/:id', () => {

  // ANON

  test("unauthorized for anon", async () => {

    const resp = await request(app).delete(`/grocery-lists/1`);
    expect(resp.statusCode).toEqual(401)
    expect(resp.body.error.message).toEqual("Unauthorized - User must be logged in")

  })

  // ADMIN

  test("works for users - ADMIN", async () => {

    const resp = await request(app)
        .delete(`/grocery-lists/1`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual(true);

  });

  test("not found if grocery list not found - ADMIN", async () => {

    const resp = await request(app)
        .delete(`/grocery-lists/9000`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
    expect(resp.body.error.message).toEqual("Not Found - No grocery list: 9000")

  });

  test("bad request if grocery list id not integer - ADMIN", async () => {

    const resp = await request(app)
        .delete(`/grocery-lists/nope`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message).toEqual('Bad Request - Must include id like "1" or "100"')

  });

  // NOT ADMIN IS USER

  test("works for users - NOT ADMIN IS USER", async () => {

    const resp = await request(app)
        .delete(`/grocery-lists/1`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual(true);

  });

  test("bad request found if grocery list id not integer - NOT ADMIN", async () => {

    const resp = await request(app)
        .delete(`/grocery-lists/nope`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message).toEqual('Bad Request - Must include id like "1" or "100"')

  });

  // NOT ADMIN NOT USER

  test("unauthorized for users - NOT ADMIN NOT USER", async () => {

    const resp = await request(app)
        .delete(`/grocery-lists/6`)
        .set("authorization", `Bearer ${u1Token}`);
    
    expect(resp.statusCode).toEqual(401);

  });

  test("unauthorized for users - NOT ADMIN NOT USER - grocery list does not exist", async () => {

    const resp = await request(app)
        .delete(`/grocery-lists/6`)
        .set("authorization", `Bearer ${u1Token}`);
    
    expect(resp.statusCode).toEqual(401);

  });

})

// GROCERYLIST INGREDIENTS ROUTES -

describe('POST /grocery-lists/:id/ingredients', () => {

  const newIngredient = {ingredientId: 111, amount: 5, unit:"boxes", minimumAmount: 3};
  const newIngredientNoMinimum = {ingredientId: 111, amount: 5, unit:"boxes"};
  const newIngredientBadRequestData = {id:111, amount:"boxes", unit:5}

  describe('newIngredient - VALID DATA', () => {

    // ANON

    test("unauthorized for anon", async () => {

      const resp = await request(app)
      .post(`/grocery-lists/1/ingredients`)
      .send(newIngredient);
      expect(resp.statusCode).toEqual(401)
      expect(resp.body.error.message).toEqual("Unauthorized - User must be logged in")

    })

    // ADMIN

    test("works for users - ADMIN", async () => {

      const resp = await request(app)
          .post(`/grocery-lists/1/ingredients`)
          .send(newIngredient)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.body).toEqual(true);

    });

    test("not found if grocery list not found - ADMIN", async () => {

      const resp = await request(app)
          .post(`/grocery-lists/9000/ingredients`)
          .send(newIngredient)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.statusCode).toEqual(404);
      expect(resp.body.error.message).toEqual("Not Found - No grocery list: 9000")

    });

    test("bad request if grocery list id not integer - ADMIN", async () => {

      const resp = await request(app)
          .post(`/grocery-lists/nope/ingredients`)
          .send(newIngredient)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.statusCode).toEqual(400);
      expect(resp.body.error.message).toEqual('Bad Request - Must include id like "1" or "100"')

    });

    // NOT ADMIN IS USER

    test("works for users - NOT ADMIN IS USER", async () => {

      const resp = await request(app)
          .post(`/grocery-lists/1/ingredients`)
          .send(newIngredient)
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.body).toEqual(true);

    });

    test("bad request found if grocery list id not integer - NOT ADMIN", async () => {

      const resp = await request(app)
          .post(`/grocery-lists/nope/ingredients`)
          .send(newIngredient)
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.statusCode).toEqual(400);
      expect(resp.body.error.message).toEqual('Bad Request - Must include id like "1" or "100"')

    });

    // NOT ADMIN NOT USER

    test("unauthorized for users - NOT ADMIN NOT USER", async () => {

      const resp = await request(app)
          .post(`/grocery-lists/6/ingredients`)
          .send(newIngredient)
          .set("authorization", `Bearer ${u1Token}`);
      
      expect(resp.statusCode).toEqual(401);

    });

    test("unauthorized for users - NOT ADMIN NOT USER - grocery list does not exist", async () => {

      const resp = await request(app)
          .post(`/grocery-lists/6/ingredients`)
          .send(newIngredient)
          .set("authorization", `Bearer ${u1Token}`);
      
      expect(resp.statusCode).toEqual(401);

    });

  });

  describe('newIngredientNoMinimum - VALID DATA - no minimumAmount', () => {

    // ANON

    test("unauthorized for anon", async () => {

      const resp = await request(app)
      .post(`/grocery-lists/1/ingredients`)
      .send(newIngredientNoMinimum);
      expect(resp.statusCode).toEqual(401)
      expect(resp.body.error.message).toEqual("Unauthorized - User must be logged in")

    })

    // ADMIN

    test("works for users - ADMIN", async () => {

      const resp = await request(app)
          .post(`/grocery-lists/1/ingredients`)
          .send(newIngredientNoMinimum)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.body).toEqual(true);

    });

    test("not found if grocery list not found - ADMIN", async () => {

      const resp = await request(app)
          .post(`/grocery-lists/9000/ingredients`)
          .send(newIngredientNoMinimum)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.statusCode).toEqual(404);
      expect(resp.body.error.message).toEqual("Not Found - No grocery list: 9000")

    });

    test("bad request if grocery list id not integer - ADMIN", async () => {

      const resp = await request(app)
          .post(`/grocery-lists/nope/ingredients`)
          .send(newIngredientNoMinimum)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.statusCode).toEqual(400);
      expect(resp.body.error.message).toEqual('Bad Request - Must include id like "1" or "100"')

    });

    // NOT ADMIN IS USER

    test("works for users - NOT ADMIN IS USER", async () => {

      const resp = await request(app)
          .post(`/grocery-lists/1/ingredients`)
          .send(newIngredientNoMinimum)
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.body).toEqual(true);

    });

    test("bad request found if grocery list id not integer - NOT ADMIN", async () => {

      const resp = await request(app)
          .post(`/grocery-lists/nope/ingredients`)
          .send(newIngredientNoMinimum)
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.statusCode).toEqual(400);
      expect(resp.body.error.message).toEqual('Bad Request - Must include id like "1" or "100"')

    });

    // NOT ADMIN NOT USER

    test("unauthorized for users - NOT ADMIN NOT USER", async () => {

      const resp = await request(app)
          .post(`/grocery-lists/6/ingredients`)
          .send(newIngredientNoMinimum)
          .set("authorization", `Bearer ${u1Token}`);
      
      expect(resp.statusCode).toEqual(401);

    });

    test("unauthorized for users - NOT ADMIN NOT USER - grocery list does not exist", async () => {

      const resp = await request(app)
          .post(`/grocery-lists/6/ingredients`)
          .send(newIngredientNoMinimum)
          .set("authorization", `Bearer ${u1Token}`);
      
      expect(resp.statusCode).toEqual(401);

    });

  });

  describe('newIngredientBadRequestData - INVALID DATA - bad request data', () => {

    // ANON

    test("unauthorized for anon", async () => {

      const resp = await request(app)
      .post(`/grocery-lists/1/ingredients`)
      .send(newIngredientBadRequestData);
      expect(resp.statusCode).toEqual(401)
      expect(resp.body.error.message).toEqual("Unauthorized - User must be logged in")

    })

    // ADMIN

    test("bad request for users - ADMIN", async () => {

      const resp = await request(app)
          .post(`/grocery-lists/1/ingredients`)
          .send(newIngredientBadRequestData)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.statusCode).toEqual(400)

    });

    test("not found if grocery list not found - ADMIN", async () => {

      const resp = await request(app)
          .post(`/grocery-lists/9000/ingredients`)
          .send(newIngredientBadRequestData)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.statusCode).toEqual(404);
      expect(resp.body.error.message).toEqual("Not Found - No grocery list: 9000")

    });

    test("bad request if grocery list id not integer - ADMIN", async () => {

      const resp = await request(app)
          .post(`/grocery-lists/nope/ingredients`)
          .send(newIngredientBadRequestData)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.statusCode).toEqual(400);
      expect(resp.body.error.message).toEqual('Bad Request - Must include id like "1" or "100"')

    });

    // NOT ADMIN IS USER

    test("bad request for users - NOT ADMIN IS USER", async () => {

      const resp = await request(app)
          .post(`/grocery-lists/1/ingredients`)
          .send(newIngredientBadRequestData)
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.statusCode).toEqual(400)


    });

    test("bad request found if grocery list id not integer - NOT ADMIN", async () => {

      const resp = await request(app)
          .post(`/grocery-lists/nope/ingredients`)
          .send(newIngredientBadRequestData)
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.statusCode).toEqual(400);
      expect(resp.body.error.message).toEqual('Bad Request - Must include id like "1" or "100"')

    });

    // NOT ADMIN NOT USER

    test("unauthorized for users - NOT ADMIN NOT USER", async () => {

      const resp = await request(app)
          .post(`/grocery-lists/6/ingredients`)
          .send(newIngredientBadRequestData)
          .set("authorization", `Bearer ${u1Token}`);
      
      expect(resp.statusCode).toEqual(401);

    });

    test("unauthorized for users - NOT ADMIN NOT USER - grocery list does not exist", async () => {

      const resp = await request(app)
          .post(`/grocery-lists/6/ingredients`)
          .send(newIngredientBadRequestData)
          .set("authorization", `Bearer ${u1Token}`);
      
      expect(resp.statusCode).toEqual(401);

    });

  });

});

describe('PATCH /grocery-lists/:id/ingredients/:ingredientId', () => {

  const validAmountData = {amount: 50};
  const invalidAmountDataKey = {notAmount:5}
  const invalidAmountDataVal = {amount:"string not valid"}

  describe('validAmountData - VALID DATA', () => {

    // ANON

    test("unauthorized for anon", async () => {

      const resp = await request(app)
      .patch(`/grocery-lists/1/ingredients/100`)
      .send(validAmountData);
      expect(resp.statusCode).toEqual(401)
      expect(resp.body.error.message).toEqual("Unauthorized - User must be logged in")

    })

    // ADMIN

    test("works for users - ADMIN", async () => {

      const resp = await request(app)
          .patch(`/grocery-lists/1/ingredients/100`)
          .send(validAmountData)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.body).toEqual(true);

    });

    test("not found if grocery list not found - ADMIN", async () => {

      const resp = await request(app)
          .patch(`/grocery-lists/9000/ingredients/100`)
          .send(validAmountData)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.statusCode).toEqual(404);
      expect(resp.body.error.message).toEqual("Not Found - No grocery list: 9000")

    });

    test("bad request if grocery list id not integer - ADMIN", async () => {

      const resp = await request(app)
          .patch(`/grocery-lists/nope/ingredients/100`)
          .send(validAmountData)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.statusCode).toEqual(400);
      expect(resp.body.error.message).toEqual('Bad Request - Must include id like "1" or "100"')

    });

    // NOT ADMIN IS USER

    test("works for users - NOT ADMIN IS USER", async () => {

      const resp = await request(app)
          .patch(`/grocery-lists/1/ingredients/100`)
          .send(validAmountData)
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.body).toEqual(true);

    });

    test("bad request found if grocery list id not integer - NOT ADMIN", async () => {

      const resp = await request(app)
          .patch(`/grocery-lists/nope/ingredients/100`)
          .send(validAmountData)
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.statusCode).toEqual(400);
      expect(resp.body.error.message).toEqual('Bad Request - Must include id like "1" or "100"')

    });

    // NOT ADMIN NOT USER

    test("unauthorized for users - NOT ADMIN NOT USER", async () => {

      const resp = await request(app)
          .patch(`/grocery-lists/6/ingredients/100`)
          .send(validAmountData)
          .set("authorization", `Bearer ${u1Token}`);
      
      expect(resp.statusCode).toEqual(401);

    });

    test("unauthorized for users - NOT ADMIN NOT USER - grocery list does not exist", async () => {

      const resp = await request(app)
          .patch(`/grocery-lists/6/ingredients/100`)
          .send(validAmountData)
          .set("authorization", `Bearer ${u1Token}`);
      
      expect(resp.statusCode).toEqual(401);

    });

  });

  describe('invalidAmountDataKey - INVALID DATA - KEY', () => {

    // ANON

    test("unauthorized for anon", async () => {

      const resp = await request(app)
      .patch(`/grocery-lists/1/ingredients/100`)
      .send(invalidAmountDataKey);
      expect(resp.statusCode).toEqual(401)
      expect(resp.body.error.message).toEqual("Unauthorized - User must be logged in")

    })

    // ADMIN

    test("bad request for users - ADMIN", async () => {

      const resp = await request(app)
          .patch(`/grocery-lists/1/ingredients/100`)
          .send(invalidAmountDataKey)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.statusCode).toEqual(400)


    });

    test("not found if grocery list not found - ADMIN", async () => {

      const resp = await request(app)
          .patch(`/grocery-lists/9000/ingredients/100`)
          .send(invalidAmountDataKey)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.statusCode).toEqual(404);
      expect(resp.body.error.message).toEqual("Not Found - No grocery list: 9000")

    });

    test("bad request if grocery list id not integer - ADMIN", async () => {

      const resp = await request(app)
          .patch(`/grocery-lists/nope/ingredients/100`)
          .send(invalidAmountDataKey)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.statusCode).toEqual(400);
      expect(resp.body.error.message).toEqual('Bad Request - Must include id like "1" or "100"')

    });

    // NOT ADMIN IS USER

    test("bad request for users - NOT ADMIN IS USER", async () => {

      const resp = await request(app)
          .patch(`/grocery-lists/1/ingredients/100`)
          .send(invalidAmountDataKey)
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.statusCode).toEqual(400)


    });

    test("bad request found if grocery list id not integer - NOT ADMIN", async () => {

      const resp = await request(app)
          .patch(`/grocery-lists/nope/ingredients/100`)
          .send(invalidAmountDataKey)
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.statusCode).toEqual(400);
      expect(resp.body.error.message).toEqual('Bad Request - Must include id like "1" or "100"')

    });

    // NOT ADMIN NOT USER

    test("unauthorized for users - NOT ADMIN NOT USER", async () => {

      const resp = await request(app)
          .patch(`/grocery-lists/6/ingredients/100`)
          .send(invalidAmountDataKey)
          .set("authorization", `Bearer ${u1Token}`);
      
      expect(resp.statusCode).toEqual(401);

    });

    test("unauthorized for users - NOT ADMIN NOT USER - grocery list does not exist", async () => {

      const resp = await request(app)
          .patch(`/grocery-lists/6/ingredients/100`)
          .send(invalidAmountDataKey)
          .set("authorization", `Bearer ${u1Token}`);
      
      expect(resp.statusCode).toEqual(401);

    });

  });

  describe('invalidAmountDataVal - INVALID DATA - VALUE', () => {

    // ANON

    test("unauthorized for anon", async () => {

      const resp = await request(app)
      .patch(`/grocery-lists/1/ingredients/100`)
      .send(invalidAmountDataVal);
      expect(resp.statusCode).toEqual(401)
      expect(resp.body.error.message).toEqual("Unauthorized - User must be logged in")

    })

    // ADMIN

    test("bad request for users - ADMIN", async () => {

      const resp = await request(app)
          .patch(`/grocery-lists/1/ingredients/100`)
          .send(invalidAmountDataVal)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.statusCode).toEqual(400)


    });

    test("not found if grocery list not found - ADMIN", async () => {

      const resp = await request(app)
          .patch(`/grocery-lists/9000/ingredients/100`)
          .send(invalidAmountDataVal)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.statusCode).toEqual(404);
      expect(resp.body.error.message).toEqual("Not Found - No grocery list: 9000")

    });

    test("bad request if grocery list id not integer - ADMIN", async () => {

      const resp = await request(app)
          .patch(`/grocery-lists/nope/ingredients/100`)
          .send(invalidAmountDataVal)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.statusCode).toEqual(400);
      expect(resp.body.error.message).toEqual('Bad Request - Must include id like "1" or "100"')

    });

    // NOT ADMIN IS USER

    test("bad request for users - NOT ADMIN IS USER", async () => {

      const resp = await request(app)
          .patch(`/grocery-lists/1/ingredients/100`)
          .send(invalidAmountDataVal)
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.statusCode).toEqual(400)


    });

    test("bad request found if grocery list id not integer - NOT ADMIN", async () => {

      const resp = await request(app)
          .patch(`/grocery-lists/nope/ingredients/100`)
          .send(invalidAmountDataVal)
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.statusCode).toEqual(400);
      expect(resp.body.error.message).toEqual('Bad Request - Must include id like "1" or "100"')

    });

    // NOT ADMIN NOT USER

    test("unauthorized for users - NOT ADMIN NOT USER", async () => {

      const resp = await request(app)
          .patch(`/grocery-lists/6/ingredients/100`)
          .send(invalidAmountDataVal)
          .set("authorization", `Bearer ${u1Token}`);
      
      expect(resp.statusCode).toEqual(401);

    });

    test("unauthorized for users - NOT ADMIN NOT USER - grocery list does not exist", async () => {

      const resp = await request(app)
          .patch(`/grocery-lists/6/ingredients/100`)
          .send(invalidAmountDataVal)
          .set("authorization", `Bearer ${u1Token}`);
      
      expect(resp.statusCode).toEqual(401);

    });

  });

});

describe('DELETE /grocery-lists/:id/ingredients/:ingredientId', () => {

  describe('ingredientId is on that list', () => {

    // ANON

    test("unauthorized for anon", async () => {

      const resp = await request(app).delete(`/grocery-lists/1/ingredients/100`);
      expect(resp.statusCode).toEqual(401)
      expect(resp.body.error.message).toEqual("Unauthorized - User must be logged in")

    })

    // ADMIN

    test("works for users - ADMIN", async () => {

      const resp = await request(app)
          .delete(`/grocery-lists/1/ingredients/100`)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.body).toEqual(true);

    });

    test("not found if grocery list not found - ADMIN", async () => {

      const resp = await request(app)
          .delete(`/grocery-lists/9000/ingredients/100`)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.statusCode).toEqual(404);
      expect(resp.body.error.message).toEqual("Not Found - No grocery list: 9000")

    });

    test("bad request if grocery list id not integer - ADMIN", async () => {

      const resp = await request(app)
          .delete(`/grocery-lists/nope/ingredients/100`)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.statusCode).toEqual(400);
      expect(resp.body.error.message).toEqual('Bad Request - Must include id like "1" or "100"')

    });

    // NOT ADMIN IS USER

    test("works for users - NOT ADMIN IS USER", async () => {

      const resp = await request(app)
          .delete(`/grocery-lists/1/ingredients/100`)
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.body).toEqual(true);

    });

    test("bad request found if grocery list id not integer - NOT ADMIN", async () => {

      const resp = await request(app)
          .delete(`/grocery-lists/nope/ingredients/100`)
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.statusCode).toEqual(400);
      expect(resp.body.error.message).toEqual('Bad Request - Must include id like "1" or "100"')

    });

    // NOT ADMIN NOT USER

    test("unauthorized for users - NOT ADMIN NOT USER", async () => {

      const resp = await request(app)
          .delete(`/grocery-lists/6/ingredients/100`)
          .set("authorization", `Bearer ${u1Token}`);
      
      expect(resp.statusCode).toEqual(401);

    });

    test("unauthorized for users - NOT ADMIN NOT USER - grocery list does not exist", async () => {

      const resp = await request(app)
          .delete(`/grocery-lists/1/ingredients/100`)
          .set("authorization", `Bearer ${u3Token}`);
      
      expect(resp.statusCode).toEqual(401);

    });

  });

  describe('ingredientId NOT on that list', () => {

    // ANON

    test("unauthorized for anon", async () => {

      const resp = await request(app).delete(`/grocery-lists/1/ingredients/1`);
      expect(resp.statusCode).toEqual(401)
      expect(resp.body.error.message).toEqual("Unauthorized - User must be logged in")

    })

    // ADMIN

    test("works for users - ADMIN", async () => {

      const resp = await request(app)
          .delete(`/grocery-lists/1/ingredients/1`)
          .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(404)
        expect(resp.body.error.message).toEqual("No ingredient with id 1 on grocery list with id 1")

    });

    test("not found if grocery list not found - ADMIN", async () => {

      const resp = await request(app)
          .delete(`/grocery-lists/9000/ingredients/1`)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.statusCode).toEqual(404);
      expect(resp.body.error.message).toEqual("Not Found - No grocery list: 9000")

    });

    test("bad request if grocery list id not integer - ADMIN", async () => {

      const resp = await request(app)
          .delete(`/grocery-lists/nope/ingredients/1`)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.statusCode).toEqual(400);
      expect(resp.body.error.message).toEqual('Bad Request - Must include id like "1" or "100"')

    });

    // NOT ADMIN IS USER

    test("works for users - NOT ADMIN IS USER", async () => {

      const resp = await request(app)
          .delete(`/grocery-lists/1/ingredients/1`)
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.statusCode).toEqual(404)
      expect(resp.body.error.message).toEqual("No ingredient with id 1 on grocery list with id 1")

    });

    test("bad request found if grocery list id not integer - NOT ADMIN", async () => {

      const resp = await request(app)
          .delete(`/grocery-lists/nope/ingredients/1`)
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.statusCode).toEqual(400);
      expect(resp.body.error.message).toEqual('Bad Request - Must include id like "1" or "100"')

    });

    // NOT ADMIN NOT USER

    test("unauthorized for users - NOT ADMIN NOT USER", async () => {

      const resp = await request(app)
          .delete(`/grocery-lists/6/ingredients/1`)
          .set("authorization", `Bearer ${u1Token}`);
      
      expect(resp.statusCode).toEqual(401);

    });

    test("unauthorized for users - NOT ADMIN NOT USER - grocery list does not exist", async () => {

      const resp = await request(app)
          .delete(`/grocery-lists/1/ingredients/1`)
          .set("authorization", `Bearer ${u3Token}`);
      
      expect(resp.statusCode).toEqual(401);

    });

  });

})

describe('POST /grocery-lists/:id/recipes', () => {

  const groceryListInitial = {
    id: 1,
    listName: 'testlistU1-1',
    owner: 'u1',
    ingredients: [
      {
        ingredientId: 100,
        amount: 2,
        unit: 'Some Unit',
        minimumAmount: 0
      },
      {
        ingredientId: 101,
        amount: 2,
        unit: 'Some Unit',
        minimumAmount: 0
      }
    ],
    recipes: [
      { id: 1, recipeId: 11 },
      { id: 2, recipeId: 12 },
      { id: 3, recipeId: 32 }
    ]
  };

  const groceryListRecipeAddedOnceA = {
    id: 1,
    listName: 'testlistU1-1',
    owner: 'u1',
    ingredients: [
      { ingredientId: 51, amount: 3, unit: 'fillet', minimumAmount: 3 },
      { ingredientId: 52, amount: 1, unit: 'pound', minimumAmount: 1 },
      {
        ingredientId: 100,
        amount: 2,
        unit: 'Some Unit',
        minimumAmount: 0
      },
      {
        ingredientId: 101,
        amount: 2,
        unit: 'Some Unit',
        minimumAmount: 0
      }
    ],
    recipes: [
      { id: 1, recipeId: 11 },
      { id: 2, recipeId: 12 },
      { id: 3, recipeId: 32 },
      { id: 6, recipeId: 100 }
    ]
  };

  const groceryListRecipeAddedOnceB = {
    id: 1,
    listName: 'testlistU1-1',
    owner: 'u1',
    ingredients: [
      { ingredientId: 51, amount: 3, unit: 'fillet', minimumAmount: 3 },
      { ingredientId: 52, amount: 1, unit: 'pound', minimumAmount: 1 },
      {
        ingredientId: 100,
        amount: 2,
        unit: 'Some Unit',
        minimumAmount: 0
      },
      {
        ingredientId: 101,
        amount: 2,
        unit: 'Some Unit',
        minimumAmount: 0
      }
    ],
    recipes: [
      { id: 1, recipeId: 11 },
      { id: 2, recipeId: 12 },
      { id: 3, recipeId: 32 },
      { id: 7, recipeId: 100 }
    ]
  };


  const groceryListRecipeAddedTwice = {
    id: 1,
    listName: 'testlistU1-1',
    owner: 'u1',
    ingredients: [
      { ingredientId: 51, amount: 6, unit: 'fillet', minimumAmount: 6 },
      { ingredientId: 52, amount: 2, unit: 'pound', minimumAmount: 2 },
      {
        ingredientId: 100,
        amount: 2,
        unit: 'Some Unit',
        minimumAmount: 0
      },
      {
        ingredientId: 101,
        amount: 2,
        unit: 'Some Unit',
        minimumAmount: 0
      }
    ],
    recipes: [
      { id: 1, recipeId: 11 },
      { id: 2, recipeId: 12 },
      { id: 3, recipeId: 32 },
      { id: 8, recipeId: 100 },
      { id: 9, recipeId: 100 }
    ]
  };

  describe('recipeId exists', () => {

    // ANON

    test("unauthorized for anon", async () => {

      const resp = await request(app).post(`/grocery-lists/1/recipes/100`);
      expect(resp.statusCode).toEqual(401)
      expect(resp.body.error.message).toEqual("Unauthorized - User must be logged in")

    })

    // ADMIN

    test("works for users - ADMIN", async () => {

      const beforeCheck = await GroceryList.get(1)
      expect(beforeCheck).toEqual(groceryListInitial)

      const resp = await request(app)
          .post(`/grocery-lists/1/recipes/100`)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.body).toEqual(true);

      const dataCheck = await GroceryList.get(1)
      expect(dataCheck).toEqual(groceryListRecipeAddedOnceA)

    });

    test("not found if grocery list not found - ADMIN", async () => {

      const resp = await request(app)
          .post(`/grocery-lists/9000/recipes/100`)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.statusCode).toEqual(404);
      expect(resp.body.error.message).toEqual("Not Found - No grocery list: 9000")

    });

    test("bad request if grocery list id not integer - ADMIN", async () => {

      const resp = await request(app)
          .post(`/grocery-lists/nope/recipes/100`)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.statusCode).toEqual(400);
      expect(resp.body.error.message).toEqual('Bad Request - Must include id like "1" or "100"')

    });

    // NOT ADMIN IS USER

    test("works for users - NOT ADMIN IS USER", async () => {

      const beforeCheck = await GroceryList.get(1)
      expect(beforeCheck).toEqual(groceryListInitial)

      const resp = await request(app)
          .post(`/grocery-lists/1/recipes/100`)
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.body).toEqual(true);

      const dataCheck = await GroceryList.get(1)
      expect(dataCheck).toEqual(groceryListRecipeAddedOnceB)

    });

    test("works for users - NOT ADMIN IS USER - ADD SAME RECIPE TWICE", async () => {

      const beforeCheck = await GroceryList.get(1)
      expect(beforeCheck).toEqual(groceryListInitial)

      const resp1 = await request(app)
          .post(`/grocery-lists/1/recipes/100`)
          .set("authorization", `Bearer ${u1Token}`);
      const resp2 = await request(app)
          .post(`/grocery-lists/1/recipes/100`)
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp2.body).toEqual(true);

      const dataCheck = await GroceryList.get(1)
      expect(dataCheck).toEqual(groceryListRecipeAddedTwice)

    });

    test("bad request found if grocery list id not integer - NOT ADMIN", async () => {

      const resp = await request(app)
          .post(`/grocery-lists/nope/recipes/100`)
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.statusCode).toEqual(400);
      expect(resp.body.error.message).toEqual('Bad Request - Must include id like "1" or "100"')

    });

    // NOT ADMIN NOT USER

    test("unauthorized for users - NOT ADMIN NOT USER", async () => {

      const resp = await request(app)
          .post(`/grocery-lists/6/recipes/100`)
          .set("authorization", `Bearer ${u1Token}`);
      
      expect(resp.statusCode).toEqual(401);

    });

    test("unauthorized for users - NOT ADMIN NOT USER - grocery list does not exist", async () => {

      const resp = await request(app)
          .post(`/grocery-lists/1/recipes/100`)
          .set("authorization", `Bearer ${u3Token}`);
      
      expect(resp.statusCode).toEqual(401);

    });

  });

})

describe('DELETE /grocery-lists/:id/recipes', () => {

  const groceryListInitial = {
    id: 1,
    listName: 'testlistU1-1',
    owner: 'u1',
    ingredients: [
      {
        ingredientId: 100,
        amount: 2,
        unit: 'Some Unit',
        minimumAmount: 0
      },
      {
        ingredientId: 101,
        amount: 2,
        unit: 'Some Unit',
        minimumAmount: 0
      }
    ],
    recipes: [
      { id: 1, recipeId: 11 },
      { id: 2, recipeId: 12 },
      { id: 3, recipeId: 32 }
    ]
  };

  const groceryListAfterTwoAddOneDelete = {
    id: 1,
    listName: 'testlistU1-1',
    owner: 'u1',
    ingredients: [
      { ingredientId: 51, amount: 3, unit: 'fillet', minimumAmount: 3 },
      { ingredientId: 52, amount: 1, unit: 'pound', minimumAmount: 1 },
      {
        ingredientId: 100,
        amount: 2,
        unit: 'Some Unit',
        minimumAmount: 0
      },
      {
        ingredientId: 101,
        amount: 2,
        unit: 'Some Unit',
        minimumAmount: 0
      }
    ],
    recipes: [
      { id: 1, recipeId: 11 },
      { id: 2, recipeId: 12 },
      { id: 3, recipeId: 32 },
      { id: 13, recipeId: 100 }
    ]
  }

  describe('recipeId exists', () => {

    // ANON

    test("unauthorized for anon", async () => {

      const resp = await request(app).delete(`/grocery-lists/1/recipes/100`);
      expect(resp.statusCode).toEqual(401)
      expect(resp.body.error.message).toEqual("Unauthorized - User must be logged in")

    })

    // ADMIN

    test("works for users - ADMIN", async () => {

      await request(app)
          .post(`/grocery-lists/1/recipes/100`)
          .set("authorization", `Bearer ${adminToken}`);

      const resp = await request(app)
          .delete(`/grocery-lists/1/recipes/100`)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.statusCode).toEqual(200)
      expect(resp.body).toEqual(true)

      const dataCheck = await GroceryList.get(1)
      expect(dataCheck).toEqual(groceryListInitial)

    });

    test("not found if grocery list not found - ADMIN", async () => {

      const resp = await request(app)
          .delete(`/grocery-lists/9000/recipes/100`)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.statusCode).toEqual(404);
      expect(resp.body.error.message).toEqual("Not Found - No grocery list: 9000")

    });

    test("bad request if grocery list id not integer - ADMIN", async () => {

      const resp = await request(app)
          .delete(`/grocery-lists/nope/recipes/100`)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.statusCode).toEqual(400);
      expect(resp.body.error.message).toEqual('Bad Request - Must include id like "1" or "100"')

    });

    // NOT ADMIN IS USER

    test("works for users - NOT ADMIN IS USER", async () => {

      await request(app)
      .post(`/grocery-lists/1/recipes/100`)
      .set("authorization", `Bearer ${u1Token}`);

      const resp = await request(app)
          .delete(`/grocery-lists/1/recipes/100`)
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.statusCode).toEqual(200)
      expect(resp.body).toEqual(true)

      const dataCheck = await GroceryList.get(1)
      expect(dataCheck).toEqual(groceryListInitial)

    });

    test("works for users - NOT ADMIN IS USER - DELETED IF SAME RECIPE PREVIOUSLY ADDED TWICE", async () => {

      await request(app)
      .post(`/grocery-lists/1/recipes/100`)
      .set("authorization", `Bearer ${u1Token}`);

      await request(app)
      .post(`/grocery-lists/1/recipes/100`)
      .set("authorization", `Bearer ${u1Token}`);

      const resp = await request(app)
          .delete(`/grocery-lists/1/recipes/100`)
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.statusCode).toEqual(200)
      expect(resp.body).toEqual(true)

      const dataCheck = await GroceryList.get(1)
      expect(dataCheck).toEqual(groceryListAfterTwoAddOneDelete)


    });

    test("bad request found if grocery list id not integer - NOT ADMIN", async () => {

      const resp = await request(app)
          .delete(`/grocery-lists/nope/recipes/100`)
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.statusCode).toEqual(400);
      expect(resp.body.error.message).toEqual('Bad Request - Must include id like "1" or "100"')

    });

    // NOT ADMIN NOT USER

    test("unauthorized for users - NOT ADMIN NOT USER", async () => {

      const resp = await request(app)
          .delete(`/grocery-lists/6/recipes/100`)
          .set("authorization", `Bearer ${u1Token}`);
      
      expect(resp.statusCode).toEqual(401);

    });

    test("unauthorized for users - NOT ADMIN NOT USER - grocery list does not exist", async () => {

      const resp = await request(app)
          .delete(`/grocery-lists/1/recipes/100`)
          .set("authorization", `Bearer ${u3Token}`);
      
      expect(resp.statusCode).toEqual(401);

    });

  });

})

// add expectations to post routes that use GroceryList to confirm correct data