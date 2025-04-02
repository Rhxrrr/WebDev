export default async function raceAction() {
  console.log("Starting race...");
  await new Promise((resolve) => setTimeout(resolve, 1500));
  console.log("Race started!");
}
