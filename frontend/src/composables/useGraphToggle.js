import { ref } from "vue";

// reactivate reference to control whether the graph is shown
const showGraph = ref(false);

// composable function to magae graph visibility state
export default function useGraphToggle() {
  const toggleGraph = () => {
    showGraph.value = !showGraph.value;
  };

  // expose the reactive state and toggle function
  return {
    showGraph,
    toggleGraph,
  };
}
