import React, {useEffect, useState} from "react";
import { useUserContext } from "./hooks";

import GroceryListAddForm from "./GroceryListAddForm";
import GroceryListCard from "./GroceryListCard";
import MessageCard from "./MessageCard";
import LoadingCard from "./LoadingCard";

import "./GroceryListsList.css"

const GroceryListsList = () => {

    const {currentUser, loadUser, currentGroceryList, setCurrentGroceryList} = useUserContext();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [groceryLists, setGroceryLists] = useState([])

    if(!currentUser) {

        return <Navigate to='/'/>

    }

    useEffect(() => {

        async function getGroceryLists() {

            try {

                let groceryLists = currentUser.groceryLists;

                setGroceryLists([...groceryLists])
                setIsLoading(false)

            } catch (e) {
                setError(e);
            } finally {
                setIsLoading(false)
            }
        }

        getGroceryLists()

    },[currentUser]);

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

    return(

        <div className="GroceryListsList">

            <GroceryListAddForm/>

            <div className="Content">

                {groceryLists.map(list => <GroceryListCard key={list.id} groceryList={list} currentUser={currentUser} loadUser={loadUser} currentGroceryList={currentGroceryList} setCurrentGroceryList={setCurrentGroceryList}/>)}

            </div>

        </div>

    )


};

export default GroceryListsList