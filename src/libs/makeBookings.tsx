export default async function makeBooking(
  providerId: string, 
  token: string, 
  rentalDate: string, 
  userId: string // Added userId parameter
) {
    const response = await fetch(`https://fe-project-68-bongbing-backend.vercel.app/api/v1/providers/${providerId}/bookings`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            rentalDate: rentalDate,
            user: userId // Added to the body
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create booking");
    }

    return await response.json();
}