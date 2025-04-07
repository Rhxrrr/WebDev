<script setup>
import { ref, computed, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import StoriesSVG from "@media/Stories.vue";
import RaceSVG from "@media/Race.vue";
import GraphSVG from "@media/Graph.vue";
import TimeSVG from "@media/Time.vue";
import useGraphToggle from "@composables/useGraphToggle";

// Graph toggle state and function from composable
const { toggleGraph, showGraph } = useGraphToggle();

const emit = defineEmits(["update-time"]);
const router = useRouter();
const route = useRoute();

const isHome = computed(() => route.path === "/");
const isLoading = ref(false);
const selectedTime = ref("15");

// Buttons to navigate between Stories and Race
const textItems = [
  {
    label: "Stories",
    icon: StoriesSVG,
    action: async () => {
      const module = await import("@composables/storiesAction.js");
      await module.default();
      await router.push("/");
      return { default: async () => {} };
    },
  },
  {
    label: "Race",
    icon: RaceSVG,
    action: async () => {
      await router.push("/race");
      return { default: async () => {} };
    },
  },
];

// UI nav icons: Graph and Time
const navItems = [
  { label: "Graph", icon: GraphSVG },
  { label: "Time", icon: TimeSVG },
];

// Typing durations (word counts)
const wordLength = ["15", "30", "60", "90"];

// Handle click for Stories or Race nav items
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

// Handle selection of typing time
const handleTimeSelect = async (item) => {
  selectedTime.value = item;
  if (!isHome.value) {
    await router.push("/");
  }
  emit("update-time", parseInt(item));
};

// Handle navigation to graph/time, ensure graph toggles as needed
const handleNavItemClick = async (label) => {
  const navigatingToHome = !isHome.value;

  if ((label === "Time" || label === "Graph") && navigatingToHome) {
    await router.push("/");
    await nextTick();

    if (label === "Graph" && !showGraph.value) {
      toggleGraph();
    }
  } else if (label === "Graph" && isHome.value) {
    toggleGraph();
  }
};
</script>

<template>
  <nav
    class="p-2 relative bg-secondary-grey flex rounded-lg text-primary-grey items-center"
  >
    <!-- Text Items: Stories and Race -->
    <div class="grid grid-cols-2">
      <button
        v-for="item in textItems"
        :key="item.label"
        class="group hover:text-primary-paige flex items-center justify-center w-full space-x-2"
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

    <!-- Separator between text items and nav items -->
    <div
      class="seperator mx-2 w-[2px] h-full bg-primary-paige rounded-full"
    ></div>

    <!-- Nav Items: Graph and Time -->
    <div class="flex justify-between">
      <button
        v-for="item in navItems"
        :key="item.label"
        @click="handleNavItemClick(item.label)"
        class="group flex items-center justify-center space-x-2 px-2 transition-all"
        :class="[
          (item.label === 'Time' && isHome) ||
          (item.label === 'Graph' && showGraph && isHome)
            ? 'text-primary-paige'
            : 'text-primary-grey hover:text-primary-paige',
        ]"
      >
        <component :is="item.icon" class="w-6 h-6" />
        <span class="relative">
          <span>{{ item.label }}</span>
          <span
            class="absolute left-0 -bottom-0.5 h-0.5 bg-primary-paige transition-all duration-300"
            :class="[
              (item.label === 'Time' && isHome) ||
              (item.label === 'Graph' && showGraph && isHome)
                ? 'w-full'
                : 'w-0 group-hover:w-full',
            ]"
          ></span>
        </span>
      </button>
    </div>

    <!-- Separator between nav items and time options -->
    <div
      class="seperator mx-2 w-[2px] h-full bg-primary-paige rounded-full"
    ></div>

    <!-- Word Length Options -->
    <div class="grid grid-cols-4">
      <button
        v-for="item in wordLength"
        :key="item"
        @click="handleTimeSelect(item)"
        class="group flex items-center justify-center w-full mx-2 px-2 py-1 text-lg transition-all relative"
        :class="[
          selectedTime === item && isHome
            ? 'text-primary-paige'
            : 'hover:text-primary-paige',
        ]"
      >
        <span class="relative">
          <span>{{ item }}</span>
          <span
            class="absolute left-0 -bottom-0.5 h-0.5 bg-primary-paige transition-all duration-300"
            :class="[
              selectedTime === item && isHome
                ? 'w-full'
                : 'w-0 group-hover:w-full',
            ]"
          ></span>
        </span>
      </button>
    </div>
  </nav>
</template>
