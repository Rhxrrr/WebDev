import { ref } from "vue";

// Use a shared reactive reference for the fetched text
export const textContent = ref("");

export default async function storiesAction() {
  try {
    const response = await fetch("http://localhost:3000/api/stories");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    textContent.value = data.text || "No story available.";
  } catch (error) {
    console.error("Error fetching text:", error);
    textContent.value = "Failed to load text. Please try again! \n \n";
  }
}
