import React from "react";
import { Clinic } from "@/model/typeDefinitions";
import Image from "next/image";

interface ClinicItemProps {
  clinic: Clinic;
  isSelected: boolean;
  onSelect: () => void;
}

const SelectClinicCard: React.FC<ClinicItemProps> = ({
  clinic,
  isSelected,
  onSelect,
}) => {
  const { image, clinicName, services } = clinic;
  return (
    <div
      onClick={onSelect}
      className={`flex flex-col h-full cursor-pointer rounded-md  ${
        isSelected ? "outline outline-2 outline-secondary-1" : "shadow-md"
      }`}
    >
      <div className="image-container">
          <Image
            src={image.src}
            alt={clinicName + " image"}
            className="image rounded-t-md"
            layout="fill"
          />
        </div>
      <div className="flex flex-col flex-grow px-6 pt-6 pb-12 bg-primary-3">
        <h1 className="text-primary-1 text-base">{clinicName}</h1>
        <div className="flex gap-2 text-primary-1 text-xs mt-2">
          <p>{services}</p>
        </div>
      </div>
    </div>
  );
};

export default SelectClinicCard;
