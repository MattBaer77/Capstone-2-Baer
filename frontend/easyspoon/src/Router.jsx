import React from "react";

import {Route, Routes, Navigate} from "react-router-dom";

import Home from "./Home"
import UserCard from "./UserCard"

import GroceryListsList from "./GroceryListsList";

import RecipesList from "./RecipesList";
import RecipeDetail from "./RecipeDetail"
import IngredientsList from "./IngredientsList";
import IngredientDetail from "./IngredientDetail";

import LoginForm from "./LoginForm"
import SignupForm from "./SignupForm"
import UserEditForm from "./UserEditForm";
import UserIntolerancesEditForm from "./UserIntolerancesEditForm"
import Logout from './Logout'

const Router = () => {

    return (

        <Routes>

            <Route exact path="/" element={<Home/>}/>

            <Route exact path="/grocery-lists" element={<GroceryListsList/>}/>

            <Route exact path="/recipes" element={<RecipesList/>}/>
            <Route exact path="/recipes/:id" element={<RecipeDetail/>}/>

            <Route exact path="/ingredients" element={<IngredientsList/>}/>
            <Route exact path="/ingredients/:id" element={<IngredientDetail/>}/>


            <Route exact path="/login" element={<LoginForm />}/>
            <Route exact path="/signup" element={<SignupForm />}/>
            <Route exact path="/user" element={<> <UserEditForm/> <UserIntolerancesEditForm/> </>}/>
            <Route exact path="/logout" element={<Logout/>}/>

            <Route path="*" element={<Navigate to='/' />}/>

        </Routes>

    )

}

export default Router;