import {render, screen, act} from '@testing-library/react'
import SignupForm from '../SignupForm'
import UserContext from '../UserContext'

import { BrowserRouter } from 'react-router-dom'

import {LoggedOutUser, LoggedInUser} from './_testCommon';


it('renders correctly - NO USER', async () => {

    await act (async() => {render(<UserContext.Provider value={{currentUser: LoggedOutUser.currentUser , loadUser: LoggedOutUser.loadUser, currentGroceryList: LoggedOutUser.currentGroceryList, setCurrentGroceryList: LoggedOutUser.setCurrentGroceryList, logout: LoggedOutUser.logout}}>

        <BrowserRouter>

        <SignupForm/>

        </BrowserRouter>

    </UserContext.Provider>)})

});