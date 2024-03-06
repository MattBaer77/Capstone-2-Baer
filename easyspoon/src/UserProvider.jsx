import React, {useState, useEffect, useContext} from "react";
import UserContext from "./UserContext";

import EasySpoonAPI from "./Api";
import { jwtDecode } from 'jwt-decode';

const UserProvider = ({children}) => {

    const localStorage = window.localStorage

    const INITIAL_STATE = null;

    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(INITIAL_STATE);
    const [currentGroceryList, setCurrentGroceryList] = useState(INITIAL_STATE);

    const loadUser = async (token) => {

        try {

            const { username } = jwtDecode(token)

            const userApi = EasySpoonAPI;
            userApi.token = token;
            const { user } = await userApi.getUserDetails(username);

            // GET GROCERYLISTS DETAIL FOR currentUser
            let groceryLists = await userApi.getAllUsersGroceryLists(username);

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
                    groceryLists : groceryLists,
                }
    
            })

            if(currentGroceryList) {

                setCurrentGroceryList((groceryLists.find(groceryList => groceryList.id === currentGroceryList.id))) 

            }
    
            localStorage.setItem("token", token)
            setIsLoading(false)

        } catch (e) {

            // console.error("Error loading user:", e)
            setIsLoading(false)

        }
    }

    const logout = async () => {

        setCurrentUser(INITIAL_STATE)
        localStorage.clear()

    }

    useEffect(() => {

        const storedToken = localStorage.getItem('token')
        loadUser(storedToken)


    }, [])

    if (isLoading) {

        return <p>Loading User...</p>

    }

    return (
        <UserContext.Provider value = {{currentUser, loadUser, currentGroceryList, setCurrentGroceryList, logout}}>
            {children}
        </UserContext.Provider>
    )

}

export default UserProvider;