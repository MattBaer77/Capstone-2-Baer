import React from "react";

import { NavLink } from "react-router-dom";

import "./Card.css"
import "./IngredientCard.css"

const IngredientCard = ({item}) => {

    return(

        <div className="Card IngredientCard">

            <div className="center">

                <NavLink exact="true" to={`/ingredients/${item.name}`}><h4>{item.name}</h4></NavLink>

                <div className="ingredient-image">
                    <img src={`https://spoonacular.com/cdn/ingredients_250x250/${item.image}`}/>
                </div>

            </div>

        </div>


    )


}

export default IngredientCard