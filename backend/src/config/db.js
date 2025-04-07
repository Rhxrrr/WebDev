import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

// create a new PostgreSQL connection pool using the DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// test the database connection by running a simple query
const testConnection = async () => {
  try {
    const res = await pool.query("SELECT NOW()"); // Runs a simple query
    console.log("PostgreSQL connected:", res.rows[0].now);
  } catch (err) {
    console.error("PostgreSQL connection error:", err.message);
  }
};

// run the test when the backend starts
testConnection(); // Run test when backend starts

export default pool;
