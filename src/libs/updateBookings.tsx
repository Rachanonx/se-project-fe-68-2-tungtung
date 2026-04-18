export default async function updateBooking(id: string, token: string, rentalDate: string) {
    const response = await fetch(`https://fe-project-68-bongbing-backend.vercel.app/api/v1/bookings/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            rentalDate: rentalDate,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update booking");
    }

    return await response.json();
}