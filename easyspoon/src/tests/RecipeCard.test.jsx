import {render, screen, act} from '@testing-library/react'
import App from '../App'
import RecipeCard from '../RecipeCard'
import UserContext from '../UserContext'

import {LoggedOutUser, LoggedInUser} from './_testCommon';

it('renders correctly - USER', async () => {

    <RecipeCard recipe={LoggedInUser.currentUser.groceryLists[0].recipes[0]}/>

});
