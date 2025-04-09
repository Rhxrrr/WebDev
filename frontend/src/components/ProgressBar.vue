<script setup>
import { computed } from "vue";

// Props for game state and current player ID

const props = defineProps({
  game: Object,
  currentPlayerID: Object,
});

// Extract and format players from game object

const players = computed(() => {
  if (!props.game || !props.game.players) return [];
  return Object.entries(props.game.players).map(([id, data]) => ({
    id,
    ...data,
  }));
});

// Sort and rank players based on finished order or progress

const rankedPlayers = computed(() => {
  if (!props.game || !props.game.players) return [];

  const playersMap = Object.entries(props.game.players).map(([id, data]) => ({
    id,
    displayName: id, // Show actual ID instead of "You"
    ...data,
  }));
  if (props.game.finishedOrder && props.game.finishedOrder.length > 0) {
    const finishedPlayers = props.game.finishedOrder
      .map((id, index) => {
        const player = playersMap.find((p) => p.id === id);
        return player ? { ...player, rank: index + 1 } : null;
      })
      .filter(Boolean);

    const unfinishedPlayers = playersMap
      .filter((p) => !props.game.finishedOrder.includes(p.id))
      .sort((a, b) => b.progress - a.progress);

    return [...finishedPlayers, ...unfinishedPlayers];
  }

  return playersMap
    .sort((a, b) => b.progress - a.progress)
    .map((player, index) => ({ ...player, rank: index + 1 }));
});

// Calculate how many players are still needed to start
const missingPlayers = computed(() => 4 - players.value.length);

// Convert a rank number to its ordinal suffix

function getOrdinalSuffix(n) {
  const s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

const emit = defineEmits(["exitRace", "enterRace"]);
</script>
<template>
  <br>
  <!-- Join button shown when player is not in race -->
  <button
    v-if="!game.inGame"
    @click="emit('enterRace')"
    class="p-2 text-lg rounded-lg text-primary-paige bg-secondary-grey hover:bg-primary-red dark:text-primary-paige dark:bg-secondary-grey dark:hover:bg-primary-red"
  >
    Enter Race
  </button>
  <!-- Race panel shown when player is in race -->
  <div
    class="lg:w-[45%] sm:w-[90%] p-2 flex items-center flex-col justify-center text-primary-paige dark:text-primary-paige"
    v-if="game.inGame"
  >
    <div v-if="!game">
      <p class="text-center">Waiting for players...</p>
    </div>

    <div v-else class="w-full">
      <div class="flex justify-between mb-1">
        <div class="text-sm font-bold">Players</div>
        <p v-if="missingPlayers > 0" class="">
          Waiting for {{ missingPlayers }} more
          {{ missingPlayers === 1 ? "player" : "players" }}...
        </p>
        <div class="text-sm font-bold">WPM</div>
      </div>

      <!-- List of players with progress bars -->
      <div class="space-y-3">
        <div v-for="player in rankedPlayers" :key="player.id" class="space-y-1">
          <div class="flex justify-between items-center">
            <span class="text-sm font-bold">
              {{ player.id === currentPlayerID ? "You" : player.displayName }}
              <span v-if="player.progress === 100" class="ml-2 text-xs italic">
                ({{ player.rank }}{{ getOrdinalSuffix(player.rank) }})
              </span>
            </span>

            <span class="text-sm font-bold">{{ player.wpm }}</span>
          </div>
          <div class="relative h-4 bg-gray-700 rounded-full overflow-hidden">
            <div
              class="absolute top-0 left-0 h-full bg-primary-paige dark:bg-primary-paige transition-all duration-300"
              :style="{ width: `${player.progress}%` }"
            ></div>
          </div>
        </div>
      </div>
      <!-- Countdown, end message, and action buttons -->
      <div class="flex items-center justify-between mt-4 text-md font-bold">
        <div>
          <div v-if="game.countDown > 0" class="p-2">
            Game starting in: {{ game.countDown }}
          </div>
          <div v-if="game.time === 0 && game.gameEnded" class="p-2">
            Time's Up!
          </div>
        </div>
        <div>
          <button
            v-if="!game.gameEnded && game.inGame"
            @click="emit('exitRace')"
            class="p-2 rounded-lg bg-secondary-grey hover:bg-primary-red dark:bg-secondary-grey dark:hover:bg-primary-red"
          >
            Exit Race
          </button>
          <button
            v-if="game.gameEnded"
            @click="emit('enterRace')"
            class="p-2 rounded-lg bg-secondary-grey hover:bg-primary-red dark:bg-secondary-grey dark:hover:bg-primary-red"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
