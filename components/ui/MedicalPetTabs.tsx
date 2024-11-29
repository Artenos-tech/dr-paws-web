import Image, { StaticImageData } from "next/image";
import React, { useEffect, useState } from "react";
import PetMedicalHistory from "./PetMedicalHistory";

interface medicalPetTabsProps {
  petsTab:
    | {
        petId: string;
        petName: string;
        petImage: string | StaticImageData;
      }[]
    | null;
}

const MedicalPetTabs: React.FC<medicalPetTabsProps> = ({ petsTab }) => {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  useEffect(() => {
    if (petsTab && petsTab.length > 0) {
      setActiveTab(petsTab[0].petId);
    }
  }, [petsTab]);
  const pet = petsTab && petsTab.find((pet) => pet.petId === activeTab);

  return (
    <div className="w-full h-full m-auto">
      <div className="flex flex-wrap items-center gap-3 w-full">
        {petsTab &&
          petsTab.map((pet) => (
            <div
              key={pet.petId}
              onClick={() => {
                setActiveTab(pet.petId);
              }}
              className={`bg-primary-3 w-[140px] py-2 rounded-lg flex justify-center items-center gap-3 ${
                activeTab === pet.petId && "bg-secondary-1"
              }`}
            >
              <Image
                src={pet.petImage}
                alt={pet.petName}
                width={35}
                height={35}
              />
              <h1
                className={`${
                  activeTab === pet.petId ? "text-white" : "text-secondary-1"
                }`}
              >
                {pet.petName}
              </h1>
            </div>
          ))}
        <br />
      </div>
      <div className="w-full h-full mt-12">
        {activeTab && (
          <PetMedicalHistory petId={activeTab} petName={pet?.petName} />
        )}
      </div>
    </div>
  );
};

export default MedicalPetTabs;
