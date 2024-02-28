import {render, screen, act} from '@testing-library/react'
import App from '../App'
import PreviewCard from '../PreviewCard'
import UserContext from '../UserContext'

import {LoggedOutUser, LoggedInUser} from './_testCommon';

it('renders correctly - USER', async () => {

    <PreviewCard item={LoggedInUser.currentUser.groceryLists[0].recipes[0]} currentUser={LoggedInUser.currentUser} loadUser={LoggedInUser.loadUser} currentGroceryList={LoggedInUser.currentGroceryList} groceryListId={LoggedInUser.currentUser.groceryLists[0].id}/>

});
