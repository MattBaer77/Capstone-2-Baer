import React, {useState} from "react";

import MessageCard from "./MessageCard";

import "./Form.css"
import { useEffect } from "react";

const IngredientAddForm = ({currentUser, loadUser, currentGroceryList, ingredient, possibleUnits, setIsLoading}) => {

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

        setIsLoading(true)

        const ingredientData = {...formData}

        try {

            await currentUser.userApi.postIngredientToGroceryList(currentGroceryList.id, ingredientData)

            // CHECK currentUser BEFORE
            console.log(currentUser)
            // CHECK currentGroceryList BEFORE
            console.log(currentGroceryList)

            // DO NOT FULLY RELOAD USER
            // await loadUser(currentUser.token)

            /* THIS APPROACH DOES NOT LOAD DETAILS AND THEREFORE DOES NOT WORK -
                // INSTEAD - INDIVIDUAL SIDE EFFECTS
                // GET UPDATED GROCERY LIST
                // const updatedGroceryList = await currentUser.userApi.getGroceryListById(currentGroceryList.id)
                // console.log(updatedGroceryList)

                // REPLACE IN currentGroceryList
                // currentGroceryList = updatedGroceryList

                // REPLACE IN currentUser.groceryLists
                // const updatedGroceryLists = currentUser.groceryLists.map(list => list.id === updatedGroceryList.id ? list = updatedGroceryList : list)
                // console.log(updatedGroceryLists)

                // currentUser.groceryLists = updatedGroceryLists

            */

            // INSTEAD - INDIVIDUAL SIDE EFFECTS

            // UPDATE currentGroceryList

            // do not reload currentGroceryList and lose details of all ingredients and recipes

            console.log(ingredientData)

            console.log(ingredient)

            // get details of newly added ingredient
            // const ingredientDetail = await currentUser.userApi.getIngredientById(ingredientData.ingredientId);
            // NOT NEEDED IF GOTTEN FROM ingredient.detail (BELOW)

            // structure newly added ingredient correctly
            // ingredientData['detail'] = ingredientDetail
            // NOT NEEDED IF GOTTEN FROM ingredient.detail (BELOW)
            ingredientData['detail'] = ingredient.detail

            console.log(ingredientData)

            // Update currentGroceryList.ingredients by adding new ingredient
            currentGroceryList.ingredients.push(ingredientData)

            // MAY NOT NEED DUE TO REFERENCE BETWEEN currentUser.groceryLists and currentGroceryList

                // REPLACE just same ID grocery list as currentGroceryList in currentUser.groceryLists
                // May be able to use code from above?
                // const updatedGroceryLists = currentUser.groceryLists.map(list => list.id === currentGroceryList.id ? list = currentGroceryList : list)
                // console.log(updatedGroceryLists)

                // currentUser.groceryLists = updatedGroceryLists

            // MAY NOT NEED DUE TO REFERENCE BETWEEN currentUser.groceryLists and currentGroceryList


            // CHECK currentUser AFTER
            console.log(currentUser)
            // CHECK currentGroceryList AFTER
            console.log(currentGroceryList)

            setError(null)
            setSuccess("Ingredient Successfully Added")
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