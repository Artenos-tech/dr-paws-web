"use client";

import React from "react";
import BookingCard from "@/components/ui/BookingCard";
import BookingModal from "@/components/ui/BookingModal";
import { bookingCategories } from "@/model/mockData";
import Button from "./Button";

export interface Pet {
  petId: string;
  name: string;
  type: string;
  petImage?: string;
}

export interface BookingCategory {
  id: string;
  title: string;
  description: string;
}

interface SelectServiceProps {
  pets: Pet[];
  setPets: React.Dispatch<React.SetStateAction<Pet[]>>;
  selectedData: Record<string, Pet | null>;
  setSelectedData: React.Dispatch<
    React.SetStateAction<Record<string, Pet | null>>
  >;
  openCard: string | null;
  setOpenCard: React.Dispatch<React.SetStateAction<string | null>>;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onNext: () => void;
}

const SelectService: React.FC<SelectServiceProps> = ({
  pets,
  setPets,
  selectedData,
  setSelectedData,
  openCard,
  setOpenCard,
  isModalOpen,
  setIsModalOpen,
  onNext,
}) => {
  const handleCardSelection = (cardId: string, selectedPet: Pet | null) => {
    setSelectedData({ [cardId]: selectedPet });
  };

  const toggleCard = (cardId: string) => {
    setOpenCard((prevOpenCard) => {
      if (prevOpenCard && prevOpenCard !== cardId) {
        setSelectedData((prevSelectedData) => ({
          ...prevSelectedData,
          [prevOpenCard]: null,
        }));
      }

      if (cardId === "Surgeries") {
        setIsModalOpen(true);
      }

      return prevOpenCard === cardId ? null : cardId;
    });
  };

  const isButtonDisabled = !Object.values(selectedData).some(
    (selectedPet) => selectedPet !== null
  );

  const handleNext = () => {
    console.log("Proceeding to next step with:", selectedData);
    onNext();
  };

  return (
    <div className="w-full h-full">
      <h1 className="text-2xl font-bold mb-4">Select Services</h1>
      <p className="text-gray-600 mb-6">Choose from our services:</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start ">
        {bookingCategories.map((category) => (
          <BookingCard
            key={category.id}
            cardId={category.id}
            title={category.title}
            description={category.description}
            pets={pets}
            onCardSelection={handleCardSelection}
            isOpen={openCard === category.id}
            toggleCard={toggleCard}
            setPets={setPets}
          />
        ))}
      </div>
      <div className="my-16 w-full flex item-center justify-center m-8">
      <Button
        buttonText="Next"
        buttonBackground="bg-secondary-1"
        buttonClickEvent={handleNext}
        disabled={isButtonDisabled}
      />
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onNext={() => console.log("Proceeding to next step")}
      />
    </div>
  );
};

export default SelectService;
