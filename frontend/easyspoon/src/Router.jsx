import React from "react";

import {Route, Routes, Navigate} from "react-router-dom";

import Home from "./Home"
import UserCard from "./UserCard"

const Router = () => {

    return (

        <Routes>

            <Route exact path="/" element={<Home/>}/>
            <Route exact path="/user" element={<UserCard/>}/>

        </Routes>

    )

}

export default Router;