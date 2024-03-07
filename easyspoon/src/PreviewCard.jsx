import React, {useState} from "react";

import { NavLink, useNavigate } from "react-router-dom";

import "./PreviewCard.css"
import MessageCard from "./MessageCard";

const PreviewCard = ({item, currentUser, loadUser, currentGroceryList, groceryListId, setIsLoading}) => {

    const [error, setError] = useState(null)

    const navigate = useNavigate()

    const handleAdd = async(item) => {

        setIsLoading(true)
        try {

            // if(item.title){

                await currentUser.userApi.postRecipeToGroceryList(currentGroceryList.id, item.id)
                await loadUser(currentUser.token)
                setIsLoading(false)
                navigate('/grocery-lists')

            // } else if (item.name) {

                // const ingredient = currentUser.userApi.postIngredientToGroceryList(currentGroceryList.id, item.id)
                // setIsLoading(false)
            // }

        } catch(e) {
            setError(e)

        } finally {
            setIsLoading(false)
        }

    };

    const handleDelete = async() => {

        setIsLoading(true)
        try {

            await currentUser.userApi.deleteRecipeOnGroceryList(groceryListId, item.id)
            await loadUser(currentUser.token)
            setError(null)
            setIsLoading(false)

        } catch (e) {

            setError(e)

        } finally {
            setIsLoading(false)
        }

    }

    return(

        <div className="Card PreviewCard">

            {error && <MessageCard className="error" message={error.message}/>}
            
            <div className="card-title">

            {currentUser ? <NavLink exact="true" to={`/recipes/${item.id}`}><h2 className="title-link">{item.title}</h2></NavLink> : <h2>{item.title}</h2>}

            </div>

            <div className="image-circle">
                <img src={item.image}/>
            </div>

            <div className="button-space">

                {!groceryListId && currentGroceryList && <button className="positive" onClick={() => handleAdd(item)}>Add</button>}

                {currentGroceryList && currentGroceryList.id === groceryListId && <button className="negative" onClick={()=>{handleDelete()}}>Delete</button>}

            </div>

        </div>

    )

}

export default PreviewCard