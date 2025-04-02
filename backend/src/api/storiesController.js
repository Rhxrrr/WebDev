import storyModel from "../models/story.js";

const getRandomStory = async (req, res) => {
  try {
    const story = await storyModel.getRandomStory();
    if (!story) {
      return res.status(400).json({ message: "No stories found" });
    }
    res.json(story);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default getRandomStory;
