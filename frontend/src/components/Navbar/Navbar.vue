<script setup>
import { ref } from "vue";
import StoriesSVG from "@media/Stories.vue";
import LeaderboardSVG from "@media/Leaderboard.vue";
import CodeSVG from "@media/Code.vue";
import RaceSVG from "@media/Race.vue";
import UserSVG from "@media/User.vue";
import InfinitySVG from "@media/Infinity.vue";

// Track loading state for button clicks
const isLoading = ref(false);

/**
 * List of primary text buttons with dynamic logic imports.
 * Each button executes an external function when clicked.
 */
const textItems = [
  {
    label: "Stories",
    icon: StoriesSVG,
    action: () => import("@composables/storiesAction.js"),
  },
  {
    label: "Race",
    icon: RaceSVG,
    action: () => import("@composables/raceAction.js"),
  },
  {
    label: "Code",
    icon: CodeSVG,
    action: () => import("@composables/codeAction.js"),
  },
];

/**
 * Navigation bar buttons.
 * These buttons currently don't have actions assigned.
 */
const navItems = [
  { label: "Leaderboard", icon: LeaderboardSVG },
  { label: "Graph", icon: LeaderboardSVG },
  { label: "Button", icon: LeaderboardSVG },
];

/**
 * Word length options for selecting typing test difficulty.
 */
const wordLength = ["50", "100", "150"];

/**
 * Handles button clicks and executes the associated action.
 * Prevents multiple clicks using `isLoading`.
 *
 * @param {Object} item - The clicked button item.
 * @param {string} item.label - The label of the button.
 * @param {Function} item.action - The function to dynamically import.
 */
const handleClick = async (item) => {
  if (isLoading.value) return; // Prevent multiple clicks

  isLoading.value = true;
  try {
    const module = await item.action(); // Dynamically import action
    await module.default(); // Execute the imported function
  } catch (error) {
    console.error("Error executing action:", error);
  } finally {
    isLoading.value = false; // Reset loading state
  }
};
</script>

<template>
  <nav class="p-2 bg-secondary-grey flex rounded-lg text-primary-grey">
    <!-- Text Items (Stories, Race, Code) -->
    <div class="grid grid-cols-3">
      <button
        v-for="item in textItems"
        :key="item.label"
        class="group hover:text-primary-paige flex items-center justify-center w-full space-x-1"
        :disabled="isLoading"
        @click="handleClick(item)"
      >
        <component :is="item.icon" />
        <span class="relative">
          <span>{{ item.label }}</span>
          <span
            class="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-primary-paige transition-all duration-300 group-hover:w-full"
          ></span>
        </span>
      </button>
    </div>

    <!-- Separator -->
    <div
      class="seperator mx-2 w-[2px] h-full bg-primary-paige rounded-full"
    ></div>

    <!-- Nav Items (Leaderboard, Graph, Button) -->
    <div class="grid grid-cols-3">
      <button
        v-for="item in navItems"
        :key="item.label"
        class="group hover:text-primary-paige flex items-center justify-center w-full space-x-1"
      >
        <component :is="item.icon" />
        <span class="relative">
          <span>{{ item.label }}</span>
          <span
            class="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-primary-paige transition-all duration-300 group-hover:w-full"
          ></span>
        </span>
      </button>
    </div>

    <!-- Separator -->
    <div
      class="seperator mx-2 w-[2px] h-full bg-primary-paige rounded-full"
    ></div>

    <!-- Word Length Options -->
    <div class="grid grid-cols-5">
      <button
        class="hover:text-primary-paige flex items-center justify-center w-full mx-2"
        v-for="item in wordLength"
        :key="item"
      >
        {{ item }}
      </button>
      <button
        class="hover:text-primary-paige flex items-center justify-center w-full mx-2"
      >
        <InfinitySVG />
      </button>
      <button
        class="hover:text-primary-paige flex items-center justify-center w-full mx-2"
      >
        <UserSVG />
      </button>
    </div>
  </nav>
</template>
