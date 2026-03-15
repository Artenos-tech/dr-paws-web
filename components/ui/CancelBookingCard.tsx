"use client"

import React from "react"
import Image from "next/image"
import { format } from "date-fns"
import { CircleX } from "lucide-react"
import { MdOutlineAccessTime } from "react-icons/md"
import { GrLocation } from "react-icons/gr"
import { HiOutlineCalendar } from "react-icons/hi"
import CustomButton from "./CustomButton"
import defaultVetImage from "@/public/assets/images/clinic/doctorFemale.webp"
import { petImageByType } from "./PetCard"
import { AppointmentDetails, RefundStatus } from "@/model/typeDefinitions"

type Props = {
  appointment: AppointmentDetails
  refundStatus?: RefundStatus
  refundAmount?: number
  onDone: () => void
}

const CancelledBookingCard = ({
  appointment,
  refundStatus,
  refundAmount,
  onDone,
}: Props) => {
  const visitType = appointment.booking_type
  const parsedDate = new Date(appointment.booking_date)

  const defaultPetImage =
    petImageByType[appointment.pet_type?.toLowerCase() || "other"] ||
    petImageByType.other

  const petImage = appointment.pet_profile_image || defaultPetImage
  const vetImage = appointment.vet_image || defaultVetImage

  const fullAddress = [
    appointment.address?.address_line1,
    appointment.address?.address_line2,
  ]
    .filter(Boolean)
    .join(", ")

  const isUnConfirmed = appointment.visit_status === "UNCONFIRMED"
  const isCancelled = appointment.visit_status === "CANCELLED"

  let appointmentText = ""

  if (appointment.booking_type === "HOME_VISIT") {
    appointmentText =
      isUnConfirmed || isCancelled
        ? `${appointment.pet_name} was scheduled for a Home Visit`
        : `${appointment.pet_name} was scheduled for a Home Visit with ${appointment.vet_name}`
  } else {
    appointmentText =
      appointment.appt_type === "GROOMING"
        ? `${appointment.pet_name} was scheduled for a ${appointment.appt_type_title} session`
        : `${appointment.pet_name} was scheduled with ${appointment.vet_name} for a ${appointment.appt_type_title}`
  }

  return (
    <div className="flex flex-col justify-center gap-4 items-center">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl sm:text-3xl">Booking Cancelled</h1>
        <CircleX size={40} fill="#5281a2" stroke="white" strokeWidth={2} />
      </div>

      <div className="p-4 text-primary-1 w-11/12 md:w-4/5 lg:w-[50%] shadow-md my-5 flex flex-col gap-4 items-center bg-primary-3">
        <p className="text-lg font-semibold mt-4 text-center">
          {appointmentText}
        </p>

        <div className="flex items-center my-4 relative">
          <div className="relative w-32 h-32 rounded-full overflow-hidden bg-white p-3">
            <Image src={petImage} alt="Pet" fill sizes="128px" />
          </div>

          {appointment.appt_type !== "GROOMING" &&
            appointment.booking_type !== "HOME_VISIT" && (
              <div className="relative w-32 h-32 rounded-full overflow-hidden bg-white -ml-8 border-4 border-white">
                <Image src={vetImage} alt="Vet" fill sizes="128px" />
              </div>
            )}
        </div>

        {refundStatus && refundAmount && (
          <div className="border border-gray-300 rounded-lg p-4 space-y-2">
            <p className="font-semibold text-primary-1">Refund Details</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Status:</span>
              <span
                className={`text-sm font-medium px-2 py-1 rounded ${
                  refundStatus === "SUCCESS"
                    ? "bg-green-100 text-green-700"
                    : refundStatus === "FAILED" || refundStatus === "REJECTED"
                      ? "bg-red-100 text-red-700"
                      : refundStatus === "PROCESSED"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {refundStatus.replace(/_/g, " ")}
              </span>
            </div>
            {(refundStatus === "PENDING" ||
              refundStatus === "REQUESTED" ||
              refundStatus === "APPROVED") && (
              <p className="text-sm text-gray-500">
                A full refund of ₹{refundAmount} will be processed and sent back
                to your original payment method. It may take 5-7 business days
                to reflect in your account.
              </p>
            )}
            {refundStatus === "SUCCESS" && (
              <p className="text-sm text-gray-500">
                Your refund of ₹{refundAmount} has been successfully processed.
              </p>
            )}
            {refundStatus === "FAILED" && (
              <p className="text-sm text-gray-500">
                Refund processing of ₹{refundAmount} failed. Please contact
                support for assistance.
              </p>
            )}
          </div>
        )}

        <div className="my-4 space-y-3 text-sm">
          {visitType !== "HOME_VISIT" ? (
            <p className="flex items-center gap-2 line-through">
              <GrLocation className="text-secondary-1" />
              {appointment.clinic_location}
            </p>
          ) : (
            <div className="space-y-1 line-through">
              <p className="flex items-center gap-2">
                <GrLocation className="text-secondary-1" />
                {appointment.address?.tag}
              </p>
              <p className="pl-6 text-gray-600">{fullAddress}</p>
            </div>
          )}

          <p className="flex items-center gap-2 line-through">
            <HiOutlineCalendar className="text-secondary-1" />
            {format(parsedDate, "EEEE dd MMMM, yyyy")}
          </p>

          <p className="flex items-center gap-2 line-through">
            <MdOutlineAccessTime className="text-secondary-1" />
            {appointment.appt_start} {visitType !== "HOME_VISIT" && " - "}{" "}
            {visitType !== "HOME_VISIT" && appointment.appt_end}
          </p>
        </div>

        <CustomButton
          buttonText="Done"
          buttonBackground="bg-secondary-1"
          buttonClickEvent={onDone}
        />
      </div>
    </div>
  )
}

export default CancelledBookingCard
