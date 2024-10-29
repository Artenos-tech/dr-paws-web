import React from "react";
import { StaticImageData } from "next/image";

type circleImageProps = {
  cirImg: {
    image: StaticImageData;
    circleText: string;
  };
};

const CircleImageCard: React.FC<circleImageProps> = ({ cirImg }) => {
  const { image, circleText } = cirImg;
  return (
    <div className="flex flex-col items-center gap-3 w-[245px] h-[296px]">
      {/* Add object-cover and set width/height to maintain aspect ratio */}
      <img
        src={image.src}
        alt="Dog & Cat Boarding"
        className="rounded-full w-32 h-32 object-cover"
      />
      <p className="text-primary-1">{circleText}</p>
    </div>
  );
};

export default CircleImageCard;
