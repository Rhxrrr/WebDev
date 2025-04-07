<script setup>
import {
  ref,
  onMounted,
  nextTick,
  computed,
  onBeforeUnmount,
  watch,
} from "vue";
import { io } from "socket.io-client";
import formatText from "@composables/type_logic/formatText";
import Navbar from "../components/Navbar/Navbar.vue";
import TextNavRace from "../components/TextNavRace.vue";
import ProgressBar from "../components/ProgressBar.vue";
import LogoSVG from "../icons/Logo.vue";

// Socket connection to backend
const socket = io("http://localhost:3000");

// Game state
const game = ref({
  players: {},
  time: 0,
  countDown: 0,
  gameStarted: false,
  gameEnded: false,
  inGame: false,
  currentRoomId: "",
  finishedOrder: [],
});

const currentPlayerID = ref("");

// Typing stats
const lockedWords = ref(0);
const correctCharsCount = ref(0);
const mistakesCounter = ref(0);
const accuracyCount = ref(100);
const wpm = ref(0);
const timer = ref(0);
const progress = ref(0);

// Typing input and formatted text
const userInput = ref("");
const inputRef = ref(null);
const formattedText = ref(
  formatText(
    "Jeanie narrowed her eyes at the woman standing in front of her in the full-length mirror. "
  )
);

// Refs for layout and scrolling
const wordRefs = ref([]);
const wordWrapperRef = ref(null);

// Recalculate line position of each word element
const getLineMap = () => {
  const lineMap = {};
  let lastOffsetTop = null;
  let currentLine = 0;

  wordRefs.value.forEach((el, index) => {
    if (!el) return;
    const offsetTop = el.offsetTop;
    if (lastOffsetTop === null) {
      lastOffsetTop = offsetTop;
    } else if (offsetTop !== lastOffsetTop) {
      currentLine++;
      lastOffsetTop = offsetTop;
    }
    lineMap[index] = currentLine;
  });

  return lineMap;
};

// Reset scroll position to top
const resetScroll = () => {
  if (wordWrapperRef.value) {
    wordWrapperRef.value.scrollTop = 0;
  }
};

// Auto-focus input when game starts
const focusInput = () => {
  if (game.value.gameEnded || !game.value.gameStarted) return;
  inputRef.value?.focus();
};

// Calculate WPM from correct characters and timer
watch([correctCharsCount, timer], ([correctChars, newTimer]) => {
  if (newTimer !== 0) {
    wpm.value = Math.round(correctChars / 5 / (newTimer / 60));
  }
});

// Handle timer updates from server
watch(
  () => game.value.time,
  (newVal, oldVal) => {
    if (newVal === 0) {
      timer.value = 0;
    } else if (newVal < oldVal) {
      timer.value++;
    }
  }
);

// Update accuracy when user types
function countAccuracy(newInput, oldInput) {
  const newWord = formatText(newInput).at(-1)?.word || "";
  const oldWord = formatText(oldInput).at(-1)?.word || "";
  if (newWord.length <= oldWord.length) return;

  const expectedWord = formattedText.value[lockedWords.value]?.word;
  const expectedLetter = expectedWord[newWord.length - 1];
  const inputLetter = newWord[newWord.length - 1];

  if (newWord.endsWith(" ") && newWord.trim() !== expectedWord) {
    if (newWord.trim().length >= expectedWord.length) return;
    mistakesCounter.value += expectedWord.length - newWord.trim().length;
  }

  if (expectedLetter !== inputLetter && inputLetter.trim()) {
    mistakesCounter.value++;
  }

  const totalTyped = correctCharsCount.value + mistakesCounter.value;
  accuracyCount.value = totalTyped
    ? Math.round((1 - mistakesCounter.value / totalTyped) * 100)
    : 100;
}

// Socket lifecycle and listeners
onMounted(() => {
  nextTick(() => focusInput());
  setupSocketListeners();
});

onBeforeUnmount(() => {
  if (socket && socket.connected) {
    socket.emit("exitRace");
    socket.disconnect();
  }
});

// Socket handlers
function setupSocketListeners() {
  socket.on("gameUpdate", (updatedGame) => {
    game.value = updatedGame;
  });

  socket.on("playerId", (playerId) => {
    currentPlayerID.value = playerId;
  });

  socket.on("countdown", (countDown) => {
    game.value.countDown = countDown;
  });

  socket.on("gameInfo", (object) => {
    formattedText.value = formatText(object.text);
    game.value.players = {};
    game.value.currentRoomId = object.roomId;
    object.players.forEach((id) => {
      game.value.players[id] = { progress: 0, wpm: 0 };
    });
    game.value.inGame = object.inGame;
  });

  socket.on("gameEnd", (object) => {
    game.value.gameEnded = object.status;
  });

  socket.on("progressUpdate", ({ finishedOrder, playerId, progress, wpm }) => {
    if (!game.value.players[playerId]) {
      game.value.players[playerId] = { progress: 0, wpm: 0 };
    }
    game.value.players[playerId].progress = progress;
    if (wpm !== undefined) {
      game.value.players[playerId].wpm = wpm;
    }
    game.value.finishedOrder = finishedOrder;
  });

  socket.on("timer", (time) => {
    game.value.time = time;
  });

  socket.on("gameStarted", (bool) => {
    game.value.gameStarted = bool;
  });
}

// Reset game and state on exit
const handleExitRace = () => {
  game.value = {
    players: {},
    time: 0,
    countDown: 0,
    gameStarted: false,
    gameEnded: false,
    inGame: false,
    currentRoomId: "",
    finishedOrder: [],
  };
  userInput.value = "";
  lockedWords.value = 0;
  correctCharsCount.value = 0;
  mistakesCounter.value = 0;
  accuracyCount.value = 100;
  wpm.value = 0;
  progress.value = 0;
  socket.emit("exitRace");
  resetScroll();
};

// Join queue for a new race
const handleEnterRace = () => {
  handleExitRace(); // reset local state
  socket.emit("joinQueue");
};

// Computed helpers
const splitUserInput = computed(() => userInput.value.split(" "));
const fullCorrectText = computed(
  () => formattedText.value.map((w) => w.word).join(" ") + " "
);

// Style characters based on correctness
const getLetterClass = (wordIndex, charIndex, char) => {
  const typedWord = splitUserInput.value[wordIndex] || "";
  const typedChar = typedWord[charIndex];
  if (typedChar === char) return "text-primary-paige";
  else if (typedChar) return "text-primary-red";
  return "";
};

// Support for deleting full word with Cmd+Backspace or Alt+Backspace
const handleKeydown = (event) => {
  const isCmdDelete = event.metaKey && event.key === "Backspace";
  const isOptionDelete = event.altKey && event.key === "Backspace";
  if (!isCmdDelete && !isOptionDelete) return;
  event.preventDefault();

  const words = splitUserInput.value;
  let targetIndex = words.length - 1;
  if (words[targetIndex] === "" && targetIndex > 0) targetIndex--;

  if (targetIndex < lockedWords.value) return;
  const newWords = words.slice(0, targetIndex);
  userInput.value = newWords.join(" ") + (newWords.length > 0 ? " " : "");
};

// Scroll to next line when advancing
const scrollToLine = (lineIndex) => {
  const wordWrapper = wordWrapperRef.value;
  if (!wordWrapper) return;
  const wordEl = wordRefs.value.find(
    (_, index) => getLineMap()[index] === lineIndex
  );
  wordEl?.scrollIntoView({ behavior: "smooth", block: "start" });
};

// Main input watcher: progress, accuracy, line scroll, validation
let lastLine = 0;
watch(userInput, (newInput, oldInput) => {
  if (!game.value.gameStarted || game.value.gameEnded) {
    userInput.value = "";
    return;
  }

  const addedChar = newInput.slice(-1);
  if (newInput.length > oldInput.length && addedChar !== " ") {
    const expectedChar = fullCorrectText.value[newInput.length - 1];
    if (addedChar === expectedChar) correctCharsCount.value++;
  }

  const words = newInput.split(" ");
  const currentIndex = words.length - 1;
  const endsWithSpace = newInput.endsWith(" ");

  const lineMap = getLineMap();
  const currentLine = lineMap[currentIndex] ?? lastLine;

  if (currentLine > lastLine) {
    const lineHasMistake = Object.entries(getLineMap()).some(
      ([index, line]) => {
        const i = parseInt(index);
        return (
          line === lastLine &&
          splitUserInput.value[i] &&
          splitUserInput.value[i] !== formattedText.value[i]?.word
        );
      }
    );
    if (!lineHasMistake) scrollToLine(currentLine);
  }

  lastLine = currentLine;

  if (
    endsWithSpace &&
    words[lockedWords.value] === formattedText.value[lockedWords.value]?.word
  ) {
    lockedWords.value++;
  }

  const expectedWord = formattedText.value[currentIndex]?.word;
  if (words[currentIndex] === expectedWord) {
    const typedCount =
      wordWrapperRef.value?.querySelectorAll(".word.typed").length + 1;
    progress.value = (typedCount / formattedText.value.length) * 100;
    if (progress.value === 100) {
      socket.off("timer");
      game.value.gameEnded = true;
    }
  }

  if (words.length < oldInput.split(" ").length) {
    const deletingIndex = words.length;
    const isLocked = deletingIndex <= lockedWords.value;
    const hasMistake = words
      .slice(0, lockedWords.value)
      .some((w, i) => w !== formattedText.value[i]?.word);
    if (isLocked && !hasMistake) {
      userInput.value = oldInput;
      return;
    }
  }

  countAccuracy(newInput, oldInput);

  const correct = fullCorrectText.value;
  let firstMistakeIndex = -1;
  for (let i = 0; i < userInput.value.length; i++) {
    if (userInput.value[i] !== correct[i]) {
      firstMistakeIndex = i;
      break;
    }
  }

  if (
    firstMistakeIndex !== -1 &&
    userInput.value.length > firstMistakeIndex + 8
  ) {
    userInput.value = userInput.value.slice(0, firstMistakeIndex + 8);
  }
});

// Return extra typed letters (for overflow styling)
const getExtraLetters = (wordIndex) => {
  const typed = splitUserInput.value[wordIndex] || "";
  const expected = formattedText.value[wordIndex]?.word || "";
  return typed.length > expected.length ? typed.slice(expected.length) : "";
};

// Auto-focus input when game starts
watch(
  () => game.value.gameStarted,
  (started) => {
    if (started) nextTick(focusInput);
  }
);

// Emit progress updates to server
watch([wpm, progress], () => {
  socket.emit("progressUpdate", {
    roomId: game.value.currentRoomId,
    progress: progress.value,
    wpm: wpm.value,
  });
});
</script>

<template>
  <div
    class="h-screen w-screen bg-primary-grey p-4 flex items-center flex-col justify-start"
    @click="focusInput"
  >
    <div class="w-[70%] sm:w-[90%] flex items-center justify-center mt-6">
      <router-link to="/" class="w-26 relative mr-6">
        <LogoSVG class="w-full h-auto cursor-pointer text-primary-paige" />
      </router-link>
      <div class="flex">
        <Navbar />
      </div>
    </div>
    <ProgressBar
      :game="game"
      :currentPlayerID="currentPlayerID"
      @exitRace="handleExitRace"
      @enterRace="handleEnterRace"
    />
    <div
      class="flex flex-col w-[70%] flex-1 items-center justify-center text-primary-grey text-4xl font-semibold relative overflow-hidden"
    >
      <TextNavRace :game="game" :accuracy-count="accuracyCount" :wpm="wpm" />

      <div
        ref="wordWrapperRef"
        class="w-full relative flex flex-wrap gap-2 max-h-[50%] scroll-locked transition-all duration-300 ease-in-out"
      >
        <div
          v-for="(wordObj, wordIndex) in formattedText"
          :key="wordIndex"
          class="word m-[0.3rem]"
          :ref="(el) => (wordRefs[wordIndex] = el)"
          :class="{
            typed:
              splitUserInput[wordIndex] &&
              splitUserInput[wordIndex] === wordObj.word,
            error:
              splitUserInput[wordIndex] &&
              splitUserInput[wordIndex] !== wordObj.word,
          }"
        >
          <span
            v-for="(char, charIndex) in wordObj.letters"
            :key="charIndex"
            :class="getLetterClass(wordIndex, charIndex, char)"
          >
            {{ char }}
          </span>
          <span v-if="getExtraLetters(wordIndex)" class="text-primary-red">
            {{ getExtraLetters(wordIndex) }}
          </span>
        </div>
      </div>

      <!-- Disabled until game starts -->
      <input
        ref="inputRef"
        v-model="userInput"
        class="absolute opacity-0"
        :disabled="!game.gameStarted || game.gameEnded"
        @keydown="handleKeydown"
      />
    </div>
  </div>
</template>
