<script setup>
import { computed } from "vue";
import GlobeSVG from "@media/Globe.vue";

// Props for game metrics and state
const props = defineProps({
  accuracyCount: {
    type: Number,
    required: true,
  },
  wpm: {
    type: Number,
    required: true,
  },
  game: Object,
});

// Format time from seconds into MM:SS
const formattedTime = computed(() => {
  const time = props.game?.time ?? 0;
  const mins = Math.floor(time / 60);
  const secs = time % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
});

console.log('${mins}:${secs.toString().padStart(2, "0")}')
</script>

<template>
  <nav
    class="p-2 justify-between bg-secondary-grey dark:bg-secondary-grey w-full flex flex-wrap rounded-lg text-primary-paige dark:text-primary-paige text-sm sm:text-lg"
  >
    <!-- Left: Typing stats -->
    <div
      class="w-full sm:w-auto flex justify-center sm:grid sm:grid-cols-3 gap-4 items-center mb-2 sm:mb-0"
    >
      <span>Time: {{ formattedTime }}</span>
      <span>WPM: {{ props.wpm }}</span>
      <span>Accuracy: {{ props.accuracyCount }}%</span>
    </div>

    <!-- Right: Actions -->
    <div class="w-full sm:w-auto flex justify-center sm:justify-end items-center gap-4">
      <button
        v-if="typingEnded"
        @click="emit('new-test')"
        class="text-sm sm:text-lg px-3 py-1 border border-primary-paige text-primary-grey dark:text-primary-grey rounded hover:text-primary-paige dark:hover:text-primary-paige hover:text-white transition-all"
      >
        New Story
      </button>

      <div>
        <span class="flex items-center hover:text-primary-paige dark:hover:text-primary-paige cursor-pointer">
          <GlobeSVG class="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
          <span class="text-sm sm:text-base">English</span>
        </span>
      </div>
    </div>
  </nav>
</template>
