import React from "react"
import { MdOutlineKeyboardArrowLeft } from "react-icons/md"
import SelectAddress from "./SelectAddress"
import SelectPet from "./SelectPet"

interface AtHomeBookingFlowProps {
  onBackToStart: () => void
}

type AtHomeAppointmentData = {
  addressId?: string
  petId?: string
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
  }
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      onBackToStart?.()
    }
  }
  console.log(atHomeAppointmentData)

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
        <SelectAddress handleConfirm={handleAddressConfirm} />
      )}

      {currentStep === 2 && <SelectPet handleConfirm={handlePetConfirm} />}
    </div>
  )
}

export default AtHomeBookingFlow
