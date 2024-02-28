import {render, screen, act} from '@testing-library/react'
import App from '../App'
import Home from '../Home'
import UserContext from '../UserContext'

import {LoggedOutUser, LoggedInUser} from './_testCommon';

it('renders correctly - NO USER', async () => {

    await act (async() => {render(<UserContext.Provider value={{currentUser: LoggedOutUser.currentUser , loadUser: LoggedOutUser.loadUser, currentGroceryList: LoggedOutUser.currentGroceryList, setCurrentGroceryList: LoggedOutUser.setCurrentGroceryList, logout: LoggedOutUser.logout}}>

        <Home/>

    </UserContext.Provider>)})

});
