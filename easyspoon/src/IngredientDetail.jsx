import React, {useState, useEffect} from "react";

import { useUserContext } from "./hooks";

import { useParams, NavLink, Navigate } from "react-router-dom";

import IngredientAddForm from "./IngredientAddForm";
import IngredientEditForm from "./IngredientEditForm";
import MessageCard from "./MessageCard";
import LoadingCard from "./LoadingCard";

import "./Content.css"
import "./IngredientDetail.css"

const IngredientDetail = () => {

    const {id} = useParams();

    const {currentUser, loadUser, currentGroceryList} = useUserContext();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ingredient, setIngredient] = useState(null);
    const [possibleUnits, setPossibleUnits] = useState(null);

    if(!currentUser) {

        return <Navigate to='/'/>

    }

    useEffect(() => {

        async function getIngredientAndDetail() {

            let ingredient;
            let possibleUnits;

            try {

                if(currentGroceryList) {

                    ingredient = currentGroceryList.ingredients.find(i => i.ingredientId === parseInt(id)) || {}

                } else {
                    ingredient = {}
                }

                if(!ingredient.detail) {

                    const detail = await currentUser.userApi.getIngredientById(id);
                    ingredient["detail"] = detail

                }

                possibleUnits = await currentUser.userApi.getIngredientInformationPossibleUnitsById(id)
                possibleUnits ? setPossibleUnits(possibleUnits) : setPossibleUnits(["each", "pound", "package"])

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

        <div className="Content">

            <div className="Card IngredientDetail">

                <div className="image">

                    <img src={`https://spoonacular.com/cdn/ingredients_250x250/${ingredient.detail.image}`}/>

                </div>

                <div className="title">

                    <h2>{ingredient.detail.name}</h2>

                </div>

                {currentGroceryList && !ingredient.ingredientId && <IngredientAddForm currentUser={currentUser} loadUser={loadUser} currentGroceryList={currentGroceryList} ingredient={ingredient} setIsLoading={setIsLoading} possibleUnits={possibleUnits}/>}
                {currentGroceryList && ingredient.ingredientId && <IngredientEditForm currentUser={currentUser} loadUser={loadUser} currentGroceryList={currentGroceryList} ingredient={ingredient} setIsLoading={setIsLoading} possibleUnits={possibleUnits}/>}

            </div>

        </div>


    )

}

export default IngredientDetail;