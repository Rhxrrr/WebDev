<script setup>
import { ref, watch } from "vue";
import GlobeSVG from "@media/Globe.vue";

// Props for typing state and performance stats
const props = defineProps({
  typingStarted: Boolean,
  typingEnded: Boolean,
  accuracyCount: {
    type: Number,
    required: true,
  },
  wpm: {
    type: Number,
    required: true,
  },
  formattedTime: {
    type: String,
    required: true,
  },
});

// Reactive refs to mirror props (optional: helpful if expanded logic is needed)
const typingStarted = ref(props.typingStarted);
const typingEnded = ref(props.typingEnded);

// Sync refs when props change
watch(
  () => props.typingStarted,
  (val) => (typingStarted.value = val)
);
watch(
  () => props.typingEnded,
  (val) => (typingEnded.value = val)
);

// Emits new typing test trigger
const emit = defineEmits(["new-test"]);
</script>

<template>
  <nav
    class="p-2 justify-between bg-secondary-grey dark:bg-secondary-grey w-full flex flex-wrap rounded-lg text-primary-paige dark:text-primary-paige text-sm sm:text-lg"
  >
    <!-- Left: Typing stats -->
    <div
      class="w-full sm:w-auto flex justify-center sm:grid sm:grid-cols-3 gap-4 items-center mb-2 sm:mb-0"
    >
      <span>Time: {{ props.formattedTime }}</span>
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

