import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import storiesRoutes from "./routes/storiesRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";

const app = express();

// Get __dirname with ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/stories", storiesRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

// Serve frontend static files from ../frontend/dist
const frontendPath = path.resolve(__dirname, "../../frontend/dist");

app.use(express.static(frontendPath));

// Catch-all route to serve index.html for SPA routing
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

export default app;
