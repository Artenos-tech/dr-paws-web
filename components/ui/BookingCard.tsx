"use client";

import React, { useState } from "react";
import Image from "next/image";

interface Pet {
  petId: string;
  name: string;
  petImage: string; // URL or base64 string
}

interface BookingCardProps {
  cardId: string;
  title: string;
  description: string;
  pets: Pet[];
  onCardSelection: (cardId: string, selectedPets: Pet[]) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({
  cardId,
  title,
  description,
  pets,
  onCardSelection,
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const [selectedPets, setSelectedPets] = useState<Pet[]>([]);

  const toggleCardSelection = () => {
    setIsSelected(!isSelected);

    // If deselected, clear selected pets
    if (isSelected) {
      setSelectedPets([]);
      onCardSelection(cardId, []);
    }
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

  return (
    <div
      className={`border rounded-lg p-4 shadow-sm cursor-pointer ${
        isSelected ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
      onClick={toggleCardSelection}
    >
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-gray-500 mb-4">{description}</p>

      {isSelected && (
        <div>
          <h3 className="text-lg font-medium mb-2">Select your Pet/Pets:</h3>
          <div className="flex gap-4 flex-wrap">
            {pets.map((pet) => (
              <div
                key={pet.petId}
                className={`relative cursor-pointer`}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click
                  handlePetClick(pet);
                }}
              >
                <Image
                  src={pet.petImage}
                  alt={pet.name}
                  width={70}
                  height={70}
                  className={`rounded-md min-w-[70px] min-h-[70px] ${
                    selectedPets.some((p) => p.petId === pet.petId)
                      ? "opacity-60 blur-"
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
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCard;
