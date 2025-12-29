"use client"

import React, { useState, useEffect } from "react"
import BookingTypeSelection, {
  BookingType,
} from "@/components/ui/BookingTypeSelection"
import ClinicBookingFlow from "@/components/ui/ClinicBookingFlow"
import AtHomeBookingFlow from "@/components/ui/AtHomeBookingFlow"
import atHomeClient from "@/services/api.athome"
import { useAPICall } from "@/hooks/apicall"
import { ClipLoader } from "react-spinners"
import toast from "react-hot-toast"

const Booking: React.FC = () => {
  const [selectedBookingType, setSelectedBookingType] =
    useState<BookingType | null>(null)

  const {
    call: getBookingTypes,
    loading: loadingBookingTypes,
    result: getBookingTypesResult,
  } = useAPICall(atHomeClient.getBookingTypes)

  useEffect(() => {
    const fetchBookingTypes = async () => {
      try {
        await getBookingTypes({})
      } catch (error) {
        console.error("Error fetching booking types:", error)
        toast.error("Failed to load booking types. Please try again later.")
      }
    }

    fetchBookingTypes()
  }, [])

  const handleBookingTypeSelect = (bookingType: BookingType) => {
    setSelectedBookingType(bookingType)
  }

  const handleBackToSelection = () => {
    setSelectedBookingType(null)
  }

  const renderFlow = () => {
    if (!selectedBookingType) return null

    const title = selectedBookingType.title.toLowerCase()

    // Check if it's a clinic booking
    if (title.includes("clinic") || title.includes("paws")) {
      return <ClinicBookingFlow onBackToStart={handleBackToSelection} />
    }

    // Check if it's an at-home booking
    if (title.includes("home") || title.includes("visit")) {
      return <AtHomeBookingFlow onBackToStart={handleBackToSelection} />
    }

    // Default fallback
    return <ClinicBookingFlow onBackToStart={handleBackToSelection} />
  }

  if (loadingBookingTypes) {
    return (
      <div className="flex justify-center items-center my-20">
        <ClipLoader color="#33495f" />
      </div>
    )
  }

  const bookingTypes =
    (getBookingTypesResult?.ok &&
      getBookingTypesResult.value.body.bookingTypes) ||
    []

  return (
    <div className="font-roca h-full w-full">
      <main className="flex flex-col items-center w-full mt-4 px-8 md:px-32 lg:px-20 xl:px-40">
        {!selectedBookingType && (
          <BookingTypeSelection
            bookingTypes={bookingTypes}
            onSelect={handleBookingTypeSelect}
          />
        )}

        {renderFlow()}
      </main>
    </div>
  )
}

export default Booking
