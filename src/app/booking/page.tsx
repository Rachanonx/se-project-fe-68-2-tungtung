"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import dayjs, { Dayjs } from "dayjs";
import DateReserve from "@/components/DateReserve";
import { useSession } from "next-auth/react";
import postBooking from "@/libs/makeBookings";
import { getImageFromId } from "@/libs/carImages";
// =================================

export default function Booking() {
  const { data: session } = useSession();
  const router = useRouter();
  const urlParams = useSearchParams();

  // Get Provider Info from URL (?id=...&name=...)
  const venueId = urlParams.get("id");
  const venueName = urlParams.get("name");

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [userName, setUserName] = useState("");

  // Sync user name from session
  useEffect(() => {
    if (session?.user?.name) {
      setUserName(session.user.name);
    }
  }, [session]);

  const handleMakeBooking = async () => {
    // 1. Validation: Ensure we have a session and the required User ID/Token
    if (!session || !session.user.token || !session.user._id) {
      alert("Authentication error: Please log in again.");
      return;
    }

    // 2. Validation: Ensure a date is selected and we know which provider to book
    if (!selectedDate || !venueId) {
      alert("Please select a date before booking.");
      return;
    }

    try {
      // Format date to ISO string for the backend
      const rentalDate = selectedDate.toISOString();
      const token = session.user.token;
      const userId = session.user._id;

      // 3. Call the API Library
      await postBooking(venueId, token, rentalDate, userId);

      alert("Booking Successful!");
      
      // 4. Redirect to Management Page
      router.push("/mybooking");
      router.refresh(); // Force refresh to show the new booking in the list
    } catch (err: any) {
      alert(`Booking Failed: ${err.message}`);
    }
  };

  // Generate the same banner image used in the list for consistency
  const imageSrc = venueId ? getImageFromId(venueId) : "/img/banner1.png";

  return (
    <main className="min-h-screen pt-[120px] pb-12 bg-white px-6 md:px-24">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

        {/* --- FORM SECTION --- */}
        <div className="flex-1 w-full max-w-lg">
          <h1 className="text-4xl font-extrabold text-black mb-10 tracking-tight">
            Confirm Your Reservation
          </h1>

          <div className="space-y-6">
            {/* User Name (Read-only for security) */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700">Customer Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed outline-none"
                value={userName || "Loading..."}
                readOnly
              />
            </div>

            {/* Provider Name (Read-only) */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700">Selected Provider</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed outline-none"
                value={venueName || "Unknown Provider"}
                readOnly
              />
            </div>

            {/* Date Picker Component */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700">Reservation Date</label>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden focus-within:border-black transition-colors">
                <DateReserve
                  onDateChange={(value: Dayjs | null) => setSelectedDate(value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleMakeBooking}
              className="w-full mt-4 flex items-center justify-center gap-3 px-6 py-4 bg-black text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-lg"
            >
              <span>Confirm Booking</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* --- IMAGE SECTION --- */}
        <div className="flex-1 w-full flex justify-center lg:justify-end">
          <div className="relative w-full aspect-[4/3] lg:aspect-[16/10] rounded-[48px] overflow-hidden shadow-2xl border-8 border-gray-50">
            <Image
              src={imageSrc}
              alt="Provider Banner"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
               <p className="text-sm font-medium opacity-80 uppercase tracking-widest mb-1">Now Booking</p>
               <h2 className="text-3xl font-bold">{venueName}</h2>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}