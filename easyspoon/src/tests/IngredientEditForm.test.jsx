import {render, screen, act} from '@testing-library/react'
import App from '../App'
import IngredientEditForm from '../IngredientEditForm'
import UserContext from '../UserContext'

import {LoggedOutUser, LoggedInUser} from './_testCommon';

it('renders correctly - USER', async () => {

    <IngredientEditForm currentUser={LoggedInUser.currentUser} loadUser={LoggedInUser.loadUser} currentGroceryList={LoggedInUser.currentGroceryList} ingredient={LoggedInUser.currentUser.groceryLists[0].ingredients[0]}/>

});
