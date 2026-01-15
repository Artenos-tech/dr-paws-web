"use client"

import React, { useEffect, useState } from "react"
import { useAPICall } from "@/hooks/apicall"
import { mockAtHomeClient } from "@/services/api.athome"
import { AppointmentDetails } from "@/model/typeDefinitions"
import { ClipLoader } from "react-spinners"
import SelectDateTimeForVisit from "./SelectDateTimeForVisit"

type Props = {
  appointmentId: string
}

const RescheduleAtHomeAppointment = ({ appointmentId }: Props) => {
  const [appointment, setAppointment] = useState<AppointmentDetails | null>(
    null,
  )
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)

  const {
    call: getAppointmentDetails,
    result: getAppointmentDetailsResult,
    loading: getAppointmentDetailsLoading,
  } = useAPICall(mockAtHomeClient.getAppointmentDetails)

  const {
    call: rescheduleAtHomeAppointment,
    loading: rescheduleLoading,
  } = useAPICall(mockAtHomeClient.rescheduleAtHomeAppointment)

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
    </div>
  )
}

export default RescheduleAtHomeAppointment
