"use client"

import { AppointmentDetails } from "@/model/typeDefinitions"
import ClinicBookingDetails from "./ClinicBookingDetails"
import AtHomeBookingDetails from "./AtHomeBookingDetails"
import { useAPICall } from "@/hooks/apicall"
import { mockAtHomeClient } from "@/services/api.athome"
import { useEffect } from "react"
import { ClipLoader } from "react-spinners"

export type BookingDetailsProps = {
  goBack: (refetch: boolean) => void
  appointmentId: string
}

const BookingDetails = ({ appointmentId, goBack }: BookingDetailsProps) => {
  const { call, result } = useAPICall(mockAtHomeClient.getAppointmentDetails)
  useEffect(() => {
    call({ appointment_id: appointmentId })
  }, [])

  if (!result?.ok) {
    return (
      <div className="flex justify-center items-center py-20">
        <ClipLoader />
      </div>
    )
  }
  const selectedAppointment: AppointmentDetails =
    result.value.body.data.appointment

  return (
    <>
      {selectedAppointment.appt_type === "HOME_VISIT" ? (
        <AtHomeBookingDetails
          selectedAppointment={selectedAppointment}
          goBack={goBack}
        />
      ) : (
        <ClinicBookingDetails
          selectedAppointment={selectedAppointment}
          goBack={goBack}
        />
      )}
    </>
  )
}

export default BookingDetails
