"use strict";

const jwt = require("jsonwebtoken");

const ExpressError = require("../expressError");

const {

    authenticateJWT,
    ensureUserLoggedIn,
    ensureAdminLoggedIn,
    ensureAdminOrEffectedUser,
    ensureAdminOrListOwner

} = require("./auth");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
} = require("../routes/_testCommon");
  
beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

const {SECRET_KEY} = require("../config");
const testJwt = jwt.sign({ username: "test", isAdmin: false }, SECRET_KEY);
const badJwt = jwt.sign({ username: "test", isAdmin: false }, "wrong");

describe("authenticateJWT", () => {

    test("works - via header", () => {

        const req = {headers: {authorization: `Bearer ${testJwt}`}};
        const res = {locals: {}};

        const next = (e) => {
            expect(e).toBeFalsy();
        };

        authenticateJWT(req, res, next);
        expect(res.locals).toEqual({

            user: {
                iat: expect.any(Number),
                username:"test",
                isAdmin: false,
            }

        });

    });

    test("works: no header", () => {

        const req = {};
        const res = { locals: {}};

        const next = (e) => {
            expect(e).toBeFalsy();
        };

        authenticateJWT(req, res, next);
        expect(res.locals).toEqual({});

    });

    test("works: invalid token", () => {

        const req = {headers: {authorization: `Bearer ${badJwt}`}};
        const res = {locals: {}};
        const next = (e) => {
            expect(e).toBeFalsy();
        };

        authenticateJWT(req, res, next);
        expect(res.locals).toEqual({});

    });

} );

describe("ensureUserLoggedIn", () => {

    test("works: - no error if user", () => {

        expect.assertions(1)

        const req = {headers: {}};

        const res = {locals:{
            
            user:{
                username:"test",
                isAdmin: false
            }

        }};

        const next =  function(e) {

            expect(e instanceof ExpressError).toBeFalsy();

        }

        ensureUserLoggedIn(req, res, next);

    });

    test("Error: - throws error if no user", () => {

        expect.assertions(1)

        const req = {headers: {}};

        const res = {locals:{}};

        const next =  function(e) {

            expect(e instanceof ExpressError).toBeTruthy();

        }

        ensureUserLoggedIn(req, res, next);


    });

});

describe("ensureAdminLoggedIn", () => {

    test("works: - no error if Admin", () => {

        expect.assertions(1)

        const req = {headers: {}};

        const res = {locals:{
            
            user:{
                username:"test",
                isAdmin: true
            }

        }};

        const next =  function(e) {

            expect(e instanceof ExpressError).toBeFalsy();

        }

        ensureAdminLoggedIn(req, res, next);

    });

    test("Error: - throws error if not Admin", () => {

        expect.assertions(3)

        const req = {headers: {}};

        const res = {locals:{
            
            user:{
                username:"test",
                isAdmin: false
            }

        }};

        const next =  function(e) {

            expect(e instanceof ExpressError).toBeTruthy();
            expect(e.message).toEqual("Unauthorized - Admin must be logged in")
            expect(e.status).toEqual(401)

        }

        ensureAdminLoggedIn(req, res, next);


    });

    test("Error: - throws error if no user", () => {

        expect.assertions(3)

        const req = {headers: {}};

        const res = {locals:{}};

        const next =  function(e) {

            expect(e instanceof ExpressError).toBeTruthy();
            expect(e.message).toEqual("Unauthorized - Admin must be logged in")
            expect(e.status).toEqual(401)

        }

        ensureAdminLoggedIn(req, res, next);


    });

});

describe("ensureAdminOrEffectedUser", () => {

    test("works: - no error if Admin and User", () => {

        expect.assertions(1)

        const req = {headers: {}, params: {username:"test"}};

        const res = {locals:{
            
            user:{
                username:"test",
                isAdmin: true
            }

        }};

        const next =  function(e) {

            expect(e instanceof ExpressError).toBeFalsy();

        }

        ensureAdminOrEffectedUser(req, res, next);

    });

    test("works: - no error if Admin No User", () => {

        expect.assertions(1)

        const req = {headers: {}, params: {}};

        const res = {locals:{
            
            user:{
                username:"test",
                isAdmin: true
            }

        }};

        const next =  function(e) {

            expect(e instanceof ExpressError).toBeFalsy();

        }

        ensureAdminOrEffectedUser(req, res, next);

    });

    test("works: - no error if Admin Wrong User", () => {

        expect.assertions(1)

        const req = {headers: {}, params: {username: "invalid"}};

        const res = {locals:{
            
            user:{
                username:"test",
                isAdmin: true
            }

        }};

        const next =  function(e) {

            expect(e instanceof ExpressError).toBeFalsy();

        }

        ensureAdminOrEffectedUser(req, res, next);

    });

    test("works: - no error if Effected User", () => {

        expect.assertions(1)

        const req = {headers: {}, params: {username:"test"}};

        const res = {locals:{
            
            user:{
                username:"test",
                isAdmin: false
            }

        }};

        const next =  function(e) {

            expect(e instanceof ExpressError).toBeFalsy();

        }

        ensureAdminOrEffectedUser(req, res, next);

    });

    test("Error: - throws error if not Admin and Not User", () => {

        expect.assertions(3)

        const req = {headers: {}, params: {username:"invalid"}};

        const res = {locals:{
            
            user:{
                username:"test",
                isAdmin: false
            }

        }};

        const next =  function(e) {

            expect(e instanceof ExpressError).toBeTruthy();
            expect(e.message).toEqual("Unauthorized - Must be Admin or Effected User")
            expect(e.status).toEqual(401)

        }

        ensureAdminOrEffectedUser(req, res, next);


    });

    test("Error: - throws error if not Admin and No User Param", () => {

        expect.assertions(3)

        const req = {headers: {}, params:{}};

        const res = {locals:{
            
            user:{
                username:"test",
                isAdmin: false
            }

        }};

        const next =  function(e) {

            expect(e instanceof ExpressError).toBeTruthy();
            expect(e.message).toEqual("Unauthorized - Must be Admin or Effected User")
            expect(e.status).toEqual(401)

        }

        ensureAdminOrEffectedUser(req, res, next);


    });

    test("Error: - throws error if no user", () => {

        expect.assertions(3)

        const req = {headers: {}, params:{}};

        const res = {locals:{}};

        const next =  function(e) {

            expect(e instanceof ExpressError).toBeTruthy();
            expect(e.message).toEqual("Unauthorized - Must be Admin or Effected User")
            expect(e.status).toEqual(401)

        }

        ensureAdminOrEffectedUser(req, res, next);


    });

});

describe("ensureAdminOrListOwner", () => {

    test("works: - no error if Admin and Owner", () => {

        expect.assertions(1)

        const req = {headers: {}, params: {id:"7"}};

        const res = {locals:{
            
            user:{
                username:"uA",
                isAdmin: true
            }

        }};

        const next =  function(e) {

            expect(e instanceof ExpressError).toBeFalsy();

        }

        ensureAdminOrListOwner(req, res, next);

    });

    test("Error: - throws error if Admin and No Id Param", () => {

        expect.assertions(3)

        const req = {headers: {}, params:{}};

        const res = {locals:{
            
            user:{
                username:"uA",
                isAdmin: true
            }

        }};

        const next =  function(e) {

            expect(e instanceof ExpressError).toBeTruthy();
            expect(e.message).toEqual('Bad Request - Must include id like "1" or "100"')
            expect(e.status).toEqual(400)

        }

        ensureAdminOrListOwner(req, res, next);


    });

    test("works: - no error if Admin Not Owner", () => {

        expect.assertions(1)

        const req = {headers: {}, params: {id:"1"}};

        const res = {locals:{
            
            user:{
                username:"uA",
                isAdmin: true
            }

        }};

        const next =  function(e) {

            expect(e instanceof ExpressError).toBeFalsy();

        }

        ensureAdminOrListOwner(req, res, next);

    });

    test("works: - no error if Owner", () => {

        expect.assertions(1)

        const req = {headers: {}, params: {id:"1"}};

        const res = {locals:{
            
            user:{
                username:"u1",
                isAdmin: false
            }

        }};

        const next =  function(e) {

            expect(e instanceof ExpressError).toBeFalsy();

        }

        ensureAdminOrListOwner(req, res, next);

    });

    test("Error: - throws error if not Admin and Not User", () => {

        // expect.assertions(3)

        const req = {headers: {}, params: {id:"6"}};

        const res = {locals:{
            
            user:{
                username:"u1",
                isAdmin: false
            }

        }};

        const next =  function(e) {

            expect(e instanceof ExpressError).toBeTruthy();
            expect(e.message).toEqual("Unauthorized - Must be Admin or List Owner")
            expect(e.status).toEqual(401)

        }

        ensureAdminOrListOwner(req, res, next);


    });

    test("Error: - throws error if not Admin and Not User and no list with that id", () => {

        // expect.assertions(3)

        const req = {headers: {}, params: {id:"nope"}};

        const res = {locals:{
            
            user:{
                username:"u1",
                isAdmin: false
            }

        }};

        const next =  function(e) {

            expect(e instanceof ExpressError).toBeTruthy();
            expect(e.message).toEqual('Bad Request - Must include id like "1" or "100"')
            expect(e.status).toEqual(400)

        }

        ensureAdminOrListOwner(req, res, next);


    });

    test("Error: - throws error if not Admin and No Id Param", () => {

        expect.assertions(3)

        const req = {headers: {}, params:{}};

        const res = {locals:{
            
            user:{
                username:"u1",
                isAdmin: false
            }

        }};

        const next =  function(e) {

            expect(e instanceof ExpressError).toBeTruthy();
            expect(e.message).toEqual('Bad Request - Must include id like "1" or "100"')
            expect(e.status).toEqual(400)

        }

        ensureAdminOrListOwner(req, res, next);


    });

    test("Error: - throws error if no user", () => {

        expect.assertions(3)

        const req = {headers: {}, params:{}};

        const res = {locals:{}};

        const next =  function(e) {

            expect(e instanceof ExpressError).toBeTruthy();
            expect(e.message).toEqual("Unauthorized - User must be logged in")
            expect(e.status).toEqual(401)

        }

        ensureAdminOrListOwner(req, res, next);


    });

});