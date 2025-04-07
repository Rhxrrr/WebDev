/**
 * Formats a string of text into structured word objects for the typing test.
 *
 * @param {string} story - The raw input text (e.g., a paragraph or sentence).
 * @returns {Array<Object>} An array of word objects with metadata:
 *   - word: the full word as a string
 *   - letters: an array of individual characters
 *   - wordIndex: position of the word in the text
 *   - status: a flag used for tracking correctness or other state
 */
const formatText = (story) => {
  return story.split(" ").map((word, wordIndex) => ({
    word,
    letters: word.split(""),
    wordIndex,
    status: false,
  }));
};

export default formatText;
