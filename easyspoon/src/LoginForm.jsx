import React, {useState} from "react";

import { useNavigate, Navigate } from "react-router-dom"

import EasySpoonAPI from "./Api";
import {useUserContext} from "./hooks"

import './Content.css'
import './Card.css'
import './Form.css'

const LoginForm = () => {

    const navigate = useNavigate()

    const {currentUser, loadUser} = useUserContext()

    const INITIAL_STATE = {
        username:"",
        password:""
    }

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
        const userInput = {...formData}

        try {

            const token = await EasySpoonAPI.loginUser(userInput)
            await loadUser(token)
            setError(null)
            navigate('/')

        } catch(e) {
            setError(e)
        }

    }

    return (

        <div className="Content">

        <div className="Card Form">

            {error && <p>{error.message}</p>}

        <h2>Login:</h2>

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

            <div className="submit">

                <button className="positive">Login</button>

            </div>


        </form>

        </div>

        </div>

    )

};

export default LoginForm;