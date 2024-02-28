import {render, screen, act} from '@testing-library/react'
import App from '../App'
import Home from '../Home'
import UserContext from '../UserContext'

const currentUser = null
const currentGroceryList = null

// functions

const loadUser = null
const setCurrentGroceryList = null
const logout = null

it('renders correctly - NO USER', async () => {

    await act (async() => {render(<UserContext.Provider value={{currentUser, loadUser, currentGroceryList, setCurrentGroceryList, logout}}>

        <Home/>

    </UserContext.Provider>)})

});
