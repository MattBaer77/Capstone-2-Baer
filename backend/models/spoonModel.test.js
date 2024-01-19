"use strict";

const ExpressError = require("../expressError");

const mockRandomResponse = {
            
    recipes: [
    
        {
            id : 1,
            title: "Faux Recipe 1"
        },
        
        {
            id : 2,
            title: "Faux Recipe 2"
        },

        {
            id : 3,
            title: "Faux Recipe 3"
        }

    ]
};

jest.mock('./spoonModel', () => {
    // Import the actual module and store it in a variable
    const originalSpoonModel = jest.requireActual('./spoonModel');

    return {
        ...originalSpoonModel,
        SpoonApi: {
            ...originalSpoonModel.SpoonApi,
            // getRandomRecipes: jest.fn(),
            // fetchFreshData: jest.fn()
            // getRandomRecipes:jest.fn().mockImplementation(() => mockRandomResponse),
            getRandomRecipes:jest.fn().mockResolvedValue(mockRandomResponse),
            // fetchFreshData:
            // getRandomRecipes:jest.fn().mockImplementation(() => Promise.resolve(mockRandomResponse)),
            // fetchFreshData:jest.fn().mockImplementation(() => mockRandomResponse),
        },
    };
});

// Test the mock (This tests nothing - just ensure code works to test in this commit)
// Now you can safely import SpoonApi from the mock
const { SpoonApi } = require('./spoonModel');

console.log(SpoonApi.getRandomRecipes)

describe("getRandomRecipes Mock Test", () => {

    test("mock test works", async () => {

        // SpoonApi.getRandomRecipes.mockReturnValue(mockRandomResponse)

        // console.log(SpoonApi)

        const opts = {
            limitLicense: true,
            number: 3
        };

        const fauxResponse = await SpoonApi.getRandomRecipes(opts)
        console.log(fauxResponse)
        expect(fauxResponse).toEqual(mockRandomResponse)

    });

});

describe("test fetchFreshData", () => {

    test("fetchFreshData - success", async () => {

        // console.log(SpoonApi)

        const fauxResponse = await SpoonApi.fetchFreshData();
        console.log(fauxResponse);

        expect(fauxResponse).toEqual(mockRandomResponse)

    })

})

// describe("test serveRecipesCache - success", () => {

//     test("serveRecipesCache - No Cache Currently Saved", async () => {

//         console.log(SpoonApi)

//         const fauxResponse = await SpoonApi.serveRecipesCache()

//         console.log(fauxResponse)

//         expect(fauxResponse).toEqual(mockRandomResponse)

//     })

// });