"use client";

import React, { useState } from "react";
import Image from "next/image";
import AddPetModal from "./AddPetModal";
import { petImageByType } from "./PetCard";
import tickMark from "@/public/assets/images/Booking/tick-svgrepo-com.svg";

interface Pet {
  petId: string;
  name: string;
  type: string;
  petImage?: string;
}

interface BookingCardProps {
  cardId: string;
  title: string;
  description: string;
  pets: Pet[];
  onCardSelection: (cardId: string, selectedPet: Pet | null) => void;
  isOpen: boolean;
  toggleCard: (cardId: string) => void;
  setPets: React.Dispatch<React.SetStateAction<Pet[]>>;
  selectedData: Record<string, Pet | null>;
}

const BookingCard: React.FC<BookingCardProps> = ({
  cardId,
  title,
  description,
  pets,
  onCardSelection,
  isOpen,
  toggleCard,
  setPets,
  selectedData,
}) => {
  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);

  const handlePetClick = (pet: Pet) => {
    const isAlreadySelected = selectedData[cardId]?.petId === pet.petId;
    const newSelectedPet = isAlreadySelected ? null : pet;
    onCardSelection(cardId, newSelectedPet);
  };

  const handleAddPetClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAddPetModalOpen(true);
  };

  const handleAddPetModalClose = () => {
    setIsAddPetModalOpen(false);
  };

  const handleNewPetSubmit = (newPet: { name: string; type: string }) => {
    const petType = newPet.type.toLowerCase();
    const newPetObject: Pet = {
      petId: Date.now().toString(),
      name: newPet.name,
      type: petType,
      petImage: petImageByType[petType]?.src,
    };

    setPets((prevPets) => {
      const updatedPets = [...prevPets, newPetObject];
      localStorage.setItem("pets", JSON.stringify(updatedPets));
      return updatedPets;
    });

    handleAddPetModalClose();
  };

  return (
    <div
      className={`flex flex-col h-full rounded-sm shadow-sm cursor-pointer font-sans ${
        isOpen ? "border-secondary-1 border-2" : "border-gray-300"
      }`}
      onClick={() => toggleCard(cardId)}
    >
      <div className={`bg-primary-3 p-4 flex flex-col gap-2`}>
        <div className="flex items-center justify-between gap-1">
          <h2 className=" lg:text-xl font-sans font-semibold">{title}</h2>
          <input
            type="checkbox"
            checked={isOpen}
            readOnly
            className="w-6 h-6 cursor-pointer"
          />
        </div>
        <p className="text-gray-500 mb-4 truncate">{description}</p>
      </div>

      {isOpen && (
        <div className="p-4 ">
          <h3 className="text-lg font-medium mb-2">Select your Pet:</h3>
          <div className="flex gap-3 flex-wrap justify-center items-center">
            {pets.map((pet) => {
              const petImage =
                pet.petImage ||
                petImageByType[pet.type.toLowerCase()]?.src ||
                petImageByType["other"].src;

              const isSelected = selectedData[cardId]?.petId === pet.petId;

              return (
                <div
                  key={pet.petId}
                  className="relative cursor-pointer m-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePetClick(pet);
                  }}
                >
                  <Image
                    src={petImage}
                    alt={pet.name}
                    width={70}
                    height={70}
                    className={`rounded-full border-2 min-w-[70px] min-h-[70px] ${
                      isSelected ? "opacity-50 " : "opacity-100"
                    }`}
                  />
                  {isSelected && (
                    <div className="absolute inset-0 -top-7 flex items-center justify-center text-white font-bold">
                      <Image
                        src={tickMark.src}
                        alt="tick mark"
                        width={50}
                        height={50}
                      />
                    </div>
                  )}
                  <p className="text-center mt-2">{pet.name}</p>
                </div>
              );
            })}
            <div className="flex flex-col items-center justify-center gap-3">
              <div
                className="flex flex-col items-center rounded-full justify-center cursor-pointer border border-dashed border-gray-400 w-[70px] h-[70px] text-gray-500"
                onClick={handleAddPetClick}
              >
                <span className="text-2xl font-bold">+</span>
              </div>
              <div className="text-sm">Add Pet</div>
            </div>
          </div>
        </div>
      )}

      <AddPetModal
        isOpen={isAddPetModalOpen}
        onClose={handleAddPetModalClose}
        onSubmit={handleNewPetSubmit}
      />
    </div>
  );
};

export default BookingCard;
