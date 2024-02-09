import React, {useState, useEffect, useContext} from "react";
import UserContext from "./UserContext";

import EasySpoonAPI from "./Api";
import { jwtDecode } from 'jwt-decode';

const UserProvider = ({children}) => {

    const localStorage = window.localStorage

    const INITIAL_STATE = {}

    const [currentUser, setCurrentUser] = useState(INITIAL_STATE)

    const loadUser = async (token) => {

        const { username } = jwtDecode(token)

        const userApi = EasySpoonAPI
        userApi.token = token
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

    }

    useEffect(() => {

        // Initial Testing - Always Logged In
        localStorage.setItem('token', import.meta.env.VITE_EXAMPLE_TOKEN)

        if (localStorage.getItem('token'))loadUser((localStorage.getItem('token')))

    }, [])

    return (
        <UserContext.Provider value = {currentUser}>
            {children}
        </UserContext.Provider>
    )

}

export default UserProvider;
export const useUserContext = () => useContext(UserContext);