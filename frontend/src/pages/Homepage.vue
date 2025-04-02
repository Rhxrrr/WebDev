<script setup>
import { ref, computed, onMounted, nextTick, watch } from "vue";
import Navbar from "../components/Navbar/Navbar.vue";
import TextNav from "../components/TextNav.vue";
import { textContent } from "@composables/storiesAction.js";

const story =
  textContent.value ||
  'In the quiet town of Eldermere, nestled between rolling green hills and a dense, whispering forest, there lived an old clockmaker named Elias Thorne. His shop, "Thorne\’s Timepieces," sat at the heart of the town square, its wooden sign creaking gently in the wind. For over fifty years, Elias had repaired and crafted the finest clocks,';
const userInput = ref(""); // Stores user's typed input
const inputRef = ref(null); // Reference to hidden input
const currentWordIndex = ref(0);
const typedWords = ref([]);
const incorrectWords = ref(new Set());
const letterStates = ref(new Map()); // Stores classes for each letter

const formattedText = computed(() => {
  return story.split(" ").map((word, wordIndex) => {
    return {
      word,
      letters: word.split(""),
      wordIndex,
      typed: typedWords.value[wordIndex] || "",
    };
  });
});

const focusInput = () => {
  if (inputRef.value) {
    inputRef.value.focus();
  }
};

onMounted(() => {
  nextTick(() => focusInput());
});

// Tracks typed letters and assigns correct/incorrect classes
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
</script>

<template>
  <div
    class="h-screen w-screen bg-primary-grey p-4 flex items-center flex-col justify-start"
    @click="focusInput"
  >
    <Navbar />
    <div
      class="flex flex-col w-[70%] flex-1 items-center justify-center text-primary-grey text-4xl font-semibold relative overflow-hidden"
    >
      <TextNav />
      <div class="w-full relative flex flex-wrap gap-2">
        <div
          v-for="wordObj in formattedText"
          :key="wordObj.wordIndex"
          class="word"
        >
          <span
            v-for="(char, charIndex) in wordObj.letters"
            :key="charIndex"
            :class="getLetterClass(wordObj.wordIndex, charIndex, char)"
          >
            {{ char }}
          </span>
        </div>
      </div>
      <input
        ref="inputRef"
        v-model="userInput"
        class="absolute opacity-0 pointer-events-none"
      />
    </div>
  </div>
</template>

<style>
.word {
  margin: 0.3rem;
}
</style>
