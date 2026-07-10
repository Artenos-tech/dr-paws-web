"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ClipLoader } from "react-spinners"
import { PawPrint } from "lucide-react"
import BookingConfirmed from "@/components/ui/BookingConfirmed"
import { useAPICall } from "@/hooks/apicall"
import atHomeApiClient from "@/services/api.athome"
import discountApiClient from "@/services/api.discount"
import { useUserContext } from "@/context/UserContext"

type DiscountOutcome = "success" | "invalid" | "already_used" | null

const ThankYouPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const appointmentId = searchParams.get("appointmentId")
  const subBookingId = searchParams.get("subBookingId")
  const { user } = useUserContext()

  const {
    call: getAppointmentDetails,
    loading,
    result,
  } = useAPICall(atHomeApiClient.getAppointmentDetails)

  const { call: applyDiscountCode } = useAPICall(
    discountApiClient.applyDiscountCode,
  )
  const [discountOutcome, setDiscountOutcome] = useState<DiscountOutcome>(null)
  const hasAppliedDiscountRef = useRef(false)

  useEffect(() => {
    getAppointmentDetails({
      appointment_id: appointmentId!,
      sub_booking_id: subBookingId!,
    })
  }, [appointmentId, subBookingId]) // eslint-disable-line react-hooks/exhaustive-deps

  const appointment = result?.ok ? result.value.body.data.appointment : null

  useEffect(() => {
    if (!result) return
    if (!result.ok || !appointment) {
      router.replace("/user/my-appointments")
    }
  }, [result, appointment, router])

  // Discount codes are only a clinic-visit concept — the home-visit flow has
  // its own independent coupon system. Fires once, regardless of payment
  // state, as soon as a real appointment with a coupon_code is available.
  useEffect(() => {
    if (hasAppliedDiscountRef.current) return
    if (!appointment || !user) return
    if (appointment.booking_type === "HOME_VISIT") return
    if (!appointment.coupon_code) return

    hasAppliedDiscountRef.current = true
    applyDiscountCode({
      appointment_id: appointment.id,
      user_id: user.id,
      discount_code: appointment.coupon_code,
    }).then((response) => {
      if (response.ok) {
        setDiscountOutcome("success")
        return
      }
      if (
        response.error.apiClientErrorType === "ErrorResponseAPIError" &&
        response.error.status === 409
      ) {
        setDiscountOutcome("already_used")
        return
      }
      if (
        response.error.apiClientErrorType === "ErrorResponseAPIError" &&
        response.error.status === 400
      ) {
        setDiscountOutcome("invalid")
      }
    })
  }, [appointment, user]) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading || !result || !appointment) {
    return (
      <div className="flex justify-center items-center my-20">
        <ClipLoader color="#33495f" />
      </div>
    )
  }

  const isGroomingAppointment = appointment.appt_type === "GROOMING"
  const isHomeVisit = appointment.booking_type === "HOME_VISIT"

  const selectedLocation = isHomeVisit
    ? (appointment.address?.tag ?? "")
    : (appointment.clinic_location ?? "")

  const selectedAddressDetails = isHomeVisit
    ? [appointment.address?.address_line1, appointment.address?.address_line2]
        .filter(Boolean)
        .join(", ")
    : undefined

  return (
    <div className="font-roca h-full w-full">
      <main className="flex flex-col items-center w-full mt-4 px-8 md:px-32 lg:px-20 xl:px-40">
        <div className="w-full">
          {discountOutcome === "success" && (
            <div className="mb-4 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
              <PawPrint className="h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">
                Yay! Your coupon{" "}
                <span className="font-bold">{appointment.coupon_code}</span>{" "}
                was applied successfully. Enjoy the savings!
              </p>
            </div>
          )}
          {discountOutcome === "already_used" && (
            <div className="mb-4 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-700">
              <PawPrint className="h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">
                Looks like you&apos;ve already used this coupon before, so it
                wasn&apos;t applied again this time.
              </p>
            </div>
          )}
          <BookingConfirmed
            bookingType={appointment.booking_type}
            isGroomingAppointment={isGroomingAppointment}
            selectedAppointment={{
              selectedSvcId: appointment.id,
              selectedService:
                appointment.appt_type_title || "Vet Consultation",
              selectedPet: {
                id: appointment.pet_id,
                name: appointment.pet_name,
                type: appointment.pet_type,
                breedId: null,
                breed: null,
                gender: null,
                dob: null,
                profileImage: appointment.pet_profile_image,
              },
              selectedClinic: appointment.clinic_id,
              selectedLocation,
              selectedAddressDetails,
              selectedClinicContact: appointment.clinic_contact,
              selectedVet:
                appointment.vet_id && appointment.vet_name
                  ? {
                      id: appointment.vet_id,
                      name: appointment.vet_name,
                      displayImage: appointment.vet_image || null,
                    }
                  : null,
              selectedDate: new Date(appointment.booking_date),
              selectedSlot: appointment.appt_start,
              selectedSlotEnd: appointment.appt_end,
              appliedCoupon: appointment.coupon_code || null,
              groomingCatalogueKeys: appointment.catalogue_keys ?? [],
            }}
          />
        </div>
      </main>
    </div>
  )
}

export default ThankYouPage
