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
import Image from "next/image"
import { petImageByType } from "./PetCard"
import defaultVetImage from "@/public/assets/images/clinic/doctorFemale.webp"

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

  const isConfirmed = selectedAppointment.visit_status === "CONFIRMED"
  const isCancelled = selectedAppointment.visit_status === "CANCELLED"

  let appointmentText = ""

  if (isCancelled) {
    appointmentText = `${selectedAppointment.pet_name} was scheduled for an At-Home Visit with ${selectedAppointment.vet_name}`
  } else if (isVisitFinished) {
    appointmentText = `${selectedAppointment.pet_name} had an At-Home Visit with ${selectedAppointment.vet_name}`
  } else if (isConfirmed) {
    appointmentText = selectedAppointment.vet_name
      ? `${selectedAppointment.pet_name} is scheduled for an At-Home Visit with ${selectedAppointment.vet_name}`
      : `${selectedAppointment.pet_name} is scheduled for an At-Home Visit`
  } else {
    appointmentText =
      selectedAppointment.visit_status === "UNCONFIRMED"
        ? `${selectedAppointment.pet_name} is scheduled for an At-Home Visit`
        : `${selectedAppointment.pet_name} is scheduled for an At-Home Visit with ${selectedAppointment.vet_name}`
  }

  const defaultPetImageByType =
    petImageByType[selectedAppointment.pet_type?.toLowerCase() || "other"] ||
    petImageByType.other

  const petImage =
    //uncomment below line to use actual pet image
    // selectedAppointment.pet_profile_image ||
    defaultPetImageByType
  const vetImage =
    //uncomment below line to use actual vet image
    //   selectedAppointment?.vet_image ||
    defaultVetImage

  return (
    <div className="w-full">
      <BackButton navigateBack={() => goBack(true)} />

      <div className="flex flex-col items-center gap-6 mt-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-primary-1">
          {selectedAppointment.visit_status === "CANCELLED"
            ? "Home Visit Cancelled"
            : isVisitFinished
              ? "Home Visit Finished"
              : "Home Visit Scheduled"}
        </h1>

        <div
          className={`${bg} ${text} w-11/12 md:w-4/5 lg:w-[50%] shadow-md rounded-lg px-6 py-4 md:py-12 md:px-24 space-y-5`}
        >
          <p className="text-lg font-semibold mt-4 text-center">
            {appointmentText}
          </p>
          <div className="flex justify-center my-4 relative">
            {
              <>
                <div className="relative w-32 h-32 rounded-full overflow-hidden bg-white p-3 flex justify-center items-center">
                  <Image
                    src={petImage}
                    alt={`${selectedAppointment.pet_name}'s profile`}
                    layout="fill"
                    objectFit="cover"
                    sizes="128px"
                    priority
                  />
                </div>
                {selectedAppointment.visit_status !== "UNCONFIRMED" && (
                  <div className="relative w-32 h-32 rounded-full overflow-hidden bg-white -ml-8 border-4 border-white flex justify-center items-center">
                    <Image
                      src={vetImage}
                      alt={`Dr. ${selectedAppointment.vet_name}'s profile`}
                      objectFit="cover"
                      sizes="80px"
                      width={80}
                      height={80}
                    />
                  </div>
                )}
              </>
            }
          </div>

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
              {format(parsedDate, "EEE, dd MMM")}
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

          {!isVisitFinished ||
            (isCancelled && (
              <AtHomeVisitStatus
                visitStatus={selectedAppointment.visit_status}
                selectedAppointment={selectedAppointment}
              />
            ))}

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
