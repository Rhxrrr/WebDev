<script setup>
import Navbar from "../components/Navbar/Navbar.vue";
import TextNav from "../components/TextNav.vue";
</script>
<template>
  <div
    class="h-screen w-screen bg-primary-grey p-4 flex items-center flex-col justify-start"
  >
    <Navbar />
    <div
      class="flex flex-col w-[70%] flex-1 items-center justify-center text-primary-grey text-4xl font-semibold relative overflow-hidden"
    >
      <TextNav />
      <div class="w-full">
        <p class="overflow-hidden max-h-[250px] leading-relaxed fade-text">
          In the quiet town of Eldermere, nestled between rolling green hills
          and a dense, whispering forest, there lived an old clockmaker named
          Elias Thorne. His shop, "Thorne’s Timepieces," sat at the heart of the
          town square, its wooden sign creaking gently in the wind. For over
          fifty years, Elias had repaired and crafted the finest clocks, each a
          masterpiece of precision and artistry. But there was one clock—an
          enormous, ornate grandfather clock—that had remained untouched in the
          corner of his workshop for as long as anyone could remember. Its dark
          mahogany frame was intricately carved with celestial symbols, and its
          pendulum, though perfectly balanced, never moved. One evening, as
          Elias sat polishing the gears of a pocket watch, a young boy named
          Oliver stepped into the shop. He was no stranger to Elias, having
          spent many afternoons watching him work, mesmerized by the delicate
          hands that breathed life into lifeless mechanisms. "Mr. Thorne,"
          Oliver asked hesitantly, pointing at the grandfather clock, "why
          doesn’t that one tick?" Elias paused, his fingers tightening around
          the watch. He let out a slow sigh and beckoned Oliver closer.
        </p>
      </div>
    </div>
  </div>
</template>
