import React, {useState} from "react";

import { useNavigate, Navigate } from "react-router-dom"

import EasySpoonAPI from "./Api";
import {useUserContext} from "./hooks"
import MessageCard from "./MessageCard";

import './Card.css'
import './Form.css'

const SignupForm = () => {

    const navigate = useNavigate()

    const {currentUser, loadUser} = useUserContext()

    const INITIAL_STATE = {
        username:"",
        password:"",
        firstname:"",
        lastName:"",
        email:""
    }

    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState(INITIAL_STATE);
    const [error, setError] = useState(null)

    if (currentUser) {
        return <Navigate to='/'/>
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
        const userInput = {...formData}

        try {

            const token = await EasySpoonAPI.signUpUser(userInput)
            await loadUser(token)
            setError(null)
            navigate('/')

        } catch(e) {
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

    return (

        <div className="Content">

        <div className="Card Form">

            {error && <MessageCard className="error" message={error.message}/>}

            <h2>Sign Up:</h2>

            <form onSubmit={handleSubmit}>


                <div className="field">

                    <label htmlFor="username">Username: </label>
                    <input
                        type="text"
                        placeholder="username"
                        name="username"
                        id="username"
                        value={formData.username}
                        onChange={handleChange}
                    />

                </div>


                <div className="field">

                    <label htmlFor="password">Password: </label>
                    <input
                        type="password"
                        placeholder="password"
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
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

                    <button className="positive">Signup</button>

                </div>

            </form>

        </div>

        </div>

    )

};

export default SignupForm;