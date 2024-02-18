INSERT INTO users (username, password, first_name, last_name, email, is_admin)
VALUES ('testuser',
        '$2b$13$p.w4iSj8eJld5y29UCGkR.W6wITjpfurQPs/60U9MtmE20tMC8.LK',
        'Test',
        'User',
        'joel@joelburton.com',
        FALSE),
       ('testadmin',
        '$2b$13$p.w4iSj8eJld5y29UCGkR.W6wITjpfurQPs/60U9MtmE20tMC8.LK',
        'Test',
        'Admin!',
        'joel@joelburton.com',
        TRUE),
        ('admin_user', 'adminpass', 'Admin', 'User', 'admin.user@example.com', TRUE),
        ('administrative_results', 'adminchimp', 'Admin', 'Results', 'admin.user@bigchimpenergy.com', TRUE),
        ('john_doe', 'password123', 'John', 'Doe', 'john.doe@example.com', FALSE),
        ('jane_smith', 'securepass', 'Jane', 'Smith', 'jane.smith@example.com', FALSE),
        ('alice_jones', 'pass123', 'Alice', 'Jones', 'alice.jones@example.com', FALSE),
        ('bob_roberts', 'secretword', 'Bob', 'Roberts', 'bob.roberts@example.com', FALSE);

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
       ('tree nut'),
       ('wheat');

INSERT INTO users_intolerances (username, intolerance_id)
VALUES ('testuser', 5),
       ('administrative_results', 9);

INSERT INTO grocery_list (list_name, owner)
VALUES ('testuser''s wonderful grocery list!', 'testuser'),
       ('testuser''s wonderful grocery list two!', 'testuser'),
       ('bobert''s list', 'bob_roberts');

INSERT INTO grocery_lists_recipes (grocery_list_id, recipe_id)
VALUES (1, 660395),
       (1, 1039293),
       (1, 647433),
       (2, 1039293),
       (2, 647433),
       (3, 660736),
       (3, 660736);

INSERT INTO grocery_lists_ingredients (grocery_list_id, ingredient_id, amount, minimum_amount, unit)
VALUES (1, 1123, 4, 0, 'each'),
       (1, 1052050, 1, 1, 'tsp');