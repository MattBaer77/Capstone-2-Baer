"use strict";

const request = require("supertest")

const db = require("../db.js");
const app = require("../app");


const {

    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll

} = require ("./_testCommon.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// POST TOKEN - /auth/token

describe("POST /auth/token", () => {

    test("works", async () => {

        const resp = await request(app)
                    .post("/auth/token")
                    .send({
                        username: "u1",
                        password: "password1",
                    }
        );

        expect(resp.statusCode).toEqual(200)
        expect(resp.body).toEqual({
            "token": expect.any(String),
        });

    });

    test("unauth - non-existent user", async () => {

        const resp = await request(app)
                    .post("/auth/token")
                    .send({
                        username: "no-such-user",
                        password: "password1"
                    })

        expect(resp.statusCode).toEqual(401);

    })

    test("unauth - wrong password", async () => {

        const resp = await request(app)
                    .post("/auth/token")
                    .send({
                        username: "u1",
                        password: "invalidpassword1",
                    })

        expect(resp.statusCode).toEqual(401);

    })

    test("bad request - missing data", async () => {

        const resp = await request(app)
                    .post("/auth/token")
                    .send({
                        username: "u1",
                    })

        expect(resp.statusCode).toEqual(400);

    })

    test("bad request - invalid data", async () => {

        const resp = await request(app)
                    .post("/auth/token")
                    .send({
                        username: 55,
                        password: "password1"
                    })

        expect(resp.statusCode).toEqual(400);

    })

})

// POST TOKEN - /auth/register

describe("POST /auth/register", () => {

    test("works for anon", async () => {

        const resp = await request(app).post("/auth/register").send(
            {
                username: "newuser",
                firstName: "Test",
                lastName: "Tester",
                password: "testpass1",
                email: "test@test.com",
            }
        );

        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            "token": expect.any(String),
        })

    })

    test("bad request - missing fields", async () => {

        const resp = await request(app).post("/auth/register").send(
            {
                username: "newuser",
                firstName: "Test",
                lastName: "Tester",
                password: "testpass1",
            }
        );

        expect(resp.statusCode).toEqual(400);

    })

    test("bad request - invalid username", async () => {

        const resp = await request(app).post("/auth/register").send(
            {
                username: "new",
                firstName: "Test",
                lastName: "Tester",
                password: "testpass1",
                email: "test@test.com",
            }
        );

        expect(resp.statusCode).toEqual(400);

    })

    test("bad request - invalid password", async () => {

        const resp = await request(app).post("/auth/register").send(
            {
                username: "newuser",
                firstName: "Test",
                lastName: "Tester",
                password: "no",
                email: "test@test.com",
            }
        );

        expect(resp.statusCode).toEqual(400);

    })

    test("bad request - invalid email", async () => {

        const resp = await request(app).post("/auth/register").send(
            {
                username: "newuser",
                firstName: "Test",
                lastName: "Tester",
                password: "testpass1",
                email: "notemail",
            }
        );

        expect(resp.statusCode).toEqual(400);

    })

});
