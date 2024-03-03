import React, {useEffect, useState} from "react";
import { useUserContext } from "./hooks";

import PreviewCard from "./PreviewCard";
import SearchForm from "./SearchForm";
import MessageCard from "./MessageCard";
import LoadingCard from "./LoadingCard";

import "./RecipesList.css"

const RecipesList = () => {

    const {currentUser, loadUser, currentGroceryList} = useUserContext();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recipes, setRecipes] = useState([])

    if(!currentUser) {

        return <Navigate to='/'/>

    }

    useEffect(() => {

        async function getCache() {

            try {

                let recipes = currentUser.cache;

                setRecipes([...recipes])
                setIsLoading(false)


            } catch (e) {
                setError(e);
            } finally {
                setIsLoading(false);
            }

        }

        getCache();

    }, []);

    const handleSearch = async (data) => {

        if (!data.searchTerms) {

            let recipes = await currentUser.cache
            console.log(recipes)
            setRecipes([...recipes])

        } else {

            const search = {
                query: data.searchTerms,
                intolerances:currentUser.intolerances
            }
            let recipes = await currentUser.userApi.getRecipesSearch(search)
            console.log(recipes)
            setRecipes([...recipes])

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

    if (recipes.length === 0) {

        return (

            <div className="RecipesList">

                <SearchForm handleSearch={handleSearch}/>

                <div className="Content">

                    <h2>No recipes match your search criteria.</h2>

                </div>

            </div>

        )

    }

    return(

        <div className="RecipesList">

            <SearchForm handleSearch={handleSearch}/>

            <div className="Content">

                {recipes.map(r => <PreviewCard key={r.id} item={r} currentUser={currentUser} loadUser={loadUser} currentGroceryList={currentGroceryList}/>)}

            </div>

        </div>

    )

};

export default RecipesList