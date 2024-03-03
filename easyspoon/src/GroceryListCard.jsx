import React, {useState} from "react";

import { NavLink } from "react-router-dom";

import IngredientCard from "./IngredientCard";
import PreviewCard from "./PreviewCard";

import "./GroceryListCard.css"
import "./CardContent.css"

const GroceryListCard = ({groceryList, currentUser, loadUser, currentGroceryList, setCurrentGroceryList}) => {

    // console.log(groceryList.recipes)
    // console.log(groceryList.ingredients)
    // console.log(currentGroceryList)

    const [error, setError] = useState(null)

    const handleDelete = async() => {

        try {

            await currentUser.userApi.deleteGroceryListById(groceryList.id)
            await loadUser(currentUser.token)
            setError(null)
            
        } catch (e) {

            setError(e)

        }

    }

    return(

        <div className="Card GroceryListCard">

            <div className="title">

                <div>

                    {error && <p>{error.message}</p>}

                    <h1>
                        {groceryList.listName}
                    </h1>

                </div>

                <div className="button-space">

                    {(!currentGroceryList || currentGroceryList.id !== groceryList.id) && <button className="positive" onClick={()=>setCurrentGroceryList(groceryList)}>Edit This List</button>}
                    {(currentGroceryList && currentGroceryList.id === groceryList.id) && <button className="negative" onClick={() => {handleDelete()}}>Delete This List</button>}

                </div>

            </div>

            <div className="CardContent">

                {groceryList.recipes.map(r => <PreviewCard key={r.id} item={r.detail} currentUser={currentUser} loadUser={loadUser} currentGroceryList={currentGroceryList} groceryListId={groceryList.id}/>)}

            </div>

            <hr></hr>

            <div className="CardContent ingredients">

                {groceryList.ingredients.map(i => <IngredientCard key={i.id} ingredient={i} currentUser={currentUser} loadUser={loadUser} currentGroceryList={currentGroceryList} groceryListId={groceryList.id}/>)}

            </div>

        </div>

    )

}

export default GroceryListCard