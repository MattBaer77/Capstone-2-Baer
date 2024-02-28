import {render, screen, act} from '@testing-library/react'
import RecipeDetail from '../RecipeDetail'
import UserContext from '../UserContext'

import { BrowserRouter } from 'react-router-dom'
import {LoggedOutUser, LoggedInUser} from './_testCommon';

// vi.mock('react-router-dom', () => {

//     return {
//     ...vi.importActual('react-router-dom'),
//     useParams: () => ({ id : 1 }),
//     }

// });

vi.mock("react-router-dom", async (importOriginal) => {

    const actual = await importOriginal()
    return {
      ...actual,
      useParams: () => ({ id : 1 }),
    }
    
})

describe("Smoke Test", () => {

    it('renders correctly - USER', async () => {
    
        await act (async() => {render(<UserContext.Provider value={{currentUser: LoggedInUser.currentUser , loadUser: LoggedInUser.loadUser, currentGroceryList: LoggedInUser.currentGroceryList, setCurrentGroceryList: LoggedInUser.setCurrentGroceryList, logout: LoggedInUser.logout}}>
    
            <BrowserRouter>
    
                <RecipeDetail/>
            
            </BrowserRouter>
    
        </UserContext.Provider>)})
    
    });

})