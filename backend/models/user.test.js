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

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// findAll

describe("findAll", () => {

    test("works", async() => {

        const users = await User.findAll();

        expect(users).toEqual([

            {
                "username": "u1",
                "firstName": "U1F",
                "lastName": "U1L",
                "email": "u1@email.com",
                "isAdmin": false
            },
            {
                "username": "u2",
                "firstName": "U2F",
                "lastName": "U2L",
                "email": "u2@email.com",
                "isAdmin": false
            },
            {
                "username": "u3",
                "firstName": "U3F",
                "lastName": "U3L",
                "email": "u3@email.com",
                "isAdmin": false
            },
            {
                "username": "uA",
                "firstName": "UAF",
                "lastName": "UAL",
                "email": "uA@email.com",
                "isAdmin": true
            },
            {
                "username": "uAB",
                "firstName": "UABF",
                "lastName": "UABL",
                "email": "uAB@email.com",
                "isAdmin": true
            }
 
        ]);

    }); 

});