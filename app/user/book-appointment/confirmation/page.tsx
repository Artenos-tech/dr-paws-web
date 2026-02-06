"use client"

import { useAPICall } from "@/hooks/apicall"
import { useSearchParams } from "next/navigation"
import atHomeAPIClient from "@/services/api.athome"
import { Suspense, useEffect, useState } from "react"
import { AppointmentDetails } from "@/model/typeDefinitions"
import BookingConfirmed from "@/components/ui/BookingConfirmed"
import { Loader2 } from "lucide-react"
import { useAPIErrorToastFromResult } from "@/hooks/useAPIErrorToast"

const BookingConfirmationContent: React.FC = () => {
  const searchParams = useSearchParams()
  const appointmentId = searchParams.get("appointment_id")
  const subBookingId = searchParams.get("sub_booking_id")
  const [confirmedAppointment, setConfirmedAppointment] =
    useState<AppointmentDetails | null>(null)
  const {
    call: getBookingById,
    result: getBookingByIdResult,
    loading: loadingGetBookingById,
  } = useAPICall(atHomeAPIClient.getAppointmentDetails)

  useEffect(() => {
    if (appointmentId && subBookingId)
      getBookingById({
        appointment_id: appointmentId,
        sub_booking_id: subBookingId,
      })
  }, [appointmentId, subBookingId])

  useEffect(() => {
    if (getBookingByIdResult?.ok) {
      setConfirmedAppointment(getBookingByIdResult.value.body.data.appointment)
    }
  }, [getBookingByIdResult])
  useAPIErrorToastFromResult(getBookingByIdResult,{fallbackMessage:'Failed to fetch booking'})

  if (loadingGetBookingById || !confirmedAppointment) {
    return (
      <div className="flex flex-col justify-center items-center space-y-4">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    )
  }

  return (
    <main className="flex flex-col items-center w-full mt-8 mb-8 px-8 md:px-32 lg:px-20 xl:px-40">
      <BookingConfirmed
        bookingType={confirmedAppointment.booking_type}
        isGroomingAppointment={false}
        selectedAppointment={{
          selectedSvcId: confirmedAppointment.appt_type,
          selectedPet: {
            id: confirmedAppointment.pet_id,
            name: confirmedAppointment.pet_name,
            type: confirmedAppointment.pet_type,
            profileImage: confirmedAppointment.pet_profile_image,
            breedId: null,
            breed: null,
            gender: null,
            dob: null,
          },
          selectedClinic: confirmedAppointment.clinic_id,
          selectedLocation: confirmedAppointment.address?.tag as string,
          selectedAddressDetails: [
            confirmedAppointment.address?.address_line1,
            confirmedAppointment.address?.address_line2,
          ]
            .filter(Boolean)
            .join(", "),
          selectedClinicContact: confirmedAppointment.clinic_contact,
          selectedService: confirmedAppointment.appt_type_title,
          selectedVet: null,
          selectedDate: new Date(confirmedAppointment.booking_date),
          selectedSlot: confirmedAppointment.appt_start,
          selectedSlotEnd: confirmedAppointment.appt_end,
          appliedCoupon: null,
        }}
      />
    </main>
  )
}

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={<Loader2 />}>
      <BookingConfirmationContent />
    </Suspense>
  )
}
