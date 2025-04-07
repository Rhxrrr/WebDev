import { computed } from "vue";

/**
 * Composable to handle typing UI logic in a type racing application.
 *
 * @param {Object} params - Parameters for the composable.
 * @param {Ref<Array<string>>} params.typedWords - Words already typed by the user.
 * @param {Ref<number>} params.currentWordIndex - Index of the word currently being typed.
 * @param {Ref<string>} params.userInput - Current user input (partial word).
 * @param {Ref<Array<{ word: string }>>} params.formattedText - The original words for comparison.
 *
 * @returns {Object} splitUserInput, getLetterClass, getExtraLetters
 */
export default function useTypingUI({
  typedWords,
  currentWordIndex,
  userInput,
  formattedText,
}) {
  /**
   * Computed array combining completed words and current input.
   * It merges typed words with the currently typed portion (in-progress).
   */
  const splitUserInput = computed(() => {
    const result = [...typedWords.value];

    // Update the word at the current index with the current user input
    if (userInput.value.length > 0) {
      result[currentWordIndex.value] = userInput.value.trim();
    }

    return result;
  });

  /**
   * Determines the CSS class to apply to a specific letter.
   *
   * @param {number} wordIndex - Index of the word.
   * @param {number} charIndex - Index of the character in the word.
   * @param {string} char - The actual character in the original word.
   * @returns {string} CSS class for correct/incorrect/neutral characters.
   */
  const getLetterClass = (wordIndex, charIndex, char) => {
    const typedWord = splitUserInput.value[wordIndex] || "";
    const typedChar = typedWord[charIndex];

    if (typedChar === char) {
      return "text-primary-paige"; // Correct character
    } else if (typedChar) {
      return "text-primary-red"; // Incorrect character
    }
    return ""; // No class for untyped character
  };

  /**
   * Extracts extra characters typed by the user that exceed the original word length.
   *
   * @param {number} wordIndex - Index of the word.
   * @returns {string} Extra characters typed by the user, if any.
   */
  const getExtraLetters = (wordIndex) => {
    const typedWord = splitUserInput.value[wordIndex] || "";
    const originalWord = formattedText.value[wordIndex]?.word || "";

    // Return only the extra characters that exceed the original word
    return typedWord.length > originalWord.length
      ? typedWord.slice(originalWord.length)
      : "";
  };

  return {
    splitUserInput,
    getLetterClass,
    getExtraLetters,
  };
}
