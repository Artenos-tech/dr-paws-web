"use client"

import React, { useEffect, useState } from "react"
import { useAPICall } from "@/hooks/apicall"
import atHomeApiClient from "@/services/api.athome"
import { AppointmentDetails, ReasonForVisitEnum } from "@/model/typeDefinitions"
import { ClipLoader } from "react-spinners"
import SelectDateTimeForVisit from "./SelectDateTimeForVisit"
import ConfirmationModal from "./ConfirmationModal"
import { VISIT_REASONS } from "./ReasonForVisit"
import RescheduleConfirmed from "./RescheduleConfirmed"

type RescheduleHomeVistProps = {
  appointmentId: string
  subBookingId: string
}

type BookingDetails = {
  petName: string
  service: string
  doctorName?: string
  reasonForVisit: string
  reasonDescription: string
  location: string
  date: Date
  slot: string
  couponCode: string | null
}
type ViewState = "SELECT_SLOT" | "CONFIRMED"

const RescheduleAtHomeAppointment = ({
  appointmentId,
  subBookingId,
}: RescheduleHomeVistProps) => {
  const [appointment, setAppointment] = useState<AppointmentDetails | null>(
    null,
  )

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)

  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(
    null,
  )
  const [view, setView] = useState<ViewState>("SELECT_SLOT")

  const {
    call: getAppointmentDetails,
    result: getAppointmentDetailsResult,
    loading: getAppointmentDetailsLoading,
  } = useAPICall(atHomeApiClient.getAppointmentDetails)

  const { call: rescheduleAtHomeAppointment, loading: rescheduleLoading } =
    useAPICall(atHomeApiClient.rescheduleAtHomeAppointment)

  useEffect(() => {
    getAppointmentDetails({
      appointment_id: appointmentId,
      sub_booking_id: subBookingId,
    })
  }, [appointmentId])

  useEffect(() => {
    if (getAppointmentDetailsResult?.ok) {
      setAppointment(getAppointmentDetailsResult.value.body.data.appointment)
    }
  }, [getAppointmentDetailsResult])

  const handleConfirmSlots = (
    date: string,
    slot: { startTime: string; endTime: string },
  ) => {
    if (!appointment?.sub_booking_id) return

    setBookingDetails({
      petName: appointment.pet_name ?? "",
      service: "Home Visit",
      doctorName: appointment.vet_name ?? undefined,
      reasonForVisit: getReasonByKey(
        appointment.reason_for_visit as ReasonForVisitEnum,
      ),
      reasonDescription: appointment.notes as string,
      location: [
        appointment.address?.address_line1,
        appointment.address?.address_line2,
      ]
        .filter(Boolean)
        .join(", "),
      date: new Date(date),
      slot: `${slot.startTime} - ${slot.endTime}`,
      couponCode: appointment.coupon_code ?? null,
    })

    setIsConfirmationModalOpen(true)
  }

  const handleConfirmReschedule = async () => {
    if (!appointment || !bookingDetails) return

    const res = await rescheduleAtHomeAppointment({
      appointment_id: appointment.id,
      sub_booking_id: appointment.sub_booking_id,
      booking_date: bookingDetails.date.toISOString(),
      appt_start: bookingDetails.slot.split(" - ")[0].replace(":", ""),
      appt_end: bookingDetails.slot.split(" - ")[1].replace(":", ""),
    })

    if (res?.ok) {
      setIsConfirmationModalOpen(false)
      setView("CONFIRMED")
    }
  }

  const getReasonByKey = (key: ReasonForVisitEnum): string => {
    return VISIT_REASONS.find((r) => r.key === key)?.label ?? "Unknown reason"
  }

  if (getAppointmentDetailsLoading || !appointment) {
    return (
      <div className="flex justify-center py-10">
        <ClipLoader />
      </div>
    )
  }

  const oldValues = {
    oldDate: new Date(appointment.booking_date),
    oldSlot: appointment.appt_start,
    oldSlotEnd: appointment.appt_end,
  }

  return (
<<<<<<< HEAD
    <div className="w-full pt-0">
=======
    <div className="w-full pt-1">
>>>>>>> 9bd0f17 (fix the space between title and back button)
      {view === "SELECT_SLOT" && (
        <>
          <SelectDateTimeForVisit
            addressId={appointment.address?.id as string}
            petId={appointment.pet_id}
            isConfirmationModalOpen={isConfirmationModalOpen}
            isConfirming={rescheduleLoading}
            onConfirm={handleConfirmSlots}
            isReschedule
          />

          {bookingDetails && (
            <ConfirmationModal
              isOpen={isConfirmationModalOpen}
              onClose={() => setIsConfirmationModalOpen(false)}
              onConfirm={handleConfirmReschedule}
              bookingDetails={bookingDetails}
            />
          )}
        </>
      )}

      {view === "CONFIRMED" && bookingDetails && (
        <RescheduleConfirmed
          isHomeVisit
          isGroomingAppointment={false}
          updatedValues={{
            selectedSvcId: appointment.appt_type,
            selectedPet: {
              id: appointment.pet_id,
              name: appointment.pet_name,
              type: appointment.pet_type ?? null,

              breedId: null,
              breed: null,
              gender: null,
              dob: null,

              profileImage: appointment.pet_profile_image ?? null,
            },

            selectedService: appointment.appt_type_title,

            selectedVet: appointment.vet_name
              ? {
                  id: appointment.vet_id ?? null,
                  name: appointment.vet_name ?? null,
                }
              : null,

            selectedDoctorImage: appointment.vet_image ?? null,

            selectedDate: bookingDetails.date,
            selectedSlot: bookingDetails.slot.split(" - ")[0],
            selectedSlotEnd: bookingDetails.slot.split(" - ")[1],

            address: appointment.address
              ? {
                  tag: appointment.address.tag ?? "",
                  address_line1: appointment.address.address_line1 ?? "",
                  address_line2: appointment.address.address_line2 ?? "",
                }
              : undefined,
          }}
          oldValues={{
            oldVet: appointment.vet_name
              ? {
                  id: appointment.vet_id ?? null,
                  name: appointment.vet_name ?? null,
                }
              : { id: null, name: null },

            oldDoctorImage: appointment.vet_image ?? null,

            oldDate: new Date(appointment.booking_date),
            oldSlot: appointment.appt_start,
            oldSlotEnd: appointment.appt_end,
          }}
          onDone={() => window.location.reload()}
        />
      )}
    </div>
  )
}

export default RescheduleAtHomeAppointment
