"use client";
import BackButton from "@/components/ui/BackButton";
import MedicalPetTabs from "@/components/ui/MedicalPetTabs";
import { Pet } from "@/model/typeDefinitions";
import React, { useEffect, useState } from "react";

const page = () => {
  const [pets, setPets] = useState<Pet[] | null>(null);

  useEffect(() => {
    const pets = localStorage.getItem("pets");
    if (pets) {
      setPets(JSON.parse(pets));
    }
  }, []);

  const petsTab =
    pets &&
    pets.map((pet: Pet) => ({
      petId: pet.petId,
      petName: pet.name,
      petImage: pet.petImage,
    }));

  return (
    <div className="flex flex-col w-full h-full items-center justify-items-center font-roca pb-20">
      <main className="flex flex-col gap-[20px] row-start-2 items-center w-full h-full px-8 md:px-32 lg:px-20 xl:px-40">
        <BackButton />

        <MedicalPetTabs petsTab={petsTab} />
      </main>
    </div>
  );
};

export default page;
