import React, { useEffect, useReducer, useRef, useState } from "react"
import { MdOutlineKeyboardArrowLeft } from "react-icons/md"
import SelectAddress from "./SelectAddress"
import SelectPet from "./SelectPet"
import ReasonForVisit, { VISIT_REASONS } from "./ReasonForVisit"
import SelectDateTimeForVisit from "./SelectDateTimeForVisit"
import ConfirmationModal from "./ConfirmationModal"
import { useAPICall } from "@/hooks/apicall"
import atHomeApiClient from "@/services/api.athome"
import api from "@/services/api"
import { ReasonForVisitEnum } from "@/model/typeDefinitions"
import { load } from "@cashfreepayments/cashfree-js"
import toast from "react-hot-toast"

interface AtHomeBookingFlowProps {
  onBackToStart: () => void
}

type HomeVisitPricingSummary = {
  base_amount: number
  discount_amount: number
  final_amount: number
  coupon_applied: boolean
  coupon_code: string | null
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
  | {
      type: "SET_PET"
      payload: { petId: string; petName: string }
    }
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
  | { type: "BOOKING_CONFIRMED" }
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

// Pure utility — no component state dependencies
const convertBookingDateToIso = (date: string) => {
  const dateParts = date.split("-")
  return new Date(
    Date.UTC(
      Number(dateParts[0]),
      Number(dateParts[1]) - 1,
      Number(dateParts[2]),
    ),
  ).toISOString()
}

const AtHomeBookingFlow: React.FC<AtHomeBookingFlowProps> = ({
  onBackToStart,
}) => {
  const [state, dispatch] = useReducer(atHomeBookingReducer, initialState)
  const [pricingSummary, setPricingSummary] =
    React.useState<HomeVisitPricingSummary | null>(null)
  const [basePricingSummary, setBasePricingSummary] =
    React.useState<HomeVisitPricingSummary | null>(null)
  const [isLoadingPaymentAmount, setIsLoadingPaymentAmount] =
    React.useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [couponError, setCouponError] = useState<string | null>(null)
  const [bookingFlowSessionId, setBookingFlowSessionId] = useState<
    string | null
  >(null)
  const lastTrackedStepRef = useRef<number | null>(null)

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
  const { call: startBookingFlow } = useAPICall(api.startBookingFlow)
  const { call: updateBookingFlowStep } = useAPICall(api.updateBookingFlowStep)
  const trackStep = async (sessionId: string, stepNumber: number) => {
    if (stepNumber < 1 || stepNumber === lastTrackedStepRef.current) return
    lastTrackedStepRef.current = stepNumber
    try {
      const result = await updateBookingFlowStep({
        session_id: sessionId,
        step_number: stepNumber,
      })
      if (!result.ok) {
        console.warn("Failed to track booking flow step", result.error)
      }
    } catch (e) {
      console.warn("Failed to track booking flow step", e)
    }
  }

  useEffect(() => {
    const startSession = async () => {
      try {
        const result = await startBookingFlow({
          booking_flow_type: "HOME_VISIT",
          platform: "WEB",
        })
        if (!result.ok) {
          console.warn("Failed to start booking flow session", result.error)
          return
        }
        const sessionId = result.value.body.data.session.id
        setBookingFlowSessionId(sessionId)
        await trackStep(sessionId, 1)
      } catch (e) {
        console.warn("Failed to start booking flow session", e)
      }
    }
    startSession()
  }, [])

  useEffect(() => {
    if (!bookingFlowSessionId || currentStep <= 1) return
    void trackStep(bookingFlowSessionId, currentStep)
  }, [currentStep, bookingFlowSessionId])

  const { call: getHomeVisitPaymentAmount } = useAPICall(
    atHomeApiClient.getHomeVisitPaymentAmount,
  )
  useEffect(() => {
    if (!isConfirming) return

    const blockBack = () => {
      history.pushState(null, "", window.location.href)
    }

    history.pushState(null, "", window.location.href)

    window.addEventListener("popstate", blockBack)

    return () => {
      window.removeEventListener("popstate", blockBack)
    }
  }, [isConfirming])

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

    if (bookingFlowSessionId) {
      void trackStep(bookingFlowSessionId, 5)
    }

    const createPaymentOrderResult = await createPaymentOrder({
      pet_id: appointmentData.petId as string,
      address_id: appointmentData.addressId as string,
      appt_start: appointmentData.slot?.startTime as string,
      appt_end: appointmentData.slot?.endTime as string,
      booking_date: convertBookingDateToIso(appointmentData.date as string),
      reason_for_visit: reasonForVisit as ReasonForVisitEnum,
      notes: bookingDetails.reasonDescription as string,
      coupon_code: appliedCoupon ?? undefined,
      booking_flow_session_id: bookingFlowSessionId ?? undefined,
    })

    if (createPaymentOrderResult?.ok) {
      dispatch({ type: "BOOKING_CONFIRMED" })
      const { paymentSessionId, orderId } =
        createPaymentOrderResult.value.body.data.order
      handlePayment(paymentSessionId, orderId)
    } else {
      dispatch({ type: "HIDE_CONFIRMATION_MODAL" })
      let errorMessage = "Could not complete booking. Please try again later."

      if (
        createPaymentOrderResult &&
        !createPaymentOrderResult.ok &&
        createPaymentOrderResult.error.apiClientErrorType ===
          "ErrorResponseAPIError"
      ) {
        errorMessage = createPaymentOrderResult.error.body.message

        if (appliedCoupon && /coupon/i.test(errorMessage)) {
          setCouponError(errorMessage)
          setAppliedCoupon(null)
          if (basePricingSummary) {
            setPricingSummary(basePricingSummary)
          }
        }
      }

      toast.error(errorMessage)
    }
  }

  const handlePayment = async (paymentSessionId: string, orderId: string) => {
    try {
      const cashfreeSession = await initializeSDK()
      console.log(paymentSessionId, orderId)
      const result = await cashfreeSession.checkout({
        paymentSessionId,
        returnUrl:
          window.location.origin +
          `/user/book-appointment/home-visit/payment?order_id=` +
          orderId +
          `&service=Home_Visit`,
        redirectTarget: "_self",
      })
      console.log("Cashfree checkout result: ", result)
    } catch (e) {
      console.error("Error initiating payment on Cashfree")
      console.error(e)
    }
  }

  const handleBack = () => {
    if (isConfirming) return

    if (currentStep > 1) {
      if (bookingFlowSessionId) {
        void trackStep(bookingFlowSessionId, currentStep - 1)
      }
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
      slot: appointmentData.slot ? `${appointmentData.slot.startTime}` : "",
      couponCode: appliedCoupon,
    }
  }, [appointmentData, appliedCoupon])

  // Price is fixed per (address, pet) — it does not vary by date or slot.
  // Reset when address or pet changes so a new fetch is triggered.
  const hasFetchedAmountRef = useRef(false)
  useEffect(() => {
    setPricingSummary(null)
    setBasePricingSummary(null)
    setIsLoadingPaymentAmount(false)
    setCouponCode("")
    setAppliedCoupon(null)
    setCouponError(null)
    hasFetchedAmountRef.current = false
  }, [appointmentData.addressId, appointmentData.petId])

  // Called by SelectDateTimeForVisit once slots are loaded, with the first
  // available slot. Fetches the payment amount once and caches it for the
  // session so that it is ready before the user selects any slot.
  const handleSlotsLoaded = async (
    firstSlot: { startTime: string; endTime: string },
    date: string,
  ) => {
    if (hasFetchedAmountRef.current) return
    if (!appointmentData.addressId || !appointmentData.petId) return

    hasFetchedAmountRef.current = true
    setIsLoadingPaymentAmount(true)
    const result = await getHomeVisitPaymentAmount({
      address_id: appointmentData.addressId,
      pet_id: appointmentData.petId,
      booking_date: convertBookingDateToIso(date),
      appt_start: firstSlot.startTime,
      appt_end: firstSlot.endTime,
    })
    setIsLoadingPaymentAmount(false)

    if (result?.ok) {
      setPricingSummary(result.value.body.data.pricing)
      setBasePricingSummary(result.value.body.data.pricing)
    } else {
      toast.error("Failed to fetch payment amount")
      hasFetchedAmountRef.current = false
    }
  }

  const handleCouponCodeChange = (value: string) => {
    const normalizedValue = value.toUpperCase()
    setCouponCode(normalizedValue)
    setCouponError(null)
    if (appliedCoupon) {
      setAppliedCoupon(null)
      if (basePricingSummary) {
        setPricingSummary(basePricingSummary)
      }
    }
  }

  const handleApplyCoupon = async (
    date: string,
    slot: { startTime: string; endTime: string },
  ) => {
    const trimmedCouponCode = couponCode.trim().toUpperCase()
    if (!trimmedCouponCode) {
      setCouponError("Please enter a coupon code.")
      return
    }
    if (!appointmentData.addressId || !appointmentData.petId) return

    setIsLoadingPaymentAmount(true)
    const result = await getHomeVisitPaymentAmount({
      address_id: appointmentData.addressId,
      pet_id: appointmentData.petId,
      booking_date: convertBookingDateToIso(date),
      appt_start: slot.startTime,
      appt_end: slot.endTime,
      coupon_code: trimmedCouponCode,
    })
    setIsLoadingPaymentAmount(false)

    if (result?.ok) {
      setPricingSummary(result.value.body.data.pricing)
      setAppliedCoupon(trimmedCouponCode)
      setCouponCode(trimmedCouponCode)
      setCouponError(null)
      return
    }

    let errorMessage = "Failed to apply coupon code. Please try again later."
    if (
      result &&
      !result.ok &&
      result.error.apiClientErrorType === "ErrorResponseAPIError"
    ) {
      errorMessage = result.error.body.message
    }
    setCouponError(errorMessage)
    setAppliedCoupon(null)
    if (basePricingSummary) {
      setPricingSummary(basePricingSummary)
    }
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleBack}
        disabled={isLoading || isConfirming}
        className="flex gap-1 mb-4 items-center self-start 
             disabled:opacity-50 disabled:cursor-not-allowed"
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
              pricingSummary={pricingSummary}
              isLoadingPaymentAmount={isLoadingPaymentAmount}
              couponCode={couponCode}
              appliedCoupon={appliedCoupon}
              couponError={couponError}
              onCouponCodeChange={handleCouponCodeChange}
              onApplyCoupon={handleApplyCoupon}
              onConfirm={handleDateTimeConfirm}
              onSlotsLoaded={handleSlotsLoaded}
            />
            <ConfirmationModal
              isOpen={showConfirmationModal}
              onClose={() => dispatch({ type: "HIDE_CONFIRMATION_MODAL" })}
              onConfirm={handleConfirmBooking}
              isSubmitting={isConfirming}
              bookingDetails={bookingDetails}
              pricingSummary={pricingSummary}
            />
          </>
        )}
    </div>
  )
}

export default AtHomeBookingFlow
