"use client"

import {
  AppointmentCategory,
  AppointmentListItem,
} from "@/model/typeDefinitions"
import React from "react"
import OutlineButton from "./OutlineButton"
import Image from "next/image"
import defaultVetImage from "@/public/assets/images/clinic/doctorFemale.webp"
import { petImageByType } from "./PetCard"
import { format, parseISO } from "date-fns"
import { HiLocationMarker } from "react-icons/hi"
import { Building2, Home } from "lucide-react"

type AppointmentCardProps = {
  appointment: AppointmentListItem
  onClick: () => void
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onClick,
}) => {
  // Styles and labels based on appt_status
  const cardStyles = {
    upcoming: {
      border: "border-l-secondary-1 border-l-4",
      bg: "bg-white",
      text: "text-primary-1",
    },
    active: {
      border: "border-l-secondary-1 border-l-4",
      bg: "bg-white",
      text: "text-primary-1",
    },
    cancelled: {
      border: "border-l-[#C6C4C4] border-l-4",
      bg: "bg-[#F1F1F1]",
      text: "text-[#909090]",
    },
    past: {
      border: "border-l-[#fdc776] border-l-4",
      bg: "bg-[#f7f1de]",
      text: "text-[#909090]",
    },
  }
  const visitStatusStyles: Record<
    NonNullable<AppointmentListItem["visit_status"]>,
    { bg: string; text: string }
  > = {
    UNCONFIRMED: { bg: "bg-[#FC862C]", text: "text-white" },
    VET_CONFIRMED: { bg: "bg-[#2C8DFC]", text: "text-white" },
    VET_DELAYED: { bg: "bg-[#D00000]", text: "text-white" },
    VET_REACHED: { bg: "bg-[#FBFF26A8]", text: "text-black" },
    CANCELLED: { bg: "bg-[#656565]", text: "text-white" },
    VISIT_STARTED: { bg: "bg-[#4AB200DB]", text: "text-white" },
    VISIT_FINISHED: { bg: "bg-[#4AB200]", text: "text-white" },
  }

  // Mapping appt_status to style categories
  const getStatusCategory = (category: AppointmentCategory) => {
    if (category === "UPCOMING") return "upcoming"
    if (category === "COMPLETED") return "past"
    if (category === "ACTIVE") return "active"
    if (category === "CANCELLED") return "cancelled"
    throw new Error(`No status category defined for ${category}`)
  }

  function getAppointmentCategoryLabel(category: AppointmentCategory) {
    if (category === "UPCOMING") return "Upcoming"
    if (category === "COMPLETED") return "Past"
    if (category === "ACTIVE") return "Active"
    if (category === "CANCELLED") return "Cancelled"
    throw new Error(`No category label defined for ${category}`)
  }

  const statusCategory = getStatusCategory(appointment.category)
  const { border, bg, text } = cardStyles[statusCategory]
  const isSOSActive = appointment.sos_status === "ACTIVE"

  const defaultPetImageByType =
    petImageByType[appointment.pet_type?.toLowerCase() || "other"] ||
    petImageByType.other

  const petImage = appointment.pet_profile_image || defaultPetImageByType

  const vetImage = appointment.vet_image || defaultVetImage

  const parsedDate = parseISO(appointment.booking_date)
  const Icon = appointment.booking_type === "HOME_VISIT" ? Home : Building2
  return (
    <div
      className={`p-4 ${border} ${isSOSActive ? "bg-red-100" : bg} flex flex-col gap-3 rounded-lg shadow-md w-full`}
    >
      {/* Status and Reason */}
      <div className="text-xs flex justify-between">
        <p className={`${text}`}>
          {getAppointmentCategoryLabel(appointment.category)}
        </p>
        {appointment.appt_type === "HOME_VISIT" &&
          appointment.visit_status &&
          appointment.visit_status !== "UNCONFIRMED" &&
          appointment.visit_status !== "VET_CONFIRMED" &&
          appointment.visit_status !== "VISIT_FINISHED" && (
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                visitStatusStyles[appointment.visit_status].bg
              } ${visitStatusStyles[appointment.visit_status].text}`}
            >
              {appointment.visit_status.replace("_", " ")}
            </span>
          )}
        {appointment.appt_type !== "HOME_VISIT" && (
          <p
            className={`px-2 py-1 rounded-md flex ${
              // statusCategory === "cancelled" ? "bg-[#E0E0E0]" : "bg-primary-2"
              "bg-primary-2"
            } ${
              // statusCategory === "cancelled" ? "text-[#909090]" : "text-primary-1"
              "text-primary-1"
            }`}
          >
            {appointment.appt_type_title}
          </p>
        )}
        <span className="flex items-center text-sm">
          <Icon size={20} className="mr-1" />
          <span className="hidden sm:inline">
            {appointment.booking_type === "HOME_VISIT"
              ? "Home Visit"
              : "Clinic Visit"}
          </span>
        </span>
      </div>
      <div className="flex items-center my-4">
        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-white p-3 flex justify-center items-center">
          <Image
            src={petImage}
            alt={`${appointment.pet_name}'s profile`}
            layout="fill"
            objectFit="cover"
            sizes="80px"
            priority
          />
        </div>
        {(appointment.appt_type === "VET_CONSULTATION" ||
          (appointment.appt_type === "HOME_VISIT" &&
            appointment.visit_status !== "CANCELLED" &&
            appointment.visit_status !== "UNCONFIRMED")) && (
          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-white -ml-6 border-2 border-white">
            <Image
              src={vetImage}
              alt={`Dr. ${appointment.vet_name}'s profile`}
              objectFit="cover"
              sizes="80px"
              width={80}
              height={80}
            />
          </div>
        )}
      </div>
      <div className={`space-y-1 ${text}`}>
        <p className="font-semibold">
          {appointment.pet_name}
          {((appointment.appt_type === "HOME_VISIT" &&
            appointment.visit_status !== "CANCELLED" &&
            appointment.visit_status !== "UNCONFIRMED") ||
            appointment.appt_type === "VET_CONSULTATION") &&
            appointment.vet_name &&
            ` and ${appointment.vet_name}`}
        </p>

        {appointment.clinic_name && <p>{appointment.clinic_name}</p>}
        {appointment.address && (
          <>
            {appointment.address.has_coordinates !== false && (
              <div className="flex">
                <HiLocationMarker className="mt-1 mr-1" size={14} />
                <span className="font-semibold">{appointment.address.tag}</span>
              </div>
            )}

            {appointment.address.has_coordinates === false ? (
              <div className="flex items-start gap-2 rounded-[10px] border border-[#fcd34d] bg-[#fffbeb] px-3 py-2 text-[#b45309]">
                <span className="leading-5">{"\u26A0"}</span>
                <p className="text-sm leading-relaxed">
                  The exact visit location is not available yet for this
                  booking. Our Dr Paws team will update it shortly.
                </p>
              </div>
            ) : (
              <p>
                {appointment.address.address_line1},{" "}
                {appointment.address.address_line2},{" "}
                {appointment.address.pincode}
              </p>
            )}
          </>
        )}

        <p>{format(parsedDate, "EEEE dd MMMM, yyyy")}</p>
        <p>
          {appointment.appt_start}
          {appointment.booking_type === "CLINIC_VISIT" && " - "}
          {appointment.booking_type === "CLINIC_VISIT" && appointment.appt_end}
        </p>
      </div>
      <div className="mt-auto self-end">
        <OutlineButton outlineBtnText="View Details" outlineBtnLink={onClick} />
      </div>
    </div>
  )
}

export default AppointmentCard
