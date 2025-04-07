import { ref } from "vue";

/**
 * Manages the reactive state for a typing game.
 *
 * @param {Ref<Array<{ word: string }>>} formattedText - The text to type, split into word objects.
 * @param {Ref<number>} accuracy - The reactive accuracy value (percentage).
 *
 * @returns {Object} Reactive typing state and reset function.
 */
export default function useTypingState(formattedText, accuracy) {
  // DOM reference to the input element
  const inputRef = ref(null);

  // Reactive input and tracking
  const userInput = ref(""); // Current input value (in-progress word)
  const typedWords = ref([]); // All completed words typed by the user
  const currentWordIndex = ref(0); // Index of the current word being typed
  const isWordCorrect = ref([]); // Array of booleans tracking if each word was typed correctly

  // Typing progress flags
  const typingStarted = ref(false); // True when typing has started
  const typingEnded = ref(false); // True when typing has ended

  // Character-level stats
  const correctCharsCount = ref(0); // Total correct characters typed
  const mistakesCounter = ref(0); // Total mistakes made
  const totalExpectedLetters = ref(0); // Total characters expected to be typed

  // Last visible line index (used in multi-line layouts)
  const lastLine = ref(0);

  /**
   * Resets all typing-related state variables.
   *
   * @param {Function} resetTimer - Callback function to reset any external timer logic.
   */
  const resetTypingState = (resetTimer) => {
    typingStarted.value = false;
    typingEnded.value = false;

    // Reset external timer (e.g., countdown or stopwatch)
    resetTimer();

    // Clear input and progress
    userInput.value = "";
    typedWords.value = [];
    currentWordIndex.value = 0;
    isWordCorrect.value = [];

    // Reset stats
    correctCharsCount.value = 0;
    mistakesCounter.value = 0;
    totalExpectedLetters.value = 0;
    accuracy.value = 100;

    // UI helper reset
    lastLine.value = 0;
  };

  return {
    inputRef,
    userInput,
    typedWords,
    currentWordIndex,
    isWordCorrect,
    typingStarted,
    typingEnded,
    correctCharsCount,
    mistakesCounter,
    totalExpectedLetters,
    lastLine,
    resetTypingState,
  };
}
