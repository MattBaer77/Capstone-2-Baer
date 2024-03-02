import {render, screen, act} from '@testing-library/react'
import IngredientsList from '../IngredientsList'
import UserContext from '../UserContext'

import { BrowserRouter } from 'react-router-dom'

import {LoggedOutUser, LoggedInUser} from './_testCommon';

it('renders correctly - USER', async () => {

  await act (async() => {render(<UserContext.Provider value={{currentUser: LoggedInUser.currentUser , loadUser: LoggedInUser.loadUser, currentGroceryList: LoggedInUser.currentGroceryList, setCurrentGroceryList: LoggedInUser.setCurrentGroceryList, logout: LoggedInUser.logout}}>

    <BrowserRouter>

        <IngredientsList/>

    </BrowserRouter>

  </UserContext.Provider>)})

});
