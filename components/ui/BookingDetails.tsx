"use client"

import { AppointmentDetails } from "@/model/typeDefinitions"
import ClinicBookingDetails from "./ClinicBookingDetails"
import AtHomeBookingDetails from "./AtHomeBookingDetails"
import { useAPICall } from "@/hooks/apicall"
import atHomeApiClient from "@/services/api.athome"
import { useEffect, useRef, useState } from "react"
import { ClipLoader } from "react-spinners"
import { useAPIErrorToastFromResult } from "@/hooks/useAPIErrorToast"

const POLLING_INTERVAL_MS = 5000

export type BookingDetailsProps = {
  goBack: (refetch: boolean) => void
  appointmentId: string
  subBookingId: string
}

const BookingDetails = ({
  appointmentId,
  subBookingId,
  goBack,
}: BookingDetailsProps) => {
  const { call: getAppointmentDetails, result: getAppointmentDetailsResult } =
    useAPICall(atHomeApiClient.getAppointmentDetails)
  const [appointment, setAppointment] = useState<AppointmentDetails | null>(
    null,
  )
  const [isPollingPaused, setIsPollingPaused] = useState(false)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const getAppointmentDetailsRef = useRef(getAppointmentDetails)

  useEffect(() => {
    getAppointmentDetailsRef.current = getAppointmentDetails
  }, [getAppointmentDetails])

  const refetchAppointment = () => {
    getAppointmentDetails({
      appointment_id: appointmentId,
      sub_booking_id: subBookingId,
    })
  }

  useEffect(() => {
    getAppointmentDetails({
      appointment_id: appointmentId,
      sub_booking_id: subBookingId,
    })

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!getAppointmentDetailsResult?.ok) return

    const fetchedAppointment =
      getAppointmentDetailsResult.value.body.data.appointment
    setAppointment(fetchedAppointment)

    const shouldPoll =
      fetchedAppointment.booking_type === "HOME_VISIT" &&
      fetchedAppointment.visit_status !== "CANCELLED" &&
      fetchedAppointment.visit_status !== "VISIT_FINISHED" &&
      !isPollingPaused

    if (shouldPoll && !pollingIntervalRef.current) {
      pollingIntervalRef.current = setInterval(() => {
        getAppointmentDetailsRef.current({
          appointment_id: appointmentId,
          sub_booking_id: subBookingId,
        })
      }, POLLING_INTERVAL_MS)
    } else if (!shouldPoll && pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
  }, [getAppointmentDetailsResult, isPollingPaused])
  useAPIErrorToastFromResult(getAppointmentDetailsResult,{fallbackMessage:'Failed to fetch appointment'})

  if (!appointment) {
    return (
      <div className="flex justify-center items-center py-20">
        <ClipLoader />
      </div>
    )
  }

  return (
    <>
      {appointment.booking_type === "HOME_VISIT" ? (
        <AtHomeBookingDetails
          selectedAppointment={appointment}
          goBack={goBack}
          refetchAppointment={refetchAppointment}
          onPausePolling={setIsPollingPaused}
        />
      ) : (
        <ClinicBookingDetails
          selectedAppointment={appointment}
          goBack={goBack}
        />
      )}
    </>
  )
}

export default BookingDetails
