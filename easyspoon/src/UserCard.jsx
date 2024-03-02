import React from "react";

import {useUserContext} from "./hooks.jsx"

const UserCard = () => {

    const {currentUser} = useUserContext();
    
    return(
        <div className="Card">

            <p>{JSON.stringify(currentUser.intolerances)}</p>

        </div>
    )

}

export default UserCard