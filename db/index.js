const pg = require("pg");

const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/acme_user_places_db"
);

const getUsers = async () => {
  return (await client.query("SELECT * FROM users;")).rows;
};

const getPlaces = async () => {
  return (await client.query("SELECT * FROM places;")).rows;
};

const createUser = async ({ name }) => {
  return (
    await client.query("INSERT INTO users(name) VALUES($1) RETURNING *;", [
      name,
    ])
  ).rows[0];
};

const deleteUser = async (id) => {
  await client.query("DELETE FROM users WHERE id=$1;", [id]);
};
const syncAndSeed = async () => {
  const SQL = `
  DROP TABLE IF EXISTS places;
  DROP TABLE IF EXISTS users;
  CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE
  );
  CREATE TABLE places(
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE
  );

  INSERT INTO users(name) VALUES('Leslie');
  INSERT INTO users(name) VALUES('Ron');
  INSERT INTO users(name) VALUES('April');

  INSERT INTO places(name) VALUES('Indianapolis');
  INSERT INTO places(name) VALUES('New York City');
  INSERT INTO places(name) VALUES('Chicago');
`;
  await client.query(SQL);
};

module.exports = {
  syncAndSeed,
  client,
  getUsers,
  getPlaces,
  createUser,
  deleteUser,
};
