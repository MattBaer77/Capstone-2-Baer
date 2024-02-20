import React, {useEffect, useState} from "react";

import { Navigate } from "react-router-dom";

import EasySpoonAPI from "./Api";
import { useUserContext } from "./hooks";

import './Form.css'

const UserIntolerancesEditForm = () => {

    const {currentUser, loadUser} = useUserContext()

    const [intolerancesAll, setIntolerancesAll] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const [formData, setFormData] = useState([])
    const [success, toggleSuccess] = useState("")
    const [error, setError] = useState(null)

    console.log(formData)
    console.log(currentUser)

    if (!currentUser.token) {

        return <Navigate to='/login'/>

    }

    useEffect(() => {

        async function getIntolerancesAllList() {

            try {

                const {intolerances} = await EasySpoonAPI.getIntolerancesAll();

                console.log(intolerances)

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

    // const handleToggle = async(e) => {

    //     // e.preventDefault();

    //     try {

    //         console.log(e)

    //         const {id, name, checked} = e.target
    //         // Just logging check to start
    //         if(checked) {

    //             await currentUser.userApi.addUserIntolerance(currentUser.username, e.target.id)

    //             setFormData((data) => [...data, {intoleranceId:id, intoleranceName:name}])
    //             console.log(formData)

    //         } else if(!checked) {

    //             await currentUser.userApi.deleteUserIntolerance(currentUser.username, e.target.id)

    //             const updatedFormData = formData.filter(i => i.intoleranceId !== id);
    //             setFormData(() => [...updatedFormData])
    //             console.log(formData)

    //         }
    //         // await loadUser(currentUser.token)

    //         // setFormData(() => {

    //         //     console.log(currentUser.intolerances)
    //         //     return [...currentUser.intolerances]
    
    //         // })
            
    //         // console.log(e.target.checked)
    //         // console.log(e.target.name)
    //         // console.log(e.target.id)

    //     } catch (e) {
    //         console.log(e)
    //         setError(e)
    //     }

    // }

    const handleToggle = async (e) => {

        // e.preventDefault();
        try {

            const { id, checked } = e.target;
            if (checked) {
                await currentUser.userApi.addUserIntolerance(currentUser.username, id);
            } else {
                await currentUser.userApi.deleteUserIntolerance(currentUser.username, id);
            }
            // Reload user data after toggle operation
            await loadUser(currentUser.token);
            // Update formData with the latest user intolerances


            // setFormData(() => [...currentUser.intolerances]);


        } catch (error) {
            console.log(error);
            setError(error);
        }

    };

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

            <form>

                {intolerancesAll.map(intolerance => {

                    return (

                        <div>

                        <input
                            type="checkbox"
                            onChange={handleToggle}
                            id={intolerance.id}
                            key={intolerance.id}
                            name={intolerance.intoleranceName}
                            checked={formData.some(i => {

                                // console.log((i.intoleranceId))
                                // console.log(intolerance)

                                return i.intoleranceId === intolerance.id

                            })}
                        />

                        <label htmlFor={intolerance.intoleranceName}>{intolerance.intoleranceName}</label>

                        </div>

                    )
                })}

            </form>

        </div>

    )

}

export default UserIntolerancesEditForm;