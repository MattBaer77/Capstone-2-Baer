import React from "react";

import { NavLink } from "react-router-dom";

import "./GroceryListCard.css"
import IngredientCard from "./IngredientCard";
import PreviewCard from "./PreviewCard";

const GroceryListCard = ({groceryList}) => {

    console.log(groceryList.recipes)
    console.log(groceryList.ingredients)

    return(

        <div className="GroceryListCard">

            <p>
                {groceryList.id}
            </p>
            <p>
                {groceryList.list_name}
            </p>
            <p>
                {groceryList.owner}
            </p>

            {groceryList.recipes.map(r => <PreviewCard key={r.id} item={r}/>)}

            {groceryList.ingredients.map(i => <IngredientCard key={i.id} ingredient={i}/>)}

        </div>

    )

}

export default GroceryListCard