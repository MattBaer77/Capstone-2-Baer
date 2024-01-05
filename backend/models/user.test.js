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

// get - by username

describe("get", () => {

    test("works", async() => {

        let user = await User.get("u1");
        expect(user).toEqual({
          username: "u1",
          firstName: "U1F",
          lastName: "U1L",
          email: "u1@email.com",
          isAdmin: false
        });

    })

    test("not found if no such user", async function () {

        try {
          await User.get("nope");
          fail();
        } catch (err) {
          expect(err instanceof ExpressError).toBeTruthy();
        }
        
    });

});

//  authenticate

describe("authenticate", function () {

    test("works", async function () {
      const user = await User.authenticate("u1", "password1");
      expect(user).toEqual({
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "u1@email.com",
        isAdmin: false,
      });
    });
  
    test("unauth if no such user", async function () {
      try {
        await User.authenticate("nope", "password1");
        fail();
      } catch (err) {
        expect(err instanceof ExpressError).toBeTruthy();
      }
    });
  
    test("unauth if wrong password", async function () {
      try {
        await User.authenticate("u1", "wrong");
        fail();
      } catch (err) {
        expect(err instanceof ExpressError).toBeTruthy();
      }
    });

});

