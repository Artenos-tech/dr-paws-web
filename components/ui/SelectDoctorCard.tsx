// components/ui/DoctorCard.tsx
import React from "react";
import Image from "next/image";
import { doctorImagesMap } from "@/model/mockData";

type VetportDoctor = {
  id: number;
  name: string;
  image: string;
  clinicids: number[];
}
interface SelectDoctorCardProps {
  doctor: VetportDoctor;
  isSelected: boolean;
  onDoctorSelect: (doctorId: number, doctorName: string) => void;
}

const SelectDoctorCard: React.FC<SelectDoctorCardProps> = ({
  doctor,
  isSelected,
  onDoctorSelect,
}) => {
  const { name, image, id } = doctor;

  const handleCardClick = () => {
    onDoctorSelect(id, name);
  };

  return (
    <div
  onClick={handleCardClick}
  className={` min-w-[160px] min-h-[240px]  flex flex-col items-center justify-between rounded-lg px-4 pt-6 gap-4 bg-primary-3 ${
    isSelected ? `border-2 border-secondary-1` : ``
  }`}
>
  {/* Image Container */}
  {/* <div className="w-[120px] h-[120px] border flex items-center justify-center overflow-hidden ">
    
  </div> */}
  <Image
      src={doctorImagesMap[image]}
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
