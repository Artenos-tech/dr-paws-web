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
  const [selectedAppointment, setSelectedAppointmentState] = useState<{
    selectedData: Record<number, Pet | null>;
    selectedClinic: number | null;
    selectedLocation: string | null;
    selectedDoctor: number | null;
    selectedDate: Date | null;
    selectedSlot: string | null;
  }>({
    selectedData: {}, 
    selectedClinic: null,
    selectedLocation: null,
    selectedDoctor: null,
    selectedDate: null,
    selectedSlot: null,
  });

  const [openCard, setOpenCard] = useState<number | null>(null); // Persist this state
  const [isDisclaimerModalOpen, setIsDisclaimerModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const { userPets } = useUserContext();

  const handleClinicSelection = (clinicId: number, location: string) => {
    setSelectedAppointmentState((prev) => {
      // Toggle selection: if the clicked clinic is already selected, deselect it.
      if (prev.selectedClinic === clinicId) {
        return ({ ...prev, selectedClinic: null, selectedLocation: null });
      }
      return ({ ...prev, selectedClinic: clinicId, selectedLocation: location });
    });
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
              selectedData={selectedAppointment.selectedData}
              setSelectedData={(newSelectedData) => {
                setSelectedAppointmentState((prev) => ({ 
                  ...prev, 
                  selectedData: newSelectedData 
                }));
              }}
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
            selectedClinic={selectedAppointment.selectedClinic} 
            handleClinicSelection={handleClinicSelection}
          />
          }

          {currentStep === 3 && (
            <SelectVet 
              onNext={goToNextStep} 
              selectedClinic={selectedAppointment.selectedClinic} 
              selectedData={selectedAppointment.selectedData}
              selectedLocation={selectedAppointment.selectedLocation}
              setFinalAppointmentData={setSelectedAppointmentState}
            />
          )}
          {currentStep === 4 && (
            <BookingDetails selectedAppointment={selectedAppointment} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Booking;