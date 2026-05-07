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
import { useRouter, useSearchParams } from "next/navigation"
import { useAPIErrorToastFromResult } from "@/hooks/useAPIErrorToast"
import { useHomeVisitFeature } from "@/hooks/useHomeVisitFeature"

const Booking: React.FC = () => {
  const {
    isFeatureEnabled: isHomeVisitEnabled,
    isLoading: isLoadingFeatureFlag,
    hasResolved: hasResolvedHomeVisitFeature,
  } = useHomeVisitFeature()
  const [selectedBookingType, setSelectedBookingType] =
    useState<BookingType | null>(null)
  const [preAppliedCouponCode, setPreAppliedCouponCode] = useState<
    string | null
  >(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const home = searchParams.get("home")
  const clinic = searchParams.get("clinic")
  const coupon = searchParams.get("coupon")

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return
      window.history.pushState(
        { clearedPaymentForwardHistory: true },
        "",
        window.location.href,
      )
      setSelectedBookingType(null)
      setPreAppliedCouponCode(null)
      window.scrollTo(0, 0)
    }

    window.addEventListener("pageshow", handlePageShow)
    return () => window.removeEventListener("pageshow", handlePageShow)
  }, [])

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
  useAPIErrorToastFromResult(getBookingTypesResult, {
    fallbackMessage: "Failed to get booking types",
  })

  const atHomeBookingType = useMemo(() => {
    return bookingTypes.find((bookingType) => bookingType.type === "HOME_VISIT")
  }, [bookingTypes])

  const clinicBookingType = useMemo(() => {
    return bookingTypes.find(
      (bookingType) => bookingType.type === "CLINIC_VISIT",
    )
  }, [bookingTypes])

  useEffect(() => {
    if (isLoadingFeatureFlag || !isHomeVisitEnabled) return

    const fetchBookingTypes = async () => {
      try {
        await getBookingTypes({})
      } catch (error) {
        console.error("Error fetching booking types:", error)
        toast.error("Failed to load booking types. Please try again later.")
      }
    }

    fetchBookingTypes()
  }, [isLoadingFeatureFlag, isHomeVisitEnabled])

  useEffect(() => {
    if (isLoadingFeatureFlag || !isHomeVisitEnabled) return
    if (!getBookingTypesResult?.ok) return
    if (selectedBookingType) return

    if (home === "true" && atHomeBookingType) {
      setPreAppliedCouponCode(coupon?.trim().toUpperCase() ?? null)
      setSelectedBookingType(atHomeBookingType)
      return
    }

    if (clinic === "true" && clinicBookingType) {
      setSelectedBookingType(clinicBookingType)
      router.replace("/user/book-appointment", { scroll: false })
    }
  }, [
    isLoadingFeatureFlag,
    isHomeVisitEnabled,
    home,
    clinic,
    coupon,
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
    setPreAppliedCouponCode(null)
    router.replace("/user/book-appointment", { scroll: false })
  }

  const renderFlow = () => {
    if (!selectedBookingType) return null

    if (selectedBookingType.type === "CLINIC_VISIT") {
      return <ClinicBookingFlow onBackToStart={handleBackToSelection} />
    }

    if (selectedBookingType.type === "HOME_VISIT") {
      return (
        <AtHomeBookingFlow
          onBackToStart={handleBackToSelection}
          preAppliedCouponCode={preAppliedCouponCode}
        />
      )
    }

    return <ClinicBookingFlow onBackToStart={handleBackToSelection} />
  }

  if (
    !hasResolvedHomeVisitFeature ||
    isLoadingFeatureFlag ||
    loadingBookingTypes
  ) {
    return (
      <div className="flex justify-center items-center my-20">
        <ClipLoader color="#33495f" />
      </div>
    )
  }

  if (!isHomeVisitEnabled) {
    return (
      <div className="font-roca h-full w-full">
        <main className="flex flex-col items-center w-full mt-4 px-8 md:px-32 lg:px-20 xl:px-40">
          <ClinicBookingFlow />
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
