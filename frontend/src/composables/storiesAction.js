export default async function storiesAction() {
  console.log("Fetching stories...");
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulating async work
  console.log("Stories loaded!");
}
