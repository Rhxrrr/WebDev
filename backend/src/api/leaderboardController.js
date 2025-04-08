import { insertResult, getTopResults } from "../models/leaderboard.js";

export const submitScore = async (req, res) => {
  try {
    const { username, wpm, accuracy, time_taken } = req.body;
    const saved = await insertResult({ username, wpm, accuracy, time_taken });
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const scores = await getTopResults();
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
