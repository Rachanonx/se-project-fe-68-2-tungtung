export default async function deleteProvider(
  token: string,
  providerId: string
) {
  const response = await fetch(
    `https://fe-project-68-bongbing-backend.vercel.app/api/v1/providers/${providerId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete provider");
  }

  return await response.json();
}