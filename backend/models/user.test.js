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

// getWithCacheAndIntolerances - by username

describe("getWithCacheAndIntolerances", () => {

  test("works - user with intolerances", async() => {

    let user = await User.getWithCacheAndIntolerances("u1");
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
      isAdmin: false,
      cache:{data:{faux: "json", some: "more"}}
    });

  })

  test("works - user without intolerances", async() => {

    let user = await User.getWithCacheAndIntolerances("u3");
    expect(user).toEqual({
      username: "u3",
      firstName: "U3F",
      intolerances: [],
      lastName: "U3L",
      email: "u3@email.com",
      isAdmin: false,
      cache: null
    });

  })

  test("not found if no such user", async function () {

    try {
      await User.getWithCacheAndIntolerances("nope");
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
    const res = await User.remove("u1");
    expect(res).toEqual(true)
    const removeCheck = await db.query(
        "SELECT * FROM users WHERE username='u1'");
    expect(removeCheck.rows.length).toEqual(0);
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

describe("add user's intolerance", function () {

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

    let res = await User.addUserIntolerance(newIntoleranceU1.username, newIntoleranceU1.intoleranceId);

    expect(res).toEqual(true);

    /**
     * {

      username: "u1",
      firstName: "U1F",
      intolerances: [

        {
          intoleranceId: 1,
          intoleranceName:"dairy",
        },
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

    }
     */

  })

  test("works - user which had no intolerances", async function () {

    let intolerances = await User.addUserIntolerance(newIntoleranceU3.username, newIntoleranceU3.intoleranceId);

    expect(intolerances).toEqual(true);

    /**
     * {

      username: "u3",
      firstName: "U3F",
      intolerances: [

        {
          intoleranceId: 12,
          intoleranceName:"wheat",
        },

      ],
      lastName: "U3L",
      email: "u3@email.com",
      isAdmin: false

    }
     */

  })

  test("does not allow duplicate insertion", async function () {

    await User.addUserIntolerance(newIntoleranceU3.username, newIntoleranceU3.intoleranceId);

    try {
      await User.addUserIntolerance(newIntoleranceU3.username, newIntoleranceU3.intoleranceId);
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
    }

  })

  test("not found if no such user", async function () {

    try {
      await User.addUserIntolerance(newIntoleranceInvalidUsername.username, newIntoleranceInvalidUsername.intoleranceId);
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
    }
      
  });

  test("not found if no such intolerance", async function () {

    try {
      await User.addUserIntolerance(newIntoleranceInvalidIntoleranceId.username, newIntoleranceInvalidIntoleranceId.intoleranceId);
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
    }
      
  });

})

// remove

describe("remove user's intolerance", function () {

  test("works", async function () {

    const deletedUserIntolerance = await User.removeUserIntolerance("u1", 3);

    const intolerancesRes = await db.query(
      
      `SELECT ui.intolerance_id AS "intoleranceId",
            i.intolerance_name AS "intoleranceName"
        FROM users u
        JOIN users_intolerances ui ON u.username = ui.username
        JOIN intolerances i ON ui.intolerance_id = i.id
        WHERE u.username = 'u1'`
      
    );

    expect(deletedUserIntolerance.username).toEqual('u1')
    expect(deletedUserIntolerance.intoleranceId).toEqual(3)

    expect(intolerancesRes.rows.length).toEqual(1);
    expect(intolerancesRes.rows[0]).toEqual({intoleranceId: 2, intoleranceName: "egg"})


  });

  test("not found if no such user", async function () {
    try {
      await User.removeUserIntolerance("notValidUser", 1);
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
    }
  });

  test("not found if no such user intolerance", async function () {
    try {
      await User.removeUserIntolerance("u1", 6);
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
    }
  });

  test("not found if no such intolerance", async function () {
    try {
      await User.removeUserIntolerance("u1", -1);
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
    }
  });

  test("not found if no such user or intolerance", async function () {
    try {
      await User.removeUserIntolerance("notValidUser", -1);
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
    }
  });
    
});

// getWithCache - by username

describe("get with cache", () => {

  test("works", async() => {

      let user = await User.getWithCache("u1");
      expect(user).toEqual({
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "u1@email.com",
        isAdmin: false,
        cache:{data:{faux: "json", some: "more"}}
      });

  })

  test("works - user has no cached recipes", async() => {

      let user = await User.getWithCache("u3");
      expect(user).toEqual({
        username: "u3",
        firstName: "U3F",
        lastName: "U3L",
        email: "u3@email.com",
        isAdmin: false,
        cache:null
      });

  })

  test("not found if no such user", async function () {

      try {
        await User.getWithCache("nope");
        fail();
      } catch (err) {
        expect(err instanceof ExpressError).toBeTruthy();
      }
      
  });

});

// Retrieve Cache

describe("retrieve a user's cached data", function() {

  test("works if there is cached data", async function () {

    const res = await User.getCache("u1");

    expect(res).toEqual(
      {data:{faux: "json", some: "more"}}
    )

  })

  test("throws error if no such user", async function () {

    try {
      await User.getCache("notValidUser");
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
    }

  })

})

// Set Cache

describe("set a user's cached data", function() {

  const fauxCacheData = {fauxDataForSet : "data"}
  const fauxCacheDataArray = [{fauxDataForSetOne : "data1"}, {fauxDataForSetTwo : "data2"}]

  test("works if there is cached data", async function () {

    const res = await User.setCache("u1", fauxCacheData);

    expect(res).toEqual(true)

    const cacheCheck = await db.query(
      `SELECT cache
      FROM users
      WHERE username = 'u1'`
      )

    expect(cacheCheck.rows[0].cache).toEqual({data:fauxCacheData})

  })

  test("works if there is no cached data", async function () {

    const res = await User.setCache("u3", fauxCacheData);

    expect(res).toEqual(true)

    const cacheCheck = await db.query(
      `SELECT cache
      FROM users
      WHERE username = 'u3'`
      )

    expect(cacheCheck.rows[0].cache).toEqual({data:fauxCacheData})

  })

  test("works if there is cached data - and array of data", async function () {

    const res = await User.setCache("u1", fauxCacheDataArray);

    expect(res).toEqual(true)

    const cacheCheck = await db.query(
      `SELECT cache
      FROM users
      WHERE username = 'u1'`
      )

    expect(cacheCheck.rows[0].cache).toEqual({data:fauxCacheDataArray})

  })

  test("works if there is no cached data - and array of data", async function () {

    const res = await User.setCache("u3", fauxCacheDataArray);

    expect(res).toEqual(true)

    const cacheCheck = await db.query(
      `SELECT cache
      FROM users
      WHERE username = 'u3'`
      )

    expect(cacheCheck.rows[0].cache).toEqual({data:fauxCacheDataArray})

  })

  test("throws error if no such user", async function () {

    try {
      await User.setCache("notValidUser", fauxCacheData);
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
    }

  })

})

// Clear cache

describe("clear a user's cached data", function() {

  test("works if there is cached data", async function () {

    const res = await User.clearCache("u1");

    expect(res).toEqual(true)

    const cacheCheck = await db.query(
      `SELECT cache
      FROM users
      WHERE username = 'u1'`
      )

    expect(cacheCheck.rows[0].cache).toEqual(null)

  })

  test("works if there is no cached data", async function () {

    const res = await User.clearCache("u3");

    expect(res).toEqual(true)

    const cacheCheck = await db.query(
      `SELECT cache
      FROM users
      WHERE username = 'u3'`
      )

    expect(cacheCheck.rows[0].cache).toEqual(null)

  })

  test("throws error if no such user", async function () {

    try {
      await User.clearCache("notValidUser");
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
    }

  })

})



// FOR EVERYTHING THAT CREATES - ENSURE ADDING DUPLICATE PRODUCES EXPECTED RESULT