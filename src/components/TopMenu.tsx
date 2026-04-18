"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function TopMenu() {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const token = (session?.user as any)?.token;
      if (token) {
        await fetch(
          "https://fe-project-68-bongbing-backend.vercel.app/api/v1/auth/logout",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
            mode: "cors",
          }
        ).catch(() => console.warn("Backend logout failed, clearing local session."));
      }
      setDropdownOpen(false);
      await signOut({ callbackUrl: "/" });
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  return (
    <header className="flex w-full justify-between items-center px-16 py-3 bg-white border-b border-solid border-gray-300 fixed top-0 left-0 right-0 z-30">
      <Link href="/" className="flex items-center ml-[-70px]">
        <img
          alt="Bingbong car rental"
          src="/img/BingBongRental.png"
          className="h-10 w-auto"
        />
      </Link>

      <nav className="flex items-center gap-6 mr-[-50px]">
        {session ? (
          /* --- LOGGED IN VIEW --- */
          <div className="flex items-center gap-6">
            <Link href="/mybooking" className="text-black rounded-md px-4 py-2 font-medium hover:bg-gray-300 transition-opacity">
              My Booking
            </Link>
            <Link href="/providers" className="text-black rounded-md px-4 py-2 font-medium hover:bg-gray-300 transition-opacity">
              Providers
            </Link>

            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center cursor-pointer"
              >
                <Image
                  src={(session.user as any)?.image || "/img/pfp.png"}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-full object-cover border border-gray-200"
                />
              </button>

              {dropdownOpen && (
                <div className="absolute top-14 right-0 bg-white rounded-2xl shadow-lg border border-gray-200 w-64 p-4 z-50">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                    <Image
                      src={(session.user as any)?.image || "/img/pfp.png"}
                      alt="Profile"
                      width={50}
                      height={50}
                      className="rounded-full object-cover"
                    />
                    <div className="flex-1 overflow-hidden">
                      <p className="font-semibold text-black truncate">
                        {(session.user as any)?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {(session.user as any)?.email || ""}
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="cursor-pointer flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors mb-2"
                  >
                    <Image src="/img/Person.png" alt="Profile" width={20} height={20} />
                    <span className="text-black font-medium">Profile</span>
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-300 text-red-600 transition-colors"
                  >
                    <Image src="/img/Signout.png" alt="Sign out" width={20} height={20} />
                    <span className="font-medium">Sign out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* --- GUEST VIEW (NOT LOGGED IN) --- */
          <div className="flex items-center gap-4 md:gap-6">
            {/* Added Providers button here */}
            <Link
              href="/providers"
              className="text-black font-medium px-4 py-2 rounded-md hover:bg-gray-300 transition-opacity text-base"
            >
              Providers
            </Link>

            <Link
              href="/api/auth/signin"
              className="px-5 py-2 bg-white rounded-lg border border-solid border-black hover:bg-gray-300 transition-colors"
            >
              <span className="font-semibold text-black text-base whitespace-nowrap">
                Log in
              </span>
            </Link>

            <Link
              href="/signup"
              className="px-5 py-2 bg-black rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <span className="font-semibold text-white text-base whitespace-nowrap">
                Sign up
              </span>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}