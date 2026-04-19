"use client";
import BookingCard from "@/components/BookingCard";
import EditBookingModal from "@/components/EditBookingModal";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import deleteBooking from "@/libs/deleteBookings";
import updateBooking from "@/libs/updateBookings";
import { getImageFromId } from "@/libs/carImages";

export default function BookingList({ bookingsJson }: { bookingsJson: Promise<any> }) {
  const bookingsReady = use(bookingsJson);
  const dbItems = bookingsReady.data || [];
  
  const { data: session } = useSession();
  const router = useRouter();

  // --- Edit States ---
  const [editingBooking, setEditingBooking] = useState<any>(null);

  const startEditing = (booking: any) => {
    setEditingBooking(booking);
  };

  const handleRemove = async (bookingId: string) => {
    if (!session || !session.user.token) return;
    if (!confirm("Are you sure you want to delete this booking?")) return;
    
    try {
        await deleteBooking(bookingId, session.user.token);
        alert("Booking deleted successfully");
        router.refresh(); 
    } catch (err: any) {
        alert(err.message || "Failed to delete booking");
    }
  };

  const handleSave = async (newDate: string) => {
    if (!editingBooking || !session?.user?.token) return;
    
    const bookingId = editingBooking._id;

    try {
        await updateBooking(bookingId, session.user.token, newDate);
        alert("Booking updated successfully");
        setEditingBooking(null);
        router.refresh(); // Fetch new data from server
    } catch (err: any) {
        alert(err.message || "Failed to update booking");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 p-10 flex flex-col items-center gap-10 pt-[100px]">
      <header className="w-full max-w-[1161px] text-left">
        <h1 className="text-4xl lg:text-5xl font-black text-black tracking-tighter">
          Manage Bookings
        </h1>
        <p className="text-neutral-500 mt-2">View and manage your car reservations.</p>
      </header>

      {/* --- EDIT MODAL --- */}
      <EditBookingModal
        isOpen={editingBooking !== null}
        onClose={() => setEditingBooking(null)}
        booking={editingBooking}
        onSave={handleSave}
      />

      {/* --- LIST RENDERING --- */}
      <div className="flex flex-col gap-8 w-full items-center">
        {dbItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="text-6xl opacity-20">📭</div>
            <div className="text-xl font-bold text-neutral-400">No bookings found.</div>
          </div>
        ) : (
          dbItems.map((bookItem: any, index: number) => {
            const providerName = bookItem.provider.name;
            const providerId = bookItem.provider._id;
            const imgSrc = getImageFromId(providerId);
            
            const cardItem = {
                provider: providerName,
                bookDate: dayjs(bookItem.rentalDate).format("YYYY/MM/DD"),
                user: bookItem.user.name
            };

            return (
              <BookingCard 
                key={bookItem._id}
                item={cardItem}
                imgSrc={imgSrc}
                onRemove={() => handleRemove(bookItem._id)}
                onEdit={() => startEditing(bookItem)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}