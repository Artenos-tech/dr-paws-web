"use client"

import React, { useState } from "react"
import SelectService, { BookingCategory } from "@/components/ui/SelectService"
import SelectClinic from "@/components/ui/SelectClinic"
import { MdOutlineKeyboardArrowLeft } from "react-icons/md"
import SelectVet, { SelectedVet } from "@/components/ui/SelectVet"
import { Pet } from "@/context/UserContext"
import BookingConfirmed from "@/components/ui/BookingConfirmed"

const Booking: React.FC = () => {
  const [selectedAppointment, setSelectedAppointmentState] = useState<{
    selectedServiceId: string | null
    selectedService: string | null
    selectedSubtype: BookingCategory | null
    selectedPet: Pet | null
    isGrooming: boolean
    selectedClinic: string | null
    selectedLocation: string | null
    selectClinicContact: string | null
    selectedDoctor: SelectedVet | null
    selectedDate: Date | null
    selectedSlot: string | null
    selectedSlotEnd: string | null
    appliedCoupon: string | null
  }>({
    selectedServiceId: null,
    selectedService: null,
    selectedSubtype: null,
    selectedPet: null,
    isGrooming: false,
    selectedClinic: null,
    selectedLocation: null,
    selectClinicContact: null,
    selectedDoctor: null,
    selectedDate: null,
    selectedSlot: null,
    selectedSlotEnd: null,
    appliedCoupon: null
  })

  const [openCard, setOpenCard] = useState<string | null>(null)
  const [isDisclaimerModalOpen, setIsDisclaimerModalOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState<number>(1)

  const handleClinicSelection = (
    clinicId: string,
    location: string,
    contact: string,
  ) => {
    setSelectedAppointmentState((prev) => {
      // Toggle selection: if the clicked clinic is already selected, deselect it.
      if (prev.selectedClinic === clinicId) {
        return {
          ...prev,
          selectedClinic: null,
          selectedLocation: null,
          selectClinicContact: null,
        }
      }
      return {
        ...prev,
        selectedClinic: clinicId,
        selectedLocation: location,
        selectClinicContact: contact,
      }
    })
  }

  const goToNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1)
  }

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prevStep) => prevStep - 1)
    }
  }

  function notNull<T>(value: T | null): Exclude<T, null> {
    if (value === null) {
      throw new Error(`Value must not be null, got ${value}`)
    }
    return value as Exclude<T, null>
  }

  return (
    <div className="font-roca pb-20 h-full w-full">
      <main className="flex flex-col items-center w-full mt-4 lg:mt-16 px-8 md:px-32 lg:px-20 xl:px-40">
        <div className="w-full">
          {currentStep > 1 && currentStep !== 4 && (
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
              setServiceOptions={(
                svcId,
                svcTitle,
                pet,
                isGrooming,
                selectedSubtype,
              ) => {
                setSelectedAppointmentState((prev) => ({
                  ...prev,
                  selectedServiceId: svcId,
                  selectedService: svcTitle,
                  selectedPet: pet,
                  isGrooming: isGrooming,
                  selectedSubtype,
                }))
              }}
              openCard={openCard}
              setOpenCard={setOpenCard}
              isModalOpen={isDisclaimerModalOpen}
              setIsModalOpen={setIsDisclaimerModalOpen}
              onNext={goToNextStep}
            />
          )}

          {currentStep === 2 && (
            <SelectClinic
              onNext={goToNextStep}
              selectedClinic={selectedAppointment.selectedClinic}
              handleClinicSelection={handleClinicSelection}
              selectedPet={notNull(selectedAppointment.selectedPet)}
              isGrooming={selectedAppointment.isGrooming}
            />
          )}

          {currentStep === 3 && (
            <SelectVet
              onNext={goToNextStep}
              selectedClinic={notNull(selectedAppointment.selectedClinic)}
              selectedSvcId={notNull(selectedAppointment.selectedServiceId)}
              selectedPet={notNull(selectedAppointment.selectedPet)}
              selectedLocation={notNull(selectedAppointment.selectedLocation)}
              selectedService={notNull(selectedAppointment.selectedService)}
              selectedSubtype={selectedAppointment.selectedSubtype}
              isGrooming={selectedAppointment.isGrooming}
              isReschedule={false}
              // existingAppointmentId={null}
              setFinalAppointmentData={(appData) => {
                setSelectedAppointmentState((prev) => ({
                  ...prev,
                  ...appData,
                }))
              }}
            />
          )}
          {currentStep === 4 && (
            <BookingConfirmed
              isGroomingAppointment={selectedAppointment.isGrooming}
              selectedAppointment={{
                selectedSvcId: notNull(selectedAppointment.selectedServiceId),
                selectedService: notNull(selectedAppointment.selectedService),
                selectedSubtype: selectedAppointment.selectedSubtype?.title,
                selectedPet: notNull(selectedAppointment.selectedPet),
                selectedClinic: notNull(selectedAppointment.selectedClinic),
                selectedLocation: notNull(selectedAppointment.selectedLocation),
                selectedClinicContact: notNull(
                  selectedAppointment.selectClinicContact,
                ),
                selectedVet: selectedAppointment.selectedDoctor,
                selectedDate: notNull(selectedAppointment.selectedDate),
                selectedSlot: notNull(selectedAppointment.selectedSlot),
                selectedSlotEnd: notNull(selectedAppointment.selectedSlotEnd),
                appliedCoupon: selectedAppointment.appliedCoupon
              }}
            />
          )}
        </div>
      </main>
    </div>
  )
}

export default Booking
