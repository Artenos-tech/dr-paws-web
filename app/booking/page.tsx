"use client";

import BookingCard from "@/components/ui/BookingCard";
import React, { useState, useEffect } from "react";
import birdDefault from '@/public/assets/images/pets/bird.png';
import catDefault from '@/public/assets/images/pets/cat.png';
import dogDefault from '@/public/assets/images/pets/dog.png';
import hamsterDefault from '@/public/assets/images/pets/hamster.png';
import rabbitDefault from '@/public/assets/images/pets/rabbit.png';



export interface Pet {
  petId: string;
  name: string;
  petImage: string;
}

export interface BookingCategory {
  id: string;
  title: string;
  description: string;
}

const bookingCategories: BookingCategory[] = [
  { id: "1", title: "Planned check-ups", description: "vaccination, health checkup..." },
  { id: "2", title: "Sickness & Emergency", description: "lethargy, vomiting, limping..." },
  { id: "3", title: "Diagnostics", description: "blood test, tick fever test..." },
  { id: "4", title: "Planned Surgeries", description: "vaccination, health checkup..." },
  { id: "5", title: "Dental", description: "lethargy, vomiting, limping..." },
  { id: "6", title: "Grooming", description: "haircut, spa..." },
  { id: "7", title: "Pet Services", description: "training, boarding..." },
];

const BookingPage: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedData, setSelectedData] = useState<Record<string, Pet[]>>({});
  const [openCard, setOpenCard] = useState<string[]>([]); // Track all open cards

  // Load pets from localStorage
  useEffect(() => {
    const savedPets = localStorage.getItem("pets");
    const parsedPets = savedPets ? JSON.parse(savedPets) : [];
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
      if (prevOpenCards?.includes(cardId)) {
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
            isOpen={openCard?.includes(category.id)} // Check if the card is open
            toggleCard={toggleCard} // Pass toggle function directly
          />
        ))}
      </div>

      {/* Next Button */}
      <div className="mt-8">
        <button
          onClick={handleNextButtonClick}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BookingPage;
