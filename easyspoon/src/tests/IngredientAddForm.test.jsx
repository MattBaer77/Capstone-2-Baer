import {render, screen, act} from '@testing-library/react'
import App from '../App'
import IngredientAddForm from '../IngredientAddForm'
import UserContext from '../UserContext'

import {LoggedOutUser, LoggedInUser} from './_testCommon';

it('renders correctly - USER', async () => {

    <IngredientAddForm groceryList={LoggedInUser.currentUser.groceryLists[0]} currentUser={LoggedInUser.currentUser} loadUser={LoggedInUser.loadUser} currentGroceryList={LoggedInUser.currentGroceryList} ingredient={LoggedInUser.currentUser.groceryLists[0].ingredients[0]}/>

});
