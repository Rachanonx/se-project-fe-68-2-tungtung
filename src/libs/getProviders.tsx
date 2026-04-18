export default async function getProvider() {
  //await new Promise((resolve) => setTimeout(resolve, 1000));

  const response = await fetch(
    "https://fe-project-68-bongbing-backend.vercel.app/api/v1/providers",
  );
  if (!response.ok) {
    throw new Error("Failed to fetch Provider");
  }

  return await response.json();
}
