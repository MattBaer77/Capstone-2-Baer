import {render, screen, act} from '@testing-library/react'
import App from '../App'
import IngredientCard from '../IngredientCard'
import UserContext from '../UserContext'

import {LoggedOutUser, LoggedInUser} from './_testCommon';

it('renders correctly - USER', async () => {

    <IngredientCard ingredient={LoggedInUser.currentUser.groceryLists[0].ingredients[0]} currentUser={LoggedInUser.currentUser} loadUser={LoggedInUser.loadUser} currentGroceryList={LoggedInUser.currentGroceryList} groceryListId={LoggedInUser.currentUser.groceryLists[0].id}/>

});
