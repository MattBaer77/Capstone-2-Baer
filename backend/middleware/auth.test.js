"use strict";

const jwt = require("jsonwebtoken");

const ExpressError = require("../expressError");

const {

    authenticateJWT,
    ensureUserLoggedIn,
    ensureUserLoggedInAndAdmin,
    ensureUserLoggedInAdminOrEffectedUser

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

        const req = {headers: {authorizatio: `Bearer ${badJwt}`}};
        const res = {locals: {}};
        const next = (e) => {
            expect(e).toBeFalsy();
        };

        authenticateJWT(req, res, next);
        expect(res.locals).toEqual({});

    })

} );