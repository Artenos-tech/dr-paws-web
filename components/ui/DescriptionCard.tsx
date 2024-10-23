import { StaticImageData } from "next/image";
import { Roboto } from "@next/font/google";
import React from "react";
import Button from "./Button";

interface descriptionCardProps {
  index: number;
  description: {
    image: StaticImageData;
    title: string;
    desciption: string;
    button: {
      text: string;
      background: string;
    };
  };
}

const DescriptionCard: React.FC<descriptionCardProps> = ({
  index,
  description,
}) => {
  const { image, title, button } = description;
  return (
    <div className="flex items-center justify-between gap-20 ">
      <img src={image.src} alt={title + "image"} className="w-2/5 rounded-md" />

      <div className="w-full text-primary-1">
        <h1 className={` font-semibold text-4xl `}>{title}</h1>
        <p className="text-sm my-5">{description.desciption}</p>
        <Button {...button} />
      </div>
    </div>
  );
};

export default DescriptionCard;
