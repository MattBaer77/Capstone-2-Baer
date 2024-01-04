INSERT INTO users (username, password, first_name, last_name, email, is_admin)
VALUES ('testuser',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'User',
        'joel@joelburton.com',
        FALSE),
       ('testadmin',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'Admin!',
        'joel@joelburton.com',
        TRUE);

-- \COPY ingredients (ingredient_name, id) FROM './top-1k-ingredients.csv' DELIMITER ';' CSV HEADER;

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

INSERT INTO users_intolerances (username, intolerance_id)
VALUES ('testuser', 5);

INSERT INTO grocery_list (list_name, owner)
VALUES ('testuser''s wonderful grocery list!', 'testuser');

INSERT INTO grocery_lists_recipes (grocery_list_id, recipe_id)
VALUES (1, 641435);

INSERT INTO grocery_lists_ingredients (grocery_list_id, ingredient_id, amount, unit)
VALUES (1, 20081, 1, 'cup');