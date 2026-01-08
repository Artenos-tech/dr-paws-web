"use client"

import { useEffect, useState } from "react"
import AppointmentCard from "@/components/ui/AppointmentCard"
import BookingDetails from "@/components/ui/BookingDetails"
import ClinicTabBar from "@/components/ui/ClinicTabBar"
import Loader from "@/components/ui/Loader"
import NoAppointments from "@/components/ui/NoAppointments"
import { useAPICall } from "@/hooks/apicall"
import { AppointmentType } from "@/model/typeDefinitions"
import { mockAtHomeClient } from "@/services/api.athome"

const TABS = {
  ALL: { label: "All" },
  UPCOMING: { label: "Upcoming" },
  ACTIVE: { label: "Active" },
  PAST: { label: "Past" },
  CANCELLED: { label: "Cancelled" },
} as const

const determinePageSize = () => {
  const width = window.innerWidth
  if (width < 640) return 1
  if (width < 1024) return 4
  return 9
}

const MyAppointmentsPage = () => {
  const {
    call: getAppointments,
    loading,
    result,
  } = useAPICall(mockAtHomeClient.getAppointments)

  const [allAppointments, setAllAppointments] = useState<AppointmentType[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<
    AppointmentType[]
  >([])
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentType | null>(null)

  const [activeTab, setActiveTab] = useState<keyof typeof TABS>("ALL")
  const [pageSize, setPageSize] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const sortAppointmentsByDateTime = (appointments: AppointmentType[]) => {
    return appointments.sort((a, b) => {
      const formatTime = (time: string) => {
        const [hours, minutes] = time.split(":")
        return `${hours.padStart(2, "0")}:${minutes}`
      }

      const dateTimeA = new Date(
        `${a.booking_date.split("T")[0]}T${formatTime(a.appt_start)}:00.000Z`,
      )
      const dateTimeB = new Date(
        `${b.booking_date.split("T")[0]}T${formatTime(b.appt_start)}:00.000Z`,
      )

      return dateTimeB.getTime() - dateTimeA.getTime()
    })
  }
  const sortAppointmentsWithUpcomingFirst = (
    appointments: AppointmentType[],
  ) => {
    return appointments.sort((a, b) => {
      const categoryPriority: Record<AppointmentType["category"], number> = {
        UPCOMING: 1,
        ACTIVE: 2,
        COMPLETED: 3,
        CANCELLED: 4,
        REQUESTED: 5,
      }

      const priorityA = categoryPriority[a.category]
      const priorityB = categoryPriority[b.category]

      if (priorityA !== priorityB) {
        return priorityA - priorityB
      }

      try {
        const formatTime = (time: string) => {
          const [hours, minutes] = time.split(":")
          return `${hours.padStart(2, "0")}:${minutes}`
        }

        const dateTimeA = new Date(
          `${a.booking_date.split("T")[0]}T${formatTime(a.appt_start)}:00.000Z`,
        )
        const dateTimeB = new Date(
          `${b.booking_date.split("T")[0]}T${formatTime(b.appt_start)}:00.000Z`,
        )

        if (a.category === "UPCOMING") {
          return dateTimeA.getTime() - dateTimeB.getTime()
        } else {
          return dateTimeB.getTime() - dateTimeA.getTime()
        }
      } catch (error) {
        console.warn("Date parsing error in appointment sorting:", error)
        return 0
      }
    })
  }

  useEffect(() => {
    const updatePageSize = () => {
      setPageSize(determinePageSize())
    }

    updatePageSize()
    window.addEventListener("resize", updatePageSize)
    return () => window.removeEventListener("resize", updatePageSize)
  }, [])

  useEffect(() => {
    getAppointments({})
  }, [])

  useEffect(() => {
    if (result?.ok) {
      const all = result.value.body.data
        .appointments as unknown as AppointmentType[]
      setAllAppointments(all)
    }
  }, [result])

  useEffect(() => {
    let filtered: AppointmentType[] = []

    switch (activeTab) {
      case "UPCOMING":
        filtered = allAppointments.filter((a) => a.category === "UPCOMING")
        break
      case "ACTIVE":
        filtered = allAppointments.filter((a) => {
          if (
            a.appt_type === "AT_HOME_VISIT" &&
            a.visit_status === "VISIT_STARTED"
          ) {
            return true
          }
          return isCurrentTimeInSlot(a.booking_date, a.appt_start, a.appt_end)
        })
        break
      case "PAST":
        filtered = allAppointments.filter((a) => a.category === "COMPLETED")
        break
      case "CANCELLED":
        filtered = allAppointments.filter((a) => a.category === "CANCELLED")
        break
      default:
        filtered = allAppointments
    }

    const typeFiltered = filtered.filter(
      (appt) =>
        appt.appt_type === "VET_CONSULTATION" ||
        appt.appt_type === "GROOMING" ||
        appt.appt_type === "AT_HOME_VISIT",
    )
    console.log(allAppointments, "data is ")

    let sortedAppointments: AppointmentType[] = []

    if (activeTab === "ALL") {
      sortedAppointments = sortAppointmentsWithUpcomingFirst([...typeFiltered])
    } else if (activeTab === "UPCOMING") {
      const sorted = sortAppointmentsByDateTime([...typeFiltered])
      sortedAppointments = sorted.reverse()
    } else {
      sortedAppointments = sortAppointmentsByDateTime([...typeFiltered])
    }

    setFilteredAppointments(sortedAppointments)
    setCurrentPage(1)
  }, [activeTab, allAppointments])

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }, [currentPage, selectedAppointment])

  if (pageSize === null || loading) return <Loader />

  const totalPages = Math.ceil(filteredAppointments.length / pageSize)
  const visibleAppointments = filteredAppointments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )
  const isCurrentTimeInSlot = (
    bookingDate: string,
    start: string,
    end: string,
  ) => {
    const date = bookingDate.split("T")[0]
    const toDate = (time: string) =>
      new Date(`${date}T${time.padStart(5, "0")}:00`)
    const now = new Date()
    const startTime = toDate(start)
    const endTime = toDate(end)
    return now >= startTime && now <= endTime
  }

  return (
    <div className="flex flex-col w-full h-full items-center font-roca pb-20 flex-grow px-8 md:px-32 lg:px-20 xl:px-40">
      <main className="w-full flex flex-col gap-[40px] my-12 row-start-2 items-center">
        {selectedAppointment ? (
          <BookingDetails
            selectedAppointment={selectedAppointment}
            goBack={(refetch) => {
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
                    activeTab !== "UPCOMING"
                      ? "No appointments"
                      : "You haven't booked any visits yet"
                  }
                  showButton={activeTab === "UPCOMING"}
                />
              </div>
            ) : (
              <>
                <div className="w-full grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
                  {visibleAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.sub_booking_id}
                      appointment={appointment}
                      onClick={() => setSelectedAppointment(appointment)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center items-center gap-4 mt-6">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <span className="text-sm font-medium">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={currentPage >= totalPages}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default MyAppointmentsPage
