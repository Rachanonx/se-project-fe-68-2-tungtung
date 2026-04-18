"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

const slides = [
  { src: "/img/banner1.png", alt: "Banner 1" },
  { src: "/img/banner2.png", alt: "Banner 2" },
  { src: "/img/banner3.png", alt: "Banner 3" },
];

export default function BannerContainer() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data: session } = useSession();

  const goToPrev = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  useEffect(() => {
    const timer = setInterval(goToNext, 4000);
    return () => clearInterval(timer);
  }, [goToNext]);

  return (
    <div className="relative h-[880px] w-full overflow-hidden">

      {/* IMAGE */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: currentSlide === index ? 1 : 0 }}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <div className="cursor-pointer absolute inset-0 bg-black/40 z-10" />

      {/* BUTTON NEXT */}
      <button
        onClick={goToNext}
        className="cursor-pointer absolute right-6 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow hover:bg-white"
      >
        <Image src="/img/vectorNext.svg" alt="Next" width={10} height={10} />
      </button>

      {/* BUTTON PREV */}
      <button
        onClick={goToPrev}
        className="cursor-pointer absolute left-6 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow hover:bg-white"
      >
        <Image src="/img/vectorPrev.svg" alt="Previous" width={10} height={10} />
      </button>

      <div className="cursor-pointer absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 gap-2 rounded-full bg-white/80 px-3 py-2 backdrop-blur">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              currentSlide === index ? "w-6 bg-black" : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </div>

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center text-white">

        <h1 className="text-3xl md:text-5xl font-semibold italic drop-shadow-lg">
          Where everyone find their best Car
        </h1>

        <p className="mt-4 max-w-3xl text-lg md:text-2xl drop-shadow-lg">
          Finding the perfect car has never been easier. Whether it&apos;s a
          sedan, EV, or sports car, we offer the best selection of vehicles.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/providers"
            className="rounded-xl bg-white px-6 py-3 text-black shadow transition-colors duration-300 hover:bg-black hover:text-white"
          >
            See Our Provider →
          </Link>

          {!session && (
            <Link
              href="/signin"
              className="rounded-xl bg-white px-6 py-3 text-black shadow transition-colors duration-300 hover:bg-black hover:text-white"
            >
              Let&apos;s Start →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}