import React from 'react'
import { BrowserRouter } from 'react-router-dom';

import UserProvider from './UserProvider';
import UserCard from './UserCard'
import Home from './Home'

// NavBar
// Router

import './App.css'

function App() {

  
  return (

    <div className='App'>

      <h1>Hello!</h1>

      <UserProvider>

        {/* <BrowserRouter> */}

        <p>USER:</p>
        <UserCard />
        <Home />
        
        {/* </BrowserRouter> */}

      </UserProvider>

    </div>

  )
}

export default App
