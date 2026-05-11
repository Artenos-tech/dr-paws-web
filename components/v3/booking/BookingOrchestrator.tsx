"use client"

import { useState } from "react"
import BookingTypeSelector from "./BookingTypeSelector"
import ClinicVetFlow from "./ClinicVetFlow"
import ClinicGroomingFlow from "./ClinicGroomingFlow"
import HomeVisitFlow from "./HomeVisitFlow"
import { v3StartBookingFlow, v3UpdateBookingFlowStep } from "@/services/api.v3"

type BookingType = "HOME_VISIT" | "VET_CONSULTATION" | "GROOMING" | null

export default function BookingOrchestrator() {
  const [bookingType, setBookingType] = useState<BookingType>(null)
  const [selectorStep, setSelectorStep] = useState<"top" | "clinic-subtype">(
    "top",
  )
  const [clinicBookingFlowSessionId, setClinicBookingFlowSessionId] = useState<
    string | null
  >(null)

  async function startClinicBookingFlowSession() {
    try {
      const session = await v3StartBookingFlow({
        booking_flow_type: "CLINIC_VISIT",
        platform: "WEB",
      })
      setClinicBookingFlowSessionId(session.id)
      await v3UpdateBookingFlowStep({
        sessionId: session.id,
        stepName: "SELECT_SERVICE",
      })
    } catch (e) {
      console.warn("Failed to start Nidana clinic booking flow session", e)
    }
  }

  if (bookingType === "HOME_VISIT") {
    return <HomeVisitFlow onBack={() => setBookingType(null)} />
  }
  if (bookingType === "VET_CONSULTATION") {
    return (
      <ClinicVetFlow
        bookingFlowSessionId={clinicBookingFlowSessionId}
        onBack={() => {
          setSelectorStep("clinic-subtype")
          setBookingType(null)
        }}
      />
    )
  }
  if (bookingType === "GROOMING") {
    return (
      <ClinicGroomingFlow
        onBack={() => {
          setSelectorStep("clinic-subtype")
          setBookingType(null)
        }}
      />
    )
  }

  return (
    <BookingTypeSelector
      initialStep={selectorStep}
      onClinicVisitSelect={() => {
        void startClinicBookingFlowSession()
      }}
      onSelect={(type) => {
        setSelectorStep("top")
        setBookingType(type)
      }}
    />
  )
}
