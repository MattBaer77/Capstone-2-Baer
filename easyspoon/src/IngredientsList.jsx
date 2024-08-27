import React, {useEffect, useState} from "react";
import { useUserContext } from "./hooks";
import { removeDuplicateById } from "./helpers";

import IngredientCard from "./IngredientCard";
import SearchForm from "./SearchForm";
import MessageCard from "./MessageCard";
import LoadingCard from "./LoadingCard";

import "./IngredientsList.css"

const IngredientsList = () => {

    const {currentUser} = useUserContext();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ingredients, setIngredients] = useState([])

    if(!currentUser) {

        return <Navigate to='/'/>

    }

    useEffect(() => {

        async function getIngredients() {

            try {

                let ingredients = currentUser.cache.flatMap(r => r.extendedIngredients)
                const ingredientsNoDuplicates = removeDuplicateById(ingredients)
                const ingredientsNoDuplicatesTruncated = ingredientsNoDuplicates.slice(0,12) // LIMIT TO 12 TO MITIGATE RATE LIMITING

                for(let ingredient of ingredientsNoDuplicatesTruncated) {
                    ingredient.amount = null
                    ingredient.unit = null
                }

                setIngredients([...ingredientsNoDuplicatesTruncated])
                setIsLoading(false);

            } catch (e) {
                setError(e);
            } finally {
                setIsLoading(false);
            }

        }

        getIngredients();

    },[]);

    const handleSearch = async (data) => {

        if (!data.searchTerms) {

            let ingredients = currentUser.cache.flatMap(r => r.extendedIngredients)
            const ingredientsNoDuplicates = removeDuplicateById(ingredients)
            setIngredients([...ingredientsNoDuplicates])

        } else {

            const search = {
                query: data.searchTerms,
                intolerances:currentUser.intolerances
            }
            let ingredients = await currentUser.userApi.getIngredientsSearch(search)
            setIngredients([...ingredients])

        }


    }

    if (isLoading) {
        return (

            <LoadingCard/>

        )
    }

    if (error) {

        return (

            <div className="Err">

                {error && <MessageCard className="error" message={error.message}/>}

            </div>

        )

    }

    if (ingredients.length === 0) {

        return (

            <div className="IngredientsList">

                <SearchForm handleSearch={handleSearch}/>

                <div className="Content ingredients">

                    <h2>No ingredients match your search criteria.</h2>

                </div>

            </div>

        )
    }

    return(

        <div className="IngredientsList">

            <SearchForm handleSearch={handleSearch}/>

            <div className="Content ingredients">

                {ingredients.map(i => <IngredientCard key={i.id} ingredient={i}/>)}

            </div>

        </div>

    )

};

export default IngredientsList