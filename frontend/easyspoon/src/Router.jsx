import React from "react";

import {Route, Routes, Navigate} from "react-router-dom";

import Home from "./Home"
import UserCard from "./UserCard"
import RecipesList from "./RecipesList";
import RecipeDetail from "./RecipeDetail"

const Router = () => {

    return (

        <Routes>

            <Route exact path="/" element={<Home/>}/>
            <Route exact path="/user" element={<UserCard/>}/>

            <Route exact path="/recipes" element={<RecipesList/>}/>
            <Route exact path="/recipes/:id" element={<RecipeDetail/>}/>

        </Routes>

    )

}

export default Router;