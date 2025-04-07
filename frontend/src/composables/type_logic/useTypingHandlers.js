/**
 * Manages input focus and keydown behavior for navigating between words
 * during a typing test.
 *
 * @param {Object} params - Parameters passed into the composable.
 * @param {Ref<HTMLElement|null>} params.inputRef - Reference to the input element.
 * @param {Ref<string>} params.userInput - Current user input (partial word).
 * @param {Ref<number>} params.currentWordIndex - Index of the current word being typed.
 * @param {Ref<string[]>} params.typedWords - All completed words typed by the user.
 * @param {Ref<boolean[]>} params.isWordCorrect - Boolean array tracking word correctness.
 *
 * @returns {Object} focusInput, handleKeyDown
 */
export default function useTypingHandlers({
  inputRef,
  userInput,
  currentWordIndex,
  typedWords,
  isWordCorrect,
}) {
  /**
   * Focuses the input element, if available.
   */
  const focusInput = () => {
    if (inputRef.value) {
      inputRef.value.focus();
    }
  };

  /**
   * Custom keydown handler for navigating words with backspace/delete.
   * Allows user to move backward to fix previous incorrect words.
   * Prevents navigation if the previous word was already correct.
   *
   * @param {KeyboardEvent} event - The keyboard event.
   */
  const handleKeyDown = (event) => {
    const input = inputRef.value;
    const selectionStart = input?.selectionStart ?? 0;

    const isAtStart = selectionStart === 0;
    const isCmdDelete =
      event.key === "Backspace" && (event.metaKey || event.ctrlKey);
    const isSelecting = input?.selectionStart !== input?.selectionEnd;
    const isBackspace = event.key === "Backspace" || event.key === "Delete";

    const canGoBack =
      currentWordIndex.value > 0 &&
      isAtStart &&
      isBackspace &&
      !isSelecting &&
      userInput.value.length === 0;

    // Allow backspacing into previous word only if it was incorrect
    if (canGoBack) {
      const prevIndex = currentWordIndex.value - 1;

      if (!isWordCorrect.value[prevIndex]) {
        currentWordIndex.value = prevIndex;
        userInput.value = typedWords.value[prevIndex] || "";
        typedWords.value[prevIndex] = "";
        isWordCorrect.value[prevIndex] = false;

        event.preventDefault(); // Prevent default deletion behavior
        return;
      }
    }

    // Prevent editing back into previous word if it was correct
    const tryingToBackIntoCorrectWord =
      currentWordIndex.value > 0 &&
      (isAtStart || isSelecting) &&
      isBackspace &&
      isWordCorrect.value[currentWordIndex.value - 1];

    if (tryingToBackIntoCorrectWord) {
      event.preventDefault();
    }

    // Additional key combos (like Cmd+Backspace) could be handled here if needed
  };

  return {
    focusInput,
    handleKeyDown,
  };
}
