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
      className={`cursor-pointer rounded-md overflow-hidden ${
        isSelected ? "outline outline-2 outline-primary-1" : "shadow-md"
      }`}
    >
      <Image
        src={image.src}
        alt={`${clinicName} image`}
        layout="responsive"
        width={500}
        height={300}
      />
      <div className="px-6 pt-6 pb-12 bg-primary-3">
        <h1 className="text-primary-1 text-base">{clinicName}</h1>
        <div className="flex gap-2 text-primary-1 text-xs mt-2">
          <p>{services}</p>
        </div>
      </div>
    </div>
  );
};

export default SelectClinicCard;
