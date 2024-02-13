import React, {useContext} from "react";

import { useUserContext } from "./hooks";

import { NavLink } from "react-router-dom";

import "./NavBar.css"

const NavBar = () => {

    const currentUser = useUserContext()

    if(currentUser) {

        return(
            
            <div className="NavBar">

                <h2 className="wordmark"><NavLink exect="true" to={'/'}>easyspoon</NavLink></h2>
                <NavLink exact="true" to={'/user'}>Profile: {currentUser.username}</NavLink>
                <NavLink exact="true" to={'/grocery-lists'}>{currentUser.username}'s Grocery Lists</NavLink>
                <NavLink exact="true" to={'/recipes'}>Recipes</NavLink>
                <NavLink exact="true" to={'/ingredients'}>Ingredients</NavLink>
                {/* <NavLink exact="true" to={'/recipes/1001'}>Go To Recipe 1001</NavLink> */}

            </div>
        )


    }

    return (

        <div className="NavBar">

            <h2 className="wordmark"><NavLink exect="true" to={'/'}>easyspoon</NavLink></h2>

        </div>

    )

}

export default NavBar;