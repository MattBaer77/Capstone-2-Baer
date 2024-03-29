import React, {useState} from "react";

import { Navigate } from "react-router-dom";

import {useUserContext} from "./hooks"
import MessageCard from "./MessageCard";
import LoadingCard from "./LoadingCard";

import './Card.css'
import './Form.css'

const UserEditForm = () => {

    const {currentUser, loadUser} = useUserContext()

    const INITIAL_STATE = {

        firstName:currentUser.firstName,
        lastName:currentUser.lastName,
        email:currentUser.email,
        
    }

    const[isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState(INITIAL_STATE);
    const [success, toggleSuccess] = useState(null)
    const [error, setError] = useState(null)

    if (!currentUser) {

        return <Navigate to='/login'/>

    }

    const handleChange = (e) => {

        const {name, value} = e.target;

        setFormData((data) => {

            return {
                ...data,
                [name]:value
            }

        })

    }

    const handleSubmit = async(e) => {

        e.preventDefault();
        setIsLoading(true)
        let userInput = {...formData}

        try {

            const res = await currentUser.userApi.editUser(userInput, currentUser.username)
            await loadUser(currentUser.token)
            setError(null)
            toggleSuccess("User info updated.")

            setIsLoading(false)

        } catch (e) {
            setError(e)
        } finally {
            setIsLoading(false)
        }

    }

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

            <div className="Card Form">

                {error && <MessageCard className="error" message={error.message}/>}
                {success && <MessageCard className="success" message={success}/>}

                <h2>Edit User Profile:</h2>

                <form onSubmit={handleSubmit}>

                    <div className="field">

                        <label htmlFor="username">Username: </label>
                        <input
                            type="text"
                            placeholder={currentUser.username}
                            name="username"
                            id="username"
                            readOnly="readonly"
                            onFocus={(e) => {
                                e.preventDefault()
                                document.getElementById("username").blur();
                            }}
                        />

                    </div>

                    <div className="field">

                        <label htmlFor="firstName">First Name: </label>
                        <input
                            type="text"
                            placeholder="First Name"
                            name="firstName"
                            id="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="field">

                    <label htmlFor="lastName">Last Name: </label>
                    <input
                        type="text"
                        placeholder="Last Name"
                        name="lastName"
                        id="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                    />

                    </div>
                    

                    <div className="field">

                    <label htmlFor="email">Email: </label>
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    </div>

                    <div className="submit">

                        <button className="positive">Save Changes</button>

                    </div>

                </form>

            </div>

        </div>

    )

};

export default UserEditForm;