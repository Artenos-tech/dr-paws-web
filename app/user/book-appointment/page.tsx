"use client"

import React, { useState, useEffect } from "react"
import BookingTypeSelection, {
  BookingType,
} from "@/components/ui/BookingTypeSelection"
import ClinicBookingFlow from "@/components/ui/ClinicBookingFlow"
import AtHomeBookingFlow from "@/components/ui/AtHomeBookingFlow"
import atHomeClient from "@/services/api.athome"

const Booking: React.FC = () => {
  const [bookingTypes, setBookingTypes] = useState<BookingType[]>([])
  const [selectedBookingType, setSelectedBookingType] =
    useState<BookingType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookingTypes = async () => {
      setLoading(true)
      const result = await atHomeClient.getBookingTypes({})

      if (result.ok) {
        setBookingTypes(result.value.body.bookingTypes)
      } else {
        console.error("Failed to fetch booking types:", result.error)
      }
      setLoading(false)
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

  if (loading) {
    return (
      <div className="font-roca h-full w-full">
        <main className="flex flex-col items-center w-full mt-4 px-8 md:px-32 lg:px-20 xl:px-40">
          <div className="w-full text-center">Loading...</div>
        </main>
      </div>
    )
  }

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
