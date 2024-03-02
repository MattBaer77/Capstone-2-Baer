import {render, screen, act} from '@testing-library/react'
import App from '../App'
import GroceryListCard from '../GroceryListCard'
import UserContext from '../UserContext'

import {LoggedOutUser, LoggedInUser} from './_testCommon';

it('renders correctly - USER', async () => {

    <GroceryListCard groceryList={LoggedInUser.currentUser.groceryLists[0]} currentUser={LoggedInUser.currentUser} loadUser={LoggedInUser.loadUser} currentGroceryList={LoggedInUser.currentGroceryList} setCurrentGroceryList={LoggedInUser.setCurrentGroceryList}/>

});
