"use strict";

const ExpressError = require("../expressError");

const db = require("../db");
const User = require("./user");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll
} = require("./_testCommon");

beforeAll(commonAfterAll);
beforeEach(commonAfterEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// findAll

describe("findAll", () => {

    test("works", async() => {

        const users = await User.findAll();

        expect(users).toEqual([

        ]);

    }); 

});