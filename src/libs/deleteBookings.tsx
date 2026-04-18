export default async function deleteBooking(id: string, token: string) {
    const response = await fetch(`https://fe-project-68-bongbing-backend.vercel.app/api/v1/bookings/${id}`, {
        method: "DELETE",
        headers: {
            authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to delete booking");
    }

    return await response.json();
}