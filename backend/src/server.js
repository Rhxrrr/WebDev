import "./config/db.js"; // Import the database connection
import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // Allow frontend to make requests
import storiesRoutes from "./routes/storiesRoutes.js"; // Import API routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Handle cross-origin requests
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use("/api/stories", storiesRoutes); // Mount stories API

app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
