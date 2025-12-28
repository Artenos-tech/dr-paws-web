"use client"

import React, { useState, useEffect } from "react"
import BookingTypeSelection, {
  BookingType,
} from "@/components/ui/BookingTypeSelection"
import ClinicBookingFlow from "@/components/ui/ClinicBookingFlow"
import AtHomeBookingFlow from "@/components/ui/AtHomeBookingFlow"
import atHomeClient from "@/services/api.athome"
import { useParams, useRouter, useSearchParams } from "next/navigation"

const Booking: React.FC = () => {
  const [bookingTypes, setBookingTypes] = useState<BookingType[]>([])
  const [selectedBookingType, setSelectedBookingType] =
    useState<BookingType | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const home = searchParams.get("home")
  const clinic = searchParams.get("clinic")

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

    console.log(title.includes("clinic"))

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

  useEffect(() => {
    if (bookingTypes.length === 0) return
    if (selectedBookingType) return

    if (home === "true") {
      const atHomeType = bookingTypes.find(
        (type) =>
          type.title.toLowerCase().includes("home") ||
          type.title.toLowerCase().includes("visit"),
      )

      if (atHomeType) {
        setSelectedBookingType(atHomeType)
        router.replace("/user/book-appointment", { scroll: false })
        return
      }
    }

    if (clinic === "true") {
      const clinicType = bookingTypes.find(
        (type) =>
          type.title.toLowerCase().includes("clinic") ||
          type.title.toLowerCase().includes("paws"),
      )

      if (clinicType) {
        setSelectedBookingType(clinicType)
        router.replace("/user/book-appointment", { scroll: false })
        return
      }
    }
  }, [bookingTypes, home, clinic, selectedBookingType])

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
