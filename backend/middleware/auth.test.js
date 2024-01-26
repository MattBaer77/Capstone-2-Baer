"use strict";

const jwt = require("jsonwebtoken");

const ExpressError = require("../expressError");

const {

    authenticateJWT,
    ensureUserLoggedIn,
    ensureAdminLoggedIn,
    ensureAdminOrEffectedUser

} = require("./auth");

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

    test("works: - throws error if no user", () => {

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

    test("works: - throws error if not Admin", () => {

        expect.assertions(1)

        const req = {headers: {}};

        const res = {locals:{
            
            user:{
                username:"test",
                isAdmin: false
            }

        }};

        const next =  function(e) {

            expect(e instanceof ExpressError).toBeTruthy();

        }

        ensureAdminLoggedIn(req, res, next);


    });

    test("works: - throws error if no user", () => {

        expect.assertions(1)

        const req = {headers: {}};

        const res = {locals:{}};

        const next =  function(e) {

            expect(e instanceof ExpressError).toBeTruthy();

        }

        ensureAdminLoggedIn(req, res, next);


    });

});