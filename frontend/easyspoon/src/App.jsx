import React from 'react'
import { BrowserRouter } from 'react-router-dom';

import UserProvider from './UserProvider';

import NavBar from './NavBar'
import Router from './Router'

import './App.css'
import './ContentStage.css'

function App() {

  return (

    <div className='App'>

      <UserProvider>

        <BrowserRouter>

        <NavBar />

        <div className='ContentStage'>

        <Router />

        </div>

        </BrowserRouter>

      </UserProvider>

    </div>

  );
}

export default App
