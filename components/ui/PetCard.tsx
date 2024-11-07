"use client";

import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import petLogo from "@/public/assets/images/pets/petImg.png"

interface petCardProps {
  pet: {
    petId: string;
    name: string;
    type: string;
    petImg: StaticImageData;
  };
}

const PetCard: React.FC<petCardProps> = ({ pet }) => {
  const { name, petId, petImg } = pet;
  const router = useRouter();

  const handlePetProfileView = () => {
    router.push(`/user/profile/pet-profile/${petId}`);
  };
  return (
    <div
      className="w-[150px] border-2 border-[#E2DBC4] bg-[#E2DBC4] text-center rounded-2xl shadow-md cursor-pointer"
      onClick={handlePetProfileView}
    >
      <div className="bg-primary-3 rounded-2xl p-4 space-y-3">
        <Image src={petImg || petLogo} alt="pet logo" width={24} height={24} className="w-24 h-24 mx-auto rounded-full object-cover" />
        <h2 className="text-xl font-bold text-secondary-1">{name}</h2>
      </div>
      <div className="rounded-b-md pb-6">
      </div>
    </div>
  );
};

export default PetCard;
