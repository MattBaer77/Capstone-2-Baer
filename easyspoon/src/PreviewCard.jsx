import React, {useState} from "react";

import { NavLink } from "react-router-dom";

import "./PreviewCard.css"
import { useUserContext } from "./hooks";

const PreviewCard = ({item, currentUser, loadUser, currentGroceryList, groceryListId}) => {

    const [error, setError] = useState(null)

    const handleAdd = async(item) => {

        console.log(item)
        console.log(currentGroceryList)
        try {

            if(item.title){

                await currentUser.userApi.postRecipeToGroceryList(currentGroceryList.id, item.id)
                await loadUser(currentUser.token)

            } else if (item.name) {

                // const ingredient = currentUser.userApi.postIngredientToGroceryList(currentGroceryList.id, item.id)
                console.log(item.name)
            }

        } catch(e) {
            // console.error(e)
            setError(e)
        }

    };

    const handleDelete = async() => {

        try {

            await currentUser.userApi.deleteRecipeOnGroceryList(groceryListId, item.id)
            await loadUser(currentUser.token)
            setError(null)

        } catch (e) {

            setError(e)

        }

    }

    return(

        <div className="Card PreviewCard">

            <div className="center">

                {error && <p>{error.message}</p>}

                {currentUser ? <NavLink exact="true" to={`/recipes/${item.id}`}><h2 className="title-link">{item.title}</h2></NavLink> : <h2>{item.title}</h2>}

                <div className="image-circle">
                    <img src={item.image}/>
                </div>

                {!groceryListId && currentGroceryList && <button onClick={() => handleAdd(item)}>Add</button>}

                {currentGroceryList && currentGroceryList.id === groceryListId && <button onClick={()=>{handleDelete()}}>Delete</button>}

            </div>


        </div>

    )

}

export default PreviewCard