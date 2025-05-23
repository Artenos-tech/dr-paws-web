"use client"

import { useEffect, useState } from "react"

import AppointmentCard from "@/components/ui/AppointmentCard"
import BookingDetails from "@/components/ui/BookingDetails"
import ClinicTabBar from "@/components/ui/ClinicTabBar"
import Loader from "@/components/ui/Loader"
import NoAppointments from "@/components/ui/NoAppointments"
import { useAPICall } from "@/hooks/apicall"
import { AppointmentType } from "@/model/typeDefinitions"
import api from "@/services/api"

const TABS = {
  ALL: {
    label: "All",
  },
  REQUESTED: {
    label: "Requested",
  },
  UPCOMING: {
    label: "Upcoming",
  },
  PAST: {
    label: "Past",
  },
  // CANCELLED: {
  //   label: "Cancelled",
  // },
} as const

const MyAppointmentsPage = () => {
  const {
    call: getAppointments,
    loading,
    result,
  } = useAPICall(api.getAppointments)

  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentType | null>(null)

  const [activeTab, setActiveTab] = useState<keyof typeof TABS>("ALL")

  useEffect(() => {
    getAppointments({})
  }, [])

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    )
  }

  const appointments = result?.ok ? result.value.body.appointments : null

  const filteredAppointments = (appointments || []).filter(
    (appointment: AppointmentType) => {
      if (activeTab === "ALL") {
        return true
      }
      if (activeTab === "UPCOMING") {
        return appointment.category === "UPCOMING"
      }
      if (activeTab === "PAST") {
        return appointment.category === "COMPLETED"
      }
      if (activeTab === "REQUESTED") {
        return appointment.category === "REQUESTED"
      }
      // if (activeTab === "CANCELLED") {
      //   return appointment.category === "CANCELLED"
      // }
    },
  )

  return (
    <div className="flex flex-col w-full h-full items-center justify-items-center font-roca pb-20 flex-grow px-8 md:px-32 lg:px-20 xl:px-40">
      <main className="w-full h-full  flex flex-col gap-[40px] my-12 row-start-2 items-center">
        {selectedAppointment ? (
          <BookingDetails
            selectedAppointment={selectedAppointment}
            goBack={(refetch: boolean) => {
              setSelectedAppointment(null)
              if (refetch) {
                getAppointments({})
              }
            }}
          />
        ) : (
          <>
            {!result?.ok &&
              (result?.error.apiClientErrorType === "ErrorResponseAPIError" ? (
                <div>{result.error.message}</div>
              ) : (
                <>
                  {console.error(
                    "Error fetching appointments",
                    result?.error.message,
                  )}
                  <div>Something went wrong fetching your appointments</div>
                </>
              ))}
            <ClinicTabBar
              tabs={TABS}
              activeTabId={activeTab}
              onTabChange={setActiveTab}
            />
            {filteredAppointments.length === 0 ? (
              <div className="w-full h-full lg:h-screen">
                <NoAppointments
                  displayText={
                    activeTab !== "REQUESTED"
                      ? "No appointments"
                      : "You haven't booked any visits yet"
                  }
                  showButton={activeTab === "REQUESTED"}
                />
              </div>
            ) : (
              <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onClick={() => setSelectedAppointment(appointment)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default MyAppointmentsPage
