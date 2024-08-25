"use strict";

const request = require("supertest");

const db = require("../db.js");

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
 *  - GET ROUTES - /:username/details, /:username/cache, /:username/cache-only, 
*/

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

const app = require("../app");

// GET USER

describe('GET /users/:username', () => {

    // ANON

    test("unauthorized for anon", async () => {

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

    test("unauthorized for users - NOT ADMIN NOT USER", async () => {

        const resp = await request(app)
            .get(`/users/u2`)
            .set("authorization", `Bearer ${u1Token}`);
        
        expect(resp.statusCode).toEqual(401);

    });

    test("unauthorized for users - NOT ADMIN NOT USER", async () => {

        const resp = await request(app)
            .get(`/users/nope`)
            .set("authorization", `Bearer ${u1Token}`);
        
        expect(resp.statusCode).toEqual(401);

    });

})


// GET USER WITH CACHE AND INTOLERANCES

describe('GET /users/:username/details', () => {

    // ANON

    test("unauthorized for anon", async () => {

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

                    faux: "json",
                    some: "more",

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

    test("works for users - ADMIN - user has no cache", async () => {

        const resp = await request(app)
            .get(`/users/u3/details`)
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.body).toEqual({
            user: {

                cache:mockResponseGetRandomRecipes.recipes,
                email: "u3@email.com",
                firstName: "U3F",
                intolerances:[],
                isAdmin: false,
                lastName: "U3L",
                username: "u3",

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

                    faux: "json",
                    some: "more",

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

    test("works for users - NOT ADMIN IS USER - user has no cache", async () => {

        const resp = await request(app)
            .get(`/users/u3/details`)
            .set("authorization", `Bearer ${u3Token}`);
        expect(resp.body).toEqual({
            user: {

                cache:mockResponseGetRandomRecipes.recipes,
                email: "u3@email.com",
                firstName: "U3F",
                intolerances:[],
                isAdmin: false,
                lastName: "U3L",
                username: "u3",

            },
        });
    });

    // NOT ADMIN NOT USER

    test("unauthorized for users - NOT ADMIN NOT USER", async () => {

        const resp = await request(app)
            .get(`/users/u2/details`)
            .set("authorization", `Bearer ${u1Token}`);
        
        expect(resp.statusCode).toEqual(401);

    });

    test("unauthorized for users - NOT ADMIN NOT USER", async () => {

        const resp = await request(app)
            .get(`/users/nope/details`)
            .set("authorization", `Bearer ${u1Token}`);
        
        expect(resp.statusCode).toEqual(401);

    });

});

// PATCH USER

describe("PATCH /users/:username", () => {

    // ANON

    test("unauthorized for anon", async () => {

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

describe('GET /users/:username/cache', () => {

    // ANON

    test("unauthorized for anon", async () => {

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
                    faux: "json",
                    some: "more",
                },
                email: "u1@email.com",
                firstName: "U1F",
                isAdmin: false,
                lastName: "U1L",
                username: "u1",

            },
        });
    });

    test("works for users - ADMIN - user has no cache", async () => {

        const resp = await request(app)
            .get(`/users/u3/cache`)
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.body).toEqual({
            user: {

                cache: mockResponseGetRandomRecipes.recipes,
                email: "u3@email.com",
                firstName: "U3F",
                isAdmin: false,
                lastName: "U3L",
                username: "u3",

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
                    faux: "json",
                    some: "more",
                },
                email: "u1@email.com",
                firstName: "U1F",
                isAdmin: false,
                lastName: "U1L",
                username: "u1",

            },
        });
    });

    test("works for users - NOT ADMIN IS USER - no cache", async () => {

        const resp = await request(app)
            .get(`/users/u3/cache`)
            .set("authorization", `Bearer ${u3Token}`);
        expect(resp.body).toEqual({
            user: {

                cache: mockResponseGetRandomRecipes.recipes,
                email: "u3@email.com",
                firstName: "U3F",
                isAdmin: false,
                lastName: "U3L",
                username: "u3",

            },
        });
    });

    // NOT ADMIN NOT USER

    test("unauthorized for users - NOT ADMIN NOT USER", async () => {

        const resp = await request(app)
            .get(`/users/u2/cache`)
            .set("authorization", `Bearer ${u1Token}`);
        
        expect(resp.statusCode).toEqual(401);

    });

    test("unauthorized for users - NOT ADMIN NOT USER", async () => {

        const resp = await request(app)
            .get(`/users/nope/cache`)
            .set("authorization", `Bearer ${u1Token}`);
        
        expect(resp.statusCode).toEqual(401);

    });

})

// GET CACHE

describe('GET /users/:username/cache-only', () => {

    // ANON

    test("unauthorized for anon", async () => {

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

            faux: "json",
            some: "more",

        });
    });

    test("works for users - ADMIN - user has no cache", async () => {

        const resp = await request(app)
            .get(`/users/u3/cache-only`)
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.body).toEqual(

            mockResponseGetRandomRecipes.recipes

        );
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

                faux: "json",
                some: "more",

        });
    });

    test("works for users - NOT ADMIN IS USER - user has no cache", async () => {

        const resp = await request(app)
            .get(`/users/u3/cache-only`)
            .set("authorization", `Bearer ${u3Token}`);
        expect(resp.body).toEqual(

            mockResponseGetRandomRecipes.recipes

        );
    });

    // NOT ADMIN NOT USER

    test("unauthorized for users - NOT ADMIN NOT USER", async () => {

        const resp = await request(app)
            .get(`/users/u2/cache-only`)
            .set("authorization", `Bearer ${u1Token}`);
        
        expect(resp.statusCode).toEqual(401);

    });

    test("unauthorized for users - NOT ADMIN NOT USER", async () => {

        const resp = await request(app)
            .get(`/users/nope/cache-only`)
            .set("authorization", `Bearer ${u1Token}`);
        
        expect(resp.statusCode).toEqual(401);

    });

})

// SET CACHE

// CLEAR CACHE

// ADD INTOLERANCE

describe('/POST /users/:username/intolerances/:intoleranceId', () => {

    const userInitial = {

        cache:{data: {

            faux: "json",
            some: "more",

        }},
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

    }

    const userIntoleranceAdded = {

        cache:{data:{

            faux: "json",
            some: "more",

        }},
        email: "u1@email.com",
        firstName: "U1F",
        intolerances:[
            {
                intoleranceId: 1,
                intoleranceName: "dairy",
            },
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

    }

    // ANON

    test("unauthorized for anon", async () => {

        const resp = await request(app).post(`/users/u1/intolerances/1`);
        expect(resp.statusCode).toEqual(401)
        expect(resp.body.error.message).toEqual("Unauthorized - Must be Admin or Effected User")
    
    });

    // ADMIN

    test("works for users - ADMIN", async () => {

        const beforeCheck = await User.getWithCacheAndIntolerances('u1')
        expect(beforeCheck).toEqual(userInitial)

        const resp = await request(app)
            .post(`/users/u1/intolerances/1`)
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.body).toEqual({username:userIntoleranceAdded.username , intolerances: userIntoleranceAdded.intolerances})

        const dataCheck = await User.getWithCacheAndIntolerances('u1')
        expect(dataCheck).toEqual(userIntoleranceAdded)

    });

    test("not found if user not found - ADMIN", async () => {

        const resp = await request(app)
            .post(`/users/uX/intolerances/1`)
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(404);
        expect(resp.body.error.message).toEqual("No User: uX")

    })

    test("not found if intolerance not found - ADMIN", async () => {

        const resp = await request(app)
            .post(`/users/u1/intolerances/9000`)
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(404);
        expect(resp.body.error.message).toEqual("No Intolerance with id of 9000")

    })

    // NOT ADMIN IS USER

    test("works for users - NOT ADMIN IS USER", async () => {

        const beforeCheck = await User.getWithCacheAndIntolerances('u1')
        expect(beforeCheck).toEqual(userInitial)

        const resp = await request(app)
            .post(`/users/u1/intolerances/1`)
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.body).toEqual({username:userIntoleranceAdded.username , intolerances: userIntoleranceAdded.intolerances})

        const dataCheck = await User.getWithCacheAndIntolerances('u1')
        expect(dataCheck).toEqual(userIntoleranceAdded)

    });

    test("not found if intolerance not found - NOT ADMIN IS USER", async () => {

        const resp = await request(app)
            .post(`/users/u1/intolerances/9000`)
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(404);
        expect(resp.body.error.message).toEqual("No Intolerance with id of 9000")

    })

    // NOT ADMIN NOT USER

    test("unauthorized for users - NOT ADMIN NOT USER", async () => {

        const resp = await request(app).post(`/users/u2/intolerances/1`);
        expect(resp.statusCode).toEqual(401)
        expect(resp.body.error.message).toEqual("Unauthorized - Must be Admin or Effected User")
    
    });

})

// REMOVE INTOLERANCE

describe('/DELETE /users/:username/intolerances/:intoleranceId', () => {

    const userInitial = {

        cache:{data: {

            faux: "json",
            some: "more",

        }},
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

    }

    const userIntoleranceDeleted = {

        cache:{data:{

            faux: "json",
            some: "more",

        }},
        email: "u1@email.com",
        firstName: "U1F",
        intolerances:[
            {
                intoleranceId: 3,
                intoleranceName: "gluten",
            },
        ],
        isAdmin: false,
        lastName: "U1L",
        username: "u1",

    }

    // ANON

    test("unauthorized for anon", async () => {

        const resp = await request(app).delete(`/users/u1/intolerances/2`);
        expect(resp.statusCode).toEqual(401)
        expect(resp.body.error.message).toEqual("Unauthorized - Must be Admin or Effected User")
    
    });

    // ADMIN

    test("works for users - ADMIN", async () => {

        const beforeCheck = await User.getWithCacheAndIntolerances('u1')
        expect(beforeCheck).toEqual(userInitial)

        const resp = await request(app)
            .delete(`/users/u1/intolerances/2`)
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.body).toEqual({username:userIntoleranceDeleted.username , intolerances: userIntoleranceDeleted.intolerances})

        const dataCheck = await User.getWithCacheAndIntolerances('u1')
        expect(dataCheck).toEqual(userIntoleranceDeleted)

    });

    test("not found if user not found - ADMIN", async () => {

        const resp = await request(app)
            .delete(`/users/uX/intolerances/2`)
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(404);
        expect(resp.body.error.message).toEqual("No intolerance: 2 or user:uX")

    })

    test("not found if intolerance not found (VALID INTOLERANCE) - ADMIN", async () => {

        const resp = await request(app)
            .delete(`/users/u1/intolerances/4`)
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(404);
        expect(resp.body.error.message).toEqual("No intolerance: 4 or user:u1")

    })

    test("not found if intolerance not found (NOT VALID INTOLERANCE) - ADMIN", async () => {

        const resp = await request(app)
            .delete(`/users/u1/intolerances/9000`)
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(404);
        expect(resp.body.error.message).toEqual("No intolerance: 9000 or user:u1")

    })

    // NOT ADMIN IS USER

    test("works for users - NOT ADMIN IS USER", async () => {

        const beforeCheck = await User.getWithCacheAndIntolerances('u1')
        expect(beforeCheck).toEqual(userInitial)

        const resp = await request(app)
            .delete(`/users/u1/intolerances/2`)
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.body).toEqual({username:userIntoleranceDeleted.username , intolerances: userIntoleranceDeleted.intolerances})

        const dataCheck = await User.getWithCacheAndIntolerances('u1')
        expect(dataCheck).toEqual(userIntoleranceDeleted)

    });

    test("not found if intolerance not found (VALID INTOLERANCE) - NOT ADMIN IS USER", async () => {

        const resp = await request(app)
            .delete(`/users/u1/intolerances/4`)
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(404);
        expect(resp.body.error.message).toEqual("No intolerance: 4 or user:u1")

    })

    test("not found if intolerance not found (NOT VALID INTOLERANCE) - NOT ADMIN IS USER", async () => {

        const resp = await request(app)
            .delete(`/users/u1/intolerances/9000`)
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(404);
        expect(resp.body.error.message).toEqual("No intolerance: 9000 or user:u1")

    })

    // NOT ADMIN NOT USER

    test("unauthorized for users - NOT ADMIN NOT USER", async () => {

        const resp = await request(app).delete(`/users/u2/intolerances/1`);
        expect(resp.statusCode).toEqual(401)
        expect(resp.body.error.message).toEqual("Unauthorized - Must be Admin or Effected User")
    
    });

})