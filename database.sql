CREATE DATABASE reportwriterthree;

CREATE TABLE users
(
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255)
);