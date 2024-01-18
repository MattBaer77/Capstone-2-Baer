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
   * Returns { username, first_name, last_name, is_admin }
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
   * WARNING: this function can set a new password or make a user an admin.
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
          isAdmin: "is_admin",

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

  // static async getWithIntolerances(username) {

  //   const userRes = await db.query(
  //           `SELECT username,
  //                   first_name AS "firstName",
  //                   last_name AS "lastName",
  //                   email,
  //                   is_admin AS "isAdmin"
  //           FROM users
  //           WHERE username = $1`,
  //       [username],
  //   );

  //   const user = userRes.rows[0];

  //   if (!user) throw new ExpressError(`No user: ${username}`, 404);

  //   return user;

  // };

  

  /** Given a username and intolerance_id
   * 
   *  Create a new user_intolerance.
   * 
   *  Returns {username, intolerance:{id, intolerance_name}}
   * 
  */



  /** Given a username and intolerance_id
   * 
   * Delete an existing intolerance.
   * 
   * returns {username, intolerance:{id, intolerance_name}}
   * 
  */

}

module.exports = User;