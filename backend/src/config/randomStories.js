import pool from "./db.js";
import { faker } from "@faker-js/faker";

// Real English sentences to form the stories
const realSentences = [
  "The quick brown fox jumps over the lazy dog.",
  "Technology is rapidly changing the way we live and work.",
  "Learning never exhausts the mind.",
  "Nature has the power to heal and inspire.",
  "Reading books can transport you to new worlds.",
  "Exercise improves both physical and mental health.",
  "Traveling opens your eyes to different cultures.",
  "Good communication is key to healthy relationships.",
  "Art allows us to express emotions words cannot.",
  "Education is the most powerful weapon to change the world.",
];

const getRandomStoryContent = (minWords, maxWords) => {
  const targetWordCount =
    Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
  let content = "";
  let currentWordCount = 0;

  while (currentWordCount < targetWordCount) {
    const sentence =
      realSentences[Math.floor(Math.random() * realSentences.length)];
    const sentenceWordCount = sentence.split(" ").length;

    if (currentWordCount + sentenceWordCount <= targetWordCount) {
      content += sentence + " ";
      currentWordCount += sentenceWordCount;
    } else {
      const remainingWords = targetWordCount - currentWordCount;
      content += sentence.split(" ").slice(0, remainingWords).join(" ") + ".";
      currentWordCount = targetWordCount;
    }
  }

  return content.trim();
};

/**
 * Inserts stories into a specific table with custom word ranges.
 * @param {string} tableName - Name of the table to insert into.
 * @param {number} count - Number of stories to insert.
 * @param {number} minWords - Minimum word count per story.
 * @param {number} maxWords - Maximum word count per story.
 */
const insertStories = async (tableName, count, minWords, maxWords) => {
  try {
    const client = await pool.connect();

    for (let i = 0; i < count; i++) {
      const title = faker.word.words({ count: { min: 2, max: 5 } });
      const content = getRandomStoryContent(minWords, maxWords);

      await client.query(
        `INSERT INTO ${tableName} (title, content) VALUES ($1, $2)`,
        [title, content]
      );
    }

    console.log(`Inserted ${count} stories into '${tableName}'`);
    client.release();
  } catch (err) {
    console.error(`Error inserting into '${tableName}':`, err.message);
  }
};

// Seed the tables
const seedAll = async () => {
  await insertStories("multiplayer_stories", 10, 30, 50); // short
  await insertStories("time_stories", 10, 250, 400); // very long
  await insertStories("stories", 10, 60, 150); // medium to short
  pool.end();
};

seedAll();
