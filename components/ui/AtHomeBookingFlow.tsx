import React, { useReducer } from "react"
import { MdOutlineKeyboardArrowLeft } from "react-icons/md"
import SelectAddress from "./SelectAddress"
import SelectPet from "./SelectPet"
import ReasonForVisit, { VISIT_REASONS } from "./ReasonForVisit"
import SelectDateTimeForVisit from "./SelectDateTimeForVisit"
import ConfirmationModal from "./ConfirmationModal"
import { useAPICall } from "@/hooks/apicall"
import atHomeApiClient from "@/services/api.athome"
import { ReasonForVisitEnum } from "@/model/typeDefinitions"
import { load } from "@cashfreepayments/cashfree-js"
import toast from "react-hot-toast"
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

type AtHomeBookingState = {
  currentStep: number
  showConfirmationModal: boolean
  isLoading: boolean
  isConfirming: boolean
  appointmentData: AtHomeAppointmentData
}

type AtHomeBookingAction =
  | {
      type: "SET_ADDRESS"
      payload: { addressId: string; location: string }
    }
  | { type: "SET_PET"; payload: { petId: string; petName: string } }
  | {
      type: "SET_REASON_FOR_VISIT"
      payload: {
        reasonForVisit: string
        description: string
        isEmergency: "yes" | "no" | null
      }
    }
  | {
      type: "SET_DATE_TIME"
      payload: { date: string; slot: { startTime: string; endTime: string } }
    }
  | { type: "GO_BACK" }
  | { type: "SHOW_CONFIRMATION_MODAL" }
  | { type: "HIDE_CONFIRMATION_MODAL" }
  | { type: "CONFIRM_BOOKING" }
  | { type: "SET_LOADING"; payload: boolean }

const initialState: AtHomeBookingState = {
  currentStep: 1,
  showConfirmationModal: false,
  isLoading: false,
  isConfirming: false,
  appointmentData: {},
}

function atHomeBookingReducer(
  state: AtHomeBookingState,
  action: AtHomeBookingAction,
): AtHomeBookingState {
  switch (action.type) {
    case "SET_ADDRESS":
      return {
        ...state,
        currentStep: 2,
        isLoading: false,
        appointmentData: {
          ...state.appointmentData,
          addressId: action.payload.addressId,
          location: action.payload.location,
        },
      }
    case "SET_PET":
      return {
        ...state,
        currentStep: 3,
        appointmentData: {
          ...state.appointmentData,
          petId: action.payload.petId,
          petName: action.payload.petName,
        },
      }
    case "SET_REASON_FOR_VISIT":
      return {
        ...state,
        currentStep: 4,
        appointmentData: {
          ...state.appointmentData,
          reasonForVisit: action.payload.reasonForVisit,
          description: action.payload.description,
          isEmergency: action.payload.isEmergency,
        },
      }
    case "SET_DATE_TIME":
      return {
        ...state,
        showConfirmationModal: true,
        appointmentData: {
          ...state.appointmentData,
          date: action.payload.date,
          slot: action.payload.slot,
        },
      }
    case "GO_BACK":
      return {
        ...state,
        currentStep: Math.max(1, state.currentStep - 1),
      }
    case "SHOW_CONFIRMATION_MODAL":
      return { ...state, showConfirmationModal: true }
    case "HIDE_CONFIRMATION_MODAL":
      return { ...state, showConfirmationModal: false, isConfirming: false }
    case "CONFIRM_BOOKING":
      return { ...state, showConfirmationModal: false, isConfirming: true }
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    default:
      return state
  }
}

const AtHomeBookingFlow: React.FC<AtHomeBookingFlowProps> = ({
  onBackToStart,
}) => {
  const [state, dispatch] = useReducer(atHomeBookingReducer, initialState)
  const {
    currentStep,
    showConfirmationModal,
    isLoading,
    isConfirming,
    appointmentData,
  } = state
  const { call: getAddress } = useAPICall(atHomeApiClient.getAddress)
  const { call: createPaymentOrder } = useAPICall(
    atHomeApiClient.createPaymentOrder,
  )

  const handleAddressConfirm = async (addressId: string) => {
    dispatch({ type: "SET_LOADING", payload: true })

    const response = await getAddress({ addressid: addressId })
    if (!response?.ok) {
      dispatch({ type: "SET_LOADING", payload: false })
      return
    }

    const address = response.value.body.data.address || null
    if (!address) {
      dispatch({ type: "SET_LOADING", payload: false })
      return
    }

    const location = `${address.address_line1}, ${address.address_line2}, ${address.pincode}${
      address.directions ? ` (${address.directions})` : ""
    }`

    dispatch({ type: "SET_ADDRESS", payload: { addressId, location } })
  }

  const handlePetConfirm = (petId: string, petName: string) => {
    dispatch({ type: "SET_PET", payload: { petId, petName } })
  }

  const handleReasonForVisitConfirm = (
    reasonForVisit: string,
    description: string,
    isEmergency: "yes" | "no" | null,
  ) => {
    dispatch({
      type: "SET_REASON_FOR_VISIT",
      payload: { reasonForVisit, description, isEmergency },
    })
  }

  const handleDateTimeConfirm = (
    date: string,
    slot: { startTime: string; endTime: string },
  ) => {
    dispatch({ type: "SET_DATE_TIME", payload: { date, slot } })
  }

  const handleConfirmBooking = async () => {
    dispatch({ type: "CONFIRM_BOOKING" })
    const reasonForVisit = VISIT_REASONS.find(
      (reason) => reason.label === bookingDetails.reasonForVisit,
    )?.key
    const createPaymentOrderResult = await createPaymentOrder({
      pet_id: appointmentData.petId as string,
      address_id: appointmentData.addressId as string,
      appt_start: appointmentData.slot?.startTime as string,
      booking_date: appointmentData.date as string,
      reason_for_visit: reasonForVisit as ReasonForVisitEnum,
      notes: bookingDetails.reasonDescription as string,
    })
    if (createPaymentOrderResult?.ok) {
      const { paymentSessionId, orderId } =
        createPaymentOrderResult.value.body.data.order
      handlePayment(paymentSessionId, orderId)
    } else {
      toast.error("Could not initiate payment. Please try again later.")
    }
  }

  const handlePayment = async (paymentSessionId: string, orderId: string) => {
    const cashfreeSession = await initializeSDK()
    const result = await cashfreeSession.checkout({
      paymentSessionId,
      returnUrl:
        window.location.origin +
        `/user/book-appointment/home-visit/payment?order_id=` +
        orderId,
    })
    console.log("Cashfree checkout result: ", result)
  }

  const handleBack = () => {
    if (currentStep > 1) {
      dispatch({ type: "GO_BACK" })
    } else {
      onBackToStart()
    }
  }

  const initializeSDK = async function () {
    const cashfreeEnv = process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT as
      | "sandbox"
      | "production"
    if (!cashfreeEnv) {
      throw new Error(
        "Cashfree environment is not set. Cannot proceed with payment",
      )
    } else {
      const cashfree = await load({
        mode: process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT as
          | "sandbox"
          | "production",
      })
      return cashfree
    }
  }

  const bookingDetails = React.useMemo(() => {
    return {
      petName: appointmentData.petName || "",
      service: appointmentData.service || "Home Visit",
      location: appointmentData.location || "",
      reasonForVisit: appointmentData.reasonForVisit,
      reasonDescription: appointmentData.description,
      date: appointmentData.date ? new Date(appointmentData.date) : new Date(),
      slot: appointmentData.slot
        ? `${appointmentData.slot.startTime} - ${appointmentData.slot.endTime}`
        : "",
      couponCode: null,
    }
  }, [appointmentData])

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleBack}
        disabled={isLoading}
        className="flex gap-1 mb-4 items-center self-start disabled:opacity-50"
      >
        <MdOutlineKeyboardArrowLeft /> Back
      </button>

      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      )}

      {!isLoading && currentStep === 1 && (
        <SelectAddress
          addressId={appointmentData.addressId}
          handleConfirm={handleAddressConfirm}
        />
      )}

      {!isLoading && currentStep === 2 && (
        <SelectPet
          petId={appointmentData.petId}
          handleConfirm={handlePetConfirm}
        />
      )}
      {!isLoading && currentStep === 3 && (
        <ReasonForVisit
          reason={appointmentData.reasonForVisit}
          description={appointmentData.description}
          isEmergency={appointmentData.isEmergency}
          handleConfirm={handleReasonForVisitConfirm}
        />
      )}
      {!isLoading &&
        currentStep === 4 &&
        appointmentData.addressId &&
        appointmentData.petId && (
          <>
            <SelectDateTimeForVisit
              addressId={appointmentData.addressId}
              petId={appointmentData.petId}
              date={appointmentData.date}
              slot={appointmentData.slot}
              isConfirmationModalOpen={showConfirmationModal}
              isConfirming={isConfirming}
              onConfirm={handleDateTimeConfirm}
            />
            <ConfirmationModal
              isOpen={showConfirmationModal}
              onClose={() => dispatch({ type: "HIDE_CONFIRMATION_MODAL" })}
              onConfirm={handleConfirmBooking}
              bookingDetails={bookingDetails}
            />
          </>
        )}
    </div>
  )
}

export default AtHomeBookingFlow
