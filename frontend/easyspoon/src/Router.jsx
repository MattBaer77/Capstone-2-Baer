import React from "react";

import {Route, Routes, Navigate} from "react-router-dom";

import Home from "./Home"
import UserCard from "./UserCard"
import RecipesList from "./RecipesList";
import IngredientsList from "./IngredientsList";
import RecipeDetail from "./RecipeDetail"
import GroceryListsList from "./GroceryListsList";
import UserEditForm from "./UserEditForm";
import UserIntolerancesEditForm from "./UserIntolerancesEditForm"

const Router = () => {

    return (

        <Routes>

            <Route exact path="/" element={<Home/>}/>
            <Route exact path="/user" element={<> <UserEditForm/> <UserIntolerancesEditForm/> </>}/>

            <Route exact path="/grocery-lists" element={<GroceryListsList/>}/>

            <Route exact path="/recipes" element={<RecipesList/>}/>
            <Route exact path="/recipes/:id" element={<RecipeDetail/>}/>

            <Route exact path="/ingredients" element={<IngredientsList/>}/>

            <Route path="*" element={<Navigate to='/' />}/>

        </Routes>

    )

}

export default Router;