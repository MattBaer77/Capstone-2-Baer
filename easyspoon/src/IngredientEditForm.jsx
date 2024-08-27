import React, {useState, useEffect} from "react";

import { useNavigate, Navigate } from "react-router-dom";

import MessageCard from "./MessageCard";

import "./Form.css"

const IngredientEditForm = ({currentUser, loadUser, currentGroceryList, ingredient, possibleUnits, setIsLoading}) => {

    // const INITIAL_STATE = {

    //     ingredientId: ingredient.ingredientId,
    //     amount: ingredient.amount,
    //     unit: ingredient.unit,
    //     minimumAmount: ingredient.minimumAmount,

    // }

    // const [formData, setFormData] = useState(INITIAL_STATE);

    const [formData, setFormData] = useState({
        ingredientId: ingredient.ingredientId,
        amount: ingredient.amount,
        unit: ingredient.unit,
        minimumAmount: ingredient.minimumAmount,
    });

    useEffect(() => {
        setFormData({
            ingredientId: ingredient.ingredientId,
            amount: ingredient.amount,
            unit: ingredient.unit,
            minimumAmount: ingredient.minimumAmount,
        });
    }, [ingredient]);

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

        setIsLoading(true)
        
        const ingredientData = {amount:formData.amount}

        try {

            const res = await currentUser.userApi.patchAmountIngredientOnGroceryList(currentGroceryList.id, ingredient.ingredientId, ingredientData)
            // console.log(res)

            // DO NOT FULLY RELOAD USER
            await loadUser(currentUser.token)

            // INSTEAD - INDIVIDUAL SIDE EFFECTS

            // UPDATE ingredient

            ingredient.amount = ingredientData.amount

            // UPDATE currentGroceryList - MAY NOT NEED DUE TO REFERENCE TO "INGREDIENT"
            // UPDATE currentUser.groceryLists - MAY NOT NEED DUE TO REFERENCE TO "INGREDIENT"
            
            console.log(ingredient)
            console.log(ingredientData)
            console.log(currentGroceryList)
            console.log(currentUser)


            setError(null)
            setSuccess("Ingredient Successfully Updated")
            setIsLoading(false)

        } catch(e) {
            setError(e)
        } finally {
            setIsLoading(false)
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
                disabled
            >
                {possibleUnits.map((option) => {

                    return (
                        <option key ={option} value={option}>
                        {option}
                        </option>
                    )

                })}

                {/* <option key ={ingredient.unit} value={ingredient.unit}>
                {ingredient.unit}
                </option> */}

            </select>

            <button className="positive">Save Changes</button>

        </form>

        </div>

    )

};

export default IngredientEditForm;