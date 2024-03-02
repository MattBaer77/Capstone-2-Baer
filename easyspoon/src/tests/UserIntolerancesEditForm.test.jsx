import {render, screen, act} from '@testing-library/react'
import App from '../App'
import UserIntolerancesEditForm from '../UserIntolerancesEditForm'
import UserContext from '../UserContext'

import {LoggedOutUser, LoggedInUser} from './_testCommon';

it('renders correctly - USER', async () => {

  await act (async() => {render(<UserContext.Provider value={{currentUser: LoggedInUser.currentUser , loadUser: LoggedInUser.loadUser, currentGroceryList: LoggedInUser.currentGroceryList, setCurrentGroceryList: LoggedInUser.setCurrentGroceryList, logout: LoggedInUser.logout}}>

    <UserIntolerancesEditForm/>

  </UserContext.Provider>)})

});
