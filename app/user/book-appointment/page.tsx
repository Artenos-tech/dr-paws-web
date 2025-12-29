"use client"

import React, { useEffect, useState } from "react"
import BookingTypeSelection, {
  BookingType,
} from "@/components/ui/BookingTypeSelection"
import ClinicBookingFlow from "@/components/ui/ClinicBookingFlow"
import AtHomeBookingFlow from "@/components/ui/AtHomeBookingFlow"
import atHomeClient from "@/services/api.athome"
import { useAPICall } from "@/hooks/apicall"
import { ClipLoader } from "react-spinners"
import toast from "react-hot-toast"
import { useRouter, useSearchParams } from "next/navigation"

const Booking: React.FC = () => {
  const [selectedBookingType, setSelectedBookingType] =
    useState<BookingType | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const home = searchParams.get("home")
  const clinic = searchParams.get("clinic")

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

  const bookingTypes: BookingType[] =
    (getBookingTypesResult?.ok &&
      getBookingTypesResult.value.body.bookingTypes) ||
    []

  useEffect(() => {
    if (!getBookingTypesResult?.ok) return
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
      }
    }
  }, [
    bookingTypes,
    home,
    clinic,
    selectedBookingType,
    getBookingTypesResult,
    router,
  ])

  const handleBookingTypeSelect = (bookingType: BookingType) => {
    setSelectedBookingType(bookingType)
  }

  const handleBackToSelection = () => {
    setSelectedBookingType(null)
  }

  const renderFlow = () => {
    if (!selectedBookingType) return null

    const title = selectedBookingType.title.toLowerCase()

    if (title.includes("clinic") || title.includes("paws")) {
      return <ClinicBookingFlow onBackToStart={handleBackToSelection} />
    }

    if (title.includes("home") || title.includes("visit")) {
      return <AtHomeBookingFlow onBackToStart={handleBackToSelection} />
    }

    return <ClinicBookingFlow onBackToStart={handleBackToSelection} />
  }

  if (loadingBookingTypes) {
    return (
      <div className="flex justify-center items-center my-20">
        <ClipLoader color="#33495f" />
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
