import React from "react";

import { NavLink } from "react-router-dom";

import "./IngredientCard.css"

const IngredientCard = ({ingredient}) => {

    // console.log(ingredient)

    return(

        <div className="IngredientCard">

            <div className="center">

                <div className="ingredient-text">
                    <NavLink exact="true" to={`/ingredients/${ingredient.detail ? ingredient.detail.id : ingredient.id}`}><h4>{((ingredient.detail ? ingredient.detail.name : ingredient.name))}</h4></NavLink>
                    {ingredient.amount && <span>{parseFloat(ingredient.amount).toFixed(2)} {ingredient.unit}</span>}
                </div>

                <div className="ingredient-image">
                    <img src={`https://spoonacular.com/cdn/ingredients_250x250/${ingredient.detail ? ingredient.detail.image : ingredient.image}`}/>
                </div>

            </div>

        </div>

    )

}

export default IngredientCard