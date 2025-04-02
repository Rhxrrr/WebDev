import pool from "./db.js"; // Assuming your DB connection is in 'db.js'
import { faker } from "@faker-js/faker";

const insertRandomStories = async (count = 5) => {
  try {
    const client = await pool.connect();

    for (let i = 0; i < count; i++) {
      const title = faker.lorem.sentence();
      const content = faker.lorem.paragraphs(3);

      await client.query(
        "INSERT INTO stories (title, content) VALUES ($1, $2)",
        [title, content]
      );
    }

    console.log(`✅ Successfully inserted ${count} random stories.`);
    client.release();
  } catch (err) {
    console.error("❌ Error inserting stories:", err.message);
  } finally {
    pool.end();
  }
};

insertRandomStories(10); // Change the number of stories as needed
