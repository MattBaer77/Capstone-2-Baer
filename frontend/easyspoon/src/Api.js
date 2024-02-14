const VITE_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3001";

/** API Class
 * 
 * Static class tying together methods used to get/send to to the API.
 * 
*/

class EasySpoonAPI {

    static token;

    static async request(endpoint, data = {}, params = {}, method = "GET") {
        console.debug("API Call:", endpoint, data, params, method);

        const queryString = new URLSearchParams(params).toString();
        console.log(queryString)

        const url = `${VITE_BASE_URL}/${endpoint}${queryString ? `?${queryString}` : ''}`;
        const headers = { Authorization: `Bearer ${this.token}` };
        const body = (method === "GET") ? undefined : JSON.stringify(data);

        try {
            const response = await fetch(url, { method, body, headers });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error("API Error", error);
            throw error;
        }
    }

    // /auth

    static async loginUser(userInfo) {

        let res = await this.request(`auth/token`, userInfo, {}, "POST");

        return res.token

    };

    static async signUpUser(userInfo) {

        let res = await this.request(`auth/register`, userInfo, {}, "POST");

        return res.token

    };

    // /users

    static async getUserInfo(username) {

        let res = await this.request(`users/${username}`);

        return res

    };

    static async getUserDetails(username) {

        let res = await this.request(`users/${username}/details`);

        return res

    };

    static async editUser(userInfo, username) {

        let res = await this.request(`users/${username}`, userInfo, {}, "PATCH");

        return res

    };

    static async deleteUser(username) {

        let res = await this.request(`users/${username}`, {}, {}, "DELETE");

        return res

    };

    static async getUserCache(username) {

        let res = await this.request(`users/${username}/cache`);

        return res

    };

    static async getUserCacheOnly(username) {

        let res = await this.request(`users/${username}/cache-only`);

        return res

    };

    // /recipes

    static async getRecipesCache() {

        let res = await this.request(`recipes/cache`);

        return res
        
    };

    static async getRecipesSearch(params) {

        let res = await this.request(`recipes/search`, {}, params, "GET");

        return res.results
        
    };

    static async getRecipeById(id) {

        let res = await this.request(`recipes/${id}`);

        return res

    };

    static async getRecipeByIdWithNutrition(id) {

        let res = await this.request(`recipes/${id}/nutrition`);

        return res

    };

    // /ingredients

    static async getIngredientsSearch(params) {

        let res = await this.request(`ingredients/search`, {}, params, "GET");

        return res.results

    };

    static async getIngredientById(id) {

        let res = await this.request(`ingredients/${id}`);

        return res

    };

    // /grocery-lists

    static async getAllUsersGroceryLists(username) {

        let res = await this.request(`grocery-lists/${username}/all`);

        return res

    };

    static async getGroceryListById(id) {

        let res = await this.request(`grocery-lists/${id}`);

        return res

    };

    static async postIngredientToGroceryList(id, ingredientData) {

        let res = await this.request(`grocery-lists/${id}/ingredients`, ingredientData, {}, "POST");

        return res

    };

    static async editIngredientOnGroceryList(id, ingredientId, ingredientData) {

        let res = await this.request(`grocery-lists/${id}/ingredients/${ingredientId}`, ingredientData, {}, "PATCH");

        return res

    };

    static async deleteIngredientOnGroceryList(id, ingredientId) {

        let res = await this.request(`grocery-lists/${id}/ingredients/${ingredientId}`, {}, {}, "DELETE");

        return res

    };

    static async postRecipeToGroceryList(id, recipeId) {

        let res = await this.request(`grocery-lists/${id}/recipes/${recipeId}`, {}, {}, "POST");

        return res

    };

    static async deleteRecipeOnGroceryList(id, recipeId) {

        let res = await this.request(`grocery-lists/${id}/recipes/${recipeId}`, {}, {}, "DELETE");

        return res

    };

}

export default EasySpoonAPI;