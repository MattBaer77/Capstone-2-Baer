import React, {useEffect, useState} from "react";

import {Navigate} from "react-router-dom";

import { useUserContext } from "./hooks";

const Logout= () => {

    const { currentUser, logout } = useUserContext();
    const [isLoading, setIsloading] = useState(true);

    useEffect(() => {

        logout();
        setIsloading(false)

    }, []);

    if (!currentUser) {

        return <Navigate to='/'/>

    };

    if (!isLoading) {
        
        return <Navigate to='/'/>

    } else {

        return <div><h2>Logging out...</h2></div>

    }

}

export default Logout;