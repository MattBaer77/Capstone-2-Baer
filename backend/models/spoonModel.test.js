"use strict";

const ExpressError = require("../expressError");

jest.mock('./spoonModel', () => {
    // Import the actual module and store it in a variable
    const originalSpoonModel = jest.requireActual('./spoonModel');

    return {
        ...originalSpoonModel,
        SpoonApi: {
            ...originalSpoonModel.SpoonApi,
            getRandomRecipes: jest.fn(),
        },
    };
});

// Test the mock (This tests nothing - just ensure code works to test in this commit)
// Now you can safely import SpoonApi from the mock
const { SpoonApi } = require('./spoonModel');

describe("getRandomRecipes Mock Test", () => {

    test("mock test works", async () => {

        SpoonApi.getRandomRecipes.mockReturnValue("Yee")

        const opts = {
            limitLicense: true,
            number: 1
        };

        const fauxResponse = await SpoonApi.getRandomRecipes(opts)

        expect(fauxResponse).toEqual("Yee")

    });

});