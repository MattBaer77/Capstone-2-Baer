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

    })

} );

describe("ensureUserLoggedIn", () => {

    test("works: - no error if user", () => {

        const req = {headers: {}};

        const res = {locals:{
            
            user:{
                username:"test",
                isAdmin: false
            }

        }};

        const next = jest.fn();

        try {

            ensureUserLoggedIn(req,res,next)

        } catch {

            throw new Error("Unexpected Error")

        }

        expect(next).toHaveBeenCalled();

    })

    test("works: - throws error if no user", () => {

        const req = {headers: {}};

        const res = {locals:{}};

        const next = jest.fn();

        try {

            ensureUserLoggedIn(req,res,next)

        } catch(e) {

            expect(e).toBeInstanceOf(ExpressError);
            expect(e.message).toBe("Unauthorized - User must be logged in")
            expect(e.status).toBe(401)

        }

        expect(next).not.toHaveBeenCalled();

    })

})