import React, {useState, useEffect} from "react";

import { useUserContext } from "./hooks";

import { useParams, NavLink, Navigate } from "react-router-dom";

import IngredientAddForm from "./IngredientAddForm";
import IngredientEditForm from "./IngredientEditForm";

import "./IngredientDetail.css"

const IngredientDetail = () => {

    const {id} = useParams();

    const {currentUser, loadUser, currentGroceryList} = useUserContext();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ingredient, setIngredient] = useState(null);

    if(!currentUser) {

        return <Navigate to='/'/>

    }

    useEffect(() => {

        async function getIngredientAndDetail() {

            let ingredient;

            try {

                if(currentGroceryList) {

                    console.log("THERE IS A CURRENT")

                    console.log(currentGroceryList)
                    console.log(id)
                    console.log(parseInt(id))

                    ingredient = currentGroceryList.ingredients.find(i => i.ingredientId === parseInt(id)) || {}
                    console.log(ingredient)

                } else {
                    console.log("getIngredient ELSE RAN")
                    ingredient = {}
                }

                if(!ingredient.detail) {

                    console.log("trying to get details")
                    const detail = await currentUser.userApi.getIngredientById(id);
                    console.log(detail)
                    ingredient["detail"] = detail
                    console.log(ingredient)

                }

                setIngredient(ingredient)
                setIsLoading(false)

            } catch (e) {
                setError(e)
            } finally {
                setIsLoading(false)
            }

        }

        getIngredientAndDetail();

    }, [])

    if (isLoading) {

        return <p>Loading Ingredient...</p>

    };

    if (error) {

        return (
            <div>
                <h3>Error Loading Ingredients</h3>
                {/* <p>{error.message}.</p> */}
                <NavLink exact="true" to={'/ingredients'}>Back to Ingredients</NavLink>
            </div>
        )

    };

    return (

        <div className="Content IngredientDetail">

            <p>{JSON.stringify(ingredient)}</p>

            <div className="title">

                <img src={`https://spoonacular.com/cdn/ingredients_250x250/${ingredient.detail.image}`}/>
                <h2>{ingredient.detail.name}</h2>

                <p>{ingredient.ingredientId}</p>

                {currentGroceryList && !ingredient.ingredientId && <IngredientAddForm currentUser={currentUser} loadUser={loadUser} currentGroceryList={currentGroceryList} ingredient={ingredient}/>}
                {currentGroceryList && ingredient.ingredientId && <IngredientEditForm currentUser={currentUser} loadUser={loadUser} currentGroceryList={currentGroceryList} ingredient={ingredient}/>}

            </div>

        </div>

    )

}

export default IngredientDetail;