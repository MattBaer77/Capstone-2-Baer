import React, {useContext, useEffect, useState} from "react";

import EasySpoonAPI from "./Api";

import { useUserContext } from "./hooks.jsx";

import PreviewCard from "./PreviewCard.jsx";
// import "./List.css"

const Home = () => {

    const currentUser = useUserContext()

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [recipesCache, setRecipesCache] = useState([])


    useEffect(() => {

        async function getCache() {

            try {
                // let recipes = await EasySpoonAPI.getRecipesCache();
                let recipes;
                if(currentUser) {
                    console.log("THERE IS A USER")
                    // recipes = await currentUser.userApi.getUserCacheOnly(currentUser.username);
                    recipes = await currentUser.userApi.getRecipesCache();
                } else {
                    console.log("NO USER")
                    recipes = await EasySpoonAPI.getRecipesCache();
                }
                setRecipesCache([...recipes])
                setIsLoading(false)

            } catch (e) {
                setError(e)
            } finally {
                setIsLoading(false);
            }

        }

        getCache();

    }, []);

    if (isLoading) {
        return (
            <div>
                <h3>Loading...</h3>
            </div>
        )
    }

    if (error) {

        return (

            <div>
                <h3>Error Loading Homepage</h3>
                <p>{JSON.stringify(error)}</p>
            </div>

        )
    }

    if (currentUser) {
        return (
            <div>
    
                <h1>{currentUser.username}</h1>

                {recipesCache.map(r => <PreviewCard key={r.id} item={r}/>)}
    
    
            </div>
        )
    } else {
        return (
            <div>
    
                <h1>No User!</h1>

                {recipesCache.map(r => <PreviewCard key={r.id} item={r}/>)}

            </div>
        )
    }

}

export default Home;