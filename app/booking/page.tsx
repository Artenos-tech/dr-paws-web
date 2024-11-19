"use client";

import React, { useState, useEffect } from "react";
import SelectService, { Pet } from "@/components/ui/SelectService";
import Button from "@/components/ui/Button";
import SelectClinic from "@/components/ui/SelectClinic";

const Booking: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedData, setSelectedData] = useState<Record<string, Pet | null>>(
    {}
  );
  const [openCard, setOpenCard] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const savedPets = localStorage.getItem("pets");
    const parsedPets: Pet[] = savedPets
      ? JSON.parse(savedPets).map((pet: any) => ({
          ...pet,
          type: pet.type || "other",
          petImage: pet.petImage || undefined,
        }))
      : [];
    setPets(parsedPets);
  }, []);

  return (
    <div className="font-roca pb-20">
      <main className="flex flex-col gap-[80px] row-start-2 items-center w-full mt-4 lg:mt-24 px-8 md:px-32 lg:px-20 xl:px-40">
        <div>
          <SelectService
        pets={pets}
        setPets={setPets}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
        openCard={openCard}
        setOpenCard={setOpenCard}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
          {/* <SelectClinic /> */}
        </div>
      </main>
    </div>
  );
};

export default Booking;
