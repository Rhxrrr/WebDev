import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "webdev",
  host: "localhost",
  database: "webdev",
  password: "123456789",
  port: 5432,
});

export default pool;
