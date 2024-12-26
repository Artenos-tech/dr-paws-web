"use client";

import React, { useState } from "react";
import SelectService, { BookingCategory } from "@/components/ui/SelectService";
import SelectClinic from "@/components/ui/SelectClinic";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import SelectVet, {SelectedVet} from "@/components/ui/SelectVet";
import { Pet } from "@/context/UserContext";
import BookingConfirmed from "@/components/ui/BookingConfirmed";

const Booking: React.FC = () => {
  const [selectedAppointment, setSelectedAppointmentState] = useState<{
    selectedServiceId: number | null;
    selectedService: string | null;
    selectedSubtype: BookingCategory | null;
    selectedPet: Pet | null;
    isGrooming: boolean;
    selectedClinic: number | null;
    selectedLocation: string | null;
    selectedDoctor: SelectedVet | null;
    selectedDate: Date | null;
    selectedSlot: string | null;
  }>({
    selectedServiceId: null,
    selectedService: null,
    selectedSubtype: null,
    selectedPet: null,
    isGrooming: false,
    selectedClinic: null,
    selectedLocation: null,
    selectedDoctor: null,
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

  const validatePetSelection = (value: Pet | null): Pet => {
    if (value === null) {
      throw new Error("Pet must be selected");
    }
    return value as Pet;
  }

  const validateServiceIdSelection = (value: number | null): number => {
    if (value === null) {
      throw new Error("Service must be selected");
    }
    return value as number;
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
              selectedPet={selectedAppointment.selectedPet}
              setServiceOptions={(svcId, svcTitle, pet, isGrooming, selectedSubtype) => {
                setSelectedAppointmentState((prev) => ({ 
                  ...prev, 
                  selectedServiceId: svcId,
                  selectedService: svcTitle,
                  selectedPet: pet,
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
                selectedSvcId={validateServiceIdSelection(selectedAppointment.selectedServiceId)}
                selectedPet={validatePetSelection(selectedAppointment.selectedPet)}
                selectedLocation={validateLocationSelection(selectedAppointment.selectedLocation)}
                selectedService={validateServiceSelection(selectedAppointment.selectedService)}
                selectedSubtype={selectedAppointment.selectedSubtype}
                isGrooming={selectedAppointment.isGrooming}
                setFinalAppointmentData={appData => {
                  setSelectedAppointmentState(prev => ({...prev, ...appData}))
                }}
              />
            )
          }
          {
            currentStep === 4 &&
            (
              <BookingConfirmed
                isGroomingAppointment={selectedAppointment.isGrooming}
                selectedAppointment={{
                  selectedSvcId: validateServiceIdSelection(selectedAppointment.selectedServiceId),
                  selectedService: validateServiceSelection(selectedAppointment.selectedService),
                  selectedPet: validatePetSelection(selectedAppointment.selectedPet),
                  selectedClinic: validateClinicSelection(selectedAppointment.selectedClinic),
                  selectedLocation: validateLocationSelection(selectedAppointment.selectedLocation),
                  selectedVet: selectedAppointment.selectedDoctor,
                  selectedDate: validateDateSelection(selectedAppointment.selectedDate),
                  selectedSlot: validateSlotSelection(selectedAppointment.selectedSlot),
                  selectedDoctorImage: selectedAppointment.selectedDoctor ?
                    selectedAppointment.selectedDoctor.image
                    : null
                }}
              />
            )
          }
        </div>
      </main>
    </div>
  );
};

export default Booking;