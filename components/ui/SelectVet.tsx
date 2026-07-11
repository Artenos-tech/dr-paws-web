"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { load } from "@cashfreepayments/cashfree-js"
import SelectDoctorCard from "./SelectDoctorCard"
import CustomButton from "./CustomButton"
import SelectCalendar from "./SelectCalendar"
import { format, isSameDay, isValid, parse } from "date-fns"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./carousel"
import { useAPICall } from "@/hooks/apicall"
import api from "@/services/api"
import { Pet, useUserContext } from "@/context/UserContext"
import toast, { Toaster } from "react-hot-toast"
import { ClipLoader } from "react-spinners"
import { BookingCategory } from "./SelectService"
import BestAvailableVetCard from "./BestAvailableVetCard"
import ConfirmationModal from "./ConfirmationModal"
import { Input, Modal, Switch } from "antd"
import { PawPrint } from "lucide-react"
import posthog from "posthog-js"
import { getApplicableDiscount } from "@/lib/discountCodes"

export interface SelectedVet {
  id: string
  name: string
  displayImage: string | null
  tier?: "NORMAL" | "SENIOR"
}

interface selectVetProps {
  selectedSvcId: string
  selectedPet: Pet
  selectedClinic: string
  selectedLocation: string
  selectedService: string
  selectedSubtype: BookingCategory | null
  groomingCatalogueKeys: string[]
  isGrooming: boolean
  isReschedule: boolean
  bookingFlowSessionId?: string | null
  existingAppointment?: {
    appointmentId: string
    subBookingId: string
  } | null
  onRescheduleError?: () => void
  setFinalAppointmentData: (finalAppData: {
    selectedDoctor: SelectedVet | null
    selectedDate: Date | null
    selectedSlot: string | null
    selectedSlotEnd: string | null
    appliedCoupon: string | null
  }) => void
  onNext?: (createdAppointment?: {
    appointmentId: string
    subBookingId: string
  }) => void
  onBeforePayment?: () => void
  onPriceViewed?: () => void
}

type ClinicPaymentPricing = {
  full_amount: number
  token_amount: number
  pay_at_clinic_amount: number
  total_tax_amount: number
}

const BEST_AVAILABLE_VET_ID = "best-available"

const SelectVet: React.FC<selectVetProps> = ({
  selectedClinic,
  selectedSvcId,
  selectedPet,
  selectedSubtype,
  groomingCatalogueKeys,
  selectedLocation,
  selectedService,
  setFinalAppointmentData,
  isGrooming,
  onNext,
  isReschedule,
  bookingFlowSessionId,
  existingAppointment,
  onRescheduleError,
  onBeforePayment,
  onPriceViewed,
}) => {
  const { user } = useUserContext()

  const [selectedDoctor, setSelectedDoctor] = useState<SelectedVet | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedSlot, setSelectedSlot] = useState<{
    startTime: string
    endTime: string
  } | null>(null)
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [isSeniorModalOpen, setIsSeniorModalOpen] = useState(false)
  const [pendingSeniorDoctor, setPendingSeniorDoctor] =
    useState<SelectedVet | null>(null)
  const [chosenVetId, setChosenVetId] = useState<string | null>(null)
  const [couponCode, setCouponCode] = useState<string>("")
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [couponError, setCouponError] = useState<string | null>(null)
  const [clinicPaymentPricing, setClinicPaymentPricing] =
    useState<ClinicPaymentPricing | null>(null)
  const [isLoadingClinicPaymentAmount, setIsLoadingClinicPaymentAmount] =
    useState(false)
  const [clinicPaymentAmountError, setClinicPaymentAmountError] = useState<
    string | null
  >(null)
  const [vetSearch, setVetSearch] = useState("")
  const [showSeniorOnly, setShowSeniorOnly] = useState(false)
  const {
    call: getSlotsForStaff,
    result: slotsForStaffResult,
    loading: loadingSlotsForStaff,
  } = useAPICall(api.getSlotsForStaff)

  const {
    call: getGroomingSlotsWindow,
    result: groomingSlotsWindowResult,
    loading: loadingGroomingSlotsWindow,
  } = useAPICall(api.getSlotsForGroomingWindow)

  const {
    call: getBestAvailableVetSchedule,
    result: bestAvailableVetScheduleResult,
    loading: loadingBestAvailableVetSchedule,
  } = useAPICall(api.getBestAvailableVetSchedule)

  const { call: applyCouponCode } = useAPICall(api.applyCouponCode)

  const {
    call: createClinicPaymentOrder,
    loading: loadingAppointmentCreation,
  } = useAPICall(api.createClinicPaymentOrder)
  const { call: getClinicPaymentAmount } = useAPICall(
    api.getClinicPaymentAmount,
  )
  const getClinicPaymentAmountRef = useRef(getClinicPaymentAmount)
  getClinicPaymentAmountRef.current = getClinicPaymentAmount

  const { call: rescheduleAppointment, loading: loadingRescheduleAppointment } =
    useAPICall(api.rescheduleAppointment)

  const {
    call: getDoctorsForClinic,
    result: doctorsResult,
    loading: loadingDoctors,
  } = useAPICall(api.getDoctorsForClinic)

  const { call: getDoctor } = useAPICall(api.getDoctor)

  const isConsultation = !isGrooming
  const groomingCatalogueKeysKey = groomingCatalogueKeys.join(",")
  const groomingCatalogueKeysParam =
    groomingCatalogueKeys.length > 0
      ? groomingCatalogueKeys.join(",")
      : selectedSubtype?.id || ""

  const fetchSlotsForStaff = useCallback(async () => {
    if (!selectedDoctor) {
      throw new Error("Doctor must be selected")
    }
    if (
      selectedSvcId &&
      (selectedSubtype || isConsultation) &&
      selectedClinic &&
      selectedPet &&
      !isGrooming
    ) {
      try {
        const params: {
          staffid: string
          clinicid: string
          petid: string
          pettype: "DOG" | "CAT" | "OTHER"
          date: string
          catalogue?: string
        } = {
          staffid: selectedDoctor.id,
          clinicid: selectedClinic,
          petid: selectedPet.id,
          pettype: selectedPet.type as "DOG" | "CAT" | "OTHER",
          date: format(selectedDate, "dd/MM/yyyy"),
        }
        if (!isConsultation) {
          params.catalogue = selectedSubtype?.id as string
        }
        await getSlotsForStaff(params)
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return
        console.error("Error fetching slots for staff:", error)
        toast.error("Failed to load slots for staff. Please try again later.")
      }
    }
  }, [
    selectedSvcId,
    selectedDoctor,
    selectedClinic,
    getSlotsForStaff,
    isGrooming,
  ])

  const fetchGroomingSlotsWindow = async () => {
    if (selectedSvcId && selectedClinic && isGrooming) {
      if (groomingCatalogueKeysParam.length === 0) return
      try {
        const response = await getGroomingSlotsWindow({
          clinicid: selectedClinic,
          catalogue_keys: groomingCatalogueKeysParam,
          petid: selectedPet.id,
          pettype: selectedPet.type as "DOG" | "CAT" | "OTHER",
        })
        if (response.ok) {
          const firstAvailableDay =
            response.value.body.days.find((day) => day.slots.length > 0) ??
            response.value.body.days[0]
          if (firstAvailableDay?.date) {
            const parsedDate = parse(
              firstAvailableDay.date,
              "dd/MM/yyyy",
              new Date(),
            )
            if (isValid(parsedDate)) {
              setSelectedDate(parsedDate)
            }
          }
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return
        console.error("Error fetching grooming slots:", error)
        toast.error("Failed to load grooming slots. Please try again later.")
      }
    }
  }

  const fetchBestAvailableVetSlots = useCallback(async () => {
    if (
      selectedSvcId &&
      (selectedSubtype || isConsultation) &&
      selectedClinic &&
      selectedPet
    ) {
      try {
        const params: {
          clinicid: string
          petid: string
          pettype: "DOG" | "CAT" | "OTHER"
          date: string
          catalogue?: string
          senior_only?: "true" | "false"
        } = {
          clinicid: selectedClinic,
          petid: selectedPet.id,
          pettype: selectedPet.type as "DOG" | "CAT" | "OTHER",
          date: format(selectedDate, "dd/MM/yyyy"),
        }
        if (!isConsultation) {
          params.catalogue = selectedSubtype?.id as string
        } else {
          params.senior_only = showSeniorOnly ? "true" : "false"
        }
        await getBestAvailableVetSchedule(params)
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return
        console.error("Error fetching best available vet slots:", error)
        toast.error(
          "Failed to load slots for best available vet. Please try again later.",
        )
      }
    }
  }, [
    selectedClinic,
    selectedSvcId,
    selectedDate,
    selectedSubtype,
    selectedPet,
    isConsultation,
    showSeniorOnly,
  ])

  const fetchDoctors = useCallback(async () => {
    if ((selectedSubtype || isConsultation) && selectedPet) {
      try {
        await getDoctorsForClinic({
          clinicid: selectedClinic,
          grooming: isGrooming ? "y" : "n",
          catalogue: isConsultation ? "" : (selectedSubtype?.id as string),
          include_all_consultation: isConsultation ? "true" : "false",
          date: format(selectedDate, "dd/MM/yyyy"),
          petid: selectedPet.id,
          pettype: selectedPet.type as "DOG" | "CAT" | "OTHER",
        })
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return
        console.error("Error fetching doctors for clinic:", error)
        toast.error("Failed to load doctors. Please try again later.")
      }
    }
  }, [selectedClinic, getDoctorsForClinic])

  // on initial mount, for non grooming appts
  useEffect(() => {
    if (!isGrooming) fetchDoctors()
  }, [])

  useEffect(() => {
    if (!isGrooming) return
    setSelectedSlot(null)
    fetchGroomingSlotsWindow()
  }, [
    isGrooming,
    selectedSvcId,
    selectedClinic,
    selectedPet.id,
    selectedPet.type,
    groomingCatalogueKeysParam,
  ])

  // when a different doctor is selected
  useEffect(() => {
    if (!selectedDoctor || isGrooming) return
    setSelectedSlot(null)
    const isBestAvailable = selectedDoctor.id === BEST_AVAILABLE_VET_ID
    if (isBestAvailable) fetchBestAvailableVetSlots()
    else fetchSlotsForStaff()
  }, [selectedDoctor])

  useEffect(() => {
    if (!selectedDoctor || isGrooming) return
    if (selectedDoctor.id !== BEST_AVAILABLE_VET_ID) return
    setSelectedSlot(null)
    setChosenVetId(null)
    fetchBestAvailableVetSlots()
  }, [showSeniorOnly])

  // for best available vet
  useEffect(() => {
    if (
      selectedDoctor?.id === BEST_AVAILABLE_VET_ID &&
      selectedSlot &&
      selectedDate &&
      bestAvailableVetScheduleResult?.ok
    ) {
      try {
        const vetId = selectPreferredOrRandomAvailableVetId()
        setChosenVetId(vetId)
      } catch (err) {
        console.error("Vet selection error:", err)
        toast.error(
          "Failed to select a vet for the chosen slot. Please try again later.",
        )
        setChosenVetId(null)
      }
    }
  }, [
    selectedSlot,
    selectedDoctor,
    selectedDate,
    bestAvailableVetScheduleResult,
  ])

  useEffect(() => {
    if (isReschedule) return

    setClinicPaymentPricing(null)
    setClinicPaymentAmountError(null)

    const pricingVetId =
      selectedDoctor?.id === BEST_AVAILABLE_VET_ID
        ? chosenVetId
        : selectedDoctor?.id

    if (
      !selectedSlot ||
      !selectedDate ||
      !pricingVetId ||
      !selectedPet?.id ||
      !selectedClinic
    ) {
      setIsLoadingClinicPaymentAmount(false)
      return
    }

    if (isGrooming && groomingCatalogueKeys.length === 0) {
      setIsLoadingClinicPaymentAmount(false)
      return
    }

    if (!isGrooming && !isConsultation && !selectedSubtype?.id) {
      setIsLoadingClinicPaymentAmount(false)
      return
    }

    let cancelled = false

    const loadClinicPaymentAmount = async () => {
      setIsLoadingClinicPaymentAmount(true)
      const response = await getClinicPaymentAmountRef
        .current({
          vet_id: pricingVetId,
          pet_id: selectedPet.id,
          clinic_id: selectedClinic,
          appt_start: selectedSlot.startTime.replace(":", ""),
          appt_end: selectedSlot.endTime.replace(":", ""),
          booking_date: format(selectedDate, "dd/MM/yyyy"),
          pet_type: selectedPet.type as "DOG" | "CAT" | "OTHER",
          is_grooming: isGrooming,
          ...(isGrooming && groomingCatalogueKeys.length > 0
            ? { catalogue_keys: groomingCatalogueKeys }
            : {}),
          ...(!isConsultation && selectedSubtype?.id
            ? { subtype_id: selectedSubtype.id }
            : {}),
        })
        .finally(() => {
          if (!cancelled) {
            setIsLoadingClinicPaymentAmount(false)
          }
        })

      if (cancelled) return

      if (response.ok) {
        setClinicPaymentPricing(response.value.body.data.pricing)
        onPriceViewed?.()
        return
      }

      if (
        response.error.apiClientErrorType === "FetchAPIError" &&
        response.error.fetchError.name === "AbortError"
      ) {
        return
      }

      setClinicPaymentAmountError(
        "Could not fetch the service price. Please try another slot.",
      )
      toast.error("Failed to fetch service price")
    }

    void loadClinicPaymentAmount()

    return () => {
      cancelled = true
    }
  }, [
    isReschedule,
    selectedSlot?.startTime,
    selectedSlot?.endTime,
    selectedDate,
    selectedDoctor?.id,
    chosenVetId,
    selectedPet.id,
    selectedPet.type,
    selectedClinic,
    selectedSubtype?.id,
    groomingCatalogueKeysKey,
    isGrooming,
    isConsultation,
  ])

  // when a different date is selected
  useEffect(() => {
    if ((selectedDoctor || isGrooming) && selectedDate) {
      if (selectedDoctor && selectedDoctor.id === BEST_AVAILABLE_VET_ID)
        fetchBestAvailableVetSlots()
      else if (selectedDoctor && !isGrooming) fetchSlotsForStaff()
    }
  }, [selectedDate])

  function selectPreferredOrRandomAvailableVetId(): string {
    if (!bestAvailableVetScheduleResult?.ok) {
      throw new Error("Best available vet schedule not loaded")
    }
    if (!selectedDate) {
      throw new Error("Date must be selected")
    }
    if (!selectedSlot) {
      throw new Error("Slot must be selected")
    }

    const { slots, preferredVets } = bestAvailableVetScheduleResult.value.body

    const matchedSlot = slots.find(
      (slot) =>
        slot.startTime === selectedSlot.startTime &&
        slot.endTime === selectedSlot.endTime,
    )

    if (!matchedSlot || matchedSlot.staffIds.length === 0) {
      throw new Error("No available vets for the selected slot")
    }

    // Find preferred vets who are available in this slot
    const preferredAvailableVets = preferredVets
      .filter(({ staffId }) => matchedSlot.staffIds.includes(staffId))
      .sort((a, b) => b.appCount - a.appCount)

    if (preferredAvailableVets.length > 0) {
      const maxAppCount = Math.max(
        ...preferredAvailableVets.map((vet) => vet.appCount),
      )
      const topVets = preferredAvailableVets
        .map((vet, index) => ({ ...vet, index }))
        .filter((vet) => vet.appCount === maxAppCount)

      const randomTopVet = topVets[Math.floor(Math.random() * topVets.length)]

      return preferredAvailableVets[randomTopVet.index].staffId
    }

    // Pick a random vet from available staff for the slot
    const randomIndex = Math.floor(Math.random() * matchedSlot.staffIds.length)
    return matchedSlot.staffIds[randomIndex]
  }

  const handleNextClick = async () => {
    if (!(selectedDoctor || isGrooming)) {
      toast.error("Please select a doctor or grooming option.")
      return
    }
    if (!selectedSlot) {
      toast.error("Please select a time slot before proceeding.")
      return
    }
    if (!isReschedule && isLoadingClinicPaymentAmount) {
      toast.error("Please wait while we fetch the service price.")
      return
    }
    if (!isReschedule && !clinicPaymentPricing) {
      toast.error("Could not fetch the service price. Please try again.")
      return
    }
    const selectedDoc =
      selectedDoctor?.id === BEST_AVAILABLE_VET_ID &&
      doctors.find((doc) => doc.id === chosenVetId)
    setFinalAppointmentData({
      selectedDoctor: selectedDoc || selectedDoctor,
      selectedDate,
      selectedSlot: selectedSlot?.startTime ?? null,
      selectedSlotEnd: selectedSlot?.endTime ?? null,
      appliedCoupon: appliedCoupon,
    })
    setCouponError(null)
    setIsConfirmationModalOpen(true)
  }

  const handleConfirmBooking = async () => {
    if (!isReschedule) {
      if (user && selectedSlot && selectedDate && selectedDoctor) {
        try {
          const payload: {
            vet_id: string
            pet_id: string
            clinic_id: string
            appt_start: string
            appt_end: string
            booking_date: string
            appt_type_id: string
            subtype_id?: string
            catalogue_keys?: string[]
            pet_type: "DOG" | "CAT" | "OTHER"
            is_grooming: boolean
            coupon_code?: string
            booking_flow_session_id?: string
            platform?: "WEB"
          } = {
            vet_id:
              selectedDoctor.id === BEST_AVAILABLE_VET_ID && chosenVetId
                ? chosenVetId
                : selectedDoctor.id,
            pet_id: selectedPet.id,
            clinic_id: selectedClinic,
            // appt_reason: selectedSubtype?.title || null,
            appt_start: selectedSlot.startTime.replace(":", ""),
            appt_end: selectedSlot.endTime.replace(":", ""),
            booking_date: format(selectedDate, "dd/MM/yyyy"),
            appt_type_id: selectedSvcId,
            pet_type: selectedPet.type as "DOG" | "CAT" | "OTHER",
            is_grooming: isGrooming,
            platform: "WEB",
            ...(appliedCoupon && {
              coupon_code: appliedCoupon,
            }),
          }
          if (bookingFlowSessionId) {
            payload.booking_flow_session_id = bookingFlowSessionId
          }
          if (isGrooming && groomingCatalogueKeys.length > 0) {
            payload.catalogue_keys = groomingCatalogueKeys
          }
          if (!isConsultation) {
            payload.subtype_id = selectedSubtype?.id as string
          }
          onBeforePayment?.()
          const response = await createClinicPaymentOrder(payload)
          if (response.ok) {
            const { paymentSessionId, orderId } = response.value.body.data.order
            await handlePayment(paymentSessionId, orderId)
          } else {
            if (
              response.error.apiClientErrorType === "FetchAPIError" &&
              response.error.fetchError.name === "AbortError"
            ) {
              return
            }
            let errorMessage = "Failed to create appointment. Please try again."
            if (response.error.apiClientErrorType === "ErrorResponseAPIError") {
              errorMessage = response.error.body.message
            }
            toast.error(errorMessage, {
              duration: 6000,
              position: "bottom-right",
            })
          }
        } catch (error) {
          console.error("Error creating appointment:", error)
          toast.error("An unexpected error occurred. Please try again.", {
            duration: 3000,
            position: "bottom-right",
          })
        }
      } else {
        toast.error("Please fill out all required fields before proceeding.", {
          duration: 3000,
          position: "bottom-right",
        })
      }
    } else {
      if (
        user &&
        selectedSlot &&
        selectedDate &&
        selectedDoctor &&
        existingAppointment
      ) {
        try {
          const payload: {
            appointmentid: string
            sub_booking_id: string
            vet_id: string
            appt_start: string
            appt_end: string
            booking_date: string
            service_id: string
            catalogue_id?: string
            catalogue_keys?: string[]
            clinic_id: string
            is_grooming: boolean
            pet_type: "DOG" | "CAT" | "OTHER"
          } = {
            appointmentid: existingAppointment.appointmentId,
            sub_booking_id: existingAppointment.subBookingId,
            vet_id:
              selectedDoctor.id === BEST_AVAILABLE_VET_ID && chosenVetId
                ? chosenVetId
                : selectedDoctor.id,
            appt_start: selectedSlot.startTime.replace(":", ""),
            appt_end: selectedSlot.endTime.replace(":", ""),
            booking_date: format(selectedDate, "dd/MM/yyyy"),
            service_id: selectedSvcId,
            clinic_id: selectedClinic,
            is_grooming: isGrooming,
            pet_type: selectedPet.type as "DOG" | "CAT" | "OTHER",
          }
          if (isGrooming && groomingCatalogueKeys.length > 0) {
            payload.catalogue_keys = groomingCatalogueKeys
          }
          if (!isConsultation) {
            payload.catalogue_id = selectedSubtype?.id as string
          }
          const response = await rescheduleAppointment(payload)
          if (response.ok) {
            setIsConfirmationModalOpen(false)
            toast.success("Appointment rescheduled successfully!", {
              duration: 3000,
              position: "bottom-right",
            })
            if (onNext) {
              onNext() // Navigate to the next page only if the API succeeds
            }
          } else {
            if (
              response.error.apiClientErrorType === "FetchAPIError" &&
              response.error.fetchError.name === "AbortError"
            ) {
              return
            }
            toast.error("Failed to reschedule appointment. Please try again.", {
              duration: 3000,
              position: "bottom-right",
            })
            if (onRescheduleError) onRescheduleError()
          }
        } catch (error) {
          console.error("Error rescheduling appointment:", error)
          toast.error("An unexpected error occurred. Please try again.", {
            duration: 3000,
            position: "bottom-right",
          })
          if (onRescheduleError) onRescheduleError()
        }
      } else {
        toast.error("Please fill out all required fields before proceeding.", {
          duration: 3000,
          position: "bottom-right",
        })
      }
    }
  }

  const handlePayment = async (paymentSessionId: string, orderId: string) => {
    try {
      const cashfreeSession = await initializeSDK()
      const result = await cashfreeSession.checkout({
        paymentSessionId,
        returnUrl:
          window.location.origin +
          `/user/book-appointment/clinic-visit/payment?order_id=` +
          orderId +
          `&service=Clinic_Visit`,
        redirectTarget: "_self",
      })
      console.log("Cashfree checkout result: ", result)
    } catch (error) {
      console.error("Error initiating payment on Cashfree", error)
      toast.error("Failed to initiate payment. Please try again.", {
        duration: 3000,
        position: "bottom-right",
      })
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
    }

    const cashfree = await load({
      mode: cashfreeEnv,
    })
    return cashfree
  }

  const handleDateSelect = (date: Date) => {
    if (!isSameDay(date, selectedDate)) {
      setSelectedDate(date)
      setSelectedSlot(null)
    }
  }

  const handleSlotSelect = async (time: {
    startTime: string
    endTime: string
    staffIds?: string[]
  }) => {
    const isDeselectingSlot =
      selectedSlot && selectedSlot.startTime === time.startTime
    setSelectedSlot(isDeselectingSlot ? null : time)
    setCouponCode("")
    setAppliedCoupon(null)
    setCouponError(null)
    if (selectedDoctor?.id === BEST_AVAILABLE_VET_ID || isDeselectingSlot) {
      setChosenVetId(null)
    }
    if (time.staffIds && isGrooming && !isDeselectingSlot) {
      setSelectedDoctor(null)
      try {
        const response = await getDoctor({
          staffid:
            time.staffIds[Math.floor(Math.random() * time.staffIds.length)],
        })
        if (response.ok) {
          const doctor = response.value.body.staff
          setSelectedDoctor(doctor)
        } else if (
          !(
            response.error.apiClientErrorType === "FetchAPIError" &&
            response.error.fetchError.name === "AbortError"
          )
        ) {
          toast.error(
            "Failed to load groomer information. Please try again later.",
          )
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return
        console.error("Error fetching doctor for grooming slot:", error)
        toast.error(
          "Failed to load groomer information. Please try again later.",
        )
      }
    }
  }

  const handleApplyCoupon = async () => {
    const trimmedCouponCode = couponCode.trim()

    if (!trimmedCouponCode) {
      toast.error("Please enter a coupon code")
      setCouponError("Please enter a coupon code.")
      setAppliedCoupon(null)
      return
    }

    try {
      const resp = await applyCouponCode({
        code: trimmedCouponCode,
        appt_start: selectedSlot?.startTime ?? "",
      })
      if (resp.ok) {
        posthog.capture("coupon_applied", {
          coupon_code: trimmedCouponCode,
          user_id: user?.id ?? null,
        })
        toast.success("Coupon applied!")
        setCouponError(null)
        setAppliedCoupon(trimmedCouponCode)
      } else {
        if (
          resp.error.apiClientErrorType === "FetchAPIError" &&
          resp.error.fetchError.name === "AbortError"
        ) {
          return
        }
        const errorMessage =
          resp.error.apiClientErrorType === "ErrorResponseAPIError"
            ? resp.error.body.message
            : "Invalid coupon code. Please try again."
        toast.error(errorMessage)
        setCouponError(errorMessage)
        if (
          errorMessage !== "Coupon code not applicable for the selected slot"
        ) {
          setCouponCode("")
        }
        setAppliedCoupon(null)
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return
      console.error("Error applying coupon code:", error)
      toast.error("Failed to apply coupon code. Please try again later.")
      setCouponError("Failed to apply coupon code. Please try again later.")
      setAppliedCoupon(null)
    }
  }

  const doctors = doctorsResult?.ok ? doctorsResult.value.body.staff : []
  const filteredDoctors = doctors
    .filter((doctor) =>
      vetSearch.trim()
        ? doctor.name.toLowerCase().includes(vetSearch.trim().toLowerCase())
        : true,
    )
    .filter((doctor) => (showSeniorOnly ? doctor.tier === "SENIOR" : true))
  const hasSeniorDoctors = doctors.some((doctor) => doctor.tier === "SENIOR")
  const showNoSeniorMessage = showSeniorOnly && !hasSeniorDoctors

  const availableSlotsLoading =
    loadingSlotsForStaff ||
    loadingBestAvailableVetSchedule ||
    loadingGroomingSlotsWindow

  const availableSlotsError =
    slotsForStaffResult?.ok === false ||
    bestAvailableVetScheduleResult?.ok === false ||
    groomingSlotsWindowResult?.ok === false
  const isSubmittingBookingAction =
    loadingAppointmentCreation || loadingRescheduleAppointment
  const isClinicPaymentAmountRequired = !isReschedule && selectedSlot !== null
  const isClinicPaymentAmountUnavailable =
    isClinicPaymentAmountRequired &&
    (isLoadingClinicPaymentAmount || !clinicPaymentPricing)

  const selectedDateKey = format(selectedDate, "dd/MM/yyyy")
  const groomingSlotsForSelectedDate = groomingSlotsWindowResult?.ok
    ? (groomingSlotsWindowResult.value.body.days.find(
        (day) => day.date === selectedDateKey,
      )?.slots ?? [])
    : null
  const groomingMaxSelectableDays = groomingSlotsWindowResult?.ok
    ? groomingSlotsWindowResult.value.body.days.length
    : undefined

  const availableSlots = !isGrooming
    ? selectedDoctor
      ? selectedDoctor.id === BEST_AVAILABLE_VET_ID
        ? bestAvailableVetScheduleResult?.ok
          ? bestAvailableVetScheduleResult.value.body.slots
          : null
        : slotsForStaffResult?.ok
          ? slotsForStaffResult.value.body.slots
          : null
      : null
    : groomingSlotsForSelectedDate
      ? groomingSlotsForSelectedDate
      : null

  const appliedDisplayDiscount = getApplicableDiscount(
    appliedCoupon,
    isGrooming ? "GROOMING" : "VET_CONSULTATION",
  )

  const discountOnPayAtClinic =
    clinicPaymentPricing && appliedDisplayDiscount
      ? Math.round(
          (clinicPaymentPricing.pay_at_clinic_amount *
            appliedDisplayDiscount.value) /
            100,
        )
      : 0

  const discountedPayAtClinicAmount = clinicPaymentPricing
    ? clinicPaymentPricing.pay_at_clinic_amount - discountOnPayAtClinic
    : 0

  const discountedFullAmount = clinicPaymentPricing
    ? clinicPaymentPricing.full_amount - discountOnPayAtClinic
    : 0

  const isNextButtonEnabled =
    (selectedDoctor !== null || isGrooming) &&
    // selectedDate !== null &&
    selectedSlot !== null

  if (loadingDoctors) {
    return (
      <div className="flex justify-center items-center my-20">
        <ClipLoader color="#33495f" />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col gap-12 px-4 lg:px-0">
      {!isGrooming && (
        <div>
          <h1 className="text-2xl mb-2">Select Vet</h1>
          <p className="text-gray-600 mb-2">
            Which of our experts would you like to see?
          </p>
          <div className="mb-12 max-w-md">
            <Input.Search
              allowClear
              placeholder="Search vet by name"
              value={vetSearch}
              onChange={(event) => setVetSearch(event.target.value)}
            />
          </div>
          <div className="mb-6 flex items-center gap-3">
            <span className="text-sm text-gray-700">Senior only</span>
            <Switch
              checked={showSeniorOnly}
              onChange={(checked) => {
                setShowSeniorOnly(checked)
                if (
                  checked &&
                  selectedDoctor &&
                  selectedDoctor.tier !== "SENIOR"
                ) {
                  setSelectedDoctor(null)
                  setSelectedSlot(null)
                }
                if (!checked && selectedDoctor?.id === BEST_AVAILABLE_VET_ID) {
                  setSelectedDoctor(null)
                  setSelectedSlot(null)
                  setChosenVetId(null)
                }
              }}
            />
          </div>
          {showSeniorOnly && (
            <p className="-mt-4 mb-6 text-sm text-amber-700">
              Senior vets will be charged higher at ₹900.
            </p>
          )}
          <DoctorSelectionCarousel
            options={filteredDoctors}
            selectedDoctor={selectedDoctor}
            onDoctorSelected={(doctor) => {
              if (
                isConsultation &&
                !isGrooming &&
                !showSeniorOnly &&
                doctor.tier === "SENIOR" &&
                selectedDoctor?.tier !== "SENIOR"
              ) {
                setPendingSeniorDoctor(doctor)
                setIsSeniorModalOpen(true)
                return
              }
              setPendingSeniorDoctor(null)
              setSelectedDoctor(doctor)
              setSelectedDate(new Date()) // Reset date and slot on doctor change
              setIsSeniorModalOpen(false)
            }}
            hideBestAvailable={showNoSeniorMessage}
          />
          {showNoSeniorMessage && (
            <p className="mt-4 text-gray-500 text-sm">
              No senior vets available.
            </p>
          )}
          {!showNoSeniorMessage && !filteredDoctors.length && (
            <p className="mt-4 text-gray-500 text-sm">
              No vets match your search.
            </p>
          )}
        </div>
      )}
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl">Select Date and Time</h1>
          <p className="text-gray-600 mb-4">When would you like to visit us?</p>
        </div>

        {
          (selectedDoctor || isGrooming) &&
            (availableSlotsLoading ? (
              <div className="m-auto my-1">
                <ClipLoader color="#33495f" />
              </div>
            ) : availableSlotsError ? (
              <p className="text-gray-500 text-sm">
                Cannot load the available slots. Please try again later.
              </p>
            ) : availableSlots ? (
              <AppointmentDateAndTimeSelector
                show={false}
                selectedDate={selectedDate}
                onDateSelected={handleDateSelect}
                availableSlots={availableSlots}
                selectedSlot={selectedSlot}
                onSlotSelected={handleSlotSelect}
                maxSelectableDays={isGrooming ? groomingMaxSelectableDays : 30}
              />
            ) : null) // result starts out as undefined before API call is made
        }
      </div>
      {selectedSlot &&
        !isReschedule &&
        (isLoadingClinicPaymentAmount ||
          clinicPaymentPricing ||
          clinicPaymentAmountError) && (
          <div className="mb-0">
            {isLoadingClinicPaymentAmount ? (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ClipLoader color="#33495f" size={14} />
                <span>Loading amount...</span>
              </div>
            ) : clinicPaymentPricing ? (
              <div className="max-w-80 text-sm text-gray-700">
                <p className="font-semibold text-gray-700 mb-2">
                  Payment summary
                </p>
                <div className="space-y-1.5">
                  <div className="flex justify-between gap-3">
                    <span>Total service price</span>
                    {discountOnPayAtClinic > 0 ? (
                      <span className="flex items-baseline gap-1.5">
                        <span className="text-gray-400 line-through">
                          INR {clinicPaymentPricing.full_amount}
                        </span>
                        <span className="font-semibold">
                          INR {discountedFullAmount}
                        </span>
                      </span>
                    ) : (
                      <span className="font-semibold">
                        INR {clinicPaymentPricing.full_amount}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between gap-3">
                    <span>Pay at clinic</span>
                    {discountOnPayAtClinic > 0 ? (
                      <span className="flex items-baseline gap-1.5">
                        <span className="text-gray-400 line-through">
                          INR {clinicPaymentPricing.pay_at_clinic_amount}
                        </span>
                        <span className="font-semibold">
                          INR {discountedPayAtClinicAmount}
                        </span>
                      </span>
                    ) : (
                      <span className="font-semibold">
                        INR {clinicPaymentPricing.pay_at_clinic_amount}
                      </span>
                    )}
                  </div>
                  {discountOnPayAtClinic > 0 && (
                    <p className="text-sm font-medium text-green-600">
                      Coupon {appliedCoupon} applied: INR {discountOnPayAtClinic}{" "}
                      off
                    </p>
                  )}
                </div>
                <div className="my-2.5 border-t border-gray-300" />
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-gray-700">
                    Pay now to confirm booking
                  </span>
                  <span className="text-xl font-bold text-secondary-1">
                    INR {clinicPaymentPricing.token_amount}
                  </span>
                </div>
                <p className="mt-2 text-xs font-medium text-green-600">
                  A token amount is charged now to confirm your booking. The
                  remaining amount will be paid at the clinic.
                </p>
              </div>
            ) : (
              <p className="text-sm text-red-500">{clinicPaymentAmountError}</p>
            )}
          </div>
        )}
      {/* Coupon Code Section */}
      {(selectedDoctor || isGrooming) && selectedDate && selectedSlot && (
        <div className="flex">
          <div className="w-full max-w-md">
            <h2 className="text-lg font-semibold">Have a coupon code?</h2>
            <p className="text-gray-600 mb-4">
              Enter it below to redeem your discount
            </p>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Enter coupon code"
                className={`w-full border ${
                  couponError
                    ? "border-red-500"
                    : appliedCoupon
                      ? "border-green-500"
                      : "border-gray-300"
                } rounded-md py-2 px-4 pr-24`}
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value.toUpperCase())
                  setCouponError(null)
                  if (appliedCoupon) setAppliedCoupon(null)
                }}
                onClick={() => {
                  setCouponCode(couponCode.trim())
                  setCouponError(null)
                }}
                // disabled={!!appliedCoupon}
              />
              {!appliedCoupon && (
                <button
                  className="absolute right-1 top-1 bottom-1 my-auto bg-secondary-1 text-white px-4 py-1.5 rounded-md text-sm"
                  onClick={handleApplyCoupon}
                >
                  Apply
                </button>
              )}
            </div>
            {couponError && (
              <p className="text-red-500 text-sm mt-2">{couponError}</p>
            )}
            {appliedCoupon && (
              <p className="text-green-600 text-sm mt-2 font-medium">
                Coupon Code <span className="font-bold">{appliedCoupon}</span>{" "}
                applied!
              </p>
            )}
          </div>
        </div>
      )}
      <div className="mt-0 mb-16 flex justify-center">
        <CustomButton
          buttonText={isReschedule ? "Reschedule" : "Proceed to Pay"}
          buttonBackground="bg-secondary-1"
          disabled={
            !isNextButtonEnabled ||
            loadingAppointmentCreation ||
            loadingRescheduleAppointment ||
            isClinicPaymentAmountUnavailable
          }
          loading={
            (isNextButtonEnabled && loadingAppointmentCreation) ||
            loadingRescheduleAppointment ||
            (isNextButtonEnabled && isLoadingClinicPaymentAmount)
          }
          buttonClickEvent={handleNextClick}
        />
      </div>
      {selectedDate && selectedSlot && (
        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          onClose={() => {
            if (isSubmittingBookingAction) return
            setIsConfirmationModalOpen(false)
          }}
          onConfirm={handleConfirmBooking}
          isSubmitting={isSubmittingBookingAction}
          bookingDetails={{
            petName: selectedPet.name,
            service: isGrooming
              ? groomingCatalogueKeys.includes("haircut")
                ? "Spa Bath + Haircut"
                : "Spa Bath"
              : selectedSubtype?.title || selectedService,
            haircutAddOn:
              isGrooming && groomingCatalogueKeys.includes("haircut"),
            doctorName:
              selectedDoctor && selectedDoctor.id === BEST_AVAILABLE_VET_ID
                ? doctors.find((doc) => {
                    return doc.id === chosenVetId
                  })?.name
                : !isGrooming
                  ? selectedDoctor?.name
                  : undefined,
            isSenior: !isGrooming
              ? selectedDoctor?.id === BEST_AVAILABLE_VET_ID
                ? doctors.find((doc) => doc.id === chosenVetId)?.tier ===
                  "SENIOR"
                : selectedDoctor?.tier === "SENIOR"
              : false,
            location: selectedLocation,
            date: selectedDate,
            slot: selectedSlot.startTime,
            couponCode: appliedCoupon,
          }}
          clinicPaymentBreakdown={
            clinicPaymentPricing
              ? {
                  fullAmount: clinicPaymentPricing.full_amount,
                  tokenAmount: clinicPaymentPricing.token_amount,
                  payAtClinicAmount: clinicPaymentPricing.pay_at_clinic_amount,
                }
              : undefined
          }
        />
      )}
      <Modal
        open={isSeniorModalOpen}
        onCancel={() => {
          setIsSeniorModalOpen(false)
          setPendingSeniorDoctor(null)
        }}
        footer={null}
        centered
        destroyOnClose
        title={null}
      >
        <div className="flex flex-col items-center text-center gap-3 py-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <PawPrint className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Senior Vet Selected
          </h3>
          <p className="text-sm text-gray-700 pb-4">
            This is a senior vet and the charge will be higher at ₹900.
            <br />
          </p>
          <CustomButton
            buttonText="Proceed"
            buttonBackground="bg-secondary-1"
            buttonClickEvent={() => {
              if (!pendingSeniorDoctor) return
              setSelectedDoctor(pendingSeniorDoctor)
              setSelectedDate(new Date())
              setSelectedSlot(null)
              setIsSeniorModalOpen(false)
              setPendingSeniorDoctor(null)
            }}
          />
        </div>
      </Modal>
      <Toaster />
    </div>
  )
}

const DoctorSelectionCarousel = ({
  options,
  selectedDoctor,
  onDoctorSelected,
  hideBestAvailable,
}: {
  options: SelectedVet[]
  selectedDoctor: SelectedVet | null
  onDoctorSelected: (doctor: SelectedVet) => void
  hideBestAvailable?: boolean
}) => {
  return (
    <Carousel className="pr-1 w-[90%] sm:w-full mx-auto">
      <CarouselContent className="-ml-1">
        {!hideBestAvailable && (
          <CarouselItem
            key={"best"}
            className="basis-full sm:basis-5/12 lg:basis-1/4 xl:basis-1/5"
          >
            <BestAvailableVetCard
              isSelected={selectedDoctor?.id === BEST_AVAILABLE_VET_ID}
              onSelected={() =>
                onDoctorSelected({
                  id: BEST_AVAILABLE_VET_ID,
                  name: "Best Available Vet",
                  displayImage: null,
                })
              }
            />
          </CarouselItem>
        )}
        {options.map((doctor) => (
          <CarouselItem
            key={doctor.id}
            className="basis-full sm:basis-5/12 lg:basis-1/4 xl:basis-1/5"
          >
            <SelectDoctorCard
              doctor={doctor}
              isSelected={selectedDoctor?.id === doctor.id}
              onDoctorSelect={(id, name, displayImage) => {
                onDoctorSelected({ id, name, displayImage, tier: doctor.tier })
              }}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

const AppointmentDateAndTimeSelector = ({
  show,
  selectedDate,
  onDateSelected,
  availableSlots,
  selectedSlot,
  onSlotSelected,
  maxSelectableDays = 20,
}: {
  show: boolean
  selectedDate: Date
  onDateSelected: (date: Date) => void
  availableSlots: Array<{
    startTime: string
    endTime: string
    staffIds?: string[]
  }>
  selectedSlot: { startTime: string; endTime: string } | null
  onSlotSelected: (slot: { startTime: string; endTime: string }) => void
  maxSelectableDays?: number
}) => {
  return (
    <div className="flex flex-col justify-center items-center xl:flex-row gap-8">
      <div
        className={`w-full flex-shrink-0 lg:w-1/2 xl:w-1/3 ${
          show ? "opacity-100 pointer-events-none" : ""
        }`}
      >
        <SelectCalendar
          selectedDate={selectedDate}
          onDateSelect={onDateSelected}
          maxSelectableDays={maxSelectableDays}
        />
      </div>

      {/* Timeslots Section */}
      {selectedDate && (
        <div className="w-full">
          <div className="font-semibold text-xs text-gray-800 lg:text-lg">
            Available timeslots for{" "}
            <span className="text-secondary-1">
              {format(selectedDate, "EEEE, MMM d")}
            </span>
          </div>
          <div
            className=" w-full grid grid-cols-2 gap-2 lg:gap-4 mt-4"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(118px, 1fr))",
            }}
          >
            {availableSlots &&
            Array.isArray(availableSlots) &&
            availableSlots.length > 0 ? (
              availableSlots.map((time, index) => (
                <button
                  key={index}
                  type="button"
                  className={` text-center bg-primary-3 py-2 px-6 sm:py-1 sm:px-6 lg:py-2 lg:px-8 w-full rounded-md cursor-pointer shadow-md ${
                    selectedSlot?.startTime === time.startTime
                      ? "border border-secondary-1"
                      : ""
                  }`}
                  onClick={() => onSlotSelected(time)}
                >
                  {time.startTime}
                </button>
              ))
            ) : (
              <p className="text-gray-500 text-sm">
                No slots available for the selected date. Please try another
                day.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SelectVet
