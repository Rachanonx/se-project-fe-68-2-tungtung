export default async function getProvider(id: string) {
  const response = await fetch(
    `https://fe-project-68-bongbing-backend.vercel.app/api/v1/providers/${id}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch provider");
  }

  return await response.json();
}
