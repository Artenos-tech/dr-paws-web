import React from "react"
import { MdOutlineKeyboardArrowLeft } from "react-icons/md"
import SelectAddress from "./SelectAddress"
import SelectPet from "./SelectPet"
import ReasonForVisit from "./ReasonForVisit"
import SelectDateTimeForVisit from "./SelectDateTimeForVisit"

interface AtHomeBookingFlowProps {
  onBackToStart: () => void
}

type AtHomeAppointmentData = {
  addressId?: string
  petId?: string
  reasonForVisit?: string
  description?: string
  date?: string
  slot?: {
    startTime: string
    endTime: string
  }
}

const AtHomeBookingFlow: React.FC<AtHomeBookingFlowProps> = ({
  onBackToStart,
}: AtHomeBookingFlowProps) => {
  const [currentStep, setCurrentStep] = React.useState<number>(1)
  const [atHomeAppointmentData, setAtHomeAppointmentData] =
    React.useState<AtHomeAppointmentData>({})

  const handleAddressConfirm = (addressId: string) => {
    setAtHomeAppointmentData((prev) => ({ ...prev, addressId }))
    setCurrentStep(2)
  }

  const handlePetConfirm = (petId: string) => {
    setAtHomeAppointmentData((prev) => ({ ...prev, petId }))
    setCurrentStep(3)
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      onBackToStart()
    }
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleBack}
        className="flex gap-1 mb-4 items-center self-start"
      >
        <MdOutlineKeyboardArrowLeft /> Back
      </button>

      {currentStep === 1 && (
        <SelectAddress
          addressId={atHomeAppointmentData.addressId}
          handleConfirm={handleAddressConfirm}
        />
      )}

      {currentStep === 2 && (
        <SelectPet
          petId={atHomeAppointmentData.petId}
          handleConfirm={handlePetConfirm}
        />
      )}
      {currentStep === 3 && (
        <ReasonForVisit
          reason={atHomeAppointmentData.reasonForVisit}
          description={atHomeAppointmentData.description}
          handleConfirm={handleReasonConfirm}
        />
      )}
      {currentStep === 4 && (
        <SelectDateTimeForVisit
          addressId={atHomeAppointmentData.addressId}
          onConfirm={handleDateTimeConfirm}
        />
      )}
    </div>
  )
}

export default AtHomeBookingFlow
