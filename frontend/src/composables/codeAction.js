export default async function codeAction() {
  console.log("Loading coding challenge...");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Code challenge ready!");
}
