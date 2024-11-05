"use client";

import { useRouter } from "next/navigation";
import React from "react";

interface petCardProps {
  pet: {
    petId: string;
    name: string;
    type: string;
  };
}

const PetCard: React.FC<petCardProps> = ({ pet }) => {
  const { name, type, petId } = pet;
  const router = useRouter();

  const handlePetProfileView = () => {
    router.push(`/user/profile/pet-profile/${petId}`);
  };
  return (
    <div
      className="w-[150px] p-4 border border-secondary-2 text-center rounded-lg shadow-md"
      onClick={handlePetProfileView}
    >
      <h2 className="text-xl font-bold text-secondary-1">{name}</h2>
      <p className="text-sm text-secondary-1">{type}</p>
    </div>
  );
};

export default PetCard;
