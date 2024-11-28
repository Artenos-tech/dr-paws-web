// components/ui/DoctorCard.tsx
import React from "react";
import Image from "next/image";
import { Doctor } from "@/model/typeDefinitions";

interface SelectDoctorCardProps {
    doctor: Doctor;
    isSelected: boolean;
    onDoctorSelect: (doctorName: string) => void;
  }
  
  const SelectDoctorCard: React.FC<SelectDoctorCardProps> = ({ doctor, isSelected, onDoctorSelect }) => {
    const { name, image } = doctor;

  const handleCardClick = () => {
    onDoctorSelect(name); 
  };


  return (
    <div
    onClick={handleCardClick}
    className={`flex flex-col items-center rounded-lg  p-4 gap-4 bg-primary-3 ${isSelected ? `border-2 border-secondary-1` : `` }`}>
      <Image
        src={image}
        alt={name}
        width={100}
        height={100}
        className="rounded-full object-cover"
      />
      <h2 className="text-center text-lg font-semibold">{name}</h2>
    </div>
  );
};

export default SelectDoctorCard;
