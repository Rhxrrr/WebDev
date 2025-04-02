<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import Navbar from "../components/Navbar/Navbar.vue";
import TextNav from "../components/TextNav.vue";
import { textContent } from "@composables/storiesAction.js";

const story =
  textContent.value ||
  'In the quiet town of Eldermere, nestled between rolling green hills and a dense, whispering forest, there lived an old clockmaker named Elias Thorne. His shop, "Thorne\’s Timepieces," sat at the heart of the town square, its wooden sign creaking gently in the wind. For over fifty years, Elias had repaired and crafted the finest clocks, each a masterpiece of precision and artistry. But there was one clock—an enormous, ornate grandfather clock—that had remained untouched in the corner of his workshop for as long as anyone could remember. Its dark mahogany frame was intricately carved with celestial symbols, and its pendulum, though perfectly balanced, never moved. One evening, as Elias sat polishing the gears of a pocket watch, a young boy named Oliver stepped into the shop. He was no stranger to Elias, having spent many afternoons watching him work, mesmerized by the delicate hands that breathed life into lifeless mechanisms. "Mr. Thorne," Oliver asked hesitantly, pointing at the grandfather clock, "why doesn\’t that one tick?" Elias paused, his fingers tightening around the watch. He let out a slow sigh and beckoned Oliver closer.';

const userInput = ref(""); // Stores user's typed input
const inputRef = ref(null); // Reference to hidden input

// Generate colored text based on correctness
const formattedText = computed(() => {
  return story.split("").map((char, index) => {
    return {
      char,
      correct:
        index < userInput.value.length ? userInput.value[index] === char : null,
      cursor: index === userInput.value.length - 1, // Cursor should be on the last typed character
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
      <div class="w-full relative">
        <p class="overflow-hidden max-h-[250px] leading-relaxed fade-text">
          <span
            v-for="(charObj, index) in formattedText"
            :key="index"
            :class="{
              'text-red-500': charObj.correct === false, // Incorrect letter
              'text-black': charObj.correct === true, // Correct letter
              'text-gray-400': charObj.correct === null, // Untyped letters
              'cursor-blink': charObj.cursor, // Cursor effect
            }"
          >
            {{ charObj.char }}
          </span>
        </p>
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
@keyframes blink {
  50% {
    opacity: 0;
  }
}

.cursor-blink::after {
  content: "|";
  color: blue;
  animation: blink 1s infinite;
}
</style>
