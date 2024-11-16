"use client";

import BookingCard from "@/components/ui/BookingCard";
import React, { useState, useEffect } from "react";



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

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Select Services</h1>
      <p className="text-gray-600 mb-6">Choose from our services:</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookingCategories.map((category) => (
          <BookingCard
            key={category.id}
            cardId={category.id}
            title={category.title}
            description={category.description}
            pets={pets}
            onCardSelection={handleCardSelection}
          />
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-medium mb-4">Selected Data:</h2>
        <pre>{JSON.stringify(selectedData, null, 2)}</pre>
      </div>
    </div>
  );
};

export default BookingPage;
