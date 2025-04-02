<script setup>
import StoriesSVG from "../icons/Stories.vue";
import LeaderboardSVG from "../icons/Leaderboard.vue";
import CodeSVG from "../icons/Code.vue";
import RaceSVG from "../icons/Race.vue";
import UserSVG from "../icons/User.vue";
import InfinitySVG from "../icons/Infinity.vue";

const textItems = [
  { label: "Stories", icon: StoriesSVG },
  { label: "Race", icon: RaceSVG },
  { label: "Code", icon: CodeSVG },
];

const navItems = [
  { label: "Leaderboard", icon: LeaderboardSVG },
  { label: "Graph", icon: LeaderboardSVG },
  { label: "Button", icon: LeaderboardSVG },
];

const wordLength = ["50", "100", "150"];
</script>

<template>
  <nav class="p-2 bg-secondary-grey flex rounded-lg text-primary-grey">
    <div class="grid grid-cols-3">
      <button
        v-for="item in textItems"
        :key="item.label"
        class="hover:text-primary-paige flex items-center justify-center w-full space-x-1"
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
