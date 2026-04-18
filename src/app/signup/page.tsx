"use client"
import SignupModal from "@/components/SignupModal";
import Image from "next/image";

export default function SignupPage() {
  return (
    <div className="h-screen overflow-hidden grid grid-cols-1 md:grid-cols-2">

      {/* [1,1] Left — Form (scrollable ถ้า content เกิน) */}
      <div className="overflow-y-auto flex items-center justify-center py-8 px-4">
        <SignupModal />
      </div>

      {/* [1,2] Right — รูปภาพ (ซ่อนบน mobile) */}
      <div className="relative hidden md:block">
        <Image
          src="/img/signup.png"
          alt="Signup background"
          fill
          className="object-cover"
          priority
        />
        {/* Car Rental logo มุมขวาล่าง */}
        <div className="absolute bottom-6 right-6 z-10">
          <Image
            src="/img/Transparent Logo.png"
            alt="Car Rental"
            width={400}
            height={150}
            className="object-contain"
          />
        </div>
      </div>

    </div>
  );
}