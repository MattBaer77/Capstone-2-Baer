import React, {useState} from "react";

import { useNavigate, Navigate } from "react-router-dom";

const IngredientEditForm = ({currentUser, loadUser, currentGroceryList, ingredient}) => {

    const INITIAL_STATE = {

        ingredientId: ingredient.ingredientId,
        amount: ingredient.amount,
        unit: ingredient.unit,
        minimumAmount: ingredient.minimumAmount,

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

    const handleSubmit = async(e) => {

        e.preventDefault();
        const ingredientData = {amount:formData.amount}

        try {

            console.log(ingredientData)

            await currentUser.userApi.patchAmountIngredientOnGroceryList(currentGroceryList.id, ingredient.ingredientId, ingredientData)
            await loadUser(currentUser.token)
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

            <label htmlFor="unit">Unit: </label>
            <select
                name="unit"
                id="unit"
                value={formData.unit}
                disabled
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

export default IngredientEditForm;