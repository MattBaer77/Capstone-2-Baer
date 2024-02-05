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

const mockResponseGetSearchIngredientsOptsNullNum10 = {

    results: [
    
        {
            id : 1,
            name : "Faux Ingredient 1"
        },
        
        {
            id : 2,
            name : "Faux Ingredient 2"
        },

        {
            id : 3,
            name : "Faux Ingredient 3"
        },

        {
            id : 4,
            name : "Faux Ingredient 3"
        },

        {
            id : 5,
            name : "Faux Ingredient 3"
        },

        {
            id : 6,
            name : "Faux Ingredient 3"
        },

        {
            id : 7,
            name : "Faux Ingredient 3"
        },

        {
            id : 8,
            name : "Faux Ingredient 3"
        },

        {
            id : 9,
            name : "Faux Ingredient 3"
        },

        {
            id : 10,
            name : "Faux Ingredient 3"
        },

    ]

};

// const mockResponseGetRecipeInformation = {

//     id:3,
//     title: "Faux Recipe 3",
//     details: "Additional Details"

// };

// const mockResponseGetIngredientInformation = {

//     id:3,
//     name: "Faux Ingredient 3",
//     details: "Additional Details"

// };

const mockResponseGetRecipeInformation = {

        id: 100,
        title: 'Anchovy Spaghetti - SAMPLE FAKE RECIPE',
        image: '',
        imageType: 'jpg',
        servings: 4,
        readyInMinutes: 60,
        license: undefined,
        sourceName: '',
        sourceUrl: '',
        spoonacularSourceUrl: undefined,
        aggregateLikes: 0,
        healthScore: 50,
        spoonacularScore: 50,
        pricePerServing: 50,
        analyzedInstructions: [],
        cheap: false,
        creditsText: '',
        cuisines: [],
        dairyFree: true,
        diets: [],
        gaps: 'no',
        glutenFree: false,
        instructions: 'instructions text',
        ketogenic: undefined,
        lowFodmap: false,
        occasions: [],
        sustainable: false,
        vegan: false,
        vegetarian: false,
        veryHealthy: true,
        veryPopular: false,
        whole30: undefined,
        weightWatcherSmartPoints: 10,
        dishTypes: [ 'side dish' ],
        extendedIngredients: [

           {
            aisle: 'Seafood',
            amount: 3,
            consitency: undefined,
            id: 51,
            image: 'anchovies.jpg',
            name: 'anchovy',
            original: '3 anchovy fillets, drained, optional',
            originalName: 'anchovy fillets, drained, optional',
            unit: 'fillet',
          },

          {
            aisle: 'Pasta and Rice',
            amount: 1,
            consitency: undefined,
            id: 52,
            image: 'spaghetti.jpg',
            name: 'spaghetti',
            original: '1 pound spaghetti',
            originalName: 'spaghetti',
            unit: 'pound',
          }

        ],
        summary: `summary text`,

};

const mockResponseGetIngredientInformation = {

    id: 100,
    original: 'guacamole',
    originalName: 'guacamole',
    name: 'guacamole',
    nameClean: undefined,
    amount: undefined,
    unit: undefined,
    unitShort: undefined,
    unitLong: undefined,
    possibleUnits: [ 'cup', 'tablespoon' ],
    estimatedCost: undefined,
    consistency: 'solid',
    shoppingListUnits: undefined,
    aisle: 'Refrigerated',
    image: 'guac.jpg',
    meta: [],
    nutrition: undefined,
    categoryPath: [ 'dip' ]

};

jest.mock('./spoonModel', () => {

    const originalSpoonModel = jest.requireActual('./spoonModel');

    originalSpoonModel.getRandomRecipes = jest.fn().mockResolvedValue(mockResponseGetRandomRecipes);
    originalSpoonModel.getSearchRecipes = jest.fn().mockResolvedValue(mockResponseGetSearchRecipesOptsNullNum10);
    originalSpoonModel.getSearchIngredients = jest.fn().mockResolvedValue(mockResponseGetSearchIngredientsOptsNullNum10);
    originalSpoonModel.getRecipeInformation = jest.fn().mockResolvedValue(mockResponseGetRecipeInformation);
    originalSpoonModel.getIngredientInformation = jest.fn().mockResolvedValue(mockResponseGetIngredientInformation);
    originalSpoonModel.randomRecipesExcludeIntolerances = jest.fn().mockResolvedValue(mockResponseGetRandomRecipes)
    originalSpoonModel.startCacheTimer = jest.fn();

    return originalSpoonModel;

});

module.exports = {

    mockResponseGetRandomRecipes,
    mockResponseGetSearchRecipesOptsNullNum10,
    mockResponseGetSearchIngredientsOptsNullNum10,
    mockResponseGetRecipeInformation,
    mockResponseGetIngredientInformation

};