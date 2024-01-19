"use strict";

const ExpressError = require("../expressError");

const db = require("../db");

const Intolerance = require("./intolerance")

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

// findAll and order

describe("findAll", () =>{

    test("works", async() => {

        const intolerances = await Intolerance.findAll();

        expect(intolerances).toEqual([

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

        ])

    })

})