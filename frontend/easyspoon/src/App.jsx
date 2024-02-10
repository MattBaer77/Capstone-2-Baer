import React from 'react'
import { BrowserRouter } from 'react-router-dom';

import UserProvider from './UserProvider';

import NavBar from './NavBar'
import Router from './Router'

import './App.css'

function App() {

  
  return (

    <div className='App'>

      <UserProvider>

        <BrowserRouter>

        <NavBar />

        <Router />

        </BrowserRouter>

      </UserProvider>

    </div>

  )
}

export default App
