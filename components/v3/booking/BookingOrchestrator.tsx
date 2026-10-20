"use client"

import { useState } from "react"
import BookingTypeSelector from "./BookingTypeSelector"
import ClinicVetFlow from "./ClinicVetFlow"
import ClinicGroomingFlow from "./ClinicGroomingFlow"

type BookingType = "VET_CONSULTATION" | "GROOMING" | null

export default function BookingOrchestrator() {
  const [bookingType, setBookingType] = useState<BookingType>(null)

  if (bookingType === "VET_CONSULTATION") {
    return (
      <ClinicVetFlow
        bookingFlowSessionId={null}
        onBack={() => setBookingType(null)}
      />
    )
  }
  if (bookingType === "GROOMING") {
    return (
      <ClinicGroomingFlow
        bookingFlowSessionId={null}
        onBack={() => setBookingType(null)}
      />
    )
  }

  return <BookingTypeSelector onSelect={setBookingType} />
}
