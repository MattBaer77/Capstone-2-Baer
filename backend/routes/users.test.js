"use strict";

const request = require("supertest")

const db = require("../db.js");
const app = require("../app");

const User = require("../models/user");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1Token,
    adminToken,
} = require("./_testCommon");
  
beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// GET USER

describe('GET /users/username', () => {

    // ANON

    test("unauth for anon", async () => {

        const resp = await request(app).get(`/users/u1`);
        expect(resp.statusCode).toEqual(401)
        expect(resp.body.error.message).toEqual("Unauthorized - Must be Admin or Effected User")

    })

    // ADMIN

    test("works for users - ADMIN", async () => {

        const resp = await request(app)
            .get(`/users/u1`)
            .set("authorization", `Bearer ${adminToken}`);
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

    test("not found if user not found - ADMIN", async () => {

        const resp = await request(app)
            .get(`/users/nope`)
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(404);

    });

    // NOT ADMIN IS USER

    test("works for users - NOT ADMIN IS USER", async () => {

        const resp = await request(app)
            .get(`/users/u1`)
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

    test("unauth for users - NOT ADMIN NOT USER", async () => {

        const resp = await request(app)
            .get(`/users/u2`)
            .set("authorization", `Bearer ${u1Token}`);
        
        expect(resp.statusCode).toEqual(401);

    });

    test("unauth for users - NOT ADMIN NOT USER", async () => {

        const resp = await request(app)
            .get(`/users/nope`)
            .set("authorization", `Bearer ${u1Token}`);
        
        expect(resp.statusCode).toEqual(401);

    });

})


// GET USER WITH CACHE AND INTOLERANCES

describe('GET /users/username/details', () => {

    // ANON

    test("unauth for anon", async () => {

        const resp = await request(app).get(`/users/u1/details`);
        expect(resp.statusCode).toEqual(401)
        expect(resp.body.error.message).toEqual("Unauthorized - Must be Admin or Effected User")

    })

    // ADMIN

    test("works for users - ADMIN", async () => {

        const resp = await request(app)
            .get(`/users/u1/details`)
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.body).toEqual({
            user: {

                cache:{

                    data: {
                        faux: "json",
                        some: "more",
                    },

                },
                email: "u1@email.com",
                firstName: "U1F",
                intolerances:[
                    {
                        intoleranceId: 2,
                        intoleranceName: "egg",
                    },
                    {
                        intoleranceId: 3,
                        intoleranceName: "gluten",
                    },
                ],
                isAdmin: false,
                lastName: "U1L",
                username: "u1",

            },
        });
    });

    test("not found if user not found - ADMIN", async () => {

        const resp = await request(app)
            .get(`/users/nope/details`)
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(404);

    });

    // NOT ADMIN IS USER

    test("works for users - NOT ADMIN IS USER", async () => {

        const resp = await request(app)
            .get(`/users/u1/details`)
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.body).toEqual({
            user: {

                cache:{

                    data: {
                        faux: "json",
                        some: "more",
                    },

                },
                email: "u1@email.com",
                firstName: "U1F",
                intolerances:[
                    {
                        intoleranceId: 2,
                        intoleranceName: "egg",
                    },
                    {
                        intoleranceId: 3,
                        intoleranceName: "gluten",
                    },
                ],
                isAdmin: false,
                lastName: "U1L",
                username: "u1",

            },
        });
    });

    // NOT ADMIN NOT USER

    test("unauth for users - NOT ADMIN NOT USER", async () => {

        const resp = await request(app)
            .get(`/users/u2/details`)
            .set("authorization", `Bearer ${u1Token}`);
        
        expect(resp.statusCode).toEqual(401);

    });

    test("unauth for users - NOT ADMIN NOT USER", async () => {

        const resp = await request(app)
            .get(`/users/nope/details`)
            .set("authorization", `Bearer ${u1Token}`);
        
        expect(resp.statusCode).toEqual(401);

    });

})

// PATCH USER

describe("PATCH /users/:username", () => {

    // ANON

    test("unauth for anon", async () => {

        const resp = await request(app)
        .patch(`/users/u1`)
        .send({
            firstName: "New",
        });

        expect(resp.statusCode).toEqual(401);

    })

    // ADMIN

    test("works for users - ADMIN", async () => {

        const resp = await request(app)
        .patch(`/users/u2`)
        .send({
            firstName: "New"
        })
        .set("authorization", `Bearer ${adminToken}`);

        expect(resp.body).toEqual({

            user: {

                username: "u2",
                firstName: "New",
                lastName: "U2L",
                email: "u2@email.com",
                isAdmin: false,

            }

        })
    })

    // NOT ADMIN IS USER

    // NOT ADMIN NOT USER

});

// DELETE USER

// **********

// GET USER WITH CACHE

// GET CACHE

// SET CACHE

// CLEAR CACHE

