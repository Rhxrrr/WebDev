import pool from "../config/db.js";

const getRandomStory = async () => {
  const result = await pool.query(
    "SELECT * FROM stories ORDER BY RANDOM() LIMIT 1"
  );
  return result.rows[0];
};

export default getRandomStory;
