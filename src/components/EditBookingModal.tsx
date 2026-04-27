'use client';
import { useState } from 'react';
import dayjs from 'dayjs';

interface EditBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  onSave: (newDate: string) => void;
}

export default function EditBookingModal({ isOpen, onClose, booking, onSave }: EditBookingModalProps) {
  const [editDate, setEditDate] = useState(booking?.rentalDate || '');

  if (!isOpen || !booking) return null;

  const handleSave = () => {
    onSave(editDate);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl space-y-6">
        <h2 className="text-2xl font-bold text-black text-center">Change Date</h2>
        <div className="space-y-4 text-black">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
            Provider: {booking.provider.name}
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
            onClick={onClose}
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
  );
}