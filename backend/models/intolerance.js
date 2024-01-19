"use strict";

const db = require("../db");

const ExpressError = require("../expressError")

class Intolerance {

    /** Find All Possible Intolerances
     * 
     * 
     * 
    */

    static async findAll() {

        const result = await db.query(

            `SELECT id,
                    intolerance_name AS "intoleranceName"
                FROM intolerances
                ORDER BY id`

        );

        if(!result) throw new ExpressError("No intolerances found", 404)

        return result.rows
        
    }

}

module.exports = Intolerance