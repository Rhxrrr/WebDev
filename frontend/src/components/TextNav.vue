<script setup>
import GlobeSVG from "@media/Globe.vue";
</script>
<template>
  <nav
    class="p-2 justify-between bg-secondary-grey w-full flex rounded-lg text-primary-grey text-lg"
  >
    <div class="text-primary-paige text-center grid grid-cols-3">
      <span>Time: 00:00</span>
      <span>WPM: 98</span>
      <span>Accuracy: 98%</span>
    </div>
    <button
      class="hover:text-primary-paige mx-2 flex items-center justify-center"
    >
      <GlobeSVG />
      <span class="ml-2">English</span>
    </button>
  </nav>
</template>
