"use client";
import { useState } from "react";
import React from "react";
import { Rating } from "@mui/material";

export default function InteractiveCard({
  children,
  contentName,
  onRating,
}: {
  children: React.ReactNode;
  contentName: string;
  onRating?: Function;
}) {
  const [value, setValue] = useState<number | null>(0);

  // Replaced alert with a cleaner UI-based approach or keeping it for your logic
  function onVenueSelect() {
    console.log("Selected: " + contentName);
  }

  return (
    <div
      onClick={onVenueSelect}
      className={`
        relative w-full h-[320px] rounded-xl bg-white cursor-pointer
        /* Shadows & Transforms */
        shadow-lg hover:shadow-2xl hover:-translate-y-2
        /* Background Transition */
        transition-all duration-500 ease-out
        /* Interaction States */
        hover:bg-neutral-50 active:scale-[0.98]
        /* Layout */
        flex flex-col overflow-hidden group
      `}
    >
      {/* Container for Children 
          Using 'group-hover' to add internal animations based on card hover
      */}
      <div className="flex-grow p-4 transition-transform duration-500 group-hover:scale-[1.02]">
        {children}
      </div>

      {onRating ? (
        <div className="p-4 border-t border-neutral-100 bg-white/50 backdrop-blur-sm">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
              Feedback
            </span>
            <Rating
              name={contentName + " Rating"}
              value={value}
              data-testid={contentName + " Rating"}
              onChange={(event, newValue) => {
                setValue(newValue ?? 0);
                if (onRating) onRating(contentName, newValue);
              }}
              onClick={(e) => {
                // Prevent card click when clicking rating
                e.stopPropagation();
              }}
              sx={{
                '& .MuiRating-iconFilled': {
                  color: '#fbbf24', // Amber-400
                  transition: 'transform 0.2s ease',
                },
                '& .MuiRating-iconHover': {
                  transform: 'scale(1.2)',
                },
              }}
            />
          </div>
        </div>
      ) : null}

      {/* Decorative hover indicator line at the bottom */}
      <div className="absolute bottom-0 w-0 h-1 bg-indigo-500 transition-all duration-500 group-hover:w-full" />
    </div>
  );
}
