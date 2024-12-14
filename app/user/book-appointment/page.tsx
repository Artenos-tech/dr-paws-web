"use client";

type BookingDetails = {
  doctor: string | null;
  date: Date | null;
  slot: string | null;
};


import React, { useState } from "react";
import SelectService from "@/components/ui/SelectService";
import SelectClinic from "@/components/ui/SelectClinic";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import SelectVet from "@/components/ui/SelectVet";
import { Pet, useUserContext } from "@/context/UserContext";
import BookingDetails from "@/components/ui/BookingDetails";

const Booking: React.FC = () => {
  const [selectedData, setSelectedData] = useState<Record<string, Pet | null>>(
    {}
  );
  const [selectedClinic, setSelectedClinic] = useState<string | null>(null);

  const [openCard, setOpenCard] = useState<string | null>(null); // Persist this state
  const [isDisclaimerModalOpen, setIsDisclaimerModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const { userPets } = useUserContext();

  const handleClinicSelection = (clinicId: string) => {
    // Toggle selection: if the clicked clinic is already selected, deselect it.
    setSelectedClinic((prevSelected) =>
      prevSelected === clinicId ? null : clinicId
    );
  };

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
      <main className="flex flex-col items-center w-full mt-4 lg:mt-16 px-8 md:px-32 lg:px-20 xl:px-40">
        <div className="w-full">
          {(currentStep > 1 && currentStep !== 4) && (
            <button
              type="button"
              onClick={goToPrevStep}
              className="flex gap-1 mb-4 items-center self-start"
            >
              <MdOutlineKeyboardArrowLeft /> Back
            </button>
          )}

          {currentStep === 1 && userPets && (
            <SelectService
              selectedData={selectedData}
              setSelectedData={setSelectedData}
              openCard={openCard}
              setOpenCard={setOpenCard}
              isModalOpen={isDisclaimerModalOpen}
              setIsModalOpen={setIsDisclaimerModalOpen}
              onNext={goToNextStep}
            />
          )}

          {currentStep === 2 && 
          <SelectClinic 
            onNext={goToNextStep} 
            selectedClinic={selectedClinic} 
            handleClinicSelection={handleClinicSelection}
          />
          }

          {currentStep === 3 && <SelectVet onNext={goToNextStep} selectedClinic={selectedClinic} selectedData={selectedData} />}
          {currentStep === 4 && <BookingDetails />}
        </div>
      </main>
    </div>
  );
};

export default Booking;