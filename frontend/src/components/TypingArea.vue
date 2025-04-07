<template>
  <div
    ref="wordWrapperRef"
    class="w-full relative flex flex-wrap gap-2 max-h-[30%] scroll-locked transition-all duration-300 ease-in-out"
  >
    <!-- Loop through each word object in formattedText -->
    <div
      v-for="(wordObj, wordIndex) in formattedText"
      :key="wordIndex"
      class="word m-[0.3rem]"
      :ref="(el) => (wordRefs[wordIndex] = el)"
      :class="{
        typed:
          splitUserInput[wordIndex] &&
          splitUserInput[wordIndex] === wordObj.word,
        error:
          splitUserInput[wordIndex] &&
          splitUserInput[wordIndex] !== wordObj.word,
      }"
    >
      <!-- Render each character in the word with dynamic styling -->
      <span
        v-for="(char, charIndex) in wordObj.letters"
        :key="charIndex"
        :class="getLetterClass(wordIndex, charIndex, char)"
      >
        {{ char }}
      </span>
      <!-- Render any extra letters typed beyond the actual word -->
      <span v-if="getExtraLetters(wordIndex)" class="text-primary-red">
        {{ getExtraLetters(wordIndex) }}
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  // Props passed from the parent component to control logic and rendering
  wordWrapperRef: Object,
  formattedText: Array,
  splitUserInput: Array,
  getLetterClass: Function,
  getExtraLetters: Function,
  wordRefs: Object,
});
</script>
