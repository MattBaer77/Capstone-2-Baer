import React, {useContext} from "react";

import { useUserContext } from "./hooks";

import { NavLink } from "react-router-dom";

import "./NavBar.css"

const NavBar = () => {

    const {currentUser} = useUserContext()

    if(currentUser) {

        return(
            
            <div className="NavBar">

                <h2 className="wordmark"><NavLink exect="true" to={'/'}>easyspoon</NavLink></h2>
                <NavLink exact="true" to={'/grocery-lists'}>Grocery Lists</NavLink>
                <NavLink exact="true" to={'/recipes'}>Recipes</NavLink>
                <NavLink exact="true" to={'/ingredients'}>Ingredients</NavLink>

                <p>|</p>

                <NavLink exact="true" to={'/logout'}>Log Out</NavLink>
                <NavLink exact="true" to={'/user'}>{currentUser.username}</NavLink>

            </div>
        )


    }

    return (

        <div className="NavBar">

            <h2 className="wordmark"><NavLink exect="true" to={'/'}>easyspoon</NavLink></h2>

            <NavLink exact="true" to={'/login'}> Login </NavLink>

            <p>|</p>

            <NavLink exact="true" to={'/signup'}> Signup </NavLink>

        </div>

    )

}

export default NavBar;