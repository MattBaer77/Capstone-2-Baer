"use strict";

const request = require("supertest")

const db = require("../db.js");
const app = require("../app");

const User = require("../models/user");
// BRING IN SPOON MODEL - MOCK SPOON MODEL - ADD FUNCTIONALITY TO ROUTES:
/**
 * IF NO USER CACHE AT DATABASE - GET USER CACHE AT SPOON MODEL
 * 
 *  - (***OPTIONAL - SAVE CACHE TO DATABASE***) - (Will need to set up helper to troll at regular intervals and delete user caches.)
 *  - OR MAY NOT NEED TO SAVE CACHE TO DATABASE - START WITH THIS ASSUMPTION
 * 
 *  - SERVE USER-SPECIFIC CACHE TO FRONT END - WITH TIMER?
 * 
 *  - MUST FIRST ADD USER-SPECIFIC CACHE FUNCTIONALITY TO SPOON MODEL
 *  - MUST THEN ADD TEST CASES FOR:
 * 
 *  - GET ROUTES - /:username, /:username/details, /:username/cache, /:username, 
 */

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
        expect(resp.body.error.message).toEqual("No user: nope")

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
        expect(resp.body.error.message).toEqual("No user: nope")

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

});

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

        });
    });

    test("works set new password - ADMIN", async () => {

        const resp = await request(app)
        .patch(`/users/u2`)
        .send({
            password: "new-password",
        })
        .set("authorization", `Bearer ${adminToken}`);
        expect(resp.body).toEqual({

            user: {

                username: "u2",
                firstName: "U2F",
                lastName: "U2L",
                email: "u2@email.com",
                isAdmin: false,

            }

        })

        const isSuccessful = await User.authenticate("u2","new-password");
        expect(isSuccessful).toBeTruthy();

    });

    test("not found if no such user - ADMIN", async () => {

        const resp = await request(app)
        .patch(`/users/nope`)
        .send({
            firstName: "New",
        })
        .set("authorization", `Bearer ${adminToken}`);

        expect(resp.statusCode).toEqual(404);
        expect(resp.body.error.message).toEqual("No user: nope")

    });

    test("bad request if invalid data - ADMIN", async () => {

        const resp = await request(app)
        .patch(`/users/u2`)
        .send({
            firstName: 42
        })
        .set("authorization", `Bearer ${adminToken}`);

        expect(resp.statusCode).toEqual(400);

    });

    test("bad request if invalid data - additional fields (change isAdmin) - ADMIN", async () => {

        const resp = await request(app)
        .patch(`/users/u2`)
        .send({
            firstName: "New",
            isAdmin: true
        })
        .set("authorization", `Bearer ${adminToken}`);

        expect(resp.statusCode).toEqual(400);

    });

    // NOT ADMIN IS USER

    test("works for users - SAME USER", async () => {

        const resp = await request(app)
        .patch(`/users/u1`)
        .send({
            firstName: "New"
        })
        .set("authorization", `Bearer ${u1Token}`);

        expect(resp.body).toEqual({

            user: {

                username: "u1",
                firstName: "New",
                lastName: "U1L",
                email: "u1@email.com",
                isAdmin: false,

            }

        });
    });

    test("works set new password - SAME USER", async () => {

        const resp = await request(app)
        .patch(`/users/u1`)
        .send({
            password: "new-password",
        })
        .set("authorization", `Bearer ${u1Token}`);
        expect(resp.body).toEqual({

            user: {

                username: "u1",
                firstName: "U1F",
                lastName: "U1L",
                email: "u1@email.com",
                isAdmin: false,

            }

        })

        const isSuccessful = await User.authenticate("u1","new-password");
        expect(isSuccessful).toBeTruthy();

    });

    test("unauthorized if no such user - SAME USER", async () => {

        const resp = await request(app)
        .patch(`/users/nope`)
        .send({
            firstName: "New",
        })
        .set("authorization", `Bearer ${u1Token}`);

        expect(resp.statusCode).toEqual(401);

    });

    test("bad request if invalid data - SAME USER", async () => {

        const resp = await request(app)
        .patch(`/users/u1`)
        .send({
            firstName: 42
        })
        .set("authorization", `Bearer ${u1Token}`);

        expect(resp.statusCode).toEqual(400);

    });

    test("bad request if invalid data - additional fields (change isAdmin) - SAME USER", async () => {

        const resp = await request(app)
        .patch(`/users/u1`)
        .send({
            firstName: "New",
            isAdmin: true
        })
        .set("authorization", `Bearer ${u1Token}`);

        expect(resp.statusCode).toEqual(400);

    });

    // NOT ADMIN NOT USER

    test("unauthorized for users - OTHER USER", async () => {

        const resp = await request(app)
        .patch(`/users/u2`)
        .send({
            firstName: "New"
        })
        .set("authorization", `Bearer ${u1Token}`);

        expect(resp.statusCode).toEqual(401)


    });

    test("unauthorized set new password - OTHER USER", async () => {

        const resp = await request(app)
        .patch(`/users/u2`)
        .send({
            password: "new-password",
        })
        .set("authorization", `Bearer ${u1Token}`);

        expect(resp.statusCode).toEqual(401)

        try {
            await User.authenticate("u1","new-password")
        } catch (e) {
            expect(e.message).toEqual("Invalid username/password")
        }

    });

    test("unauthorized if no such user - OTHER USER", async () => {

        const resp = await request(app)
        .patch(`/users/nope`)
        .send({
            firstName: "New",
        })
        .set("authorization", `Bearer ${u1Token}`);

        expect(resp.statusCode).toEqual(401);

    });

    test("unauthorized request if invalid data - OTHER USER", async () => {

        const resp = await request(app)
        .patch(`/users/u2`)
        .send({
            firstName: 42
        })
        .set("authorization", `Bearer ${u1Token}`);

        expect(resp.statusCode).toEqual(401);

    });

    test("unauthorized if invalid data - additional fields (change isAdmin) - SAME USER", async () => {

        const resp = await request(app)
        .patch(`/users/u2`)
        .send({
            firstName: "New",
            isAdmin: true
        })
        .set("authorization", `Bearer ${u1Token}`);

        expect(resp.statusCode).toEqual(401);

    });

});

// DELETE USER

describe("DELETE /users/:username", () => {

    // ANON

    test("unauthorized for anon", async () => {

        const resp = await request(app)
        .delete(`/users/u1`);

        expect(resp.statusCode).toEqual(401);

    });

    // ADMIN

    test("works for users - ADMIN", async () => {

        const resp = await request(app)
        .delete(`/users/u1`)
        .set("authorization", `Bearer ${adminToken}`);
        expect(resp.body).toEqual(true);

    });

    test("not found if user missing - ADMIN", async() => {

        const resp = await request(app)
        .delete(`/users/nope`)
        .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(404);
        expect(resp.body.error.message).toEqual("No user: nope")

    });

    // NOT ADMIN IS USER

    test("works for users - NOT ADMIN IS USER", async () => {

        const resp = await request(app)
        .delete(`/users/u1`)
        .set("authorization", `Bearer ${u1Token}`);
        expect(resp.body).toEqual(true);

    });

    test("unauthorized found if user missing - NOT ADMIN IS USER", async() => {

        const resp = await request(app)
        .delete(`/users/nope`)
        .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(401);

    });

    // NOT ADMIN NOT USER

    test("unauthorized for - NOT ADMIN NOT USER", async () => {

        const resp = await request(app)
        .delete(`/users/u2`)
        .set("authorization", `Bearer ${u1Token}`);

        expect(resp.statusCode).toEqual(401);

    });

});


// **********

// GET USER WITH CACHE

describe('GET /users/username/cache', () => {

    // ANON

    test("unauth for anon", async () => {

        const resp = await request(app).get(`/users/u1/cache`);
        expect(resp.statusCode).toEqual(401)
        expect(resp.body.error.message).toEqual("Unauthorized - Must be Admin or Effected User")

    })

    // ADMIN

    test("works for users - ADMIN", async () => {

        const resp = await request(app)
            .get(`/users/u1/cache`)
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
                isAdmin: false,
                lastName: "U1L",
                username: "u1",

            },
        });
    });

    test("not found if user not found - ADMIN", async () => {

        const resp = await request(app)
            .get(`/users/nope/cache`)
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(404);
        expect(resp.body.error.message).toEqual("No user: nope")

    });

    // NOT ADMIN IS USER

    test("works for users - NOT ADMIN IS USER", async () => {

        const resp = await request(app)
            .get(`/users/u1/cache`)
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
                isAdmin: false,
                lastName: "U1L",
                username: "u1",

            },
        });
    });

    // NOT ADMIN NOT USER

    test("unauth for users - NOT ADMIN NOT USER", async () => {

        const resp = await request(app)
            .get(`/users/u2/cache`)
            .set("authorization", `Bearer ${u1Token}`);
        
        expect(resp.statusCode).toEqual(401);

    });

    test("unauth for users - NOT ADMIN NOT USER", async () => {

        const resp = await request(app)
            .get(`/users/nope/cache`)
            .set("authorization", `Bearer ${u1Token}`);
        
        expect(resp.statusCode).toEqual(401);

    });

})

// GET CACHE

describe('GET /users/username/cache-only', () => {

    // ANON

    test("unauth for anon", async () => {

        const resp = await request(app).get(`/users/u1/cache-only`);
        expect(resp.statusCode).toEqual(401)
        expect(resp.body.error.message).toEqual("Unauthorized - Must be Admin or Effected User")

    })

    // ADMIN

    test("works for users - ADMIN", async () => {

        const resp = await request(app)
            .get(`/users/u1/cache-only`)
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.body).toEqual({

            cache:{
                data: {
                    faux: "json",
                    some: "more",
                },
            }

        });
    });

    test("not found if user not found - ADMIN", async () => {

        const resp = await request(app)
            .get(`/users/nope/cache-only`)
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(404);
        expect(resp.body.error.message).toEqual("No user: nope")

    });

    // NOT ADMIN IS USER

    test("works for users - NOT ADMIN IS USER", async () => {

        const resp = await request(app)
            .get(`/users/u1/cache-only`)
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.body).toEqual({

            cache:{
                data: {
                    faux: "json",
                    some: "more",
                },
            }

        });
    });

    // NOT ADMIN NOT USER

    test("unauth for users - NOT ADMIN NOT USER", async () => {

        const resp = await request(app)
            .get(`/users/u2/cache-only`)
            .set("authorization", `Bearer ${u1Token}`);
        
        expect(resp.statusCode).toEqual(401);

    });

    test("unauth for users - NOT ADMIN NOT USER", async () => {

        const resp = await request(app)
            .get(`/users/nope/cache-only`)
            .set("authorization", `Bearer ${u1Token}`);
        
        expect(resp.statusCode).toEqual(401);

    });

})

// SET CACHE

// CLEAR CACHE

// ADD INTOLERANCE

// REMOVE INTOLERANCE