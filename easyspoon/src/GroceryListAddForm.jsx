import React, {useState} from "react";

import { Navigate } from "react-router-dom";

import { useUserContext } from "./hooks";

import MessageCard from "./MessageCard";

import './Card.css'
import './GroceryListAddForm.css'

const GroceryListAddForm = () => {

    const {currentUser, loadUser} = useUserContext();

    const INITIAL_STATE = {

        listName:`${currentUser.username}'s Grocery List`

    };

    const [formData, setFormData] = useState(INITIAL_STATE);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState(null);

    if (!currentUser) {

        return <Navigate to='/login'/>

    };

    const handleChange = (e) => {

        const {name, value} = e.target;

        setFormData((data) => {

            return {
                ...data,
                [name]:value
            }

        })

    }

    const handleSubmit = async(e) => {

        e.preventDefault();

        let listName = {...formData}

        try {

            const res = await currentUser.userApi.createGroceryList(currentUser.username, listName)
            await loadUser(currentUser.token)
            setSuccess(`New GroceryList: "${listName.listName}" added!`)
            setError(null)

        } catch (e) {
            setError(e)
        }

    }

    return (

        <div className="Card FormCard">

            <h1>Create New Grocery List:</h1>

            {error && <MessageCard className="error" message={error.message}/>}
            {success && <MessageCard className="success" message={success}/>}

            <form className="GroceryListAddForm" onSubmit={handleSubmit}>

                <label hidden="hidden" htmlFor="listName">Grocery List Name: </label>
                <input
                    type="text"
                    placeholder="Grocery List Name"
                    name="listName"
                    id="listName"
                    value={formData.listName}
                    onChange={handleChange}
                />

                <button>Create New Grocery List</button>

            </form>

        </div>

    )

}

export default GroceryListAddForm