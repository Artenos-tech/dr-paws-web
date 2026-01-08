"use client"

import React from "react"
import Image from "next/image"
import { Phone } from "lucide-react"
import defaultVetImage from "@/public/assets/images/clinic/doctorFemale.webp"
import { AppointmentType } from "@/model/typeDefinitions"
import toast from "react-hot-toast"

type VisitStatus =
  | "UNCONFIRMED"
  | "CONFIRMED"
  | "DELAYED"
  | "REACHED"
  | "CANCELLED"
  | "VISIT_STARTED"
  | "VISIT_FINISHED"

type AtHomeVisitStatusProps = {
  selectedAppointment: AppointmentType

  visitStatus?: VisitStatus
}

const AtHomeVisitStatus = ({
  selectedAppointment,
  visitStatus,
}: AtHomeVisitStatusProps) => {
  const { vet_name, vet_contact, vet_image, start_otp } = selectedAppointment
  console.log(vet_image)

  const copyNumber = () => {
    if (!vet_contact) return
    navigator.clipboard.writeText(vet_contact)
    toast.success(`Vet contact ${vet_contact} copied to clipboard`)
  }

  const vetImageSrc =
    //uncomment the line below if vet_image can be null
    //   vet_image ||
    defaultVetImage

  const VetRow = () => (
    <div className="flex items-center gap-3 mt-3">
      <div className="relative w-12 h-12 rounded-full overflow-hidden">
        <Image
          src={vetImageSrc}
          alt={vet_name || "Vet"}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1">
        <p className="font-semibold">{vet_name || "Assigned Vet"}</p>
      </div>

      {vet_contact && (
        <button
          onClick={copyNumber}
          className="p-2 rounded-full bg-white shadow"
        >
          <Phone size={16} />
        </button>
      )}
    </div>
  )

  return (
    <div
      className={`${visitStatus === "DELAYED" ? "bg-red-100" : "bg-[#F3F3F3]"} rounded-lg p-4 mt-4 space-y-2`}
    >
      {visitStatus === "UNCONFIRMED" && (
        <>
          <p className="font-semibold">Vet will be assigned soon</p>
          <p className="text-sm text-gray-600">
            The details of assigned vet will appear here, maximum of 2 hours
            before your appointment time.
          </p>
        </>
      )}

      {visitStatus === "CONFIRMED" && (
        <>
          <p className="font-semibold">Vet has been assigned</p>
          <VetRow />
          <p className="text-sm text-gray-600 mt-2">
            {vet_name} will reach on address on time. In case there are delays,
            our team will be in touch with you.
          </p>
        </>
      )}

      {visitStatus === "DELAYED" && (
        <>
          <p className="font-semibold text-red-600">Vet is delayed</p>
          <VetRow />
          <p className="text-sm text-gray-600 mt-2">
            {vet_name} is delayed, Our team will contact you soon.
          </p>
        </>
      )}

      {visitStatus === "REACHED" && (
        <>
          <p className="font-semibold">Vet has reached the address</p>
          <VetRow />
          <p className="text-sm text-gray-600 mt-2">
            Please share the following OTP to start the appointment.
          </p>
          {start_otp && (
            <div className="mt-3 flex justify-center">
              <span className="px-4 py-2 rounded-md bg-white border border-dashed border-gray-400 text-lg font-bold tracking-widest text-primary-1">
                {start_otp}
              </span>
            </div>
          )}
        </>
      )}

      {visitStatus === "VISIT_STARTED" && (
        <>
          <p className="font-semibold">Home visit started</p>
          <VetRow />
        </>
      )}
      {visitStatus === "VISIT_FINISHED" && (
        <>
          <VetRow />
        </>
      )}
    </div>
  )
}

export default AtHomeVisitStatus
