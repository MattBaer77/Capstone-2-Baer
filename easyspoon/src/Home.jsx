import React, {useContext, useEffect, useState} from "react";
import { NavLink } from "react-router-dom";

import EasySpoonAPI from "./Api";
import { useUserContext } from "./hooks.jsx";

import PreviewCard from "./PreviewCard.jsx";
import "./Content.css"
import "./Home.css"

const Home = () => {

    const {currentUser, loadUser, currentGroceryList} = useUserContext()

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
                    recipes = currentUser.cache
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
            <div className="Content Home">
                <h3>Loading...</h3>
            </div>
        )
    }

    if (error) {

        return (

            <div className="Content Home">
                <h3>Error Loading Homepage</h3>
                <p>{JSON.stringify(error)}</p>
            </div>

        )
    }

    if (currentUser) {
        return (
            <div className="Content Home">
    
                <h1>Welcome
                    <NavLink exact="true" to={'/user'}> {currentUser.username}, </NavLink>
                    happy cooking!</h1>

                {recipesCache.map(r => <PreviewCard key={r.id} item={r} currentUser={currentUser} loadUser={loadUser} currentGroceryList={currentGroceryList}/>)}
            
            </div>
        )
    } else {
        return (
            <div className="Content Home">

                <h1>
                    <NavLink exact="true" to={'/login'}>Login </NavLink>
                    or
                     <NavLink exact="true" to={'/signup'}> Signup, </NavLink>
                    and lets get cooking!
                </h1>

                {recipesCache.map(r => <PreviewCard key={r.id} item={r}/>)}

            </div>
        )
    }

}

export default Home;