// src/routes/leaderboardRoutes.js
import express from "express";
const router = express.Router();
import pool from "../config/db.js"; // Correct path now

// GET top scores
// router.get("/top", async (req, res) => {
//   try {
//     const result = await pool.query(
//       "SELECT * FROM leaderboard ORDER BY wpm DESC LIMIT 10"
//     );
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error fetching top scores");
//   }
// });
// GET /api/leaderboard/race

router.get("/race", async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT username, wpm, accuracy, time_taken
        FROM leaderboard
        WHERE mode = 'race'
        ORDER BY id DESC
        LIMIT 10
      `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching race leaderboard:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/stories", async (req, res) => {
  const { time } = req.query;
  console.log("Fetching story leaderboard for time:", time);

  if (!time) {
    return res.status(400).json({ error: "Missing time query param" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM leaderboard WHERE mode = $1 AND time_taken = $2 ORDER BY wpm DESC LIMIT 10",
      ["stories", parseInt(time)]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Database error in /stories:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST new score
// In leaderboardRoutes.js
router.post("/submit", async (req, res) => {
  const { username, wpm, accuracy, time_taken, mode, placement } = req.body;

  try {
    const query = `
        INSERT INTO leaderboard (username, wpm, accuracy, time_taken, mode, placement)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
      `;
    const result = await pool.query(query, [
      username,
      wpm,
      accuracy,
      time_taken,
      mode || "story",
      placement || null,
    ]);

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error saving score:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
