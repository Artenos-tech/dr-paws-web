"use client"

import { useState } from "react"
import BookingTypeSelector from "./BookingTypeSelector"
import ClinicVetFlow from "./ClinicVetFlow"
import ClinicGroomingFlow from "./ClinicGroomingFlow"
import HomeVisitFlow from "./HomeVisitFlow"

type BookingType = "HOME_VISIT" | "VET_CONSULTATION" | "GROOMING" | null

export default function BookingOrchestrator() {
  const [bookingType, setBookingType] = useState<BookingType>(null)
  const [selectorStep, setSelectorStep] = useState<"top" | "clinic-subtype">(
    "top",
  )

  if (bookingType === "HOME_VISIT") {
    return <HomeVisitFlow onBack={() => setBookingType(null)} />
  }
  if (bookingType === "VET_CONSULTATION") {
    return (
      <ClinicVetFlow
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
      onSelect={(type) => {
        setSelectorStep("top")
        setBookingType(type)
      }}
    />
  )
}
