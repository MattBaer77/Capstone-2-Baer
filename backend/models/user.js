"use strict";

const db = require("../db");
const bcrypt = require("bcrypt")

const {sqlForPartialUpdate} = require("../helpers/sql")

const ExpressError = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

class User {

  /** Find all users.
   *
   * Returns [{ username, first_name, last_name, email, is_admin }, ...]
   * 
  **/

  static async findAll() {

      const result = await db.query(
              `SELECT username,
                      first_name AS "firstName",
                      last_name AS "lastName",
                      email,
                      is_admin AS "isAdmin"
              FROM users
              ORDER BY username`,
      );

      return result.rows;

  };

  /** Given a username, return data about user.
   *
   * Returns { username, firstName, lastName, isAdmin }
   *
   * Throws ExpressError if user not found.
   * 
  **/

  static async get(username) {

      const userRes = await db.query(
              `SELECT username,
                      first_name AS "firstName",
                      last_name AS "lastName",
                      email,
                      is_admin AS "isAdmin"
              FROM users
              WHERE username = $1`,
          [username],
      );

      const user = userRes.rows[0];

      if (!user) throw new ExpressError(`No user: ${username}`, 404);

      return user;

  };

  /** Given a username, return data about user + that user's cache and intolerances
   *
   * Returns { username, firstName, lastName, isAdmin, cache, intolerances }
   * 
   * Where intolerances is [{id, intolerance_name, ...]
   *
   * Throws ExpressError if user not found.
   * 
  */

  static async getWithCacheAndIntolerances(username) {

    const userRes = await db.query(
            `SELECT username,
                    first_name AS "firstName",
                    last_name AS "lastName",
                    email,
                    is_admin AS "isAdmin",
                    cache
            FROM users
            WHERE username = $1`,
        [username],
    );

    const user = userRes.rows[0];

    if (!user) throw new ExpressError(`No user: ${username}`, 404);

    const intolerancesRes = await db.query(
            `SELECT ui.intolerance_id AS "intoleranceId",
                    i.intolerance_name AS "intoleranceName"
              FROM users u
              JOIN users_intolerances ui ON u.username = ui.username
              JOIN intolerances i ON ui.intolerance_id = i.id
              WHERE u.username = $1
              ORDER BY ui.intolerance_id`,
          [username],
    );

    user["intolerances"] = intolerancesRes.rows

    return user;

  };

  /** authenticate user with username, password.
   *
   * Returns { username, first_name, last_name, email, is_admin }
   *
   * Throws ExpressError is user not found or wrong password.
  **/

  static async authenticate(username, password) {

    // try to find the user first
    const result = await db.query(
          `SELECT username,
                  password,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  is_admin AS "isAdmin"
           FROM users
           WHERE username = $1`,
        [username],
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new ExpressError("Invalid username/password", 401);

  }

  /** Register user with data.
   *
   * Returns { username, firstName, lastName, email, isAdmin }
   *
   * Throws ExpressError on duplicates.
  **/

  static async register({ username, password, firstName, lastName, email, isAdmin }) {

    const duplicateCheck = await db.query(
          `SELECT username
           FROM users
           WHERE username = $1`,
        [username],
    );

    if (duplicateCheck.rows[0]) {
      throw new ExpressError(`Duplicate username: ${username}`, 400);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
          `INSERT INTO users
           (username,
            password,
            first_name,
            last_name,
            email,
            is_admin)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING username, first_name AS "firstName", last_name AS "lastName", email, is_admin AS "isAdmin"`,
        [
          username,
          hashedPassword,
          firstName,
          lastName,
          email,
          isAdmin,
        ],
    );

    const user = result.rows[0];

    return user;
  }

  /** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { firstName, lastName, password, email, isAdmin }
   *
   * Returns { username, firstName, lastName, email, isAdmin }
   *
   * Throws ExpressError if not found.
   *
   * WARNING: this function can set a new password.
   * Callers of this function must be certain they have validated inputs to this
   * or a serious security risks are opened.
   * 
 **/

  static async update(username, data) {

    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = sqlForPartialUpdate(

        data,
        {
          firstName: "first_name",
          lastName: "last_name",
        }
        
    );

    const usernameVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE username = ${usernameVarIdx} 
                      RETURNING username,
                                first_name AS "firstName",
                                last_name AS "lastName",
                                email,
                                is_admin AS "isAdmin"`;
    const result = await db.query(querySql, [...values, username]);
    const user = result.rows[0];

    if (!user) throw new ExpressError(`No user: ${username}`, 404);

    delete user.password;
    return user;
  }

  /** Delete given user from database; returns undefined. */

  static async remove(username) {

      let result = await db.query(
              `DELETE
              FROM users
              WHERE username = $1
              RETURNING username`,
          [username],
      );

      const user = result.rows[0];

      if (!user) throw new ExpressError(`No user: ${username}`, 404);

      return true

  };

  // *************************************************

  // users_intolerances methods

  /** Given a username, return data about user + that user's intolerances
   *
   * Returns { username, first_name, last_name, is_admin, intolerances }
   * 
   * Where intolerances is [{id, intolerance_name, ...]
   *
   * Throws ExpressError if user not found.
   * 
  */

  static async getWithIntolerances(username) {

    const userRes = await db.query(
            `SELECT username,
                    first_name AS "firstName",
                    last_name AS "lastName",
                    email,
                    is_admin AS "isAdmin"
            FROM users
            WHERE username = $1`,
        [username],
    );

    const user = userRes.rows[0];

    if (!user) throw new ExpressError(`No user: ${username}`, 404);

    const intolerancesRes = await db.query(
            `SELECT ui.intolerance_id AS "intoleranceId",
                    i.intolerance_name AS "intoleranceName"
              FROM users u
              JOIN users_intolerances ui ON u.username = ui.username
              JOIN intolerances i ON ui.intolerance_id = i.id
              WHERE u.username = $1
              ORDER BY ui.intolerance_id`,
          [username],
    );

    user["intolerances"] = intolerancesRes.rows

    return user;

  };

  /** Given a username and intolerance_id
   * 
   *  Create a new user_intolerance.
   * 
   *  Returns {username, intolerances:[{id, intolerance_name}...]} (including the newly created intolerance)
   * 
   * 
  */

  static async addUserIntolerance(username, intoleranceId) {

    const existingUserCheck = await db.query(

      `SELECT username,
              first_name AS "firstName",
              last_name AS "lastName",
              email,
              is_admin AS "isAdmin"
        FROM users
        WHERE username = $1`,
      [username],

    );

    if (!existingUserCheck.rows[0]) {

      throw new ExpressError(`No User: ${username}`, 404)

    }

    const existingIntoleranceCheck = await db.query(

      `SELECT id,
              intolerance_name AS "intoleranceName"
        FROM intolerances
        WHERE id = $1`,
      [intoleranceId],

    )

    if (!existingIntoleranceCheck.rows[0]) {

      throw new ExpressError(`No Intolerance with id of ${intoleranceId}`, 404)

    }

    try{

      await db.query(

        `INSERT INTO users_intolerances
         (username, intolerance_id)
         VALUES ($1, $2)
         RETURNING username, intolerance_id`,
        [username, intoleranceId],
  
      );


    } catch(e) {

      throw new ExpressError(`Conflict - Duplicate Data - Could not update intolerances for ${username} to add ${intoleranceId}`, 409)
      
    }

    return true

  };

  /** Given a username and intolerance_id
   * 
   * Delete an existing intolerance.
   * 
   * returns {username, intolerance:{id, intolerance_name...}} (excludes newly created intolerances)
   * 
  */

  static async removeUserIntolerance(username, intoleranceId){

    const result = await db.query(
      `DELETE
      FROM users_intolerances
      WHERE username = $1 AND intolerance_id = $2
      RETURNING username, intolerance_id AS "intoleranceId"`,
      [username, intoleranceId]
    )

    const deletedUserIntolerance = result.rows[0];

    if (!deletedUserIntolerance) {
      
      throw new ExpressError(`No intolerance: ${intoleranceId} or user:${username}`, 404);

    }

    return deletedUserIntolerance

  }

  /** Given a username, return data about user + that user's cache.
   *
   * Returns { username, first_name, last_name, is_admin, cache }
   *
   * Throws ExpressError if user not found.
   * 
  **/

  static async getWithCache(username) {

    const userRes = await db.query(
            `SELECT username,
                    first_name AS "firstName",
                    last_name AS "lastName",
                    email,
                    is_admin AS "isAdmin",
                    cache
            FROM users
            WHERE username = $1`,
        [username],
    );

    const user = userRes.rows[0];

    if (!user) throw new ExpressError(`No user: ${username}`, 404);

    return user;

  };

  /** Given a username
   * 
   * get Cached Recipes
   * 
  */

  static async getCache(username){

    const result = await db.query(
      `SELECT username,
              cache
      FROM users
      WHERE username = $1`,
      [username]
    )

    const user = result.rows[0]

    if (!user) throw new ExpressError(`No such user ${username}`)

    const cache = result.rows[0].cache

    return cache

  }

  /** Given a username
   * 
   * set Cached Recipes
   * 
   * returns true or error
   * 
  */

  static async setCache(username, data){

    const dataAsSingleObj = {data: data}

    const existingUserCheck = await db.query(

      `SELECT username,
              first_name AS "firstName",
              last_name AS "lastName",
              email,
              is_admin AS "isAdmin"
        FROM users
        WHERE username = $1`,
      [username],

    );

    if (!existingUserCheck.rows[0]) {

      throw new ExpressError(`No User: ${username}`, 404)

    }

    const result = await db.query(
      `UPDATE users
      SET cache = $2
      WHERE username = $1
      RETURNING username`,
      [username,dataAsSingleObj]
    )

    const user = result.rows[0]

    if (!user) throw new ExpressError(`Could not update cache for ${username} to ${data}`, 500)

    return true

  }

  /** Given a username
   * 
   * clear Cached Recipes
   * 
   * returns true or error
   * 
  */

  static async clearCache(username){

    const existingUserCheck = await db.query(

      `SELECT username,
              first_name AS "firstName",
              last_name AS "lastName",
              email,
              is_admin AS "isAdmin"
        FROM users
        WHERE username = $1`,
      [username],

    );

    if (!existingUserCheck.rows[0]) {

      throw new ExpressError(`No User: ${username}`, 404)

    }

    const result = await db.query(
      `UPDATE users
      SET cache = $2
      WHERE username = $1
      RETURNING username`,
      [username, null]
    )

    const user = result.rows[0]

    if (!user) throw new ExpressError(`Could not update cache for ${username} to null`)

    return true

  }

}

module.exports = User;