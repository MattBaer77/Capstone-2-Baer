import React from "react";

import { NavLink } from "react-router-dom";

import "./Card.css"
import "./RecipeCard.css"
import { useUserContext } from "./hooks";

const PreviewCard = ({item}) => {

    const currentUser = useUserContext()

    if(item.title) {

        return(

            <div className="Card RecipeCard">

                <div className="center">
    
                    {currentUser ? <NavLink exact="true" to={`/recipes/${item.id}`}><h2>{item.title}</h2></NavLink> : <h2>{item.title}</h2>}

                    <div className="image-circle">
                        <img src={item.image}/>
                    </div>

                </div>
    
            </div>
    
        )

    }

    else if(item.name) {

        return(

            <div className="Card IngredientCard">

                <div className="center">

                    {currentUser ? <NavLink exact="true" to={`/ingredients/${item.name}`}><h2>{item.name}</h2></NavLink> : <h2>{item.title}</h2>}

                    <div className="image-circle">
                        <img src={`https://spoonacular.com/cdn/ingredients_250x250/${item.image}`}/>
                    </div>

                </div>
    
            </div>
    
        )

    }

}

export default PreviewCard