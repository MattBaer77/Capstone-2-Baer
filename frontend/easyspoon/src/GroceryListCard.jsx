import React from "react";

import { NavLink } from "react-router-dom";

import "./GroceryListCard.css"
import IngredientCard from "./IngredientCard";
import PreviewCard from "./PreviewCard";

const GroceryListCard = ({groceryList, currentUser, loadUser, currentGroceryList, setCurrentGroceryList}) => {

    // console.log(groceryList.recipes)
    // console.log(groceryList.ingredients)
    // console.log(currentGroceryList)

    return(

        <div className="GroceryListCard">

            <h1>
                {groceryList.listName}
            </h1>
            <p>
                list owner: {groceryList.owner}
            </p>

            {groceryList.recipes.map(r => <PreviewCard key={r.id} item={r.detail} currentUser={currentUser} loadUser={loadUser} currentGroceryList={currentGroceryList} groceryListId={groceryList.id}/>)}

            {groceryList.ingredients.map(i => <IngredientCard key={i.id} ingredient={i} currentUser={currentUser} loadUser={loadUser} currentGroceryList={currentGroceryList} groceryListId={groceryList.id}/>)}

            {(!currentGroceryList || currentGroceryList.id !== groceryList.id) && <button onClick={()=>setCurrentGroceryList(groceryList)}>Edit This List</button>}

        </div>

    )

}

export default GroceryListCard