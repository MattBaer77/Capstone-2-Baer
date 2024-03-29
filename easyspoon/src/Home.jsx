import React, {useContext, useEffect, useState} from "react";
import { NavLink } from "react-router-dom";

import EasySpoonAPI from "./Api";
import { useUserContext } from "./hooks.jsx";

import PreviewCard from "./PreviewCard.jsx";
import MessageCard from "./MessageCard";
import LoadingCard from "./LoadingCard";

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
                let recipes;
                if(currentUser) {
                    recipes = currentUser.cache
                } else {
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

    if (currentUser) {

        return (

            <div className="Home">

                <h1>Welcome
                    <NavLink exact="true" to={'/user'}> {currentUser.username}, </NavLink>
                    happy cooking!
                </h1>

                <div className="Content">

                    {recipesCache.map(r => <PreviewCard key={r.id} item={r} currentUser={currentUser} loadUser={loadUser} currentGroceryList={currentGroceryList} setIsLoading={setIsLoading}/>)}
                
                </div>

            </div>
        )

    } else {

        return (

            <div className="Home">

                <h1>
                    <NavLink exact="true" to={'/login'}>Login </NavLink>
                    or
                     <NavLink exact="true" to={'/signup'}> Signup, </NavLink>
                    and lets get cooking!
                </h1>

                <div className="Content">

                    {recipesCache.map(r => <PreviewCard key={r.id} item={r}/>)}

                </div>

            </div>

        )

    }

}

export default Home;