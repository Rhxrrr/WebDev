import pool from "../config/db.js";

// Save new score to leaderboard
export const insertResult = async ({ username, wpm, accuracy, time_taken }) => {
  const query = `
    INSERT INTO leaderboard (username, wpm, accuracy, time_taken)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [username, wpm, accuracy, time_taken];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Get top 10 scores sorted by WPM, then accuracy, then time
export const getTopResults = async (limit = 10) => {
  const result = await pool.query(`
    SELECT * FROM leaderboard
    ORDER BY wpm DESC, accuracy DESC, time_taken ASC
    LIMIT $1;
  `, [limit]);
  return result.rows;
};