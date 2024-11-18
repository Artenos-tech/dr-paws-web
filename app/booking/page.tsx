"use client";

import BookingCard from "@/components/ui/BookingCard";
import BookingModal from "@/components/ui/BookingModal";
import Button from "@/components/ui/Button";
import React, { useState, useEffect } from "react";

export interface Pet {
  petId: string;
  name: string;
  type: string; // Added type to match the updated BookingCard
  petImage?: string; // petImage is optional, as default images may be used
}

export interface BookingCategory {
  id: string;
  title: string;
  description: string;
}

const bookingCategories: BookingCategory[] = [
  {
    id: "Planned Visits",
    title: "Planned Visits",
    description: "vaccination, health checkup...",
  },
  {
    id: "Sickness & Emergency",
    title: "Sickness & Emergency",
    description: "lethargy, vomiting, limping...",
  },
  {
    id: "Diagnostics",
    title: "Diagnostics",
    description: "blood test, tick fever test...",
  },
  {
    id: "Surgeries",
    title: "Surgeries",
    description: "vaccination, health checkup...",
  },
  {
    id: "Physiotherapy",
    title: "Physiotherapy",
    description: "lethargy, vomiting, limping...",
  },
  { 
    id: "Grooming", 
    title: "Grooming", 
    description: "haircut, spa..." },
  {
    id: "Pet Services",
    title: "Pet Services",
    description: "training, boarding...",
  },
];

const BookingPage: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedData, setSelectedData] = useState<Record<string, Pet[]>>({});
  const [openCard, setOpenCard] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load pets from localStorage
  useEffect(() => {
    const savedPets = localStorage.getItem("pets");
    const parsedPets: Pet[] = savedPets
      ? JSON.parse(savedPets).map((pet: any) => ({
          ...pet,
          type: pet.type || "other", // Ensure all pets have a type
          petImage: pet.petImage || undefined, // Optional petImage field
        }))
      : [];
    setPets(parsedPets);
  }, []);

  const handleCardSelection = (cardId: string, selectedPets: Pet[]) => {
    setSelectedData((prevState) => ({
      ...prevState,
      [cardId]: selectedPets,
    }));
  };

  const toggleCard = (cardId: string) => {
    setOpenCard((prevOpenCards) => {
      if (prevOpenCards.includes(cardId)) {
        // If the card is already open, close it
        return prevOpenCards.filter((id) => id !== cardId);
      } else {
        // Otherwise, open the card
        return [...prevOpenCards, cardId];
      }
    });
  };

  const handleNextButtonClick = () => {
    console.log("Selected Cards and Pets:", selectedData);
  };

  const isButtonDisabled = Object.keys(openCard).length === 0;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Select Services</h1>
      <p className="text-gray-600 mb-6">Choose from our services:</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
        {bookingCategories.map((category) => (
          <BookingCard
            key={category.id}
            cardId={category.id}
            title={category.title}
            description={category.description}
            pets={pets}
            onCardSelection={handleCardSelection}
            isOpen={openCard.includes(category.id)} // Check if the card is open
            toggleCard={toggleCard} // Pass toggle function directly
          />
        ))}
      </div>

      <div className="mt-8 w-full flex item-center justify-center p-4">
        <Button
          buttonText="Next"
          buttonBackground="bg-secondary-1"
          buttonClickEvent={handleNextButtonClick}
          disabled={isButtonDisabled} // Disable button if no cards are selected
        />
      </div>
      <button onClick={() => setIsModalOpen(true)}>open modal</button>
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // Close modal
        selectedItems={bookingCategories.filter((category) =>
          openCard.includes(category.id)
        )}
        onNext={() => console.log("Proceeding to next step")}
      />
    </div>
  );
};

export default BookingPage;
