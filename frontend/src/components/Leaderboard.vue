<template>
  <div class="flex flex-row min-h-screen bg-[#1e1e1e] text-white font-mono">
    <!-- Fastest Box -->
    <div class="w-[220px] bg-black text-white p-4 m-8">
      <div class="bg-yellow-400 text-black font-bold p-2 mb-4">Fastest : wpm =</div>
      <div>Time in secs:</div>
    </div>

    <!-- Leaderboard Content -->
    <div class="flex-1 px-8 py-6">
      <h1 class="text-center text-3xl font-bold mb-6">LeaderBoard</h1>

      <table class="w-full table-auto border-collapse text-left">
        <thead class="text-sm uppercase text-gray-400 border-b border-gray-600">
          <tr>
            <th class="py-2">#</th>
            <th class="py-2">name</th>
            <th class="py-2">wpm</th>
            <th class="py-2">accuracy</th>
            <th class="py-2">something else</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(entry, i) in scores"
            :key="i"
            :class="[
              i < 3 ? 'bg-black text-white font-semibold' : 'bg-[#2c2c2c]',
              'border-b border-gray-700',
            ]"
          >
            <td class="py-2 px-2">{{ i + 1 }}</td>
            <td class="py-2 px-2">
              <span v-if="i === 0">👑</span>
              <span v-else-if="i === 1">🥈</span>
              <span v-else-if="i === 2">🥉</span>
              {{ entry.username }}
            </td>
            <td class="py-2 px-2">{{ entry.wpm }}</td>
            <td class="py-2 px-2">{{ entry.accuracy }}</td>
            <td class="py-2 px-2">blah blah</td> <!-- Replace with actual field -->
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const scores = ref([]);

onMounted(async () => {
  const res = await fetch('http://localhost:3000/api/leaderboard/top');
  scores.value = await res.json();
});
</script>
