import React, {useState, useEffect, } from "react";

import { useUserContext } from "./hooks";

import { useParams, NavLink, Navigate } from "react-router-dom";

import RecipeCard from "./RecipeCard.jsx";
// import PreviewCard from "./PreviewCard.jsx";
import IngredientCard from "./IngredientCard.jsx";

import "./Content.css"
import "./RecipeDetail.css"

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

        <div className="Content RecipeDetail">

            <div className="title">
                <img src={recipe.image}/>
                <h2>{recipe.title}</h2>
            </div>

            <div className="ingredient-card-stage">
                {recipe.extendedIngredients.map(i => <IngredientCard key={i.id} ingredient={i}/>)}
            </div>

            <div className="recipe-card-stage">
                {/* <h3>
                    Steps:
                </h3>
                {recipe.analyzedInstructions[0].steps.map(s => <p>{JSON.stringify(s)}</p>)} */}
                <RecipeCard recipe={recipe}/>

            </div>

            {/* <div>
                {recipe.extendedIngredients.map(i => JSON.stringify(i))}
            </div> */}

            {/* <p>{JSON.stringify(recipe.analyzedInstructions)}</p> */}

        </div>

    )

}

export default RecipeDetail;