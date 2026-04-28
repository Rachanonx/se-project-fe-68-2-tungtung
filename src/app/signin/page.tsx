"use client"
import SigninModal from "@/components/SigninModal";
import Image from "next/image";

export default function SigninPage() {    
  return (
    <div className="h-screen overflow-hidden grid grid-cols-1 md:grid-cols-2">

      <div className="overflow-y-auto flex items-center justify-center py-8 px-4">
        <SigninModal />             
      </div>

      <div className="relative hidden md:block">
        <Image
          src="/img/signin.png"
          alt="Signin background"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
        <div className="absolute bottom-6 right-6 z-10">
          <Image
            src="/img/Transparent Logo.png"
            alt="Car Rental"
            width={400}
            height={150}
            style={{ width: "auto", height: "auto" }}
            className="object-contain"
          />
        </div>
      </div>

    </div>
  );
}
