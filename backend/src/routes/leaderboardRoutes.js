import express from "express";
import { submitScore, getLeaderboard } from "../api/leaderboardController.js";

const router = express.Router();

router.post("/submit", submitScore);
router.get("/", getLeaderboard);

export default router;
