import React, {useState, useEffect} from "react";

import { useUserContext } from "./hooks";

import { useParams, NavLink, Navigate } from "react-router-dom";

import IngredientAddForm from "./IngredientAddForm";

import "./IngredientDetail.css"

const IngredientDetail = () => {

    const {id} = useParams();

    const {currentUser, currentGroceryList} = useUserContext();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [onList, setOnList] = useState(false)
    const [ingredient, setIngredient] = useState(null);

    if(!currentUser) {

        return <Navigate to='/'/>

    }

    useEffect(() => {

        async function getIngredient() {

            try {

                let ingredient;

                if(currentGroceryList

                    // && currentGroceryList.ingredients.some(i => i.id === id)

                    ){

                    console.log(currentGroceryList)

                    ingredient = currentGroceryList.ingredients.find(i => i.id === id);
                    console.log(ingredient)
                    if(ingredient) setOnList(true)
                    
                } else if(!ingredient) {

                    console.log("Not in grocery list!")

                    // IF CURRENTGROCERYLIST
                    // NEED TO FIRST CHECK FOR INGREDIENT WITH INGREDIENTID on CURRENTGROCERYLIST
                    // ASSIGN BOOLEAN STATE? - PASS TO FORM (TO DETERMINE postIngredientToGroceryList vs editIngredientOnGroceryList) - NO RENDER TWO DIFFERENT FORMS CONDITIONALLY BELOW
                    // IF ONGROCERYLIST - LOAD FROM THERE
                    // ELSE DO BELOW -

                    ingredient = await currentUser.userApi.getIngredientById(id);
                    console.log(ingredient)

                }

                setIngredient(ingredient);
                setIsLoading(false);

            } catch (e) {
                setError(e);
            } finally {
                setIsLoading(false)
            }

        }

        getIngredient();

    }, []);

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

                <img src={`https://spoonacular.com/cdn/ingredients_250x250/${ingredient.image}`}/>
                <h2>{ingredient.name}</h2>

                {currentGroceryList && <IngredientAddForm currentUser={currentUser} ingredient={ingredient} onList={onList}/>}

            </div>

        </div>

    )

}

export default IngredientDetail;