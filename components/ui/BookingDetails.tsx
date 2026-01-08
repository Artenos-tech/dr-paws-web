"use client"
import { AppointmentType } from "@/model/typeDefinitions"
import ClinicBookingDetails from "./ClinicBookingDetails"
import AtHomeBookingDetails from "./AtHomeBookingDetails"

export type BookingDetailsProps = {
  selectedAppointment: AppointmentType
  goBack: (refetch: boolean) => void
}

const BookingDetails = ({
  selectedAppointment,
  goBack,
}: BookingDetailsProps) => {
  return (
    <>
      {selectedAppointment.appt_type === "AT_HOME_VISIT" ? (
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
