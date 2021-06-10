const Pool = require("pg").Pool;

const pool = new Pool({
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_USER,
    port: process.env.PG_PORT,
    database: "dbname",
});

module.exports = { pool };
