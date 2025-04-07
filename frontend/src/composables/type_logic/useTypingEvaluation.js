import { computed, watch } from "vue";

/**
 * Composable to handle typing accuracy, word progression, WPM calculation,
 * and viewport scrolling logic.
 *
 * @param {Object} params - Input parameters.
 * @param {Ref<Array<{ word: string }>>} params.formattedText - Words to be typed.
 * @param {Ref<number>} params.currentWordIndex - Index of the word currently being typed.
 * @param {Ref<string>} params.userInput - Current in-progress input.
 * @param {Ref<number>} params.correctCharsCount - Count of correct characters typed.
 * @param {Ref<number>} params.mistakesCounter - Count of typing mistakes.
 * @param {Ref<number>} params.totalExpectedLetters - Total characters expected so far.
 * @param {Ref<number>} params.accuracy - Calculated typing accuracy.
 * @param {Ref<number>} params.elapsedTime - Time passed since typing started.
 * @param {Ref<boolean>} params.typingEnded - Flag indicating if typing test has ended.
 * @param {Ref<boolean>} params.typingStarted - Flag indicating if typing test has started.
 * @param {Ref<string[]>} params.typedWords - Words the user has typed so far.
 * @param {Ref<boolean[]>} params.isWordCorrect - Flags for whether each typed word is correct.
 * @param {Function} params.scrollToLine - Function to scroll UI to a specific line.
 * @param {Function} params.getLineMap - Returns a map of word indices to line numbers.
 * @param {Ref<number>} params.lastLine - Index of the last visible line.
 *
 * @returns {Object} countAccuracy, wpm
 */
export default function useTypingEvaluation({
  formattedText,
  currentWordIndex,
  userInput,
  correctCharsCount,
  mistakesCounter,
  totalExpectedLetters,
  accuracy,
  elapsedTime,
  typingEnded,
  typingStarted,
  typedWords,
  isWordCorrect,
  scrollToLine,
  getLineMap,
  lastLine,
}) {
  /**
   * Recalculates the expected number of letters typed up to the current word.
   * Adjusts for in-progress word length.
   */
  const getExpectedLettersCount = (currentInputLength) => {
    let totalLetters = 0;

    // Sum all completed words
    for (let i = 0; i <= currentWordIndex.value; i++) {
      totalLetters += formattedText.value[i]?.word.length || 0;
    }

    const currentWord = formattedText.value[currentWordIndex.value]?.word || "";

    // If user hasn't typed the full word, subtract the missing characters
    if (currentWord.length > currentInputLength) {
      totalLetters -= currentWord.length - currentInputLength;
    }

    totalExpectedLetters.value = totalLetters;
  };

  /**
   * Counts mistakes and updates accuracy in real time.
   *
   * @param {string} newValue - New user input.
   * @param {string} oldValue - Previous user input.
   */
  const countAccuracy = (newValue, oldValue) => {
    getExpectedLettersCount(newValue.length);

    // Only check for accuracy if characters were added
    if (newValue.length <= oldValue.length) return;

    const expectedWord = formattedText.value[currentWordIndex.value]?.word;
    const expectedLetter = expectedWord?.[newValue.length - 1];
    const inputLetter = newValue[newValue.length - 1];

    // Penalize early spacebar if word is incomplete and incorrect
    if (newValue.endsWith(" ") && newValue.trim() !== expectedWord) {
      if (newValue.trim().length >= expectedWord.length) return;
      mistakesCounter.value += expectedWord.length - newValue.trim().length;
    }

    // Penalize wrong character
    if (expectedLetter !== inputLetter && inputLetter.trim()) {
      mistakesCounter.value++;
    }

    // Calculate new accuracy
    if (totalExpectedLetters.value) {
      const rawAccuracy = Math.round(
        (1 - mistakesCounter.value / totalExpectedLetters.value) * 100
      );
      accuracy.value = Math.min(100, Math.max(0, rawAccuracy));
    }
  };

  /**
   * Computed Words Per Minute (WPM).
   * Based on 5 characters per word standard.
   */
  const wpm = computed(() => {
    const minutes = elapsedTime.value / 60;
    if (minutes === 0) return 0;
    return Math.round(correctCharsCount.value / 5 / minutes);
  });

  // Main typing logic watch
  watch(userInput, (newValue, oldValue) => {
    if (typingEnded.value) return;

    countAccuracy(newValue, oldValue);

    if (!typingStarted.value && newValue.length > 0) {
      typingStarted.value = true;
    }

    const expectedChar =
      formattedText.value[currentWordIndex.value]?.word[newValue.length - 1];
    const typedChar = newValue.slice(-1);

    // Character-level correctness tracking
    if (typedChar === expectedChar) {
      correctCharsCount.value++;
    }

    // Handle spacebar → finalize current word
    if (newValue.endsWith(" ")) {
      const trimmedInput = newValue.trim();
      const expectedWord = formattedText.value[currentWordIndex.value]?.word;

      typedWords.value[currentWordIndex.value] = trimmedInput;
      isWordCorrect.value[currentWordIndex.value] =
        trimmedInput === expectedWord;

      currentWordIndex.value += 1;
      userInput.value = "";
    }

    // Last word logic
    else if (currentWordIndex.value === formattedText.value?.length - 1) {
      const trimmedInput = newValue.trim();
      const expectedWord = formattedText.value[currentWordIndex.value]?.word;

      typedWords.value[currentWordIndex.value] = trimmedInput;
      isWordCorrect.value[currentWordIndex.value] =
        trimmedInput === expectedWord;

      if (trimmedInput === expectedWord) {
        typingEnded.value = true;
      }
    }

    // Scroll logic: map current word index to line and scroll if needed
    const lineMap = getLineMap();
    const currentLine = lineMap[currentWordIndex.value] ?? lastLine.value;

    if (currentLine > lastLine.value) {
      scrollToLine(currentLine);
    }

    lastLine.value = currentLine;
  });

  return {
    countAccuracy,
    wpm,
  };
}
