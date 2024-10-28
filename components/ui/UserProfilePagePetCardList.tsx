import React from "react";
import PetCard from "@/components/ui/UserProfilePagePetCard";
import { petMockData } from "../../model/mockData";

const PetCardList: React.FC = () => {
  return (
    <div className="flex space-x-4">
      {petMockData.map((pet, index) => (
        <PetCard key={index} petData={pet} />
      ))}
    </div>
  );
};

export default PetCardList;
