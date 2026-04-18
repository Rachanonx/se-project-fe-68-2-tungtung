export default async function userLogin(
  userEmail: string,
  userPassword: string,
) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const response = await fetch(
    `${backendUrl}/api/v1/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userEmail,
        password: userPassword,
      }),
    },
  );
  if (!response.ok) {
    throw new Error("Failed to login");
  }
  return await response.json();
}
