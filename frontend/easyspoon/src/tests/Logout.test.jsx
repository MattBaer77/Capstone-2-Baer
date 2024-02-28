import {render, screen, act} from '@testing-library/react'
import Logout from '../Logout'
import UserContext from '../UserContext'

import { BrowserRouter } from 'react-router-dom'

import {LoggedOutUser, LoggedInUser} from './_testCommon';

it('renders correctly - NO USER', async () => {

    await act (async() => {render(<UserContext.Provider value={{

            currentUser: LoggedInUser.currentUser,
            loadUser: LoggedInUser.loadUser,
            currentGroceryList: LoggedInUser.currentGroceryList,
            setCurrentGroceryList: LoggedInUser.setCurrentGroceryList,
            logout: LoggedInUser.logout

        }}>

        <BrowserRouter>

        <Logout/>

        </BrowserRouter>

    </UserContext.Provider>)})

});
