import React, {useState, useEffect, } from "react";

import { useUserContext } from "./hooks";

import { useParams, NavLink, Navigate } from "react-router-dom";

import RecipeCard from "./RecipeCard.jsx";
import IngredientCard from "./IngredientCard.jsx";
import MessageCard from "./MessageCard";
import LoadingCard from "./LoadingCard";

import "./Content.css"
import "./RecipeDetail.css"

const RecipeDetail = () => {

    const {id} = useParams();

    const {currentUser, loadUser, currentGroceryList} = useUserContext();

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

    const handleAdd = async(recipe) => {

        try {

            await currentUser.userApi.postRecipeToGroceryList(currentGroceryList.id, recipe.id)
            await loadUser(currentUser.token)

        } catch(e) {
            console.error(e)
        }

    };

    if (isLoading) {
        return (

            <LoadingCard/>

        )
    }

    if (error) {

        return (

            <div className="Err">

                {error && <MessageCard className="error" message={error.message}/>}

            </div>

        )

    }

    return (

        <div className="RecipeDetail">

            <div className="Card">

                <div className="image">
                    <img src={recipe.image}/>
                </div>

                <div className="title">
                    <h1>{recipe.title}</h1>
                </div>

                <div className="button-space">
                    {currentGroceryList && <button className="positive" onClick={() => handleAdd(recipe)}>Add</button>}
                </div>

                <hr/>

                <div className="CardContent ingredients">
                    {recipe.extendedIngredients.map(i => <IngredientCard key={i.id} ingredient={i}/>)}
                </div>

                <RecipeCard recipe={recipe}/>

            </div>

        </div>

    )

}

export default RecipeDetail;