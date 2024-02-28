import EasySpoonAPI from "../Api"

class FauxEasySpoonApi {

    static token = "fauxtoken";

    static async request() {};

    static async loginUser(){};
    static async signUpUser(){};
    static async getIntolerancesAll(){};
    static async getUserInfo(){};
    static async getUserDetails(){};
    static async editUser(){};
    static async deleteUser(){};
    static async getUserCache(){};
    static async getUserCacheOnly(){};
    static async addUserIntolerance(){};
    static async deleteUserIntolerance(){};
    static async getRecipesCache(){};
    static async getRecipesSearch(){};
    static async getRecipeById(){};
    static async getRecipeByIdWithNutrition(){};
    static async getIngredientSearch(){};
    static async getIngredientById(){};
    static async getAllUsersGroceryLists(){};
    static async getGroceryListById(){};
    static async createGroeryList(){};
    static async deleteGroceryListById(){};
    static async postIngredientToGroceryList(){};
    static async patchAmountIngredientOnGroceryList(){};
    static async deleteIngredientOnGroceryList(){};
    static async postRecipeToGroceryList(){};
    static async deleteRecipeOnGroceryList(){};

}

EasySpoonAPI = FauxEasySpoonApi

const intolerance = {}
const fauxRecipe = {

    id:1,
    recipeId:1,
    detail:{
        id:1,
        image:"fauxRecipeImage.jpg",
    }
    
};

const fauxIngredient = {

    ingredientId:1,
    amount:1,
    minimumAmount:1,
    unit:"fauxUnit",
    detail:{
        id:1,
        image:"fauxIngredientImage.jpg",
        name:"name",
        possibleUnits:[
            "fauxPossibleUnit1",
            "fauxPossibleUnit2",
            "fauxPossibleUnit3"
        ]
    },

};

const fauxGroceryList = {
    id:1,
    listName: "fauxListName",
    owner:"fauxUser",
    ingredients:[
        fauxIngredient,
        fauxIngredient,
        fauxIngredient
    ],
    recipes:[
        fauxRecipe,
        fauxRecipe
    ]
};

class LoggedOutUser {

    static currentUser = null;
    static currentGroceryList = null;

    // functions

    static loadUser = () => {};
    static setCurrentGroceryList = () => {};
    static logout = () => {};

}

class LoggedInUser {

    static currentUser = {

        username:"fauxUser",
        token:FauxEasySpoonApi.token,
        firstName:"fauxFirstName",
        lastName:"fauxLastName",
        email:"fauxEmail@email.com",

        instolerances:[
            intolerance,
        ],

        cache:[
            fauxRecipe,
            fauxRecipe,
            fauxRecipe,
            fauxRecipe,
            fauxRecipe,
            fauxRecipe,
            fauxRecipe,
            fauxRecipe,
            fauxRecipe,
            fauxRecipe
        ],

        userApi: FauxEasySpoonApi,

        groceryLists:[
            fauxGroceryList,
            fauxGroceryList
        ]

    };

    static currentGroceryList = fauxGroceryList

    // functions

    loadUser = () => {};
    setCurrentGroceryList = () => {};
    logout = () => {};

}

export {LoggedOutUser, LoggedInUser}