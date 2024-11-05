"use client";

import React, { useEffect, useState } from "react";

interface Pet {
  petId: string;
  name: string;
  type: string;
}

interface PetProfileProps {
  params: {
    petProfileId: string;
  };
}

const PetProfile: React.FC<PetProfileProps> = ({ params }) => {
  const [pet, setPet] = useState<Pet | null>(null);
  const { petProfileId } = params;

  useEffect(() => {
    const storedPets = localStorage.getItem("pets");
    if (storedPets) {
      const pets: Pet[] = JSON.parse(storedPets);
      const foundPet = pets.find((pet) => pet.petId === petProfileId);
      setPet(foundPet || null);
    }
  }, [petProfileId]);

  return (
    <div className="flex flex-col w-full h-full items-center font-roca pb-20 flex-grow">
      <main className="flex flex-col w-full gap-8 md:gap-16 items-center px-8 md:px-32 lg:px-40">
        <h1>{pet?.name || "Pet not found"}</h1>
        <p>Type: {pet?.type}</p>
      </main>
    </div>
  );
};

export async function generateStaticParams() {
  // Example hardcoded pet IDs; replace this with your logic to fetch IDs.
  const pets = [
    { petId: "1" },
    { petId: "2" },
    { petId: "3" },
  ]; // Replace with actual pet fetching logic

  return pets.map((pet) => ({
    petProfileId: pet.petId,
  }));
}

export default PetProfile;
