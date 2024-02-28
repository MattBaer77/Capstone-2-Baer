import {render, screen, act} from '@testing-library/react'
import App from '../App'
import Home from '../Home'
import UserContext from '../UserContext'

import {LoggedOutUser, LoggedInUser} from './_testCommon';

console.log(LoggedInUser.currentUser)

it('renders correctly - NO USER', async () => {

    await act (async() => {render(<UserContext.Provider value={{currentUser: LoggedOutUser.currentUser , loadUser: LoggedOutUser.loadUser, currentGroceryList: LoggedOutUser.currentGroceryList, setCurrentGroceryList: LoggedOutUser.setCurrentGroceryList, logout: LoggedOutUser.logout}}>

        <App>

            <Home/>

        </App>

    </UserContext.Provider>)})

});

it('renders correctly - USER', async () => {

    await act (async() => {render(<UserContext.Provider value={{currentUser: LoggedInUser.currentUser , loadUser: LoggedInUser.loadUser, currentGroceryList: LoggedInUser.currentGroceryList, setCurrentGroceryList: LoggedInUser.setCurrentGroceryList, logout: LoggedInUser.logout}}>

        <App>

            <Home/>

        </App>

    </UserContext.Provider>)})

});
