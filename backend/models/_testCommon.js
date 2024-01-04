const bcrypt = require ("bcrypt");

const db = require("../db");

const { BCRYPT_WORK_FACTOR } = require("../config");

async function commonBeforeAll() {

    // CLEAR OUT ALL TABLES BEFORE TESTS
    // SET SERIAL IDs TO 1 (WHERE APPLICABLE)

    await db.query("DELETE FROM grocery_lists_ingredients")
    await db.query("SELECT setval('grocery_lists_ingredients_id_seq', 1, false)")

    await db.query("DELETE FROM grocery_lists_recipes")
    await db.query("SELECT setval('grocery_lists_recipes_id_seq', 1, false)")

    await db.query("DELETE FROM grocery_list")
    await db.query("SELECT setval('grocery_list_id_seq', 1, false)")

    await db.query("DELETE FROM users_intolerances")

    await db.query("DELETE FROM intolerances")
    await db.query("SELECT setval('intolerances_id_seq', 1, false)")

    await db.query("DELETE FROM users")

    // 

    await db.query(`

        INSERT INTO users(username,
                          password,
                          first_name,
                          last_name,
                          email,
                          is_admin)
        VALUES ('u1', $1, 'U1F', 'U1L', 'u1@email.com', false),
               ('u2', $2, 'U2F', 'U2L', 'u2@email.com', false),
               ('u3', $3, 'U3F', 'U3L', 'u3@email.com', false),
               ('uA', $4, 'UAF', 'UAL', 'uA@email.com', true),
               ('uAB', $5, 'UABF', 'UABL', 'uAB@email.com', true)
               RETURNING username`,
               [
                await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
                await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
                await bcrypt.hash("password3", BCRYPT_WORK_FACTOR),
                await bcrypt.hash("passwordA", BCRYPT_WORK_FACTOR),
                await bcrypt.hash("passwordAB", BCRYPT_WORK_FACTOR)
               ]   
               
    );

    // 

    await db.query(`

        INSERT INTO intolerances (intolerance_name)
        VALUES ('dairy'),
               ('egg'),
               ('gluten'),
               ('grain'),
               ('peanut'),
               ('seafood'),
               ('sesame'),
               ('shellfish'),
               ('soy'),
               ('sulfite'),
               ('tree Nut'),
               ('wheat');
    
    `);

    await db.query(`

        INSERT INTO users_intolerances (username, intolerance_id)
        VALUES ('u1', 2),
               ('u1', 3),
               ('u2', 1),
               ('uA', 6);

    `);

    await db.query(`

        INSERT INTO grocery_list (list_name, owner)
        VALUES ('testlist', 'u1'),
               ('test2list', 'u2'),
               ('testAlist', 'uA');
    
    `);

    await db.query(`

        INSERT INTO grocery_lists_recipes (grocery_list_id, recipe_id)
        VALUES (1,11),
               (2,22),
               (3,33);

    `);

    await db.query(`

        INSERT INTO grocery_lists_ingredients (grocery_list_id, ingredient_id, amount, unit)
        VALUES (1, 100, 1, 'Some Unit');
    
    `);

};

async function commonBeforeEach() {
    await db.query("BEGIN");
}

async function commonAfterEach() {
    await db.query("ROLLBACK");
}

async function commonAfterAll() {
    await db.end();
}


module.exports = {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
};