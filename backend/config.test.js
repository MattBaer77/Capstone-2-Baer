"use strict";

describe("config can come from env", function () {
  test("works", function() {
    process.env.SECRET_KEY = "abc";
    process.env.PORT = "5000";
    process.env.spoonacularKey = "spoonkey";

    const config = require("./config");
    expect(config.SECRET_KEY).toEqual("abc");
    expect(config.PORT).toEqual(5000);
    expect(config.BCRYPT_WORK_FACTOR).toEqual(1);
    expect(config.getDatabaseUri()).toEqual("easyspoon_test")

    delete process.env.SECRET_KEY;
    delete process.env.PORT;
    delete process.env.spoonacularKey;

  });
})