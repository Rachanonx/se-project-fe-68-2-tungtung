export default async function getProvider(id: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/providers/${id}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch provider");
  }

  return await response.json();
}
