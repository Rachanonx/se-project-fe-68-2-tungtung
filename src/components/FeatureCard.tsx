"use client";

import React from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import deleteProvider from "@/libs/deleteProvider";
import { useRouter } from "next/navigation";

export default function FeatureCard({
  providerId,
  providerName,
  providerAddress,
  averageRating,
  reviewCount,
  imgSrc,
}: {
  providerId: string;
  providerName: string;
  providerAddress: string;
  averageRating: number;
  reviewCount: number;
  imgSrc: string;
}) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); 

    if (!session?.user?.token) {
      alert("Unauthorized");
      return;
    }

    const confirmDelete = confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    try {
      await deleteProvider(session.user.token, providerId);
      alert("Deleted successfully");

      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div
      className={`
        group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-solid border-[#0000001a]
        w-full max-w-[700px] h-[450px]
        transition-all duration-500 ease-out cursor-pointer
        shadow-[0px_6px_12px_#00000008,0px_4px_8px_#00000005]
        hover:shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.2)]
        hover:h-[475px]
        hover:max-w-[725px]
        hover:-translate-y-2.5
      `}
    >
      {/* IMAGE */}
      <div
        className="
          relative w-full h-[400px] bg-white
          shadow-[inset_0px_4px_57px_#000000]
          overflow-hidden transition-all duration-500
        "
      >
        <Image
          alt={providerName}
          src={imgSrc}
          fill
          className="
            object-cover
            transition-transform duration-500 group-hover:scale-125
          "
          sizes="(max-width: 590px) 100vw, 590px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* CONTENT */}
      <div
        className="
          relative w-full h-[200px] flex flex-col items-start justify-center
          gap-8 p-6 transition-all duration-500 group-hover:h-[225px] group-hover:bg-neutral-50
        "
      >
        <div className="flex flex-col h-[179px] items-start gap-2 relative self-stretch w-full">
          <div
            className="
              relative flex items-center self-stretch font-semibold text-black
              transition-all duration-500
              text-2xl tracking-[-0.48px] leading-[34.8px]
              group-hover:text-[30px] group-hover:tracking-[-0.80px] group-hover:leading-[58.0px]
            "
          >
            {providerName}
          </div>

          <div
            className="
              relative flex items-center self-stretch font-medium
              text-[#0000008c] text-lg tracking-[-0.09px] leading-[25.2px]
              transition-colors duration-500 group-hover:text-black
            "
          >
            Address: {providerAddress}
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 text-xs font-bold tracking-wide uppercase">
              Rating
            </span>
            <span className="inline-flex items-center rounded-full bg-black text-white px-3 py-1 text-sm font-semibold">
              ★ {averageRating.toFixed(1)} / 5
            </span>
            <span className="text-xs text-[#0000008c] group-hover:text-black transition-colors duration-500">
              {reviewCount} review{reviewCount === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        {/* FOOTER */}
        <div
          className="
            relative flex items-center justify-between self-stretch font-medium text-black text-lg
            tracking-[-0.09px] leading-[26.1px] transition-all duration-300
          "
        >
          {/* CTA */}
          <div className="flex items-center">
            <span className="group-hover:mr-2 transition-all duration-300">
              Start Booking
            </span>
            <span className="inline-block transform transition-transform duration-300 group-hover:translate-x-1 translate-x-1">
              →
            </span>
          </div>

          {/* ADMIN BUTTON */}
          {session && session.user.role === "admin" && (
            <div className="cursor-pointer flex items-center gap-3">
              <button
                onClick={handleDelete}
                className="text-black hover:text-white px-6 py-2.5 bg-white rounded-xl hover:bg-[#690909] transition-all active:scale-95 shadow-sm border"
              >
                <span className="font-semibold text-sm whitespace-nowrap">
                  Delete
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}