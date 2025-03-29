<script setup>
import { ref } from "vue";

const isOpen = ref(false);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <nav class="bg-gray-900 text-white p-4 flex items-center justify-between">
    <div class="text-xl font-bold">TypeSpeed</div>

    <button @click="toggleMenu" class="md:hidden text-white focus:outline-none">
      <svg
        class="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        ></path>
      </svg>
    </button>

    <div
      :class="{ block: isOpen, hidden: !isOpen }"
      class="md:flex space-x-4 hidden"
    >
      <a href="#" class="hover:text-gray-400">Home</a>
      <a href="#" class="hover:text-gray-400">Test</a>
      <a href="#" class="hover:text-gray-400">Leaderboard</a>
      <a href="#" class="hover:text-gray-400">About</a>
    </div>
  </nav>
</template>

<style scoped>
nav {
  transition: all 0.3s ease-in-out;
}
</style>
