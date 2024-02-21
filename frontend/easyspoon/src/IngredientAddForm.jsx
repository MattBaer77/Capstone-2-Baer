import React, {useState} from "react";

import { useNavigate, Navigate } from "react-router-dom";

const IngredientAddForm = ({currentUser, ingredient}) => {

    const INITIAL_STATE = {

        amount:"",
        unit:"",

    }

    const [formData, setFormData] = useState(INITIAL_STATE);
    const [error, setError] = useState(null)

    const handleChange = (e) => {

        const {name, value} = e.target;

        setFormData((data) => {

            return {
                ...data,
                [name]:value
            }

        })

    };

    const handleSubmit = async(e) => {

        e.preventDefault();
        const ingredientData = {...formData}

        try {

            // NEED ALT FOR editIngredientOnGroceryList
            // NEED TO BE ABLE TO DELETE FROM GROCERYLIST AS WELL (HANDLE UP A LEVEL)
            // NO - Load IngredientAdd or IngredientEdit conditionally - ANOTHER FORM

            await currentUser.userApi.postIngredientToGroceryList(ingredient.id, ingredientData)
            setError(null)


        } catch(e) {
            setError(e)
        }

    };

    return (

        <div className="Form">

        {error && <p>{error.message}</p>}

        <h2>Add? Edit? Ingredient</h2>

        <form onSubmit={handleSubmit}>

            <label htmlFor="amount">Username: </label>
            <input
                type="number"
                placeholder="amount"
                name="amount"
                id="amount"
                value={formData.amount}
                onChange={handleChange}
            />

            {/* UPDATE BELOW BASED ON possibleUnits - make select */}

            <label htmlFor="unit">Password: </label>
            <input
                type="number"
                placeholder="unit"
                name="unit"
                id="unit"
                value={formData.unit}
                onChange={handleChange}
            />

            <button>Add? Edit?</button>

        </form>

        </div>

    )

};

export default IngredientAddForm;