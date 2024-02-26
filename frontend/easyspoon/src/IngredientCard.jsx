import React, { useState } from "react";

import { NavLink } from "react-router-dom";

import "./IngredientCard.css"

const IngredientCard = ({ingredient, currentUser, loadUser, currentGroceryList, groceryListId}) => {

    console.log(currentUser)
    console.log(ingredient)
    console.log(currentGroceryList)
    console.log(groceryListId)

    const [error, setError] = useState(null)

    const handleDelete = async() => {

        try {

            await currentUser.userApi.deleteIngredientOnGroceryList(groceryListId, ingredient.ingredientId)
            await loadUser(currentUser.token)
            setError(null)

        } catch (e) {

            setError(e)

        }

    }

    return(

        <div className="IngredientCard">

            <div className="center">

                {error && <p>{error.message}</p>}

                <div className="ingredient-text">
                    <NavLink exact="true" to={`/ingredients/${ingredient.detail ? ingredient.detail.id : ingredient.id}`}><h4>{((ingredient.detail ? ingredient.detail.name : ingredient.name))}</h4></NavLink>
                    {ingredient.amount && <span>{parseFloat(ingredient.amount).toFixed(2)} {ingredient.unit}</span>}
                </div>

                <div className="ingredient-image">
                    <img src={`https://spoonacular.com/cdn/ingredients_250x250/${ingredient.detail ? ingredient.detail.image : ingredient.image}`}/>
                </div>

               {currentGroceryList && currentGroceryList.id === groceryListId && <button onClick={()=>{handleDelete()}}>Delete</button>}

            </div>


        </div>

    )

}

export default IngredientCard