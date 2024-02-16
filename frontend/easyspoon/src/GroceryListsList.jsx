import React, {useEffect, useState} from "react";
import { useUserContext } from "./hooks";

import GroceryListCard from "./GroceryListCard";

const GroceryListsList = () => {

    const currentUser = useUserContext();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [groceryLists, setGroceryLists] = useState([])

    if(!currentUser) {

        return <Navigate to='/'/>

    }

    useEffect(() => {

        async function getGroceryLists() {

            try {

                let groceryLists = await currentUser.userApi.getAllUsersGroceryLists(currentUser.username);

                console.log(groceryLists)

                for(let groceryList of groceryLists){

                    let recipesDetails = await Promise.all(groceryList.recipes.map(async r => await currentUser.userApi.getRecipeById(r.recipeId)));
                    let ingredientDetails = await Promise.all(groceryList.ingredients.map(async i => await currentUser.userApi.getIngredientById(i.ingredientId)))
                    console.log(recipesDetails)
                    console.log(ingredientDetails)

                    groceryList.recipes = recipesDetails;
                    groceryList.ingredients = ingredientDetails;

                }


                setGroceryLists([...groceryLists])
                setIsLoading(false)

            } catch (e) {
                setError(e);
            } finally {
                setIsLoading(false)
            }
        }

        getGroceryLists()

    },[]);

    return(

        <div>

            <h1>GroceryLists List...</h1>
            {groceryLists.map(list => <GroceryListCard key={list.id} groceryList={list}/>)}

        </div>

    )


};

export default GroceryListsList