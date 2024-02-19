import React, {useEffect, useState} from "react";

import { Navigate } from "react-router-dom";

import EasySpoonAPI from "./Api";
import { useUserContext } from "./hooks";

import './Form.css'

const UserIntolerancesEditForm = () => {

    const {currentUser, loadUser} = useUserContext()

    const INITIAL_STATE = currentUser.intolerances

    const [intolerancesAll, setIntolerancesAll] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const [formData, setFormData] = useState(INITIAL_STATE)
    const [success, toggleSuccess] = useState("")
    const [error, setError] = useState(null)

    console.log(formData)

    if (!currentUser.token) {

        return <Navigate to='/login'/>

    }

    useEffect(() => {

        async function getIntolerancesAllList() {

            try {

                const {intolerances} = await EasySpoonAPI.getIntolerancesAll();

                console.log(intolerances)

                setIntolerancesAll([...intolerances])
                setIsLoading(false)

            } catch (e) {
                console.log("ERRORRROROROROR")
                setError(e)
            } finally {
                setIsLoading(false);
            }

        }

        getIntolerancesAllList();

    }, []);

    if (isLoading) {
        return <p>Loading...</p>
    }

    if (error) {

        return (

            <div className="Content">
                <p>Error!</p>
                <p>{JSON.stringify(error)}</p>
            </div>

        )
    }

    return (

        <div className="Form UserIntolerancesForm">

            <p>{JSON.stringify(intolerancesAll)}</p>
            <p>{JSON.stringify(formData)}</p>

        </div>

    )

}

export default UserIntolerancesEditForm;