import React, {useState, useEffect, } from "react";

import { useUserContext } from "./hooks";

import { useParams, NavLink, Navigate } from "react-router-dom";

import RecipeCard from "./RecipeCard.jsx";

import "./List.css"

const RecipeDetail = () => {

    const {id} = useParams();

    const currentUser = useUserContext();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recipe, setRecipe] = useState(null);

    if(!currentUser) {

        return <Navigate to='/'/>

    }

    useEffect(() => {

        async function getRecipe() {

            try{
                let recipe = await currentUser.userApi.getRecipeById(id);
                setRecipe(recipe);
                setIsLoading(false);

            } catch (e) {
                setError(e);
            } finally {
                setIsLoading(false)
            }
        }

        getRecipe();

    }, []);


    if (isLoading) {

        return <p>Loading Recipe...</p>

    };

    if (error) {

        return (
        <div>
            <h3>Error Loading Recipe</h3>
            {/* <p>{error.message}.</p> */}
            <NavLink exact="true" to={'/recipes'}>Back to Recipes</NavLink>
        </div>
        )

    };

    return (

        <div className="List">

            <img src={recipe.image}/>
            <h2>{recipe.title}</h2>
            {recipe.extendedIngredients.map(i => <p>{JSON.stringify(i)}</p>)}
            <p>{JSON.stringify(recipe.analyzedInstructions)}</p>

        </div>

    )

}

export default RecipeDetail;