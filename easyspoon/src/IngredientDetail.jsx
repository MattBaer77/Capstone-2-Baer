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
    const [ingredient, setIngredient] = useState({});
    const [possibleUnits, setPossibleUnits] = useState(null);

    if(!currentUser) {

        return <Navigate to='/'/>

    }

    useEffect(() => {

        async function getIngredientAndDetail() {

            // setIngredient(INITIAL_STATE)
            // console.log("LOADING INGREDIENT")

            let ingredientLoad;
            let possibleUnits;

            try {

                if(currentGroceryList) {

                    ingredientLoad = currentGroceryList.ingredients.find(i => i.ingredientId === parseInt(id)) || {}
                    // console.log(ingredientLoad)

                } else {
                    ingredientLoad = {}
                }

                if(!ingredientLoad.detail) {

                    const detail = await currentUser.userApi.getIngredientById(id);
                    ingredientLoad["detail"] = detail

                }

                possibleUnits = await currentUser.userApi.getIngredientInformationPossibleUnitsById(id)
                possibleUnits ? setPossibleUnits(possibleUnits) : setPossibleUnits(["each", "pound", "package"])

                setIngredient(ingredientLoad)
                setIsLoading(false)

            } catch (e) {
                setError(e)
            } finally {
                setIsLoading(false)
            }

        }

        getIngredientAndDetail();

    }, [currentGroceryList])

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