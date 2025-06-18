"use client"

import { AppointmentType } from "@/model/typeDefinitions"
import React from "react"
import OutlineButton from "./OutlineButton"
import Image from "next/image"
// import { doctorImagsesMap } from "@/model/mockData"
import defaultVetImage from "@/public/assets/images/clinic/doctorFemale.webp"
import { petImageByType } from "./PetCard"
import { format, parseISO } from "date-fns"

type AppointmentCardProps = {
  appointment: AppointmentType
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
    // cancelled: {
    //   border: "border-l-[#C6C4C4] border-l-4",
    //   bg: "bg-[#F1F1F1]",
    //   text: "text-[#909090]",
    // },
    past: {
      border: "border-l-[#C6C4C4] border-l-4",
      bg: "bg-[#F1F1F1]",
      text: "text-[#909090]",
    },
  }

  // Mapping appt_status to style categories
  const getStatusCategory = (appt: AppointmentType) => {
    if (appt.category === "UPCOMING") return "upcoming"
    if (appt.category === "COMPLETED") return "past"
    // if (appt.category === "CANCELLED") return "cancelled"
    throw new Error(`No status category defined for ${appt.category}`)
  }

  function getAppointmentCategoryLabel(category: string) {
    if (category === "UPCOMING") return "Upcoming"
    if (category === "COMPLETED") return "Visited"
    // if (category === "CANCELLED") return "Cancelled"
    throw new Error(`No category label defined for ${category}`)
  }

  const statusCategory = getStatusCategory(appointment)
  const { border, bg, text } = cardStyles[statusCategory]

  const defaultPetImageByType =
    petImageByType[appointment.pet_type?.toLowerCase() || "other"] ||
    petImageByType.other

  const parsedDate = parseISO(appointment.booking_date)

  return (
    <div
      className={`p-4 ${border} ${bg} flex flex-col gap-3 rounded-lg shadow-md w-full`}
    >
      {/* Status and Reason */}
      <div className="text-xs flex justify-between">
        <p className={`${text}`}>
          {getAppointmentCategoryLabel(appointment.category)}
        </p>
        <p
          className={`px-2 py-1 rounded-md ${
            // statusCategory === "cancelled" ? "bg-[#E0E0E0]" : "bg-primary-2"
            "bg-primary-2"
          } ${
            // statusCategory === "cancelled" ? "text-[#909090]" : "text-primary-1"
            "text-primary-1"
          }`}
        >
          {appointment.appt_type}
        </p>
      </div>
      <div className="flex items-center my-4">
        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-white p-3 flex justify-center items-center">
          <Image
            src={appointment.pet_profile_image || defaultPetImageByType}
            alt={`${appointment.pet_name}'s profile`}
            layout="fill"
            objectFit="cover"
            sizes="80px"
            priority
          />
        </div>
        {appointment.appt_type !== "Grooming" && (
          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-white -ml-6 border-2 border-white">
            <Image
              src={appointment.vet_image ?? defaultVetImage}
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
          {appointment.appt_type !== "Grooming" &&
            ` and ${appointment.vet_name}`}
        </p>
        <p>{appointment.clinic_name}</p>
        <p>{format(parsedDate, "EEEE dd MMMM, yyyy")}</p>
        <p>
          {appointment.appt_start}
          {" - "}
          {appointment.appt_end}
        </p>
      </div>
      <div className="self-end">
        <OutlineButton outlineBtnText="View Details" outlineBtnLink={onClick} />
      </div>
    </div>
  )
}

export default AppointmentCard
