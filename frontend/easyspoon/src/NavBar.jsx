import React, {useContext} from "react";

import { useUserContext } from "./hooks";

import { NavLink } from "react-router-dom";

// import "./NavBar.css"

const NavBar = () => {

    const currentUser = useUserContext()

    if(currentUser.token) {

        return(
            <div className="NavBar">

                <h2 className="wordmark"><NavLink exect="true" to={'/'}>easyspoon</NavLink></h2>
                <NavLink exact="true" to={'/user'}>{currentUser.username}</NavLink>
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