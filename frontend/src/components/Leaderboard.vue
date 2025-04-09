<script setup>
import { ref, onMounted } from 'vue';
import Navbar from '@/components/Navbar/Navbar.vue';
import LogoSVG from "@media/Logo.vue";

const scores = ref([]);

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/leaderboard/top');
    scores.value = await res.json();
  } catch (err) {
    console.error('Failed to fetch leaderboard data:', err);
  }
});
</script>

<template>
  <div class="bg-primary-grey min-h-screen w-screen p-4 flex flex-col items-center text-white">
    <!-- Navbar + Logo -->
    <div class="w-[70%] sm:w-[100%] flex items-center justify-center mt-6">
      <router-link to="/" class="w-26 relative mr-6">
        <LogoSVG class="w-full h-auto cursor-pointer text-primary-paige" />
      </router-link>
      <div class="flex">
        <Navbar />
      </div>
    </div>


    <!-- Leaderboard Section -->
    <div class="grid grid-cols-3 gap-4 p-8 w-[70%] sm:w-full">
      <!-- Fastest Box -->
      <div class="bg-secondary-grey text-primary-grey font-bold p-4 rounded-lg shadow-md">
        <div class="bg-primary-grey text-primary-grey font-bold p-2 mb-4 rounded">
          Fastest: wpm = {{ scores[0]?.wpm || '--' }}
        </div>
        <div>Time in secs: {{ scores[0]?.time_taken || '--' }}</div>
      </div>

      <!-- Leaderboard Table -->
      <div class="col-span-2 bg-secondary-grey text-primary-grey p-6 rounded-lg shadow-lg">
        <h1 class="text-center text-3xl font-bold mb-6">LeaderBoard</h1>

        <table class="w-full table-auto border-collapse text-left">
          <thead class="text-sm uppercase text-primary-gray bg-secondary-grey border-b border-gray-600">
            <tr>
              <th class="py-2">#</th>
              <th class="py-2">name</th>
              <th class="py-2">wpm</th>
              <th class="py-2">accuracy</th>
              <th class="py-2">time</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(entry, i) in scores"
              :key="i"
              :class="[
                i < 3 ? 'bg-secondary-grey text-primary-grey font-semibold' : 'bg-secondary-grey',
                'border-b border-gray-700 hover:bg-primary-paige rounded-md',
              ]"
            >
              <td class="py-2 px-2 rounded-l-md">{{ i + 1 }}</td>
              <td class="py-2 px-2">
                <span v-if="i === 0">👑</span>
                <span v-else-if="i === 1">🥈</span>
                <span v-else-if="i === 2">🥉</span>
                {{ entry.username }}
              </td>
              <td class="py-2 px-2">{{ entry.wpm }}</td>
              <td class="py-2 px-2">{{ entry.accuracy }}</td>
              <td class="py-2 px-2 rounded-r-md">{{ entry.time_taken }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
