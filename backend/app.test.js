const request = require("supertest");

require("./models/spoonModelTestSetup.js")
const app = require("./app");
const db = require("./db");

test("not found for site 404", async function () {

    const resp = await request(app).get("/no-such-path");
    expect(resp.statusCode).toEqual(404);

});

test("not found for site 404 (test stack print)", async function () {

    const consoleErrorSpy = jest.spyOn(console, 'error');

    process.env.NODE_ENV = "";
    const resp = await request(app).get("/no-such-path");
    expect(resp.statusCode).toEqual(404);

    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Error: Not Found!!!'))

    delete process.env.NODE_ENV;

});

afterAll(function () {
    db.end();
  });