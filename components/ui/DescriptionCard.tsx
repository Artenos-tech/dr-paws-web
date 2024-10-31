import { StaticImageData } from "next/image";
import React from "react";
import Button from "./Button";

interface descriptionCardProps {
  index: number;
  description: {
    image: StaticImageData;
    title: string;
    desciption: string;
    button: {
      buttonText: string;
      buttonBackground: string;
      buttonLink?: string;
    };
  };
}

const DescriptionCard: React.FC<descriptionCardProps> = ({
  index,
  description,
}) => {
  const { image, title, button } = description;
  return (
    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center px-8 md:px-32 lg:px-40 lg:gap-20">
      <div className={`w-full ${index % 2 !== 0 ? "lg:order-2" : ""}`}>
        <img
          src={image.src}
          alt={title + "image"}
          className="mx-auto rounded-md"
        />
      </div>
      <div className="w-full text-center lg:text-left text-primary-1 my-3 md:my-8 lg:my-0">
        <h1 className={`text-xl md:text-4xl`}>{title}</h1>
        <p className="text-sm md:text-base my-3 md:my-5">
          {description.desciption}
        </p>
        <Button {...button} />
      </div>
    </div>
  );
};

export default DescriptionCard;
