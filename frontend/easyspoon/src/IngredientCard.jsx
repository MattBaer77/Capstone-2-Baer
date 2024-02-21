import React from "react";

import { NavLink } from "react-router-dom";

import "./IngredientCard.css"

const IngredientCard = ({ingredient}) => {

    return(

        <div className="IngredientCard">

            <div className="center">

                <div className="ingredient-text">
                    <NavLink exact="true" to={`/ingredients/${ingredient.id}`}><h4>{((ingredient.name))}</h4></NavLink>
                    {ingredient.amount && <span>{parseFloat(ingredient.amount).toFixed(2)} {ingredient.unit}</span>}
                </div>

                <div className="ingredient-image">
                    <img src={`https://spoonacular.com/cdn/ingredients_250x250/${ingredient.image}`}/>
                </div>

            </div>

        </div>

    )

}

export default IngredientCard