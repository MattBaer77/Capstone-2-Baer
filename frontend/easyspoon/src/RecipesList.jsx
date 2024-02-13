import React, {useEffect, useState} from "react";
import { useUserContext } from "./hooks";
import RecipeCard from "./RecipeCard";
import PreviewCard from "./PreviewCard";
import SearchForm from "./SearchForm"

const RecipesList = () => {

    const currentUser = useUserContext();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recipes, setRecipes] = useState([])

    if(!currentUser) {

        return <Navigate to='/'/>

    }

    useEffect(() => {

        async function getCache() {

            try {

                // ACTUAL
                // let recipes = await currentUser.userApi.getUserCacheOnly(currentUser.username);

                // TEMP
                let recipes = await currentUser.userApi.getRecipesCache();

                setRecipes([...recipes])
                setIsLoading(false)


            } catch (e) {
                setError(e)
            } finally {
                setIsLoading(false);
            }

        }

        getCache();

    }, []);

    const handleSearch = async (data) => {

        if (!data.searchTerms) {

            let recipes = await currentUser.userApi.getRecipesCache();

        } else {

            const search = {query: data.searchTerms}
            let recipes = await currentUser.userApi.getRecipesSearch(search)
            console.log(recipes)
            setRecipes([...recipes])
        }


    }

    if (isLoading) {
        return <p>Loading Recipes...</p>
    }

    if (recipes.length === 0) {

        return (

            <div className="Content RecipesList">

                <SearchForm handleSearch={handleSearch}/>

                <h2>No recipes match your search criteria.</h2>

            </div>

        )

    }

    if (error) {

        return (

            <div className="Content RecipesList">
                <h3>Error Loading Homepage</h3>
                <p>{JSON.stringify(error)}</p>
            </div>

        )

    }


    return(

        <div className="Content RecipesList">

        <SearchForm handleSearch={handleSearch}/>

        {recipes.map(r => <PreviewCard key={r.id} item={r}/>)}

    </div>
    )


};

export default RecipesList