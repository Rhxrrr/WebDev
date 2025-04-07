import { ref } from "vue";

// Shared reactive reference for the fetched text
export const textContent = ref("");

// aasynchronously fetches a story bsed on the provided type
export default async function storiesAction(type) {
  try {
    // send a GET response to the backend API with the specified type as a query parame
    const response = await fetch(
      `http://localhost:3000/api/stories?type=${type}`
    );

    // if the response is not ok, attempt to extract and throw the error message
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }

    // parse the JSON response and update the reactive text content
    const data = await response.json();
    textContent.value = data.content; // Make sure your backend returns 'content'
  } catch (error) {
    // log any errors and set a fallback message
    console.error("Error fetching text:", error);
    textContent.value =
      error.message || "Failed to load text. Please try again! \n \n";
  }
}
