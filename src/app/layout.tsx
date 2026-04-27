import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopMenu from "@/components/TopMenu";
import Footer from "@/components/Footer";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";
import NextAuthProvider from "@/providers/NextAuthProvider";
import ReduxProvider from "@/redux/ReduxProvider";
import ChatWidget from "@/components/ChatWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Venue Explorer - Find Your Perfect Venue",
  description: "Discover and book amazing venues. Read reviews from other users and share your experience.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await getServerSession(authOptions);
  
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning  
      >
        <ReduxProvider>
        <NextAuthProvider session={session}>
        <TopMenu />
        {children}
        <ChatWidget />
        <Footer />
        </NextAuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
