"use client"

import React, { useEffect } from "react"
import Image, { StaticImageData } from "next/image"
import { BsCheckCircleFill } from "react-icons/bs"
import { GrLocation } from "react-icons/gr"
import { HiOutlineCalendar } from "react-icons/hi"
import { MdOutlineAccessTime } from "react-icons/md"
import CustomButton from "./CustomButton"
import defaultVetImage from "@/public/assets/images/clinic/doctorFemale.webp"
import { petImageByType } from "./PetCard"
import { Pet } from "@/context/UserContext"
import { VisitStatus } from "@/model/typeDefinitions"

type RescheduleConfirmedProps = {
  isGroomingAppointment: boolean
  isHomeVisit?: boolean
  visitStatus?: VisitStatus

  updatedValues: {
    selectedPet: Pet
    selectedSvcId: string
    selectedService: string
    selectedSubtype?: string
    selectedClinic?: string
    selectedLocation?: string
    address?: {
      tag?: string
      address_line1?: string
      address_line2?: string
    }
    selectedVet: {
      id: string | null
      name: string | null
    } | null
    selectedDoctorImage: string | StaticImageData | null
    selectedDate: Date
    selectedSlot: string
    selectedSlotEnd: string
  }

  oldValues: {
    oldVet: {
      id: string | null
      name: string | null
    }
    oldDoctorImage: string | StaticImageData | null
    oldDate: Date
    oldSlot: string
    oldSlotEnd: string
  }

  onDone: () => void
}

const RescheduleConfirmed: React.FC<RescheduleConfirmedProps> = ({
  isGroomingAppointment,
  isHomeVisit,
  visitStatus,
  updatedValues,
  oldValues,
  onDone,
}) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const defaultPetImage =
    petImageByType[updatedValues.selectedPet.type?.toLowerCase() || "other"] ||
    petImageByType.other

  const petImage = updatedValues.selectedPet.profileImage || defaultPetImage

  const vetImage = updatedValues.selectedDoctorImage || defaultVetImage

  const fullAddress = [
    updatedValues.address?.address_line1,
    updatedValues.address?.address_line2,
  ]
    .filter(Boolean)
    .join(", ")

  let appointmentText = ""

  if (isHomeVisit) {
    appointmentText =
      visitStatus &&
      visitStatus !== "CANCELLED" &&
      visitStatus !== "UNCONFIRMED" &&
      updatedValues.selectedVet
        ? `${updatedValues.selectedPet.name} is scheduled for a Home Visit with ${updatedValues.selectedVet.name}.`
        : `${updatedValues.selectedPet.name} is scheduled for a Home Visit.`
  } else if (isGroomingAppointment && updatedValues.selectedSubtype) {
    appointmentText = `${updatedValues.selectedPet.name} is scheduled for a ${updatedValues.selectedSubtype}.`
  } else {
    appointmentText = `${updatedValues.selectedPet.name} is scheduled with ${updatedValues.selectedVet?.name} for ${updatedValues.selectedService}.`
  }

  return (
    <div className="flex flex-col justify-center gap-4 items-center w-full">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl sm:text-3xl font-semibold">
          Booking Rescheduled
        </h1>
        <BsCheckCircleFill fill="#5281a2" size={32} />
      </div>

      <div className="p-10 text-primary-1 w-11/12 md:w-4/5 lg:w-[50%] shadow-md my-5 flex flex-col gap-4 items-center bg-[#FFFCF3] rounded-lg">
        <p className="text-lg font-semibold text-center">{appointmentText}</p>

        <div className="flex items-center my-4 relative">
          <div className="relative w-32 h-32 rounded-full overflow-hidden bg-white p-3">
            <Image src={petImage} alt="Pet" fill sizes="128px" />
          </div>

          {!isGroomingAppointment &&
            isHomeVisit &&
            visitStatus &&
            visitStatus !== "CANCELLED" &&
            visitStatus !== "UNCONFIRMED" && (
              <div className="relative w-32 h-32 rounded-full overflow-hidden bg-white -ml-8 border-4 border-white p-3">
                <Image src={vetImage} alt="Vet" fill sizes="128px" />
              </div>
            )}
        </div>

        <div className="my-4 space-y-3 text-sm w-full">
          {isHomeVisit ? (
            <div className="space-y-1">
              <p className="flex items-center gap-2">
                <GrLocation className="text-secondary-1" />
                {updatedValues.address?.tag}
              </p>
              <p className="pl-6 text-gray-600">{fullAddress}</p>
            </div>
          ) : (
            <p className="flex items-center gap-2">
              <GrLocation className="text-secondary-1" />
              {updatedValues.selectedLocation}
            </p>
          )}

          <p className="flex items-center gap-2">
            <HiOutlineCalendar className="text-secondary-1" />
            {updatedValues.selectedDate.toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <p className="flex items-center gap-2">
            <MdOutlineAccessTime className="text-secondary-1" />
            {updatedValues.selectedSlot} – {updatedValues.selectedSlotEnd}
          </p>

          <p className="font-medium pt-2">Former Timings</p>

          <p className="flex items-center gap-2 line-through text-gray-600">
            <HiOutlineCalendar className="text-secondary-1" />
            {oldValues.oldDate.toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <p className="flex items-center gap-2 line-through text-gray-600">
            <MdOutlineAccessTime className="text-secondary-1" />
            {oldValues.oldSlot} – {oldValues.oldSlotEnd}
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

export default RescheduleConfirmed
