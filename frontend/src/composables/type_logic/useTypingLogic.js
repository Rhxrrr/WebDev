import { watch, onMounted, onUnmounted, nextTick } from "vue";
import { useTimer } from "../useTimer";
import useTypingState from "./useTypingState";
import useTypingHandlers from "./useTypingHandlers";
import useTypingEvaluation from "./useTypingEvaluation";
import useTypingUI from "./useTypingUI";

/**
 * Core composable that orchestrates the typing test logic.
 * Coordinates state, evaluation, input handling, and UI behavior.
 *
 * @param {Ref<Array<{ word: string }>>} formattedText - The structured text the user will type.
 * @param {Ref<number>} accuracy - Reactive reference to the accuracy percentage.
 * @param {Ref<number>} durationRef - Duration (in seconds) of the typing test.
 * @param {Function} getLineMap - Function to retrieve line positioning data for scrolling.
 * @param {Function} scrollToLine - Function to scroll to a specific line.
 *
 * @returns {Object} Exposed refs and functions used in the typing test.
 */
export default function useTypingTest(
  formattedText,
  accuracy,
  durationRef,
  getLineMap,
  scrollToLine
) {
  // --- Typing state management ---
  const {
    inputRef,
    userInput,
    typedWords,
    currentWordIndex,
    isWordCorrect,
    typingStarted,
    typingEnded,
    resetTypingState,
    correctCharsCount,
    mistakesCounter,
    totalExpectedLetters,
    lastLine,
  } = useTypingState(formattedText, accuracy);

  // --- Timer logic (starts/stops based on typing state) ---
  const { time, formattedTime, resetTimer, elapsedTime } = useTimer(
    typingStarted,
    typingEnded,
    durationRef
  );

  // --- Keyboard handling and input focus ---
  const { handleKeyDown, focusInput } = useTypingHandlers({
    inputRef,
    userInput,
    currentWordIndex,
    typedWords,
    isWordCorrect,
  });

  // --- Evaluation logic: accuracy, WPM, mistake counting ---
  const { countAccuracy, wpm } = useTypingEvaluation({
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
  });

  // --- UI helpers: coloring and extra letter display ---
  const { splitUserInput, getLetterClass, getExtraLetters } = useTypingUI({
    typedWords,
    currentWordIndex,
    userInput,
    formattedText,
  });

  // --- Watch for formattedText changes to reset typing state ---
  watch(
    formattedText,
    (newText) => {
      if (newText?.length) resetTypingState(resetTimer);
    },
    { deep: true }
  );

  // --- Lifecycle: mount/unmount listeners ---
  onMounted(() => {
    nextTick(() => {
      focusInput();
      inputRef.value?.addEventListener("keydown", handleKeyDown);
    });
  });

  onUnmounted(() => {
    inputRef.value?.removeEventListener("keydown", handleKeyDown);
  });

  return {
    // Refs exposed for use in the template or other composables
    inputRef,
    userInput,
    typedWords,
    currentWordIndex,
    isWordCorrect,
    splitUserInput,
    getLetterClass,
    getExtraLetters,
    focusInput,
    typingStarted,
    typingEnded,
    wpm,
    time,
    formattedTime,

    // Helper: resets state and timer
    resetTypingState: () => resetTypingState(resetTimer),
  };
}
