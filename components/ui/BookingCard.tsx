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
  onCardSelection: (cardId: string, selectedPet: Pet | null) => void; // Changed to handle single pet selection
  isOpen: boolean;
  toggleCard: (cardId: string) => void;
  setPets: React.Dispatch<React.SetStateAction<Pet[]>>;
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
}) => {
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null); // Only one pet can be selected
  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);

  const handlePetClick = (pet: Pet) => {
    const newSelectedPet = selectedPet?.petId === pet.petId ? null : pet; // Toggle selection
    setSelectedPet(newSelectedPet);
    onCardSelection(cardId, newSelectedPet);
  };

  const handleAddPetClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card toggle when clicking on Add Pet
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

    // Update pets in parent
    setPets((prevPets) => {
      const updatedPets = [...prevPets, newPetObject];
      if (typeof window !== "undefined") {
        localStorage.setItem("pets", JSON.stringify(updatedPets));
      }
      return updatedPets;
    });

    handleAddPetModalClose();
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent toggling other cards in the grid
    toggleCard(cardId); // Pass the specific cardId to toggle its state
  };

  return (
    <div
      className={`rounded-sm overflow-hidden shadow-sm cursor-pointer font-sans ${
        isOpen ? "border-secondary-1 border-2" : "border-gray-300"
      }`}
      onClick={handleCardClick}
    >
      <div className="bg-primary-3 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{title}</h2>
          <input
            type="checkbox"
            checked={isOpen}
            readOnly
            className="w-6 h-6 cursor-pointer"
            onClick={handleCardClick}
          />
        </div>
        <p className="text-gray-500 mb-4">{description}</p>
      </div>

      {isOpen && (
        <div className="p-4 ">
          <h3 className="text-lg font-medium mb-2">Select your Pet:</h3>
          <div className="flex gap-3 flex-wrap justify-center items-center">
            {pets.map((pet) => {
              const petImage =
                pet.petImage ||
                petImageByType[pet.type.toLowerCase()]?.src || // Fallback to type-based default image
                petImageByType["other"].src; // Fallback to "other" type

              return (
                <div
                  key={pet.petId}
                  className="relative cursor-pointer"
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
                      selectedPet?.petId === pet.petId
                        ? "opacity-50 "
                        : "opacity-100"
                    }`}
                  />
                  {selectedPet?.petId === pet.petId && (
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
