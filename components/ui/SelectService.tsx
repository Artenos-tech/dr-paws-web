"use client";

import React, { useEffect, useState } from "react";
import BookingCard from "@/components/ui/BookingCard";
import BookingModal from "@/components/ui/BookingModal";
import CustomButton from "./CustomButton";
import { Pet, useUserContext } from "@/context/UserContext";
import { useAPICall } from "@/hooks/apicall";
import api from "@/services/api";
import Loader from "./Loader";

export interface BookingCategory {
  id: string;
  title: string;
  description: string;
}

interface SelectServiceProps {
  selectedData: Record<number, Pet | null>;
  setSelectedData: (
    newSelectedData: Record<number, Pet | null>,
    cardTitle: string | null,
    isGrooming: boolean,
    selectedSubtype: Record<number, string | null>
  ) => void;
  openCard: number | null;
  setOpenCard: React.Dispatch<React.SetStateAction<number | null>>;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onNext: () => void;
}

const SelectService: React.FC<SelectServiceProps> = ({
  selectedData,
  setSelectedData,
  openCard,
  setOpenCard,
  isModalOpen,
  setIsModalOpen,
  onNext,
}) => {
  const {  updateUserPetsHandler, user } = useUserContext();
  const [subtypes, setSubtypes] = useState<BookingCategory[]>([]);
  const [selectedSubtype, setSelectedSubtype] = useState<Record<number, string | null>>({});

  const { call: getPetsAPI, result: getPetsAPIResult} = useAPICall(
    api.getPets
  );

  const {
    call: callGetAppointmentServices,
    result: getAppointmentServicesResult,
    loading: loadingServices
  } = useAPICall(api.getAppointmentServices)

  useEffect(() => {
    callGetAppointmentServices({});
    fetchPets();
  }, []);

  const fetchPets = async () => {
    if (user) {
      const response = await getPetsAPI({});
      if (response.ok) {
        const pets = response.value.body.pets.map((pet) => ({
          ...pet,
          profileImage: pet.profile_image,
          vetPortId: pet.vetport_id,
          gender: pet.gender,
        }));

        if (pets) {
          updateUserPetsHandler(pets);
        }
      }
    }
  };

  const pets =
    getPetsAPIResult?.ok &&
    getPetsAPIResult.value.body.pets.map((pet) => ({
      ...pet,
      profileImage: pet.profile_image,
      vetPortId: pet.vetport_id,
    }));

  const ServiceTabsData = getAppointmentServicesResult?.ok
    ? getAppointmentServicesResult.value.body.appointmentTypes
    : [];

  const handleCardSelection = (cardId: number, cardTitle: string, selectedPet: Pet | null, isGrooming: boolean) => {
    setSelectedData({ [cardId]: selectedPet }, cardTitle, isGrooming, selectedSubtype);
  };

  const toggleCard = (cardId: number, isGrooming: boolean) => {
    setOpenCard((prevOpenCard) => {
      if (prevOpenCard !== null) {
        setSelectedData(
          {
            [prevOpenCard]: null,
          },
          null,
          isGrooming,
          selectedSubtype
        );
      }
      const selectedCard = ServiceTabsData.find((category) => category.vetPortId === cardId);

      if (selectedCard && selectedCard.isGrooming && selectedCard.subtypes && prevOpenCard !== cardId) {
        setSubtypes(selectedCard.subtypes);
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

  if (loadingServices) {
    return <div><Loader /></div>;
  }
  return (
    <div className="w-full h-full">
      <h1 className="text-2xl mb-2">Select Services</h1>
      <p className="text-gray-600 mb-12">Choose from our services:</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
        {ServiceTabsData.map((category) => (
          <BookingCard
            key={category.id}
            cardId={category.vetPortId}
            title={category.title}
            description={category.description}
            onCardSelection={handleCardSelection}
            isOpen={openCard === category.vetPortId}
            isGrooming={category.isGrooming}
            toggleCard={toggleCard}
            selectedData={selectedData}
            pets={pets || []}
            fetchPets={fetchPets}
          />
        ))}
      </div>
      <div className="my-16 w-full flex item-center justify-center">
        <CustomButton
          buttonText="Next"
          buttonBackground="bg-secondary-1"
          buttonClickEvent={handleNext}
          disabled={isButtonDisabled}
        />
      </div>

      <BookingModal
        isOpen={isModalOpen}
        subtypes={subtypes}
        onClose={() => setIsModalOpen(false)}
        onSelect={(option: Record<number, string | null>) => setSelectedSubtype(option)}
      />
    </div>
  );
};

export default SelectService;
