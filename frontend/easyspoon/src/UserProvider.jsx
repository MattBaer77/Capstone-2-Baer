import React, {useState, useEffect, useContext} from "react";
import UserContext from "./UserContext";

import EasySpoonAPI from "./Api";
import { jwtDecode } from 'jwt-decode';

const UserProvider = ({children}) => {

    const localStorage = window.localStorage

    const INITIAL_STATE = null;

    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(INITIAL_STATE);

    const loadUser = async (token) => {

        try {

            const { username } = jwtDecode(token)

            console.log(username)

            const userApi = EasySpoonAPI;
            userApi.token = token;
            console.log(username)
            const { user } = await userApi.getUserDetails(username);
            console.log(user)

            // GET GROCERYLISTS DETAIL FOR currentUser
            // let groceryLists = "Hello"
            let groceryLists = await userApi.getAllUsersGroceryLists(username);

            console.log(groceryLists)

            for (let groceryList of groceryLists){

                for (let recipe of groceryList.recipes) {

                    const recipeDetail = await userApi.getRecipeById(recipe.recipeId);
                    recipe['detail'] = recipeDetail

                };

                for (let ingredient of groceryList.ingredients){

                    const ingredientDetail = await userApi.getIngredientById(ingredient.ingredientId);
                    ingredient['detail'] = ingredientDetail

                }

            }

            console.log(groceryLists)
    
            setCurrentUser(() => {
    
                return {
                    username:user.username,
                    token : token,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    intolerances: user.intolerances,
                    cache: user.cache,
                    userApi : userApi,
                    groceryLists : groceryLists
                }
    
            })
    
            localStorage.setItem("token", token)
            setIsLoading(false)

        } catch (e) {

            // console.error("Error loading user:", e)
            setIsLoading(false)

        }
    }

    // TEMPORARY FOR DEVLEOPMENT
    // localStorage.setItem("token", import.meta.env.VITE_EXAMPLE_TOKEN)
    // TEMPORARY FOR DEVELOPMENT

    useEffect(() => {

        const storedToken = localStorage.getItem('token')
        loadUser(storedToken)


    }, [])

    if (isLoading) {

        return <p>Loading User...</p>

    }

    return (
        <UserContext.Provider value = {currentUser}>
            {children}
        </UserContext.Provider>
    )

}

export default UserProvider;