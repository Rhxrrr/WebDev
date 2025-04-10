import { insertResult, getTopResults } from "../models/leaderboard.js";

export const submitScore = async (req, res) => {
  try {
    const { username, wpm, accuracy, time_taken } = req.body;

    console.log(" New Score Submitted:", { username, wpm, accuracy, time_taken, mode });
    const saved = await insertResult({ username, wpm, accuracy, time_taken });
    res.json(saved);
  } catch (err) {
    console.error("Error saving score:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const scores = await getTopResults();
    res.json(scores);
  } catch (err) {
    onsole.error("Error fetching leaderboard:", err);
    res.status(500).json({ error: err.message });
  }
};
