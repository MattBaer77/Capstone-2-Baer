"use strict";

const request = require("supertest")
const app = require("../app")

const { MiscApi } = require("../config")

//

// MOCK FOR MiscApi

jest.mock("../config")

// Mock implementation for getARandomFoodJoke
MiscApi.getARandomFoodJoke.mockImplementation((callback) => {

    // Simulate a successful API call with mock data
    callback(null, null, { body: { text: "Mocked food joke data" } });

});

// MOCK FOR MiscApi

// 

test("OK - returns Joke", async () => {

    const resp = await request(app).get("/jokes");
  
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({ text: "Mocked food joke data" });
  });
  

