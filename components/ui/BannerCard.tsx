import Image, { StaticImageData } from "next/image";
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
    <div className="relative w-[100px] md:w-[130px] lg:w-[150px] min-h-[100px] rounded-t-3xl flex flex-col justify-end items-center">
      <Image
        src={bannerImage.src}
        alt={`${bannerText} img`}
        width={70}
        height={120}
        className="flex-1 h-[130px] object-cover object-top mx-auto absolute top-[-11px]"
        // w-[40px] h-[50px] md:w-[50px] md:h-[60px] lg:w-[60px] lg:h-[70px]
      />
      <div className="flex flex-col w-full ">
        <div className="rounded-t-3xl w-full bg-primary-1 min-h-[90px]"></div>
        <div className="w-full  py-2 bg-[#ffcb77] z-20 rounded-b-3xl">
          <h1
            className=" mt-0  text-primary-1 text-center font-semibold rounded-b-3xl text-xs md:text-base tracking-wider"
            // onClick={handleBookAVisit}
          >
            {bannerText}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default BannerCard;
