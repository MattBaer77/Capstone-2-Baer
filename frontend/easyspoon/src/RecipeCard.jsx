import React from "react";

import { NavLink } from "react-router-dom";

// import "./Card.css"

const RecipeCard = ({recipe}) => {

    return(

        <div className="Card">

            <NavLink exact="true" to={`/recipes/${recipe.id}`}><h2>{recipe.title}</h2></NavLink>
            <img src={recipe.image}/>

        </div>

    )

}

export default RecipeCard