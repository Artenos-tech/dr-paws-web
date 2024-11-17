"use client";

import React, { useState } from "react";
import Image from "next/image";
import AddPetModal from "./AddPetModal";

import defaultPetImg from "@/public/assets/images/pets/petImg.png";
import defaultdogImg from "@/public/assets/images/pets/dog.png";
import defaultCatImg from "@/public/assets/images/pets/cat.png";
import defaultHamsterImg from "@/public/assets/images/pets/hamster.png";
import defaultBirdImg from "@/public/assets/images/pets/bird.png";
import defaultRabbitImg from "@/public/assets/images/pets/rabbit.png";
import defaultOtherPetImage from "@/public/assets/images/pets/petImg.png";

interface Pet {
  petId: string;
  name: string;
  petImage: string;
}

interface BookingCardProps {
  cardId: string;
  title: string;
  description: string;
  pets: Pet[];
  onCardSelection: (cardId: string, selectedPets: Pet[]) => void;
  isOpen: boolean;
  toggleCard: (cardId: string) => void; // Pass cardId to the toggle function
}

const BookingCard: React.FC<BookingCardProps> = ({
  cardId,
  title,
  description,
  pets,
  onCardSelection,
  isOpen,
  toggleCard,
}) => {
  const [selectedPets, setSelectedPets] = useState<Pet[]>([]);
  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);

  // Mapping for default pet images
  const defaultImages: Record<string, string> = {
    dog: defaultdogImg.src,
    cat: defaultCatImg.src,
    bird: defaultBirdImg.src,
    rabbit: defaultRabbitImg.src,
    hamster: defaultHamsterImg.src,
    other: defaultOtherPetImage.src,

  };

  const handlePetClick = (pet: Pet) => {
    let updatedPets: Pet[];
    if (selectedPets.some((p) => p.petId === pet.petId)) {
      updatedPets = selectedPets.filter((p) => p.petId !== pet.petId);
    } else {
      updatedPets = [...selectedPets, pet];
    }

    setSelectedPets(updatedPets);
    onCardSelection(cardId, updatedPets);
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
      petId: Date.now().toString(), // Unique ID for the pet
      name: newPet.name,
      petImage: defaultImages[petType] || defaultImages.ohter, // Use appropriate default image
    };

    const updatedPets = [...pets, newPetObject];
    setSelectedPets(updatedPets);
    onCardSelection(cardId, updatedPets);
    handleAddPetModalClose();
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent toggling other cards in the grid
    toggleCard(cardId); // Pass the specific cardId to toggle its state
  };

  return (
    <div
      className={`border rounded-lg p-4 shadow-sm cursor-pointer ${
        isOpen ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
      onClick={handleCardClick}
    >
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

      {isOpen && (
        <div>
          <h3 className="text-lg font-medium mb-2">Select your Pet/Pets:</h3>
          <div className="flex gap-4 flex-wrap">
            {pets.map((pet) => (
              <div
                key={pet.petId}
                className="relative cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePetClick(pet);
                }}
              >
                <Image
                  src={pet.petImage || defaultImages.default} // Use default image if no image is set
                  alt={pet.name}
                  width={70}
                  height={70}
                  className={`rounded-md min-w-[70px] min-h-[70px] ${
                    selectedPets.some((p) => p.petId === pet.petId)
                      ? "opacity-60 blur-sm"
                      : "opacity-100"
                  }`}
                />
                {selectedPets.some((p) => p.petId === pet.petId) && (
                  <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
                    ✓
                  </div>
                )}
                <p className="text-center mt-2">{pet.name}</p>
              </div>
            ))}

            <div
              className="flex flex-col items-center justify-center cursor-pointer border border-dashed border-gray-400 rounded-md w-[70px] h-[70px] text-gray-500"
              onClick={handleAddPetClick}
            >
              <span className="text-2xl font-bold">+</span>
              <span className="text-sm">Add Pet</span>
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
