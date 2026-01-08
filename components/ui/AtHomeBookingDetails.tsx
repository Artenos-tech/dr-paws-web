"use client"

import React from "react"
import BackButton from "./BackButton"
import { BookingDetailsProps } from "./BookingDetails"
import { CalendarDays } from "lucide-react"
import { MdOutlineAccessTime } from "react-icons/md"
import { GrLocation } from "react-icons/gr"
import { format, parseISO } from "date-fns"
import AtHomeVisitStatus from "./AtHomeVisitStatus"

const AtHomeBookingDetails = ({
  selectedAppointment,
  goBack,
}: BookingDetailsProps) => {
  const parsedDate = parseISO(selectedAppointment.booking_date)

  const fullAddress = [
    selectedAppointment?.address?.tag,
    selectedAppointment?.address?.address_line1,
    selectedAppointment?.address?.address_line2,
  ]
    .filter(Boolean)
    .join(", ")

  const isVisitFinished = selectedAppointment.visit_status === "VISIT_FINISHED"

  const getCardStyles = (category: string) => {
    switch (category) {
      case "CANCELLED":
        return {
          bg: "bg-[#F1F1F1]",
          text: "text-[#909090]",
          strike: "line-through",
        }
      case "COMPLETED":
        return {
          bg: "bg-[#f7f1de]",
          text: "text-[#909090]",
          strike: "",
        }
      default:
        return {
          bg: "bg-[#FFFCF3]",
          text: "text-primary-1",
          strike: "",
        }
    }
  }

  const { bg, text } = getCardStyles(selectedAppointment.category)

  return (
    <div className="w-full">
      <BackButton navigateBack={() => goBack(true)} />

      <div className="flex flex-col items-center gap-6 mt-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-primary-1">
          {isVisitFinished ? "Home visit finished" : "Home Visit Scheduled"}
        </h1>

        <div
          className={`${bg} ${text} w-11/12 md:w-4/5 lg:w-[50%] shadow-md rounded-lg p-6 space-y-4`}
        >
          {isVisitFinished && (
            <div className="text-start  space-y-1">
              <p className="text-xl font-medium">
                {`  Hope everything was to ${selectedAppointment.pet_name}'s
                satisfaction!`}
              </p>
              <p className="text-base text-gray-600">
                Please feel free to call us about issues or feedback.
              </p>
            </div>
          )}
          {isVisitFinished && (
            <AtHomeVisitStatus
              visitStatus={selectedAppointment.visit_status}
              selectedAppointment={selectedAppointment}
            />
          )}

          <div className="flex items-center gap-3">
            <CalendarDays className="text-secondary-1" />
            <span className="text-base font-medium">
              {format(parsedDate, "EEE dd MMM")}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <MdOutlineAccessTime className="text-secondary-1 text-xl" />
            <span className="text-base font-medium">
              {selectedAppointment.appt_start} – {selectedAppointment.appt_end}
            </span>
          </div>

          <div className="flex items-start gap-3">
            <GrLocation className="text-secondary-1 text-xl mt-1" />
            <span className="text-base font-medium leading-relaxed">
              {fullAddress}
            </span>
          </div>

          {!isVisitFinished && (
            <AtHomeVisitStatus
              visitStatus={selectedAppointment.visit_status}
              selectedAppointment={selectedAppointment}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default AtHomeBookingDetails
