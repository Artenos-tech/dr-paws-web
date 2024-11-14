"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Clinic } from "@/model/typeDefinitions";
import ContactInfoModal from "./ContactInfoModal";

interface ClinicItemProps {
  clinic: Clinic;
  enlargedView: boolean;
}

const ClinicItem: React.FC<ClinicItemProps> = ({ clinic, enlargedView }) => {
  const { image, clinicName, services, id } = clinic;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleBookVisit = () => {
    router.push(`/clinics/${id}`);
  };
  return (
    <div
      className={`bg-[#FFFCF3] ${
        !enlargedView && "w-full lg:w-[25%] min-h-[270px]"
      } flex flex-col justify-between h-full w-full shadow-md rounded-md`}
      
    >
      <div onClick={handleBookVisit}>
        <img
          src={image.src}
          alt={clinicName + "image"}
          className="rounded-t-md"
        />
        <div className="p-2">
          <h1 className="text-primary-1 text-base">{clinicName}</h1>
          <div className="flex gap-2 text-primary-1 text-xs mt-2 ">
            <p>{services}</p>
          </div>
        </div>
      </div>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`btn bg-secondary-1 rounded-none border-none z text-white w-full rounded-b-md py-3`}
      >
        Book a Visit
      </button>
      <ContactInfoModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ClinicItem;
