import BookingList from "@/components/BookingList";
import getBookings from "@/libs/getBookings";
import { Suspense } from "react";
import { LinearProgress } from "@mui/material";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export default async function BookingPage() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.token) return null;

    // Only fetch bookings now
    const bookings = getBookings(session.user.token); 

    return (
        <main className="mt-5">
            <Suspense fallback={
                <div className="w-full p-10">
                    <p className="text-center mb-2 font-bold text-black">Loading your reservations...</p>
                    <LinearProgress />
                </div>
            }>
                <BookingList bookingsJson={bookings} />
            </Suspense>
        </main>
    );
}