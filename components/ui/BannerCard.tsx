import { StaticImageData } from "next/image";
import React from "react";

interface bannerCardProps {
  banItem: {
    bannerImage: StaticImageData;
    bannerText: string;
  };
}

const BannerCard: React.FC<bannerCardProps> = ({ banItem }) => {
  const { bannerImage, bannerText } = banItem;
  return (
    <div className="rounded-3xl w-[120px] h-[140px] flex flex-col items-center justify-between">
      <div className="p-4">
        <h1 className="text-secondary-1 text-center text-lg font-semibold">
          {bannerText}
        </h1>
        <div className="w-[80px] h-[62px]">
          <img
            src={bannerImage.src}
            alt={bannerText + "img"}
            className="w-14 my-4 mx-auto h-[60px] object-contain"
          />
        </div>
      </div>

      <button className="w-full py-3 font-semibold tracking-wider bg-secondary-1 text-white rounded-none rounded-b-3xl border-none text-xs">
        Book a Visit
      </button>
    </div>
  );
};

export default BannerCard;
