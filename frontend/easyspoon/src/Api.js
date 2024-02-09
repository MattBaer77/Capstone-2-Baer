const VITE_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3001";

/** API Class
 * 
 * Static class tying together methods used to get/send to to the API.
 * 
*/

class EasySpoonAPI {

    static token;

    static async request(endpoint, data = {}, method = "GET") {
        console.debug("API Call:", endpoint, data, method);

        const url = `${VITE_BASE_URL}/${endpoint}`;
        console.log(url);
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

    // USER

    static async loginUser(userInfo) {

        let res = await this.request(`auth/token`, userInfo, "POST")

        return res.token

    };

    static async signUpUser(userInfo) {

        let res = await this.request(`auth/register`, userInfo, "POST")

        return res.token

    };

    static async editUser(userInfo, username) {

        let res = await this.request(`users/${username}`, userInfo, "PATCH")

        return res

    };

    static async getUserInfo(username) {

        console.log(this.token)

        let res = await this.request(`users/${username}`)

        console.log(res)

        return res

    };

    static async getUserDetails(username) {

        console.log(this.token)

        let res = await this.request(`users/${username}/details`)

        console.log(res)

        return res

    };

    // RECIPES

    static async getRecipesCache() {

        console.log(this.token)

        let res = await this.request(`recipes/cache`)

        console.log(res)

        return res
        
    }

    // INGREDIENTS

    // GROCERYLISTS

}

export default EasySpoonAPI;