"use client";
import BookingCard from "@/components/BookingCard";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import deleteBooking from "@/libs/deleteBookings";
import updateBooking from "@/libs/updateBookings"; // Import the new lib

// ====== Seed Image Logic ======
const images = [
  "/img/banner1.png",
  "/img/banner2.png",
  "/img/banner3.png",
  "/img/car1.png",
  "/img/car2.png",
  "/img/car3.png",
  "/img/car4.png",
];

function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 7) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getImageFromId(id: string) {
  const hash = hashString(id || "default");
  return images[hash % images.length];
}

export default function BookingList({ bookingsJson }: { bookingsJson: Promise<any> }) {
  const bookingsReady = use(bookingsJson);
  const dbItems = bookingsReady.data || [];
  
  const { data: session } = useSession();
  const router = useRouter();

  // --- Edit States ---
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editDate, setEditDate] = useState("");

  const startEditing = (index: number, item: any) => {
    setEditingIndex(index);
    setEditDate(item.rentalDate);
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

  const handleSave = async () => {
    if (editingIndex === null || !session?.user?.token) return;
    
    const bookingId = dbItems[editingIndex]._id;

    try {
        await updateBooking(bookingId, session.user.token, editDate);
        alert("Booking updated successfully");
        setEditingIndex(null);
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
      {editingIndex !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl space-y-6">
            <h2 className="text-2xl font-bold text-black text-center">Change Date</h2>
            <div className="space-y-4 text-black">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                Provider: {dbItems[editingIndex].provider.name}
              </p>
              <div>
                <label className="block text-sm font-bold mb-1 text-gray-700">New Date</label>
                <input 
                  type="date"
                  className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-black bg-white"
                  value={dayjs(editDate).format("YYYY-MM-DD")}
                  onChange={(e) => {
                      const newDate = dayjs(e.target.value).toISOString();
                      setEditDate(newDate);
                  }}
                />
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => setEditingIndex(null)} 
                className="flex-1 py-3 border border-neutral-300 rounded-xl font-bold text-black hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                className="flex-1 py-3 bg-black text-white rounded-xl font-bold hover:bg-zinc-800 transition-transform active:scale-95"
              >
                Save Date
              </button>
            </div>
          </div>
        </div>
      )}

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
                onEdit={() => startEditing(index, bookItem)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}