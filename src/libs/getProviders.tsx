export default async function getProvider() {
  //await new Promise((resolve) => setTimeout(resolve, 1000));

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/providers`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch Provider");
  }

  return await response.json();
}
