"use client";

import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";

// Update this interface to remove the required onLocationChange
interface DateReserveProps {
  onDateChange: (date: Dayjs | null) => void;
  // onLocationChange: Function;  <-- Remove or comment this out
}

export default function DateReserve({ onDateChange }: DateReserveProps) {
  return (
    <div className="w-full">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          // Styling to match your text inputs
          slotProps={{
            textField: {
              variant: "outlined",
              fullWidth: true,
              sx: {
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "& fieldset": { borderColor: "#E5E7EB" },
                  "&:hover fieldset": { borderColor: "#000" },
                  "&.Mui-focused fieldset": { borderColor: "#000" },
                },
              },
            },
          }}
          onChange={(newValue) => onDateChange(newValue)}
        />
      </LocalizationProvider>
    </div>
  );
}