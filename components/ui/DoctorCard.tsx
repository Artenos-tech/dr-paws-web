"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CiLocationOn } from "react-icons/ci";
import { Doctor } from "@/model/typeDefinitions";
import DoctorDetailsModal from "./DoctorDetailsModal";

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  const { name, position, experience, location, image } = doctor;
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const truncate = (text: string, maxLength: number) =>
    text?.length > maxLength ? text.slice(0, maxLength) + "..." : text;

  return (
    <>
      <div className="rounded-xl border border-primary-3 shadow-md bg-primary-3 text-primary-1 p-4 sm:p-6 w-[260px] md:w-[378px] lg:w-[320px] flex flex-col items-center text-center space-y-4">
        <Image
          src={image}
          alt={name}
          width={120}
          height={120}
          className="rounded-full object-contain w-[120px] h-[120px]"
        />
        <h2 className="text-lg sm:text-xl">{name}</h2>
        <p className="text-sm sm:text-base">{position}</p>
        <p className="text-sm sm:text-base">{experience}</p>
        <div className="flex items-center space-x-2 text-primary-1">
          <CiLocationOn size={20} />
          <span className="text-sm sm:text-base">{truncate(location, 20)}</span>
        </div>
        {/* {!isMarketingFeatureEnabled ? ( */}
          <button
            className="mt-4 py-2 px-4 rounded-lg bg-accent text-white text-sm hover:bg-secondary-1"
            onClick={() => setModalOpen(true)}
          >
            View Profile
          </button>
        {/* ) : null} */}
      </div>
      <DoctorDetailsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        doctor={doctor}
      />
    </>
  );
};

export default DoctorCard;
