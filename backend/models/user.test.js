"use strict";

const ExpressError = require("../expressError");

const db = require("../db");
const User = require("./user");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// findAll

describe("findAll", () => {

    test("works", async() => {

        const users = await User.findAll();

        expect(users).toEqual([

            {
                "username": "u1",
                "firstName": "U1F",
                "lastName": "U1L",
                "email": "u1@email.com",
                "isAdmin": false
            },
            {
                "username": "u2",
                "firstName": "U2F",
                "lastName": "U2L",
                "email": "u2@email.com",
                "isAdmin": false
            },
            {
                "username": "u3",
                "firstName": "U3F",
                "lastName": "U3L",
                "email": "u3@email.com",
                "isAdmin": false
            },
            {
                "username": "uA",
                "firstName": "UAF",
                "lastName": "UAL",
                "email": "uA@email.com",
                "isAdmin": true
            },
            {
                "username": "uAB",
                "firstName": "UABF",
                "lastName": "UABL",
                "email": "uAB@email.com",
                "isAdmin": true
            }
 
        ]);

    }); 

});

// get - by username

describe("get", () => {

    test("works", async() => {

        let user = await User.get("u1");
        expect(user).toEqual({
          username: "u1",
          firstName: "U1F",
          lastName: "U1L",
          email: "u1@email.com",
          isAdmin: false
        });

    })

    test("not found if no such user", async function () {

        try {
          await User.get("nope");
          fail();
        } catch (err) {
          expect(err instanceof ExpressError).toBeTruthy();
        }
        
    });

});

//  authenticate

describe("authenticate", function () {

    test("works", async function () {
      const user = await User.authenticate("u1", "password1");
      expect(user).toEqual({
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "u1@email.com",
        isAdmin: false,
      });
    });
  
    test("unauth if no such user", async function () {
      try {
        await User.authenticate("nope", "password1");
        fail();
      } catch (err) {
        expect(err instanceof ExpressError).toBeTruthy();
      }
    });
  
    test("unauth if wrong password", async function () {
      try {
        await User.authenticate("u1", "wrong");
        fail();
      } catch (err) {
        expect(err instanceof ExpressError).toBeTruthy();
      }
    });

});

//  register

describe("register", function () {

    const newUser = {
      username: "new",
      firstName: "Test",
      lastName: "Tester",
      email: "test@test.com",
      isAdmin: false,
    };
  
    test("works", async function () {
      let user = await User.register({
        ...newUser,
        password: "password",
      });
      expect(user).toEqual(newUser);
      const found = await db.query("SELECT * FROM users WHERE username = 'new'");
      expect(found.rows.length).toEqual(1);
      expect(found.rows[0].is_admin).toEqual(false);
      expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
    });
  
    test("works: adds admin", async function () {
      let user = await User.register({
        ...newUser,
        password: "password",
        isAdmin: true,
      });
      expect(user).toEqual({ ...newUser, isAdmin: true });
      const found = await db.query("SELECT * FROM users WHERE username = 'new'");
      expect(found.rows.length).toEqual(1);
      expect(found.rows[0].is_admin).toEqual(true);
      expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
    });
  
    test("bad request with dup data", async function () {
      try {
        await User.register({
          ...newUser,
          password: "password",
        });
        await User.register({
          ...newUser,
          password: "password",
        });
        fail();
      } catch (err) {
        expect(err instanceof ExpressError).toBeTruthy();
      }
    });

});

// update

describe("update", function () {

    const updateData = {
      firstName: "NewF",
      lastName: "NewF",
      email: "new@email.com",
      isAdmin: true,
    };
  
    test("works", async function () {
      let job = await User.update("u1", updateData);
      expect(job).toEqual({
        username: "u1",
        ...updateData,
      });
    });
  
    test("works: set password", async function () {
      let job = await User.update("u1", {
        password: "new",
      });
      expect(job).toEqual({
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "u1@email.com",
        isAdmin: false,
      });
      const found = await db.query("SELECT * FROM users WHERE username = 'u1'");
      expect(found.rows.length).toEqual(1);
      expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
    });
  
    test("not found if no such user", async function () {
      try {
        await User.update("nope", {
          firstName: "test",
        });
        fail();
      } catch (err) {
        expect(err instanceof ExpressError).toBeTruthy();
      }
    });
  
    test("bad request if no data", async function () {
      expect.assertions(1);
      try {
        await User.update("c1", {});
        fail();
      } catch (err) {
        expect(err instanceof ExpressError).toBeTruthy();
      }
    });

});

// remove

describe("remove", function () {

  test("works", async function () {
    await User.remove("u1");
    const res = await db.query(
        "SELECT * FROM users WHERE username='u1'");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such user", async function () {
    try {
      await User.remove("nope");
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
    }
  });
    
});

// users_intolerances methods

// get - by username

describe("getWithIntolerances", () => {

  test("works - user with intolerances", async() => {

    let user = await User.getWithIntolerances("u1");
    expect(user).toEqual({
      username: "u1",
      firstName: "U1F",
      intolerances: [

        {
          intoleranceId: 2,
          intoleranceName:"egg",
        },
        {
          intoleranceId: 3,
          intoleranceName:"gluten",
        },

      ],
      lastName: "U1L",
      email: "u1@email.com",
      isAdmin: false
    });

  })

  test("works - user without intolerances", async() => {

    let user = await User.getWithIntolerances("u3");
    expect(user).toEqual({
      username: "u3",
      firstName: "U3F",
      intolerances: [],
      lastName: "U3L",
      email: "u3@email.com",
      isAdmin: false
    });

  })

  test("not found if no such user", async function () {

    try {
      await User.getWithIntolerances("nope");
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
    }
      
  });

});

describe("delete user's intolerance", function () {

  const newIntoleranceU1 = {
    username:"u1",
    intoleranceId:"1"
  }

  const newIntoleranceU3 = {
    username:"u3",
    intoleranceId:"12"
  }

  const newIntoleranceInvalidUsername = {
    username:"ux",
    intoleranceId:"12"
  }

  const newIntoleranceInvalidIntoleranceId = {

    username:"u3",
    intoleranceId:"99"

  }

  test("works - user which already has intolerances", async function () {

    let intolerances = await User.addUserIntolerance(newIntoleranceU1);

    expect(intolerances).toEqual({

      username: "u1",
      firstName: "U1F",
      intolerances: [

        {
          intoleranceId: 2,
          intoleranceName:"egg",
        },
        {
          intoleranceId: 3,
          intoleranceName:"gluten",
        },
        {
          intoleranceId: 1,
          intoleranceName:"dairy",
        },

      ],
      lastName: "U1L",
      email: "u1@email.com",
      isAdmin: false

    });

  })

  test("works - user which had no intolerances", async function () {

    let intolerances = await User.addUserIntolerance(newIntoleranceU3);

    expect(intolerances).toEqual({

      username: "u3",
      firstName: "U13",
      intolerances: [

        {
          intoleranceId: 12,
          intoleranceName:"wheat",
        },

      ],
      lastName: "U3L",
      email: "u3@email.com",
      isAdmin: false

    });

  })

  test("not found if no such user", async function () {

    try {
      await User.addUserIntolerance(newIntoleranceInvalidUsername);
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
    }
      
  });

  test("not found if no such intolerance", async function () {

    try {
      await User.addUserIntolerance(newIntoleranceInvalidIntoleranceId);
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
    }
      
  });

})
