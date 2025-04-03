import { ref, computed, watch, onMounted, nextTick } from "vue";

export function useTypingLogic(storyText) {
  const story =
    storyText ||
    'In the quiet town of Eldermere, nestled between rolling green hills and a dense, whispering forest, there lived an old clockmaker named Elias Thorne. His shop, "Thorne’s Timepieces," sat at the heart of the town square, its wooden sign creaking gently in the wind. For over fifty years, Elias had repaired and crafted the finest clocks,';

  const userInput = ref(""); // Stores user's typed input
  const inputRef = ref(null); // Reference to hidden input
  const currentWordIndex = ref(0);
  const typedWords = ref([]);
  const incorrectWords = ref(new Set());
  const letterStates = ref(new Map()); // Stores classes for each letter

  // Format the text into words and letters
  const formattedText = computed(() => {
    return story.split(" ").map((word, wordIndex) => ({
      word,
      letters: word.split(""),
      wordIndex,
      typed: typedWords.value[wordIndex] || "",
    }));
  });
  // Function to get CSS class for each letter
  const getLetterClass = (wordIndex, charIndex, char) => {
    const key = `${wordIndex}-${charIndex}`;
    return letterStates.value.get(key) || "";
  };

  // Watch user input
  watch(userInput, (newValue) => {
    const wordObj = formattedText.value[currentWordIndex.value];
    const typedWord = newValue.trim();

    // Update letter states dynamically
    wordObj.letters.forEach((char, charIndex) => {
      const key = `${currentWordIndex.value}-${charIndex}`;
      letterStates.value.set(
        key,
        charIndex < newValue.length
          ? newValue[charIndex] === char
            ? "text-primary-paige"
            : "text-primary-red"
          : ""
      );
    });

    if (newValue.endsWith(" ")) {
      typedWords.value[currentWordIndex.value] = typedWord;
      if (typedWord !== wordObj.word) {
        incorrectWords.value.add(currentWordIndex.value);
      }
      currentWordIndex.value += 1;
      userInput.value = "";
    }
  });

  return {
    story,
    userInput,
    inputRef,
    currentWordIndex,
    typedWords,
    incorrectWords,
    letterStates,
    formattedText,
    getLetterClass,
  };
}
