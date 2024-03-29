
CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  cache JSONB
);

-- v MAY NO LONGER NEED v --

-- CREATE TABLE ingredients (

--   id INTEGER PRIMARY KEY,
--   ingredient_name TEXT NOT NULL

-- );

-- CREATE TABLE allergies (

--   username VARCHAR(25) REFERENCES users(username),
--   ingredient_id SERIAL REFERENCES ingredients(id),
--   PRIMARY KEY (username, ingredient_id)

-- );

-- ^ MAY NO LONGER NEED ^ --

CREATE TABLE intolerances (

  id SERIAL PRIMARY KEY,
  intolerance_name TEXT NOT NULL

);

CREATE TABLE users_intolerances (

  username VARCHAR(25) REFERENCES users(username) ON DELETE CASCADE,
  intolerance_id SERIAL REFERENCES intolerances(id) ON DELETE CASCADE,
  PRIMARY KEY (username, intolerance_id)

);

CREATE TABLE grocery_list (

  id SERIAL PRIMARY KEY,
  list_name TEXT NOT NULL,
  owner VARCHAR(25) REFERENCES users(username) ON DELETE CASCADE

);

CREATE TABLE grocery_lists_recipes (

  id SERIAL PRIMARY KEY,
  grocery_list_id SERIAL REFERENCES grocery_list(id) ON DELETE CASCADE,
  recipe_id INTEGER NOT NULL
  
);

CREATE TABLE grocery_lists_ingredients (

  -- id SERIAL PRIMARY KEY,
  grocery_list_id SERIAL REFERENCES grocery_list(id) ON DELETE CASCADE,
  ingredient_id INTEGER NOT NULL,
  amount FLOAT NOT NULL,
  unit TEXT NOT NULL,
  -- on_recipe BOOLEAN NOT NULL DEFAULT FALSE
  minimum_amount FLOAT NOT NULL,
  PRIMARY KEY (grocery_list_id, ingredient_id)

);