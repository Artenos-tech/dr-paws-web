"use client"

import React, { useState } from "react"
import Image from "next/image"
import { CiLocationOn } from "react-icons/ci"
import { DoctorBase } from "@/model/typeDefinitions"
import DoctorDetailsModal from "./DoctorDetailsModal"
import api from "@/services/api.display"
import { useAPICall } from "@/hooks/apicall"
import Loader from "./Loader"

interface DoctorCardProps {
  doctor: DoctorBase
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  const { displayName, position, experience, availableToDisplayAt, imageUrl } =
    doctor
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const {
    call: getDoctorProfile,
    result: doctorProfileResult,
    loading: loadingDoctorProfile,
  } = useAPICall(api.getDoctorForDisplay)

  const handleViewProfile = async () => {
    const doctorDetails = await getDoctorProfile({
      doctorid: doctor.id,
      clinicid: availableToDisplayAt[0]?.id ?? "",
    })
    if (doctorDetails.ok) {
      setModalOpen(true)
    }
  }

  const doctorProfile =
    doctorProfileResult?.ok && doctorProfileResult.value.body.doctor
      ? doctorProfileResult.value.body.doctor
      : // : doctors.find((doc) => doc.id === doctor.id)
        null

  return (
    <>
      <div className="rounded-xl border border-primary-3 shadow-md bg-primary-3 text-primary-1 p-4 sm:p-6 w-[260px] md:w-[378px] lg:w-[320px] flex flex-col items-center text-center space-y-4">
        <Image
          src={imageUrl.value}
          alt={displayName}
          width={120}
          height={120}
          className="rounded-full object-contain w-[120px] h-[120px]"
        />
        <h2 className="text-lg sm:text-xl">{displayName}</h2>
        <p className="text-sm sm:text-base">{position}</p>
        <p className="text-sm sm:text-base">{experience} of Experience</p>
        <div className="flex w-full justify-center text-primary-1">
          <div className="flex max-w-[240px] items-start gap-2">
            <CiLocationOn size={20} className="mt-0.5 shrink-0" />
            <p className="m-0 text-center text-sm sm:text-base whitespace-normal break-words">
              {availableToDisplayAt.map((clinic) => clinic.name).join(", ")}
            </p>
          </div>
        </div>
        <div
          className={`relative mt-4 py-2 px-4 rounded-lg text-white text-sm ${loadingDoctorProfile ? "bg-transparent" : "bg-accent"} ${loadingDoctorProfile ? "" : "hover:bg-secondary-1"}`}
        >
          {loadingDoctorProfile ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader />
            </div>
          ) : (
            <button
              className="w-full h-full"
              onClick={handleViewProfile}
              // disabled={!!doctorProfile}
            >
              View Profile
            </button>
          )}
        </div>
      </div>
      {doctorProfile && (
        <DoctorDetailsModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          doctor={doctorProfile}
        />
      )}
    </>
  )
}

export default DoctorCard
