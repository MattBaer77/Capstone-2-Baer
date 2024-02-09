import React, {useContext, useEffect, useState} from "react";

import EasySpoonAPI from "./Api";

import { useUserContext } from "./UserProvider";

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
                if(Object.keys(currentUser).length !== 0) {
                    console.log("THERE IS A USER")
                    console.log(currentUser)
                    console.log(currentUser.userApi)
                    recipes = await currentUser.userApi.getRecipesCache();
                    console.log(recipes)
                } else {
                    console.log("NO USER")
                    recipes = await EasySpoonAPI.getRecipesCache();
                }
                setRecipesCache([...recipes])
                setIsLoading(false)

            } catch (e) {
                console.log(e)
                setError(e)
            } finally {
                setIsLoading(false);
            }

        }

        getCache();

    }, [currentUser]);

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
                <p>{error.message}</p>
            </div>

        )
    }

    if (Object.keys(currentUser).length !== 0) {
        return (
            <div className="List">
    
                <h1>{currentUser.username}</h1>
    
                <p>{JSON.stringify(recipesCache)}</p>
    
            </div>
        )
    } else {
        return (
            <div className="List">
    
                <h1>No User!</h1>

                <p>{JSON.stringify(recipesCache)}</p>

            </div>
        )
    }

}

export default Home;