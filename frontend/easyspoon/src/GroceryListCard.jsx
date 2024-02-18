import React from "react";

import { NavLink } from "react-router-dom";

import "./GroceryListCard.css"
import IngredientCard from "./IngredientCard";
import PreviewCard from "./PreviewCard";

const GroceryListCard = ({groceryList}) => {

    // console.log(groceryList.recipes)
    // console.log(groceryList.ingredients)

    return(

        <div className="GroceryListCard">

            <h1>
                {groceryList.listName}
            </h1>
            <p>
                list owner: {groceryList.owner}
            </p>

            {groceryList.recipes.map(r => <PreviewCard key={r.id} item={r.detail}/>)}

            {groceryList.ingredients.map(i => <IngredientCard key={i.id} ingredient={i.detail}/>)}

            <button>Edit This List</button>

        </div>

    )

}

export default GroceryListCard