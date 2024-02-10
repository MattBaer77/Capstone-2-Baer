import React, {useContext} from "react";

import { useUserContext } from "./hooks";

import { NavLink } from "react-router-dom";

// import "./NavBar.css"

const NavBar = () => {

    const currentUser = useUserContext()

    if(currentUser) {

        return(
            <div className="NavBar">

                <h2 className="wordmark"><NavLink exect="true" to={'/'}>easyspoon</NavLink></h2>
                <NavLink exact="true" to={'/user'}>{currentUser.username}</NavLink>

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