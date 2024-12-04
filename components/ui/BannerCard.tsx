import Image, { StaticImageData } from "next/image";
import React from "react";

interface bannerCardProps {
  banItem: {
    bannerImage: StaticImageData;
    bannerText: string;
  };
  openLoginModal: ((val: string) => void) | undefined;
}

const BannerCard: React.FC<bannerCardProps> = ({ banItem, openLoginModal }) => {
  const { bannerImage, bannerText } = banItem;
  return (
    <div className="w-[100px] md:w-[130px] lg:w-[150px] flex flex-col items-center">
      <div className="bg-white rounded-t-3xl w-full flex flex-col items-center p-2 md:p-4">
        <h1 className="text-secondary-1 text-center text-xs md:text-sm lg:text-base">
          {bannerText}
        </h1>
        <div className="mt-1">
          <Image
            src={bannerImage.src}
            alt={`${bannerText} img`}
            width={40}
            height={50}
            className="w-[40px] h-[50px] md:w-[50px] md:h-[60px] lg:w-[60px] lg:h-[70px] object-contain mx-auto"
          />
        </div>
      </div>
      <div className="w-full">
        <button
          className="w-full py-2 bg-secondary-1 hover:bg-primary-1 text-white rounded-b-3xl text-xs md:text-sm"
          onClick={() => openLoginModal && openLoginModal("Book a Visit")}
        >
          Book a Visit
        </button>
      </div>
    </div>
  );
};

export default BannerCard;
