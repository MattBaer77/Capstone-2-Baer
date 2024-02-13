import React from "react";

import { NavLink } from "react-router-dom";

import "./RecipeCard.css"

const RecipeCard = ({recipe}) => {

    return(

        <div className="RecipeCard">

            <h3>

                Steps:

            </h3>

            <ol>

                {recipe.analyzedInstructions[0].steps.map(s => <li key={s.number}>{s.step}</li>)}

            </ol>

        </div>

    )

}

export default RecipeCard