import { ref, computed, watch } from "vue";

// timer composable to track countdown and elapsed time for a typing session
export function useTimer(typingStarted, typingEnded, durationRef) {
  // reactive countdown time initialized with the given duration
  const time = ref(durationRef.value);
  // tracks how many seconds have elapsed since the timer started
  const elapsedTime = ref(0);
  // holds the interval ID for the countdown
  const interval = ref(null);
  // computed value to format the countdown time as MM:SS
  const formattedTime = computed(() => {
    const minutes = Math.floor(time.value / 60);
    const seconds = time.value % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  });

  // starts or restarts the timer
  const startTimer = () => {
    clearInterval(interval.value); // clear any existing timer
    time.value = durationRef.value; // reset to full duration
    elapsedTime.value = 0;

    // decrease time every second and track elapsed time
    interval.value = setInterval(() => {
      if (time.value > 0) {
        time.value--;
        elapsedTime.value++;
      } else {
        // end typing when time hits zero
        typingEnded.value = true;
        clearInterval(interval.value);
      }
    }, 1000);
  };

  // resets the timer without starting it
  const resetTimer = () => {
    clearInterval(interval.value);
    time.value = durationRef.value;
    elapsedTime.value = 0;
  };

  // watch for when typing starts to begin the timer
  watch(typingStarted, (val) => {
    if (val) startTimer();
  });

  // update time if the initial duration changes
  watch(durationRef, (newDuration) => {
    time.value = newDuration;
  });

  // return relevant state and functions for use in components
  return { time, formattedTime, resetTimer, elapsedTime };
}
