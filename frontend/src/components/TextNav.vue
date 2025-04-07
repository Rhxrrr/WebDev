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
    class="p-2 justify-between bg-secondary-grey w-full flex rounded-lg text-primary-grey text-lg"
  >
    <!-- Left: Typing stats -->
    <div
      class="text-primary-paige text-center grid grid-cols-3 gap-4 items-center"
    >
      <span>Time: {{ props.formattedTime }}</span>
      <span>WPM: {{ props.wpm }}</span>
      <span>Accuracy: {{ props.accuracyCount }}%</span>
    </div>

    <!-- Right: New test button + language toggle -->
    <div class="flex items-center gap-4 mx-2">
      <button
        v-if="typingEnded"
        @click="emit('new-test')"
        class="text-lg px-3 py-1 border border-primary-paige text-primary-paige rounded hover:bg-primary-paige hover:text-white transition-all"
      >
        New Story
      </button>

      <div class="flex items-center hover:text-primary-paige cursor-pointer">
        <GlobeSVG />
        <span class="ml-2">English</span>
      </div>
    </div>
  </nav>
</template>
