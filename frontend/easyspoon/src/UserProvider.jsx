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

            const userApi = EasySpoonAPI;
            userApi.token = token;
            const {user} = await userApi.getUserInfo(username);
    
            setCurrentUser(() => {
    
                return {
                    username:user.username,
                    token : token,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    applications: user.applications,
                    userApi : userApi
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