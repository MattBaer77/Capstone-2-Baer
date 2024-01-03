
CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE ingredients (

  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL

);

CREATE TABLE allergies (

  username VARCHAR(25) REFERENCES users(username),
  ingredient_id SERIAL REFERENCES ingredients(id),
  PRIMARY KEY (username, ingredient_id)

);

CREATE TABLE intolerances (

  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL

);

CREATE TABLE users_intolerances (

  username VARCHAR(25) REFERENCES users(username),
  intolerance_id SERIAL REFERENCES intolerances(id),
  PRIMARY KEY (username, intolerance_id)

);