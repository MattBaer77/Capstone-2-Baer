import {render, screen, act} from '@testing-library/react'
import App from '../App'
import GroceryListAddForm from '../GroceryListAddForm'
import UserContext from '../UserContext'

import {LoggedOutUser, LoggedInUser} from './_testCommon';

console.log(LoggedInUser.currentUser)

it('renders correctly - NO USER', async () => {

    await act (async() => {render(<UserContext.Provider value={{currentUser: LoggedInUser.currentUser , loadUser: LoggedInUser.loadUser, currentGroceryList: LoggedInUser.currentGroceryList, setCurrentGroceryList: LoggedInUser.setCurrentGroceryList, logout: LoggedInUser.logout}}>

        <App>

          <GroceryListAddForm/>

        </App>

    </UserContext.Provider>)})

});
