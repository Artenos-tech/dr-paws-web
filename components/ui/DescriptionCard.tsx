import { StaticImageData } from "next/image";
import React from "react";
import Button from "./Button";
import localFont from "next/font/local";

interface descriptionCardProps {
  index: number;
  description: {
    image: StaticImageData;
    title: string;
    desciption: string;
    button: {
      buttonText: string;
      buttonBackground: string;
    };
  };
}

const DescriptionCard: React.FC<descriptionCardProps> = ({
  index,
  description,
}) => {
  const { image, title, button } = description;
  return (
    <div className="w-[90%] flex flex-col  sm:flex-row sm:w-[70%]">
      <div className="md:flex md:items-center md:justify-between gap-20  md:w-full ">
        <img
          src={image.src}
          alt={title + "image"}
          className={`${
            index % 2 !== 0 && "md:order-2"
          } w-11/12 mx-auto md:w-1/2 rounded-md`}
        />

        <div className="w-full text-center md:text-left text-primary-1 my-3 md:my-0">
          <h1 className={`  text-xl md:text-4xl `}>{title}</h1>
          <p className="text-sm md:text-base my-3 md:my-5">
            {description.desciption}
          </p>
          <Button {...button} />
        </div>
      </div>
    </div>
  );
};

export default DescriptionCard;
