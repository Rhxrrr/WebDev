import express from "express";
import getRandomStory from "../api/storiesController.js";
const router = express.Router();

router.get("/", getRandomStory);

export default router;
