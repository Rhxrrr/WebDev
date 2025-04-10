import pool from "./db.js";
import { faker } from "@faker-js/faker";

// Available modes and time durations
const modes = ["race", "stories"];
const timeOptions = [15, 30, 60];

/**
 * Get the next available ID for a table by finding the current MAX(id) and adding 1.
 * @param {string} tableName - Table to query.
 * @returns {Promise<number>} - The next available ID.
 */
const getNextId = async (tableName) => {
  try {
    const res = await pool.query(`SELECT MAX(id) AS max_id FROM ${tableName}`);
    return (res.rows[0].max_id || 0) + 1;
  } catch (err) {
    console.error(`Error getting next ID for '${tableName}':`, err.message);
    return 1;
  }
};

/**
 * Inserts leaderboard entries into the given table.
 * @param {string} tableName - Name of the leaderboard table.
 * @param {number} count - Number of mock rows to insert.
 * @param {number} startingId - ID to start from.
 */
const insertLeaderboardData = async (tableName, count, startingId) => {
  try {
    const client = await pool.connect();

    for (let i = 0; i < count; i++) {
      const id = startingId + i;
      const username = faker.internet.userName().toLowerCase();
      const wpm = faker.number.int({ min: 65, max: 110 });

      // Ensures 1 decimal place (not more)
      const rawAccuracy = faker.number.float({ min: 88.0, max: 99.9 });
      const accuracy = Math.round(rawAccuracy * 10) / 10;

      const time_taken = faker.helpers.arrayElement(timeOptions);
      const mode = faker.helpers.arrayElement(modes);
      const placement = faker.number.int({ min: 1, max: 4 });
      const played_at = faker.date.recent({ days: 14 });

      await client.query(
        `INSERT INTO ${tableName} 
         (id, username, wpm, accuracy, time_taken, mode, placement, played_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [id, username, wpm, accuracy, time_taken, mode, placement, played_at]
      );
    }

    console.log(`✅ Inserted ${count} leaderboard entries into '${tableName}'`);
    client.release();
  } catch (err) {
    console.error(`❌ Error inserting into '${tableName}':`, err.message);
  }
};

/**
 * Seeds the leaderboard table with mock data.
 */
const seedLeaderboard = async () => {
  const tableName = "leaderboard";
  const count = 10;
  const nextId = await getNextId(tableName);

  await insertLeaderboardData(tableName, count, nextId);

  pool.end();
};

seedLeaderboard();
