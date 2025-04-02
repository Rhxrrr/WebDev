import { ref } from "vue";

// Use a shared reactive reference for the fetched text
export const textContent = ref("");

export default async function storiesAction() {
  try {
    const response = await fetch("http://localhost:3000/api/stories");

    if (!response.ok) {
      // Check if the status code is 400 to display the custom message
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }

    const data = await response.json();
    textContent.value = data.content; // assuming 'text' is part of the response from your backend
  } catch (error) {
    console.error("Error fetching text:", error);
    textContent.value =
      error.message || "Failed to load text. Please try again! \n \n";
  }
}
