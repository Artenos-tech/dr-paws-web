"use client"

import React, { useEffect, useState, useMemo } from "react"
import BookingTypeSelection, {
  BookingType,
} from "@/components/ui/BookingTypeSelection"
import ClinicBookingFlow from "@/components/ui/ClinicBookingFlow"
import AtHomeBookingFlow from "@/components/ui/AtHomeBookingFlow"
import atHomeClient from "@/services/api.athome"
import { useAPICall } from "@/hooks/apicall"
import { ClipLoader } from "react-spinners"
import toast from "react-hot-toast"
import { useParams, useRouter, useSearchParams } from "next/navigation"

const Booking: React.FC = () => {
  const [selectedBookingType, setSelectedBookingType] =
    useState<BookingType | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const home = searchParams.get("home")
  const clinic = searchParams.get("clinic")

  const {
    call: getBookingTypes,
    loading: loadingBookingTypes,
    result: getBookingTypesResult,
  } = useAPICall(atHomeClient.getBookingTypes)

  const bookingTypes = useMemo(() => {
    return (
      (getBookingTypesResult?.ok &&
        getBookingTypesResult.value.body.data.bookingTypes) ||
      []
    )
  }, [getBookingTypesResult])

  const atHomeBookingType = useMemo(() => {
    return bookingTypes.find(
      (bookingType) => bookingType.type === "AT_HOME_VISIT",
    )
  }, [bookingTypes])

  const clinicBookingType = useMemo(() => {
    return bookingTypes.find(
      (bookingType) => bookingType.type === "CLINIC_VISIT",
    )
  }, [bookingTypes])

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

  useEffect(() => {
    if (!getBookingTypesResult?.ok) return
    if (selectedBookingType) return

    if (home === "true" && atHomeBookingType) {
      setSelectedBookingType(atHomeBookingType)
      router.replace("/user/book-appointment", { scroll: false })
      return
    }

    if (clinic === "true" && clinicBookingType) {
      setSelectedBookingType(clinicBookingType)
      router.replace("/user/book-appointment", { scroll: false })
    }
  }, [
    home,
    clinic,
    selectedBookingType,
    getBookingTypesResult,
    router,
    atHomeBookingType,
    clinicBookingType,
  ])

  const handleBookingTypeSelect = (bookingType: BookingType) => {
    setSelectedBookingType(bookingType)
  }

  const handleBackToSelection = () => {
    setSelectedBookingType(null)
  }

  const renderFlow = () => {
    if (!selectedBookingType) return null

    if (selectedBookingType.type === "CLINIC_VISIT") {
      return <ClinicBookingFlow onBackToStart={handleBackToSelection} />
    }

    if (selectedBookingType.type === "AT_HOME_VISIT") {
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
