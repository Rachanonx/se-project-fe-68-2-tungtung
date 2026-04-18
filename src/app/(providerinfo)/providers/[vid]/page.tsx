import Image from "next/image";
import getProvider from "@/libs/getProvider";
import Link from "next/link";

const images = [
  "/img/banner1.png",
  "/img/banner2.png",
  "/img/banner3.png",
  "/img/car1.png",
  "/img/car2.png",
  "/img/car3.png",
  "/img/car4.png",
];

function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 7) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getImageFromId(id: string) {
  const hash = hashString(id);
  return images[hash % images.length];
}

export default async function VenueDetailPage({
  params,
}: {
  params: Promise<{ vid: string }>;
}) {
  const { vid } = await params;
  const venueDetail = await getProvider(vid);

  const imageSrc =
    venueDetail.data.picture || getImageFromId(vid);

  return (
    <main className="px-8 py-10 max-w-[1200px] mx-auto mt-15">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Content */}
        <div>
          <h1 className="text-4xl font-extrabold mb-4">
            {venueDetail.data.name}
          </h1>

          <p className="text-gray-500 mb-8">
            {venueDetail.data.address}
          </p>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <p className="text-lg font-semibold mb-2">
              Provider Information
            </p>
            <p className="mb-2">
              Location: {venueDetail.data.address}
            </p>
            <p className="mb-2">
              Tel: {venueDetail.data.tel}
            </p>
          </div>

          <Link
            href={`/booking?id=${vid}&name=${encodeURIComponent(
              venueDetail.data.name
            )}`}
          >
            <button className="cursor-pointer mt-6 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition">
              Book Your Car
            </button>
          </Link>
        </div>

        {/* Right Image */}
        <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-lg">
          <Image
            src={imageSrc}
            alt="venueImage"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </main>
  );
}