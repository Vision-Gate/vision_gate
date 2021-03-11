DROP TABLE IF EXISTS visions;

CREATE TABLE visions (
  id SERIAL PRIMARY KEY,
  image_url VARCHAR(255),
  username VARCHAR(255),
  description VARCHAR(255),
  deadline VARCHAR(255),
  author VARCHAR(255),
  author_url VARCHAR(255)
);

DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255)
);

-- psql -d table-name -f data/images_schema.sql;
-- psql -d table-name -f data/seed.sql;
-- psql -d table-name -f data/user_schema.sql;