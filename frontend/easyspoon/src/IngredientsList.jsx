import React, {useEffect, useState} from "react";
import { useUserContext } from "./hooks";
import { removeDuplicateById } from "./helpers";

import IngredientCard from "./IngredientCard";
import SearchForm from "./SearchForm";

const IngredientsList = () => {

    const currentUser = useUserContext();

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
                setIngredients([...ingredientsNoDuplicates])

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
            console.log(ingredients)
            setIngredients([...ingredients])

        }


    }

    if (isLoading) {
        return <p>Loading Ingredients...</p>
    }

    if (ingredients.length === 0) {

        return (

            <div className="Content IngredientsList">

                <SearchForm handleSearch={handleSearch}/>

                <h2>No ingredients match your search criteria.</h2>

            </div>
        )
    }

    if (error) {

        return (

            <div className="Content RecipesList">
                <h3>Error Loading Ingredients</h3>
                <p>{JSON.stringify(error)}</p>
            </div>

        )

    }

    return(

        <div className="Content RecipesList">

            <SearchForm handleSearch={handleSearch}/>

            {ingredients.map(i => <IngredientCard key={i.id} ingredient={i}/>)}

        </div>

    )

};

export default IngredientsList