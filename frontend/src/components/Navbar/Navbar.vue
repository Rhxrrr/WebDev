<script setup>
import StoriesSVG from "@media/Stories.vue";
import LeaderboardSVG from "@media/Leaderboard.vue";
import CodeSVG from "@media/Code.vue";
import RaceSVG from "@media/Race.vue";
import UserSVG from "@media/User.vue";
import InfinitySVG from "@media/Infinity.vue";
import { ref } from "vue";

const isLoading = ref(false);

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

const navItems = [
  { label: "Leaderboard", icon: LeaderboardSVG },
  { label: "Graph", icon: LeaderboardSVG },
  { label: "Button", icon: LeaderboardSVG },
];

const wordLength = ["50", "100", "150"];

const handleClick = async (item) => {
  if (isLoading.value) return;
  isLoading.value = true;

  try {
    const module = await item.action();
    await module.default();
  } catch (error) {
    console.error("Error executing action:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <nav class="p-2 bg-secondary-grey flex rounded-lg text-primary-grey">
    <div class="grid grid-cols-3">
      <button
        v-for="item in textItems"
        :key="item.label"
        class="hover:text-primary-paige flex items-center justify-center w-full space-x-1"
        :disabled="isLoading"
        @click="handleClick(item)"
      >
        <component :is="item.icon" />
        <span>{{ item.label }}</span>
      </button>
    </div>
    <div
      class="seperator mx-2 w-[2px] h-full bg-primary-paige rounded-full"
    ></div>
    <div class="grid grid-cols-3">
      <button
        v-for="item in navItems"
        :key="item.label"
        class="hover:text-primary-paige flex items-center justify-center w-full space-x-1"
      >
        <component :is="item.icon" />
        <span> {{ item.label }}</span>
      </button>
    </div>
    <div
      class="seperator mx-2 w-[2px] h-full bg-primary-paige rounded-full"
    ></div>
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
