import React from "react";
import Image from "next/image";
import { clinicImagesMap } from "@/model/mockData";

type VetportClinic = {
  image: string;
  services: string;
  id: number;
  name: string;
  location: string;
}
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
            src={clinicImagesMap[image]}
            alt={name + " image"}
            className="image rounded-t-md"
            layout="fill"
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
