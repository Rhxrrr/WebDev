import pool from "./db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsPath = path.join(__dirname, "../migrations");

const runMigrations = async () => {
  try {
    // Ensure migrations table exists
    await pool.query(`CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      filename TEXT UNIQUE NOT NULL,
      applied_at TIMESTAMP DEFAULT NOW()
    );`);

    const appliedMigrations = await pool.query(
      "SELECT filename FROM migrations"
    );
    const appliedFiles = appliedMigrations.rows.map((row) => row.filename);

    const migrationFiles = fs
      .readdirSync(migrationsPath)
      .filter((file) => file.endsWith(".sql"))
      .filter((file) => !appliedFiles.includes(file)); // Skip applied migrations

    for (const file of migrationFiles) {
      const filePath = path.join(migrationsPath, file);
      const sql = fs.readFileSync(filePath, "utf-8");
      console.log(`🚀 Running migration: ${file}`);
      await pool.query(sql);
      await pool.query("INSERT INTO migrations (filename) VALUES ($1)", [file]); // Track it
    }

    console.log("✅ All pending migrations applied.");
  } catch (error) {
    console.error("❌ Migration error:", error.message);
  } finally {
    pool.end();
  }
};

runMigrations();
