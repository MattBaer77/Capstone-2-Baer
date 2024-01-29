// MOCK RESPONSES -
const mockResponseGetRandomRecipes = {
            
    recipes: [
    
        {
            id : 1,
            title: "Faux RANDOM Recipe 1"
        },
        
        {
            id : 2,
            title: "Faux RANDOM Recipe 2"
        },

        {
            id : 3,
            title: "Faux RANDOM Recipe 3"
        }

    ]
};

const mockResponseGetSearchRecipesOptsNullNum10 = {

    results: [
    
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
        },

        {
            id : 4,
            title: "Faux Recipe 3"
        },

        {
            id : 5,
            title: "Faux Recipe 3"
        },

        {
            id : 6,
            title: "Faux Recipe 3"
        },

        {
            id : 7,
            title: "Faux Recipe 3"
        },

        {
            id : 8,
            title: "Faux Recipe 3"
        },

        {
            id : 9,
            title: "Faux Recipe 3"
        },

        {
            id : 10,
            title: "Faux Recipe 3"
        },

    ]

};

const mockResponseGetRecipeInformation = {

    id:3,
    title: "Faux Recipe 3",
    details: "Additional Details"

};

jest.mock('./spoonModel', () => {

    const originalSpoonModel = jest.requireActual('./spoonModel');

    originalSpoonModel.getRandomRecipes = jest.fn().mockResolvedValue(mockResponseGetRandomRecipes);
    originalSpoonModel.getSearchRecipes = jest.fn().mockResolvedValue(mockResponseGetSearchRecipesOptsNullNum10);
    originalSpoonModel.getRecipeInformation = jest.fn().mockResolvedValue(mockResponseGetRecipeInformation);
    originalSpoonModel.randomRecipesExcludeIntolerances = jest.fn().mockResolvedValue(mockResponseGetRandomRecipes)
    originalSpoonModel.startCacheTimer = jest.fn();

    return originalSpoonModel;

});

module.exports = {

    mockResponseGetRandomRecipes,
    mockResponseGetSearchRecipesOptsNullNum10,
    mockResponseGetRecipeInformation

};