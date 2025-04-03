<script setup>
import Navbar from "../components/Navbar/Navbar.vue";
import TextNav from "../components/TextNav.vue";
import { textContent } from "@composables/storiesAction.js";
import { useTypingLogic } from "@composables/type_logic/useTypingLogic.js";
import { focusInput } from "@composables/type_logic/focusInput.js";

const { userInput, inputRef, formattedText, getLetterClass } = useTypingLogic(
  textContent.value
);

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
