DROP TABLE IF EXISTS visions;

CREATE TABLE visions (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255)
);

-- psql -d table-name -f data/images_schema.sql;
-- psql -d table-name -f data/seed.sql;
-- psql -d table-name -f data/user_schema.sql;