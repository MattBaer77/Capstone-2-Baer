import React, {useState} from "react";

import { Navigate } from "react-router-dom";

import { useUserContext } from "./hooks";

import './Form.css'

const GroceryListAddForm = () => {

    const {currentUser, loadUser} = useUserContext();

    const INITIAL_STATE = {

        listName:`${currentUser.username}'s Grocery List`

    };

    const [formData, setFormData] = useState(INITIAL_STATE);
    const [success, toggleSuccess] = useState("");
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

        console.log(currentUser.username)
        console.log(listName)

        try {

            const res = await currentUser.userApi.createGroceryList(currentUser.username, listName)
            console.log(res)
            await loadUser(currentUser.token)
            setError(null)

        } catch (e) {
            console.log(e)
            setError(e)
        }

    }

    return (

    <div className="Form">

        <h2>Create New Grocery List:</h2>

        {error && <p className="Error">{error}</p>}
        {success && <p className="Success">{success}</p>}

        <form onSubmit={handleSubmit}>

            <label htmlFor="listName">Grocery List Name: </label>
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