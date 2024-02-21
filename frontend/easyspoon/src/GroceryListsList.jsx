import React, {useEffect, useState} from "react";
import { useUserContext } from "./hooks";

import GroceryListCard from "./GroceryListCard";

const GroceryListsList = () => {

    const {currentUser, currentGroceryList, setCurrentGroceryList} = useUserContext();

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

                console.log(currentUser.getGroceryLists)

                setGroceryLists([...groceryLists])
                setIsLoading(false)

            } catch (e) {
                setError(e);
            } finally {
                setIsLoading(false)
            }
        }

        getGroceryLists()

    },[]);

    return(

        <div>

            {groceryLists.map(list => <GroceryListCard key={list.id} groceryList={list} currentUser={currentUser} currentGroceryList={currentGroceryList} setCurrentGroceryList={setCurrentGroceryList}/>)}

        </div>

    )


};

export default GroceryListsList