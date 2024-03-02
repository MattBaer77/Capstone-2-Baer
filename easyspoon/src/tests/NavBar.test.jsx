import {render, screen, act} from '@testing-library/react'
import NavBar from '../NavBar'
import UserContext from '../UserContext'

import { BrowserRouter } from 'react-router-dom'

import {LoggedOutUser, LoggedInUser} from './_testCommon';

it('renders correctly - NO USER', async () => {

  await act (async() => {render(<UserContext.Provider value={{currentUser: LoggedOutUser.currentUser , loadUser: LoggedOutUser.loadUser, currentGroceryList: LoggedOutUser.currentGroceryList, setCurrentGroceryList: LoggedOutUser.setCurrentGroceryList, logout: LoggedOutUser.logout}}>

    <BrowserRouter>

        <NavBar/>

    </BrowserRouter>

  </UserContext.Provider>)})

});

it('renders correctly - USER', async () => {

  await act (async() => {render(<UserContext.Provider value={{currentUser: LoggedInUser.currentUser , loadUser: LoggedInUser.loadUser, currentGroceryList: LoggedInUser.currentGroceryList, setCurrentGroceryList: LoggedInUser.setCurrentGroceryList, logout: LoggedInUser.logout}}>

    <BrowserRouter>

        <NavBar/>

    </BrowserRouter>

  </UserContext.Provider>)})

});
