<script setup>
import { ref, onMounted, watch } from 'vue';
import Navbar from '@/components/Navbar/Navbar.vue';
import LogoSVG from "@media/Logo.vue";

const scores = ref([]);
const selectedMode = ref("race"); // 'race' or 'stories'
const selectedDuration = ref("15");

const fetchScores = async () => {
  try {
    const url =
      selectedMode.value === "race"
        ? "http://localhost:3000/api/leaderboard/race"
        : `http://localhost:3000/api/leaderboard/stories?time=${selectedDuration.value}`;

    const res = await fetch(url);
    scores.value = await res.json();
  } catch (err) {
    console.error("Failed to fetch leaderboard data:", err);
  }
};

// Fetch when mode or duration changes
watch([selectedMode, selectedDuration], fetchScores);

// Fetch on load and set up auto-refresh
onMounted(() => {
  fetchScores();
  setInterval(fetchScores, 5000); // refresh every 5 seconds
});
</script>

<template>
  <div class="bg-primary-grey min-h-screen w-screen p-4 flex flex-col items-center text-white font-sans">
    <!-- Logo + Navbar -->
    <div class="w-[70%] sm:w-[100%] flex items-center justify-center mt-6">
      <router-link to="/" class="w-26 relative mr-6">
        <LogoSVG class="w-[80%] h-auto lg:w-full cursor-pointer text-primary-paige dark:text-primary-paige" />
      </router-link>
      <div class="flex">
        <Navbar />
      </div>
    </div>

    <!-- Toggle between Race Results and Stories -->
    <div class="flex space-x-4 mt-6">
      <button
        class="px-4 py-2 rounded bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition"
        :class="{ 'ring-2 ring-yellow-500': selectedMode === 'race' }"
        @click="selectedMode = 'race'"
      >
        🏁 Race Results
      </button>
      <button
        class="px-4 py-2 rounded bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition"
        :class="{ 'ring-2 ring-yellow-500': selectedMode === 'stories' }"
        @click="selectedMode = 'stories'"
      >
        📖 Stories
      </button>
    </div>

    <!-- Show duration selector only for stories -->
    <div v-if="selectedMode === 'stories'" class="mt-2">
      <label class="mr-2 text-primary-paige font-semibold">Duration:</label>
      <select v-model="selectedDuration" class="p-1 rounded text-black">
        <option value="15">15s</option>
        <option value="30">30s</option>
        <option value="60">60s</option>
      </select>
    </div>

    <!-- Leaderboard Section (Full Width) -->
    <div class="w-[70%] sm:w-full p-8">
      <div class="bg-secondary-grey text-primary-paige p-6 rounded-lg shadow-lg">
        <h1 class="text-center text-3xl font-bold mb-6">
          LeaderBoard – {{ selectedMode === 'race' ? 'Race Results' : 'Stories' }}
        </h1>

        <table class="w-full table-auto border-collapse text-left">
          <thead class="text-sm uppercase text-primary-paige bg-secondary-grey border-b border-gray-600">
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
              :class="[i < 3 ? 'bg-secondary-grey text-primary-paige font-semibold' : 'bg-secondary-grey',
                        'border-b border-gray-700 hover:bg-primary-paige rounded-md']"
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
