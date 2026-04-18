import Image from "next/image";
import InteractiveCard from "./InteractiveCard";

export default function Card({
  venueName,
  imgSrc,
  onRating,
}: {
  venueName: string;
  imgSrc: string;
  onRating?: Function;
}) {
  return (
    <InteractiveCard contentName={venueName} onRating={onRating}>
      <div className="w-full h-[70%] relative rounded-t-lg">
        <Image
          src={imgSrc}
          alt="card"
          fill={true}
          className="object-cover rounded-t-lg"
        />
      </div>
      <div className="w-full h-[15%] p-[10px] text-black underline">
        {venueName}
      </div>
    </InteractiveCard>
  );
}