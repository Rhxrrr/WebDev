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
</script>

<template>
  <nav
    class="p-2 justify-between bg-secondary-grey w-full flex rounded-lg text-primary-grey text-lg"
  >
    <!-- Game stats display -->
    <div class="text-primary-paige text-center grid grid-cols-3">
      <span>Time: {{ formattedTime }}</span>
      <span>WPM: {{ props.wpm }}</span>
      <span>Accuracy: {{ props.accuracyCount }}%</span>
    </div>

    <!-- Language toggle button -->
    <button
      class="hover:text-primary-paige mx-2 flex items-center justify-center"
    >
      <GlobeSVG />
      <span class="ml-2">English</span>
    </button>
  </nav>
</template>
