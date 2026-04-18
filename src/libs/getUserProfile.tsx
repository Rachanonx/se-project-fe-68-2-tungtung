export default async function getUserProfile(token: string) {
  const response = await fetch(
    "https://fe-project-68-bongbing-backend.vercel.app/api/v1/auth/me",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error("Failed to get use profile");
  }

  return await response.json();
}
