import React, {useState} from "react";

import { useNavigate, Navigate } from "react-router-dom";

const IngredientAddForm = ({currentUser, loadUser, currentGroceryList, ingredient}) => {

    const INITIAL_STATE = {

        ingredientId: ingredient.detail.id,
        amount: 0,
        unit: "",
        minimumAmount: 0,

    }

    const [formData, setFormData] = useState(INITIAL_STATE);
    const [error, setError] = useState(null)

    const handleChange = (e) => {

        const {name, value} = e.target;

        const parsedValue = name === "amount" || name === "minimumAmount" ? parseInt(value, 10) : value;

        console.log(name)
        console.log(value)

        setFormData((data) => {

            return {
                ...data,
                [name]:parsedValue
            }

        })

    };

    const handleSelect = (e) => {

        console.log(e)

    }

    const handleSubmit = async(e) => {

        e.preventDefault();
        const ingredientData = {...formData}

        try {

            // NEED ALT FOR editIngredientOnGroceryList
            // NEED TO BE ABLE TO DELETE FROM GROCERYLIST AS WELL (HANDLE UP A LEVEL)
            // NO - Load IngredientAdd or IngredientEdit conditionally - ANOTHER FORM

            await currentUser.userApi.postIngredientToGroceryList(currentGroceryList.id, ingredientData)
            loadUser(currentUser.token)
            setError(null)


        } catch(e) {
            setError(e)
        }

    };

    return (

        <div className="Form">

        {error && <p>{error.message}</p>}

        <h2>Ingredient</h2>

        <form onSubmit={handleSubmit}>

            <label htmlFor="amount">Amount: </label>
            <input
                type="number"
                placeholder="amount"
                name="amount"
                id="amount"
                value={formData.amount}
                onChange={handleChange}
            />

            {/* UPDATE BELOW BASED ON possibleUnits - make select */}

            <label htmlFor="unit">Unit: </label>
            <select
                name="unit"
                id="unit"
                value={formData.unit}
                onChange={handleChange}
            >
                {ingredient.detail.possibleUnits.map((option) => {

                    return (
                        <option key ={option} value={option}>
                        {option}
                        </option>
                    )

                })}

            </select>

            <button>Add</button>

        </form>

        </div>

    )

};

export default IngredientAddForm;