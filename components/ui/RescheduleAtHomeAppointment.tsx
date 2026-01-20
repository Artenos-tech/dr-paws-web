"use client"

import React, { useEffect, useState } from "react"
import { useAPICall } from "@/hooks/apicall"
import { mockAtHomeClient } from "@/services/api.athome"
import { AppointmentDetails, ReasonForVisit } from "@/model/typeDefinitions"
import { ClipLoader } from "react-spinners"
import SelectDateTimeForVisit from "./SelectDateTimeForVisit"
import ConfirmationModal from "./ConfirmationModal"
import { VISIT_REASONS } from "./ReasonForVisit"

type Props = {
  appointmentId: string
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

const RescheduleAtHomeAppointment = ({ appointmentId }: Props) => {
  const [appointment, setAppointment] = useState<AppointmentDetails | null>(
    null,
  )

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)

  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(
    null,
  )

  const {
    call: getAppointmentDetails,
    result: getAppointmentDetailsResult,
    loading: getAppointmentDetailsLoading,
  } = useAPICall(mockAtHomeClient.getAppointmentDetails)

  const { call: rescheduleAtHomeAppointment, loading: rescheduleLoading } =
    useAPICall(mockAtHomeClient.rescheduleAtHomeAppointment)

  useEffect(() => {
    getAppointmentDetails({ appointment_id: appointmentId })
  }, [appointmentId])

  useEffect(() => {
    if (getAppointmentDetailsResult?.ok) {
      setAppointment(getAppointmentDetailsResult.value.body.data.appointment)
    }
  }, [getAppointmentDetailsResult])

  const handleReschedule = (
    date: string,
    slot: { startTime: string; endTime: string },
  ) => {
    if (!appointment?.sub_booking_id) return

    rescheduleAtHomeAppointment({
      appointment_id: appointment.id,
      sub_booking_id: appointment.sub_booking_id,
      booking_date: date,
      appt_start: slot.startTime,
      appt_end: slot.endTime,
    })

    setBookingDetails({
      petName: appointment.pet_name ?? "",
      service: "Home Visit",
      doctorName: appointment.vet_name ?? undefined,
      reasonForVisit: getReasonByKey(
        appointment.reason_for_visit as ReasonForVisit,
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
  const getReasonByKey = (key: ReasonForVisit): string => {
    return VISIT_REASONS.find((r) => r.key === key)?.label ?? "Unknown reason"
  }

  if (getAppointmentDetailsLoading || !appointment) {
    return (
      <div className="flex justify-center py-10">
        <ClipLoader />
      </div>
    )
  }

  return (
    <div className="w-full pt-4">
      <SelectDateTimeForVisit
        addressId={appointment.address?.id}
        isConfirmationModalOpen={isConfirmationModalOpen}
        isConfirming={rescheduleLoading}
        onConfirm={handleReschedule}
      />

      {bookingDetails && (
        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          onClose={() => setIsConfirmationModalOpen(false)}
          onConfirm={() => {}}
          bookingDetails={bookingDetails}
        />
      )}
    </div>
  )
}

export default RescheduleAtHomeAppointment
