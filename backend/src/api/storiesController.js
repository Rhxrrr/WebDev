import getRandomStory from "../models/story.js";

// bcontroller to handle GET requests for fetching a story
const storiesGET = async (req, res) => {
  try {
    const { type } = req.query;

    // Build the options based on the query parameter 'type'
    const options = {
      multiplayer: type === "multiplayer",
      time: type === "time",
    };

    // fetch a random story based on the given options
    const story = await getRandomStory(options);

    // if no story is found, respond with a 400 status and a message
    if (!story) {
      return res.status(400).json({
        message: "Sorry, we don't have any stories for you today!",
      });
    }

    // send the fetched story as a JSON response
    res.json(story);
  } catch (error) {
    // log in the error and respond with a 500 status and error message
    console.error("Error in storiesGET:", error);
    res.status(500).json({ error: error.message });
  }
};

export default storiesGET;
