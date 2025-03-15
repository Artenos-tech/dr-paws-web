import React from "react";
import Image from "next/image";
import { clinicImagesMap } from "@/model/mockData";
import defaultClinicImg from "@/public/assets/images/clinic/ClinicImage.png";

type VetportClinic = {
  image: {
    type: "url" | "ref";
    value: string;
  };
  services: string;
  id: number;
  name: string;
  location: string;
};
interface ClinicItemProps {
  clinic: VetportClinic;
  isSelected: boolean;
  onSelect: () => void;
}

const SelectClinicCard: React.FC<ClinicItemProps> = ({
  clinic,
  isSelected,
  onSelect,
}) => {
  const { image, name, services } = clinic;
  return (
    <div
      onClick={onSelect}
      className={`flex flex-col h-full cursor-pointer rounded-md  ${
        isSelected ? "outline outline-2 outline-secondary-1" : "shadow-md"
      }`}
    >
      <div className="image-container">
        <Image
          src={
            image.value === "unknown"
              ? defaultClinicImg
              : image.type === "ref"
                ? clinicImagesMap[image.value]
                : image.value
          }
          alt={name + " image"}
          className="image rounded-t-md"
          height={200}
          width={100}
        />
      </div>
      <div className="flex flex-col flex-grow px-6 pt-6 pb-12 bg-primary-3">
        <h1 className="text-primary-1 text-lg">{name}</h1>
        <div className="flex gap-2 text-primary-1 text-base mt-2">
          <p>{services}</p>
        </div>
      </div>
    </div>
  );
};

export default SelectClinicCard;
