import React, {useState} from "react";

import MessageCard from "./MessageCard";

import "./Form.css"
import { useEffect } from "react";

const IngredientAddForm = ({currentUser, loadUser, currentGroceryList, ingredient, possibleUnits}) => {

    const INITIAL_STATE = {

        ingredientId: ingredient.detail.id,
        amount: 0,
        unit: "",
        minimumAmount: 0,

    }

    const [formData, setFormData] = useState(INITIAL_STATE);
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const handleChange = (e) => {

        const {name, value} = e.target;
        const parsedValue = name === "amount" || name === "minimumAmount" ? parseInt(value, 10) : value;

        setFormData((data) => {

            return {
                ...data,
                [name]:parsedValue
            }

        })

    };

    const handleSubmit = async(e) => {

        e.preventDefault();
        const ingredientData = {...formData}

        try {

            await currentUser.userApi.postIngredientToGroceryList(currentGroceryList.id, ingredientData)
            await loadUser(currentUser.token)
            setError(null)
            setSuccess("Ingredient Successfully Added")

        } catch(e) {
            setError(e)
        }

    };

    return (

        <div className="Form">

            {error && <MessageCard className={"error"} message={error.message}/>}
            {success && <MessageCard className={"success"} message={success}/>}

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
                onChange={handleChange}
            >
                {possibleUnits.map((option) => {

                    return (
                        <option key ={option} value={option}>
                        {option}
                        </option>
                    )

                })}

            </select>

            <button className="positive">Add</button>

        </form>

        </div>

    )

};

export default IngredientAddForm;