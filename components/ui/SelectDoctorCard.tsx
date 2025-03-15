// components/ui/DoctorCard.tsx
import React from "react";
import Image from "next/image";
import { doctorImagesMap } from "@/model/mockData";
import defaultVetImg from "@/public/assets/images/clinic/doctorFemale.webp";

type VetportDoctor = {
  id: number;
  name: string;
  image: {
    type: "url" | "ref";
    value: string;
  };
};
interface SelectDoctorCardProps {
  doctor: VetportDoctor;
  isSelected: boolean;
  onDoctorSelect: (
    doctorId: number,
    doctorName: string,
    doctorImage: { type: "url" | "ref"; value: string },
  ) => void;
}

const SelectDoctorCard: React.FC<SelectDoctorCardProps> = ({
  doctor,
  isSelected,
  onDoctorSelect,
}) => {
  const { name, image, id } = doctor;

  const handleCardClick = () => {
    onDoctorSelect(id, name, image);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`cursor-pointer min-w-[160px] min-h-[260px]  flex flex-col items-center justify-between rounded-lg px-4 pt-6 gap-4 bg-primary-3 border-2 ${
        isSelected ? `border-secondary-1` : ``
      }`}
    >
      <Image
        src={
          image.value === "unknown"
            ? defaultVetImg
            : image.type === "ref"
              ? doctorImagesMap[image.value]
              : image.value
        }
        alt={name}
        width={120}
        height={120}
        className="w-[120px] h-[120px] object-contain rounded-full aspect-[4/3] "
      />

      {/* Name */}
      <h2 className="flex-1 pt-2 text-center text-lg font-semibold">{name}</h2>
    </div>
  );
};

export default SelectDoctorCard;
