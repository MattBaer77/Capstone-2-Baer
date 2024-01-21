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
       ('bobert''s list', 'bob_roberts');

INSERT INTO grocery_lists_recipes (grocery_list_id, recipe_id)
VALUES (1, 641435),
       (1, 641435),
       (1, 642096),
       (2, 641435),
       (2, 640941);

INSERT INTO grocery_lists_ingredients (grocery_list_id, ingredient_id, amount, minimum_amount, unit)
VALUES (1, 20081, 2, 1, 'cup'),
       (1, 20082, 1, 2, 'cup');