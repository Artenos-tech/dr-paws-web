"use client";

import React, { useState, useEffect } from "react";
import SelectService, { Pet } from "@/components/ui/SelectService";
import SelectClinic from "@/components/ui/SelectClinic";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import SelectVet from "@/components/ui/SelectVet";


const Booking: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedData, setSelectedData] = useState<Record<string, Pet | null>>(
    {}
  );
  const [openCard, setOpenCard] = useState<string | null>(null); // Persist this state
  const [isDisclaimerModalOpen, setIsDisclaimerModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);

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

  const goToNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  return (
    <div className="font-roca pb-20 h-full w-full">
      <main className="flex flex-col gap-[40px] row-start-2 items-center w-full mt-4 lg:mt-24 px-8 md:px-32 lg:px-20 xl:px-40">
        <div className="w-full">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={goToPrevStep}
              className="flex gap-1 my-4 items-center self-start"
            >
              <MdOutlineKeyboardArrowLeft /> Back
            </button>
          )}

          {currentStep === 1 && (
            <SelectService
              pets={pets}
              setPets={setPets}
              selectedData={selectedData}
              setSelectedData={setSelectedData}
              openCard={openCard}
              setOpenCard={setOpenCard}
              isModalOpen={isDisclaimerModalOpen}
              setIsModalOpen={setIsDisclaimerModalOpen}
              onNext={goToNextStep}
            />
          )}

          {currentStep === 2 && <SelectClinic onNext={goToNextStep} />}

          {currentStep === 3 && <SelectVet />}
        </div>
      </main>
    </div>
  );
};

export default Booking;