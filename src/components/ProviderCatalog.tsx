"use client";
import React, { use, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import FeatureCard from "./FeatureCard";
import type { ProviderJson, ProviderItem } from "../../interface";
import pushProvider from "@/libs/pushProvider";
import { useRouter } from "next/navigation";
import { getImageFromId } from "@/libs/carImages";

export default function ProviderCatalog({
  providersJson,
}: {
  providersJson: Promise<ProviderJson>;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  
  // Resolving the promise without 'async/await'
  const providersJsonReady = use(providersJson);

  // ฟังก์ชันสำหรับการกดปุ่มสุ่มเพิ่มข้อมูล
  const handleAddRandomProvider = async () => {
    // 1. เช็ค Token ก่อนเลย
    console.log("Checking session user:", session?.user);
    
    if (!session || !session.user?.token) {
        alert("ไม่เจอ Token ใน Session! กรุณาเช็คการตั้งค่า NextAuth");
        return;
    }

    try {
        const result = await pushProvider(session.user.token);
        if (result) {
            alert("เพิ่มข้อมูลสำเร็จ!");
            router.refresh();
        }
    } catch (error: any) {
        // 2. ถ้ามัน Failed to fetch จริงๆ มันจะมาตกที่นี่
        console.error("Detailed Error:", error);
        
        // ถ้าเป็นปัญหา Network/CORS จะขึ้น "Failed to fetch"
        // แต่ถ้าเป็นปัญหาที่ Backend จะขึ้น HTTP Status เช่น 400, 401
        alert("เกิดข้อผิดพลาด: " + error.message);
    }
};

  //Search field states
  const [search, setSearch] = useState("");

  // ===== FILTER =====
  const filteredProviders = useMemo(() => {
  return providersJsonReady.data.filter((provider) =>
    provider.name?.toLowerCase().includes(search.toLowerCase())
  );
}, [providersJsonReady, search]);


  return (
    <div className="w-full flex flex-col items-center">
      <header className="w-full max-w-[1750px] flex justify-between items-end px-4 mt-10">
        <div className="flex flex-col items-start text-left">
          <h1 className="text-4xl lg:text-5xl font-black text-black tracking-tighter text-left">
            Explore Provider
          </h1>
          <p className="text-neutral-500 mt-2 text-left">
            Find the partnership that suits you best.
          </p>
        </div>

        {/* ปุ่มสำหรับ Admin: แสดงผลทางด้านขวาของหัวข้อ */}
        {session && session.user?.role === "admin" && (
          <div className="cursor-pointer pb-1">
            <button 
              className="xt-black hover:text-white px-6 py-3 bg-white rounded-xl hover:bg-[#00d66b] transition-all active:scale-95 shadow-sm border border-neutral-200"
              onClick={handleAddRandomProvider}
            >
              <span className="font-semibold text-sm whitespace-nowrap">
                + Add Random Provider
              </span>
            </button>
          </div>
        )}
      </header>

      {/* ===== SEARCH BAR ===== */}
      <div className="w-full max-w-[1750px] px-4 mt-8">
  <div className="flex items-center bg-white border border-neutral-200 rounded-xl px-5 py-3 shadow-sm focus-within:ring-2 focus-within:ring-[#828282] transition-all">

    {/* 🔍 Icon */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-neutral-400 mr-3"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-4.35-4.35m1.1-4.65a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>

    {/* Input */}
    <input
      type="text"
      placeholder="Search providers..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full bg-transparent outline-none text-sm text-black placeholder:text-neutral-400"
    />

    {/* ❌ Clear button */}
    {search && (
      <button
        onClick={() => setSearch("")}
        className="ml-2 text-neutral-400 hover:text-black transition"
      >
        ✕
      </button>
    )}
  </div>
</div>

      {/* Grid Display */}
      <div className="grid grid-cols-[repeat(auto-fit,400px)] justify-center gap-10 px-4 py-12 w-full">
        {filteredProviders.map((providerItem: ProviderItem) => (
          <Link
            href={`/providers/${providerItem._id}`}
            key={providerItem._id}
            className="block"
          >
            <FeatureCard
              providerId={providerItem._id}
              providerName={providerItem.name}
              providerAddress={providerItem.address}
              averageRating={providerItem.averageRating ?? 0}
              reviewCount={providerItem.reviewCount ?? 0}
              imgSrc={getImageFromId(providerItem._id)}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}