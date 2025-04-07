import pool from "../config/db.js";

/**
 * Fetches a random story from the appropriate table based on options.
 *
 * @param {Object} options - Options to determine which table to query.
 * @param {boolean} options.multiplayer - If true, selects from `multiplayer_stories`.
 * @param {boolean} options.time - If true, selects from `time_stories`.
 * @returns {Object} - A random story row.
 */
const getRandomStory = async ({ multiplayer = false, time = false } = {}) => {
  let tableName = "stories"; // default

  if (multiplayer) {
    tableName = "multiplayer_stories";
  } else if (time) {
    tableName = "time_stories";
  }

  const result = await pool.query(
    `SELECT * FROM ${tableName} ORDER BY RANDOM() LIMIT 1`
  );
  return result.rows[0];
};

export default getRandomStory;
