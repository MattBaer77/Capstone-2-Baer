import React from "react";

import "./Card.css"

const RecipeCard = ({recipe}) => {

    return(

        <div className="Card">

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