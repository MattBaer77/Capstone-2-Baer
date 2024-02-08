import React from "react";

import {useUserContext} from "./UserProvider.jsx"

const UserCard = () => {

    const currentUser = useUserContext();

    

    return(
        <div className="Card">

            <p>{JSON.stringify(currentUser)}</p>

        </div>
    )

}

export default UserCard