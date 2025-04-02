import express from "express";
import storiesGET from "../api/storiesController.js";
const router = express.Router();

router.get("/", storiesGET);

export default router;
