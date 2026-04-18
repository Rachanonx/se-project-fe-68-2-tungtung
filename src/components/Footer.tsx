export default function Footer() {
  return (
    <footer className="flex flex-col items-center justify-center w-full py-8 bg-white border-t border-solid border-gray-300">
      <img src="/img/BingBongRental.png" alt="Bingbong logo" className="h-[70px] w-auto" />
      <p className="mt-2 text-sm text-gray-700">
        © {new Date().getFullYear()} BingBong Rental, Inc. All rights reserved.
      </p>
    </footer>
  );
}
