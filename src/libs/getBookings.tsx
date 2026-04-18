export default async function getBookings(token: string) {
    const response = await fetch(`https://fe-project-68-bongbing-backend.vercel.app/api/v1/bookings`, {
        method: "GET",
        headers: {
            authorization: `Bearer ${token}`,
        },
        cache: "no-store", 
    });

    if (!response.ok) {
        throw new Error("Failed to fetch bookings");
    }

    return await response.json();
}