"use client";

import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import defaultPetImg from "@/public/assets/images/pets/petImg.png";
import defaultdogImg from "@/public/assets/images/pets/dog.png";
import defaultCatImg from "@/public/assets/images/pets/cat.png";
import defaultHamsterImg from "@/public/assets/images/pets/hamster.png";
import defaultBirdImg from "@/public/assets/images/pets/bird.png";
import defaultRabbitImg from "@/public/assets/images/pets/rabbit.png";

interface PetCardProps {
  pet: {
    petId: string;
    name: string;
    type: string;
    petImage: StaticImageData | string;
  };
}

export const petImageByType: Record<string, StaticImageData> = {
  dog: defaultdogImg,
  cat: defaultCatImg,
  bird: defaultBirdImg,
  rabbit: defaultRabbitImg,
  hamster: defaultHamsterImg,
};

const PetCard: React.FC<PetCardProps> = ({ pet }) => {
  const { name, petId, petImage, type } = pet;
  const router = useRouter();

  const handlePetProfileView = () => {
    router.push(`/user/profile/pet-profile/${petId}`);
  };

  const imageSrc = petImage || petImageByType[type.toLowerCase()] || defaultPetImg;

  return (
    <div
      className="w-[150px] border-2 border-[#E2DBC4] bg-[#E2DBC4] text-center rounded-2xl shadow-md cursor-pointer"
      onClick={handlePetProfileView}
    >
      <div className="bg-primary-3 rounded-2xl p-4 space-y-3">
        <Image
          src={imageSrc}
          alt="pet logo"
          width={96}
          height={96}
          className={`w-24 h-24 ${!petImage && "p-1"} mx-auto rounded-full bg-white object-contain`}
        />
        <h2 className="text-xl font-bold text-secondary-1">{name}</h2>
      </div>
      <div className="rounded-b-md pb-6"></div>
    </div>
  );
};

export default PetCard;
