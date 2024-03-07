import React, {useEffect, useState} from "react";

import { Navigate } from "react-router-dom";

import EasySpoonAPI from "./Api";
import { useUserContext } from "./hooks";
import MessageCard from "./MessageCard";
import LoadingCard from "./LoadingCard";

import './Form.css'

const UserIntolerancesEditForm = () => {

    const {currentUser, loadUser} = useUserContext()

    const [intolerancesAll, setIntolerancesAll] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const [formData, setFormData] = useState([])
    const [success, toggleSuccess] = useState(null)
    const [error, setError] = useState(null)

    if (!currentUser) {

        return <Navigate to='/login'/>

    }

    useEffect(() => {

        async function getIntolerancesAllList() {

            try {

                const {intolerances} = await EasySpoonAPI.getIntolerancesAll();

                setIntolerancesAll([...intolerances])
                setFormData([...currentUser.intolerances])
                setIsLoading(false)

            } catch (e) {
                setError(e)
            } finally {
                setIsLoading(false);
            }

        }

        getIntolerancesAllList();

    }, [currentUser]);

    const handleToggle = async (e) => {

        setIsLoading(true)

        try {

            const { id, checked } = e.target;
            if (checked) {
                await currentUser.userApi.addUserIntolerance(currentUser.username, id);
            } else {
                await currentUser.userApi.deleteUserIntolerance(currentUser.username, id);
            }
            setError(null)
            toggleSuccess("User info updated.")
            await loadUser(currentUser.token);

            setIsLoading(false)

        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false)
        }
    };

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

    return (

        <div className="Content">

            <div className="Card Form UserIntolerancesForm">

            {error && <MessageCard className="error" message={error.message}/>}
            {success && <MessageCard className="success" message={success}/>}

                <h2>Select Any Dietary Intolerances:</h2>

                <div className="CenteredForm">

                <form className="">

                    {intolerancesAll.map(intolerance => {

                        return (

                            <div>

                            <input
                                type="checkbox"
                                onChange={handleToggle}
                                id={intolerance.id}
                                key={intolerance.id}
                                name={intolerance.intoleranceName}
                                checked={formData.some(i => i.intoleranceId === intolerance.id)}
                            />

                            <label htmlFor={intolerance.intoleranceName}>{intolerance.intoleranceName}</label>

                            </div>

                        )
                    })}

                </form>

                </div>

            </div>

        </div>

    )

}

export default UserIntolerancesEditForm;