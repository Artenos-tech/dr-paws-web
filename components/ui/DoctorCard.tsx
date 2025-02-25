"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CiLocationOn } from "react-icons/ci";
import defaultVetImage from "@/public/assets/images/clinic/doctorFemale.webp";
import { DoctorBase } from "@/model/typeDefinitions";
import DoctorDetailsModal from "./DoctorDetailsModal";
import { doctorImagesMap } from "@/model/mockData";
import api from "@/services/api";
import { useAPICall } from "@/hooks/apicall";
import Loader from "./Loader";

interface DoctorCardProps {
  doctor: DoctorBase;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  const { displayName, position, experience, availableToDisplayAt, imageUrl } =
    doctor;
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const {
    call: getDoctorProfile,
    result: doctorProfileResult,
    loading: loadingDoctorProfile,
  } = useAPICall(api.getDoctorForDisplay);

  const handleViewProfile = async () => {
    const doctorDetails = await getDoctorProfile({
      doctorid: doctor.id.toString(),
    });
    if (doctorDetails.ok) {
      setModalOpen(true);
    }
  };

  const doctorProfile = doctorProfileResult?.ok
    ? doctorProfileResult.value.body.doctor
    : null;

  if (loadingDoctorProfile) {
    return <Loader />;
  }
  return (
    <>
      <div className="rounded-xl border border-primary-3 shadow-md bg-primary-3 text-primary-1 p-4 sm:p-6 w-[260px] md:w-[378px] lg:w-[320px] flex flex-col items-center text-center space-y-4">
        <Image
          src={
            imageUrl.value === "unknown"
              ? defaultVetImage
              : imageUrl.type === "ref"
              ? doctorImagesMap[imageUrl.value]
              : imageUrl.value
          }
          alt={displayName}
          width={120}
          height={120}
          className="rounded-full object-contain w-[120px] h-[120px]"
        />
        <h2 className="text-lg sm:text-xl">{displayName}</h2>
        <p className="text-sm sm:text-base">{position}</p>
        <p className="text-sm sm:text-base">{experience}</p>
        <div className="flex items-center space-x-2 text-primary-1 truncate">
          <CiLocationOn size={20} />
          <span className="text-sm sm:text-base">
            {availableToDisplayAt.map((clinic) => clinic.name).join(", ")}
          </span>
        </div>
        {/* {!isMarketingFeatureEnabled ? ( */}
        <button
          className="mt-4 py-2 px-4 rounded-lg bg-accent text-white text-sm hover:bg-secondary-1"
          onClick={handleViewProfile}
        >
          View Profile
        </button>
        {/* ) : null} */}
      </div>
      {doctorProfile && (
        <DoctorDetailsModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          doctor={doctorProfile}
        />
      )}
    </>
  );
};

export default DoctorCard;
