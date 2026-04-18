import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BookingItem } from "../../../interface";

type BookState = {
  bookItems: BookingItem[];
};

const initialState: BookState = {
  bookItems: [],
};

export const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    addBooking: (state, action: PayloadAction<BookingItem>) => {
      const newItem = action.payload;

      const index = state.bookItems.findIndex(
        (item) =>
          item.provider === newItem.provider && item.bookDate === newItem.bookDate,
      );

      if (index !== -1) {
        state.bookItems[index] = newItem;
      } else {
        state.bookItems.push(newItem);
      }
    },
    removeBooking: (state, action: PayloadAction<BookingItem>) => {
      state.bookItems = state.bookItems.filter((obj) => {
        return (
          obj.user !== action.payload.user ||
          obj.provider !== action.payload.provider ||
          obj.bookDate !== action.payload.bookDate
        );
      });
    },
    // --- NEW UPDATE REDUCER ---
    updateBooking: (state, action: PayloadAction<{ index: number; newBooking: BookingItem }>) => {
      const { index, newBooking } = action.payload;
      if (index >= 0 && index < state.bookItems.length) {
        state.bookItems[index] = newBooking;
      }
    },
  },
});

export const { addBooking, removeBooking, updateBooking } = bookSlice.actions;

export default bookSlice.reducer;