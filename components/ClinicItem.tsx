import React from "react";
import Button from "./Button";
import { StaticImageData } from "next/image";

interface ClinicItemProps {
  clinic: {
    image: StaticImageData;
    clinicName: string;
    branch: string;
    description: string;
    button: {
      text: string;
      background: string;
      rounded: boolean;
    };
  };
  background: string;
}

const ClinicItem: React.FC<ClinicItemProps> = ({ clinic, background }) => {
  const { image, clinicName, branch, description, button } = clinic;
  return (
    <div className={`${background} w-56 shadow-md rounded-md`}>
      <img src={image.src} alt={clinicName + "image"} className="rounded-t-md" />
      <div className="p-2">
        <h1 className="text-primary-1 text-base font-semibold">{clinicName}</h1>
        <div className="flex gap-2 text-primary-1 text-xs mt-2 ">
          <p>{branch}</p> |
          <p>{description}</p>
        </div>
      </div>
      <Button {...button} />
    </div>
  );
};

export default ClinicItem;
