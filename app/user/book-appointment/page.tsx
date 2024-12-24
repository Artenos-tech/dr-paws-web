"use client";

import React, { useState } from "react";
import SelectService, { BookingCategory } from "@/components/ui/SelectService";
import SelectClinic from "@/components/ui/SelectClinic";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import SelectVet from "@/components/ui/SelectVet";
import { Pet } from "@/context/UserContext";
import BookingConfirmed from "@/components/ui/BookingConfirmed";

const Booking: React.FC = () => {
  const [selectedAppointment, setSelectedAppointmentState] = useState<{
    selectedService: string | null;
    selectedSubtype: BookingCategory | null;
    selectedServiceIdToPet: Record<number, Pet | null>;
    isGrooming: boolean;
    selectedClinic: number | null;
    selectedLocation: string | null;
    selectedDoctor: Record<number, string> | null;
    selectedDoctorImage: string | null;
    selectedDate: Date | null;
    selectedSlot: string | null;
  }>({
    selectedService: null,
    selectedSubtype: null,
    selectedServiceIdToPet: {},
    isGrooming: false,
    selectedClinic: null,
    selectedLocation: null,
    selectedDoctor: null,
    selectedDoctorImage: null,
    selectedDate: null,
    selectedSlot: null,
  });

  const [openCard, setOpenCard] = useState<number | null>(null); // Persist this state
  const [isDisclaimerModalOpen, setIsDisclaimerModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);

  const handleClinicSelection = (clinicId: number, location: string) => {
    setSelectedAppointmentState((prev) => {
      // Toggle selection: if the clicked clinic is already selected, deselect it.
      if (prev.selectedClinic === clinicId) {
        return ({ ...prev, selectedClinic: null, selectedLocation: null });
      }
      return ({ ...prev, selectedClinic: clinicId, selectedLocation: location })
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

  const validateClinicSelection = (value: number | null): number => {
    if (value === null) {
      throw new Error("Clinic must be selected");
    }
    return value as number;
  }

  const validateSelectedData = (value: Record<number, Pet | null>): Record<number, Pet> => {
    if (
      value === null ||
      Object.keys(value).length === 0 ||
      Object.values(value).find((pet) => pet === null)) {
      throw new Error("Service and pet must be selected");
    }
    return value as Record<number, Pet>;
  }

  const validateServiceSelection = (value: string | null): string => {
    if (value === null) {
      throw new Error("Service must be selected");
    }
    return value as string;
  }

  const validateLocationSelection = (value: string | null): string => {
    if (value === null) {
      throw new Error("Location must be selected");
    }
    return value as string;
  }

  const validateDateSelection = (value: Date | null): Date => {
    if (value === null) {
      throw new Error("Date must be selected");
    }
    return value as Date;
  }

  const validateSlotSelection = (value: string | null): string => {
    if (value === null) {
      throw new Error("Slot must be selected");
    }
    return value as string;
  }

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

          {currentStep === 1 && (
            <SelectService
              selectedData={selectedAppointment.selectedServiceIdToPet}
              setServiceOptions={(selectedSvcIdToPet, serviceTitle, isGrooming, selectedSubtype) => {
                setSelectedAppointmentState((prev) => ({ 
                  ...prev, 
                  selectedServiceIdToPet: selectedSvcIdToPet,
                  selectedService: serviceTitle,
                  isGrooming: isGrooming,
                  selectedSubtype
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

          {
            currentStep === 3 &&
            (
              <SelectVet 
                onNext={goToNextStep} 
                selectedClinic={validateClinicSelection(selectedAppointment.selectedClinic)} 
                selectedServiceIdToPet={validateSelectedData(selectedAppointment.selectedServiceIdToPet)}
                selectedLocation={validateLocationSelection(selectedAppointment.selectedLocation)}
                selectedService={validateServiceSelection(selectedAppointment.selectedService)}
                selectedSubtype={selectedAppointment.selectedSubtype}
                isGrooming={selectedAppointment.isGrooming}
                setFinalAppointmentData={setSelectedAppointmentState}
              />
            )
          }
          {
            currentStep === 4 && 
            (
              <BookingConfirmed selectedAppointment={
                {
                  selectedData: validateSelectedData(selectedAppointment.selectedServiceIdToPet),
                  selectedClinic: validateClinicSelection(selectedAppointment.selectedClinic),
                  selectedLocation: validateLocationSelection(selectedAppointment.selectedLocation),
                  selectedService: validateServiceSelection(selectedAppointment.selectedService),
                  selectedDoctor: selectedAppointment.selectedDoctor,
                  selectedDate: validateDateSelection(selectedAppointment.selectedDate),
                  selectedSlot: validateSlotSelection(selectedAppointment.selectedSlot),
                  selectedDoctorImage: selectedAppointment.selectedDoctorImage
                }
              } />
            )
          }
        </div>
      </main>
    </div>
  );
};

export default Booking;