import getRandomStory from "../models/story.js";

const storiesGET = async (req, res) => {
  try {
    const story = await getRandomStory();
    if (!story) {
      return res
        .status(400)
        .json({ message: "Sorry we dont have any stories for you today! \n" });
    }
    res.json(story);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export default storiesGET;
