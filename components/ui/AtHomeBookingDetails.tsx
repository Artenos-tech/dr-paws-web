"use client"

import React from "react"
import BackButton from "./BackButton"
import {
  CalendarDays,
  Phone,
  AlertTriangle,
  RotateCcw,
  XCircle,
} from "lucide-react"
import { MdOutlineAccessTime } from "react-icons/md"
import { GrLocation } from "react-icons/gr"
import { format, parseISO } from "date-fns"
import AtHomeVisitStatus from "./AtHomeVisitStatus"
import toast from "react-hot-toast"
import { AppointmentApiDetails } from "@/model/typeDefinitions"

type BookingDetailsProps = {
  goBack: (refetch: boolean) => void
  selectedAppointment: AppointmentApiDetails
}
const AtHomeBookingDetails = ({
  selectedAppointment,
  goBack,
}: BookingDetailsProps) => {
  const parsedDate = parseISO(selectedAppointment.booking_date)

  const fullAddress = [
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
        }
      case "COMPLETED":
        return {
          bg: "bg-[#f7f1de]",
          text: "text-[#909090]",
        }
      default:
        return {
          bg: "bg-[#FFFCF3]",
          text: "text-primary-1",
        }
    }
  }

  const { bg, text } = getCardStyles(selectedAppointment.category)

  const copyHelpline = () => {
    if (!selectedAppointment.helpline_no) return
    navigator.clipboard.writeText(selectedAppointment.helpline_no)
    toast.success(
      `Helpline number ${selectedAppointment.helpline_no} copied to clipboard`,
    )
  }

  return (
    <div className="w-full">
      <BackButton navigateBack={() => goBack(true)} />

      <div className="flex flex-col items-center gap-6 mt-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-primary-1">
          {selectedAppointment.visit_status === "CANCELLED"
            ? "Home Visit Cancelled"
            : isVisitFinished
              ? "Home visit finished"
              : "Home Visit Scheduled"}
        </h1>

        <div
          className={`${bg} ${text} w-11/12 md:w-4/5 lg:w-[50%] shadow-md rounded-lg py-12 px-28 space-y-5`}
        >
          {isVisitFinished && (
            <>
              <div className="space-y-1">
                <p className="text-xl font-medium">
                  {`Hope everything was to ${selectedAppointment.pet_name}'s satisfaction!`}
                </p>
                <p className="text-base text-gray-600">
                  Please feel free to call us about issues or feedback.
                </p>
              </div>

              <AtHomeVisitStatus
                visitStatus={selectedAppointment.visit_status}
                selectedAppointment={selectedAppointment}
              />
            </>
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

          <div className="flex gap-3">
            <div className="w-6 flex justify-center">
              <GrLocation className="text-secondary-1 text-xl mt-1" />
            </div>

            <div className="flex flex-col">
              <span className="font-medium">
                {selectedAppointment.address?.tag}
              </span>
              <span className="text-base leading-relaxed">{fullAddress}</span>
            </div>
          </div>

          {!isVisitFinished && (
            <AtHomeVisitStatus
              visitStatus={selectedAppointment.visit_status}
              selectedAppointment={selectedAppointment}
            />
          )}

          <div className="pt-4 border-t space-y-4">
            <div className="space-y-1 ">
              <p className="font-semibold">Need help?</p>
              <button
                onClick={copyHelpline}
                className="flex items-center gap-2 text-secondary-1 font-medium"
              >
                <Phone size={16} />
                Call us
              </button>
            </div>

            <div className="flex items-center gap-2 text-red-600 font-semibold">
              <AlertTriangle size={18} />
              Emergency
            </div>

            <div className="border border-red-300 rounded-lg p-4 space-y-3">
              <div>
                <p className="font-semibold text-red-700">
                  Reschedule & Cancel
                </p>
                <p className="text-sm text-red-600">
                  Free cancellation up to 24 hours before the appointment. A
                  100% cancellation fee will be charged otherwise.
                </p>
              </div>

              <button className="flex items-center gap-2 text-secondary-1 font-medium">
                <RotateCcw size={16} />
                Reschedule for free
              </button>

              <button className="flex items-center gap-2 text-red-600 font-medium">
                <XCircle size={16} />
                Cancel for free
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AtHomeBookingDetails
