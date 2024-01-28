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

    const originalSpoonModel = jest.requireActual('./spoonModel');

    originalSpoonModel.getRandomRecipes = jest.fn().mockResolvedValue(mockRandomResponse)

    return originalSpoonModel;

});

const SpoonApi = require('./spoonModel');

// CHECKING THAT MOCKS HAVE REPLACED API CALLS
describe("getRandomRecipes Mock Test", () => {

    test("mock test works", async () => {

        const opts = {
            limitLicense: true,
            number: 3
        };

        const fauxResponse = await SpoonApi.getRandomRecipes(opts)
        expect(fauxResponse).toEqual(mockRandomResponse)

    });

});

// TESTS -
describe("test fetchFreshRandomData", () => {

    test("fetchFreshData - success", async () => {

        const fauxResponse = await SpoonApi.fetchFreshRandomData();
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