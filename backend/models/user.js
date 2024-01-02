"use strict";

const db = require("../db");

const {sqlForPartialUpdate} = require("../helpers/sql")

const ExpressError = require("../expressError");

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

    // if (data.password) {
    //   data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    // }

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

}

module.exports = User;