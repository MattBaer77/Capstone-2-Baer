import React from "react";

import { NavLink } from "react-router-dom";

import "./PreviewCard.css"
import { useUserContext } from "./hooks";

const PreviewCard = ({item, currentUser, loadUser, currentGroceryList}) => {

    // console.log(currentGroceryList)

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
            console.error(e)
        }

    };

    return(

        <div className="PreviewCard">

            <div className="center">

                {currentUser ? <NavLink exact="true" to={`/recipes/${item.id}`}><h2>{item.title}</h2></NavLink> : <h2>{item.title}</h2>}

                <div className="image-circle">
                    <img src={item.image}/>
                </div>

                {currentGroceryList && <button onClick={() => handleAdd(item)}>Add</button>}

            </div>


        </div>

    )

}

export default PreviewCard