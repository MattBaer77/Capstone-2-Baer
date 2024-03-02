import React, {useEffect, useState} from "react";
import { useUserContext } from "./hooks";

import GroceryListAddForm from "./GroceryListAddForm";
import GroceryListCard from "./GroceryListCard";

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

    },[currentUser]);

    return(

        <div>

            <GroceryListAddForm/>

            {groceryLists.map(list => <GroceryListCard key={list.id} groceryList={list} currentUser={currentUser} loadUser={loadUser} currentGroceryList={currentGroceryList} setCurrentGroceryList={setCurrentGroceryList}/>)}

        </div>

    )


};

export default GroceryListsList