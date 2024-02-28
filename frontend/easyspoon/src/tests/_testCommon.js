
class LoggedOutUser {

    static currentUser = null;
    static currentGroceryList = null;

    // functions

    static loadUser = () => {};
    static setCurrentGroceryList = () => {};
    static logout = () => {};

}

class LoggedInUser {

    currentUser = "User";
    currentGroceryList = {}

    // functions

    loadUser = () => {};
    setCurrentGroceryList = () => {};
    logout = () => {};

}

// export {loggedOutUser, loggedInUser}

export {LoggedOutUser, LoggedInUser}