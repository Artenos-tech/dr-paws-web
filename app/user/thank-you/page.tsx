"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ClipLoader } from "react-spinners"
import BookingConfirmed from "@/components/ui/BookingConfirmed"
import { useAPICall } from "@/hooks/apicall"
import atHomeApiClient from "@/services/api.athome"

const ThankYouPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const appointmentId = searchParams.get("appointmentId")
  const subBookingId = searchParams.get("subBookingId")

  const {
    call: getAppointmentDetails,
    loading,
    result,
  } = useAPICall(atHomeApiClient.getAppointmentDetails)

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
