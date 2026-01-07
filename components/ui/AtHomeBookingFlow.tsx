import React from "react"
import { MdOutlineKeyboardArrowLeft } from "react-icons/md"
import SelectAddress from "./SelectAddress"
import SelectPet from "./SelectPet"
import ReasonForVisit from "./ReasonForVisit"
import SelectDateTimeForVisit from "./SelectDateTimeForVisit"
import ConfirmationModal from "./ConfirmationModal"
import { useAPICall } from "@/hooks/apicall"
import { mockAtHomeClient } from "@/services/api.athome"

interface AtHomeBookingFlowProps {
  onBackToStart: () => void
}

type AtHomeAppointmentData = {
  service?: string
  addressId?: string
  location?: string
  petId?: string
  petName?: string
  isEmergency?: "yes" | "no" | null
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
}) => {
  const [currentStep, setCurrentStep] = React.useState<number>(1)
  const [showConfirmationModal, setShowConfirmationModal] =
    React.useState(false)
  const [atHomeAppointmentData, setAtHomeAppointmentData] =
    React.useState<AtHomeAppointmentData>({})
  const { call: getAddress } = useAPICall(mockAtHomeClient.getAddress)

  const handleAddressConfirm = async (addressId: string) => {
    const response = await getAddress({ addressid: addressId })
    if (!response?.ok) return

    const address = response.value.body.data.address_book || null
    if (!address) return

    const location = `${address.address_line1}, ${address.address_line2}, ${address.pincode}${
      address.directions ? ` (${address.directions})` : ""
    }`

    setAtHomeAppointmentData((prev) => ({
      ...prev,
      addressId,
      location,
    }))

    setCurrentStep(2)
  }

  const handlePetConfirm = (petId: string, petName: string) => {
    setAtHomeAppointmentData((prev) => ({ ...prev, petId, petName }))
    setCurrentStep(3)
  }

  const handleReasonForVisitConfirm = (
    reasonForVisit: string,
    description: string,
    isEmergency: "yes" | "no" | null,
  ) => {
    setAtHomeAppointmentData((prev) => ({
      ...prev,
      reasonForVisit,
      description,
      isEmergency,
    }))
    setCurrentStep(4)
  }

  const handleDateTimeConfirm = (
    date: string,
    slot: { startTime: string; endTime: string },
  ) => {
    setAtHomeAppointmentData((prev) => ({
      ...prev,
      date,
      slot,
    }))
    setShowConfirmationModal(true)
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      onBackToStart()
    }
  }
  const bookingDetails = React.useMemo(() => {
    return {
      petName: atHomeAppointmentData.petName || "",
      service: atHomeAppointmentData.service || "At-Home Appointment",
      doctorName: undefined,
      location: atHomeAppointmentData.location || "",
      reasonForVisit: atHomeAppointmentData.reasonForVisit,
      reasonDescription: atHomeAppointmentData.description,
      date: atHomeAppointmentData.date
        ? new Date(atHomeAppointmentData.date)
        : new Date(),
      slot: atHomeAppointmentData.slot
        ? `${atHomeAppointmentData.slot.startTime} - ${atHomeAppointmentData.slot.endTime}`
        : "",
      couponCode: null,
    }
  }, [atHomeAppointmentData])

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
          isEmergency={atHomeAppointmentData.isEmergency}
          handleConfirm={handleReasonForVisitConfirm}
        />
      )}
      {currentStep === 4 && (
        <>
          <SelectDateTimeForVisit
            addressId={atHomeAppointmentData.addressId}
            date={atHomeAppointmentData.date}
            slot={atHomeAppointmentData.slot}
            onConfirm={handleDateTimeConfirm}
          />
          <ConfirmationModal
            isOpen={showConfirmationModal}
            onClose={() => setShowConfirmationModal(false)}
            onConfirm={() => {
              setShowConfirmationModal(false)
            }}
            bookingDetails={bookingDetails}
          />
        </>
      )}
    </div>
  )
}

export default AtHomeBookingFlow
